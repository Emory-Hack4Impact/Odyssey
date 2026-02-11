import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { uploadDocumentCore, getSignedUrlForFileId } from "./index";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/utils/supabase/server";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // mode control determines: get user names-id mapping or to get files
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode");
    // for getting user names-id mapping //
    if (mode === "labels") {
      const body = (await req.json()) as { ids?: string[] };
      const ids = Array.isArray(body.ids) ? body.ids : [];
      if (ids.length === 0) {
        return NextResponse.json({ users: [] });
      }

      // auth guard: only signed-in users can ask for labels
      const authedUser = await getUser();
      if (!authedUser) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }

      // authorization: only admins can resolve other users' names now
      // TODO: in the final sprints, determine who have access to resolved users' names
      const requesterMeta = await prisma.userMetadata.findUnique({
        where: { id: authedUser.id },
        select: { is_admin: true },
      });
      if (!requesterMeta?.is_admin) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }

      // batch query: fetch names for all ids in one DB call
      const metas = await prisma.userMetadata.findMany({
        where: { id: { in: ids } },
        select: { id: true, employeeFirstName: true, employeeLastName: true },
      });

      // build a lookup map: id -> displayName
      const idToName = new Map<string, string>();
      for (const m of metas) {
        const fullName = [m.employeeFirstName, m.employeeLastName]
          .filter((part) => typeof part === "string" && part.trim().length > 0)
          .join(" ")
          .trim();

        idToName.set(m.id, fullName || "Unknown user");
      }

      // return users aligned to the request order, with safe fallback
      return NextResponse.json({
        users: ids.map((id) => ({
          id,
          displayName: idToName.get(id) ?? "Unknown user",
        })),
      });
    }

    // for getting files //
    // read data from request and pull out fields
    const formData = await req.formData();
    const authedUser = await getUser();
    if (!authedUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const userId = authedUser.id; // ensure uploader is ALWAYS the signed-in user
    const bucket = formData.get("bucket") as string | null;

    if (!bucket) {
      return NextResponse.json({ error: "bucket is required" }, { status: 400 });
    }

    const viewersRaw = formData.get("viewers") as string | null;
    const folderPathRaw = formData.get("folderPath") as string | null;

    const viewers: string[] = viewersRaw ? JSON.parse(viewersRaw) : [];
    const folderPath: string[] = folderPathRaw ? JSON.parse(folderPathRaw) : [];

    // mime type
    const contentType = file.type ?? (formData.get("contentType") as string | null) ?? undefined;

    // turn file in ArrayBuffer
    const fileBody = await file.arrayBuffer();

    // server helper to update Prisma & Supabase
    const result = await uploadDocumentCore({
      userId,
      fileName: file.name,
      viewers,
      folderPath,
      bucket,
      contentType,
      fileBody,
    });

    // send json back to client side
    return NextResponse.json(result);
  } catch (err) {
    console.error("/api/documents POST error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // parse request url & extract userId query params
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("mode");
  const fileId = searchParams.get("fileId");
  const nameKeyword = searchParams.get("nameKeyword");
  // from supabase, check whether current user is authenticated
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  // look up Prisma UserMetadata using the Supabase auth user id
  const userMeta = await prisma.userMetadata.findUnique({
    where: { id: user.id },
  });

  // Model for searching possible users for document upload //
  if (mode === "userSearch" && nameKeyword) {
    try {
      if (!userMeta?.is_admin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const normalized = nameKeyword.trim().replace(/\s+/g, " ");
      const tokens = normalized.split(" ").filter(Boolean);
      // if emptry don't query
      if (tokens.length === 0) {
        return NextResponse.json({ users: [] });
      }
      const where: Prisma.UserMetadataWhereInput = {
        AND: tokens.map((t) => ({
          OR: [
            { employeeFirstName: { contains: t, mode: "insensitive" as const } },
            { employeeLastName: { contains: t, mode: "insensitive" as const } },
          ],
        })),
      };
      const users = await prisma.userMetadata.findMany({
        where,
        select: { id: true, employeeFirstName: true, employeeLastName: true },
        take: 10, // keep it small for dropdown
        orderBy: [{ employeeLastName: "asc" }, { employeeFirstName: "asc" }],
      });
      return NextResponse.json({ users });
    } catch (err) {
      console.error("/api/documents GET userSearch error", err);
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  // Model for fetching files on click (mode=view) //
  if (mode === "view" && fileId) {
    try {
      const signedUrl = await getSignedUrlForFileId(fileId, user.id, 60);
      return NextResponse.json({ signedUrl });
    } catch (err) {
      console.error("/api/documents GET signed-url error", err);
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  // Model for reading file list only //
  // check whether is admin, if so, show all files
  const isAdmin = userMeta?.is_admin === true;
  if (isAdmin) {
    const files = await prisma.files.findMany({ orderBy: { uploadedAt: "desc" } });
    return NextResponse.json(files);
  }

  // if normal user: ignore the incoming ?userId=... and only list what the current user can see.
  // that includes:
  // 1) files they uploaded (owner)
  // 2) files shared with them via metadata.viewers
  try {
    const files = await prisma.files.findMany({
      where: {
        OR: [
          { userId: user.id },
          // JSON field filter: metadata.viewers contains current user id
          // If TypeScript complains here, see the note below.
          {
            metadata: {
              path: ["viewers"],
              array_contains: [user.id],
            },
          },
        ],
      },
      orderBy: { uploadedAt: "desc" },
    });
    // return list of files as json
    return NextResponse.json(files);
  } catch (err) {
    console.error("/api/documents GET list error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// for now, PATCH function is only for:
// 1) editing files
export async function PATCH(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let body: { fileId?: string; viewers?: unknown }; // untrusted input container from request, to be sanitized before DB updates
    try {
      body = (await req.json()) as { fileId?: string; viewers?: unknown };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const fileId = typeof body.fileId === "string" ? body.fileId.trim() : "";
    const incomingViewers = Array.isArray(body.viewers) ? body.viewers : [];

    if (!fileId) {
      return NextResponse.json({ error: "fileId is required" }, { status: 400 });
    }

    const file = await prisma.files.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const isOwner = file.userId === user.id; // check whether is owner
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // build sanitized viewers
    const viewers = Array.from(
      new Set(
        incomingViewers
          .map((value) => (typeof value === "string" ? value.trim() : ""))
          .filter((value) => value.length > 0),
      ),
    );

    const existingMetadata =
      file.metadata && typeof file.metadata === "object" && !Array.isArray(file.metadata)
        ? (file.metadata as Record<string, unknown>)
        : {};

    // update DB
    await prisma.files.update({
      where: { id: fileId },
      data: {
        metadata: {
          ...existingMetadata,
          viewers,
        },
      },
    });

    return NextResponse.json({
      fileId,
      viewers,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("/api/documents PATCH error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
