import { NextResponse } from "next/server";
import { uploadDocumentCore, getSignedUrlForFileId } from "./index";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/utils/supabase/server";

export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// for uploading files
export async function POST(req: Request) {
  try {
    // read data from request and pull out fields
    const formData = await req.formData();

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const userId = formData.get("userId") as string | null;
    const bucket = formData.get("bucket") as string | null;

    if (!userId || !bucket) {
      return NextResponse.json({ error: "userId and bucket are required" }, { status: 400 });
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

export async function GET(req: NextResponse) {
  // parse request url & extract userId query params
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("mode");
  const fileId = searchParams.get("fileId");
  const userId = searchParams.get("userId");
  // check authentication from supabase
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  // look up Prisma UserMetadata using the Supabase auth user id
  const userMeta = await prisma.userMetadata.findUnique({
    where: { id: user.id },
  });

  // Model 1: for fetching files on click (mode=view)
  if (mode === "view" && fileId) {
    try {
      const signedUrl = await getSignedUrlForFileId(fileId, user.id, 60);
      return NextResponse.json({ signedUrl });
    } catch (err) {
      console.error("/api/documents GET signed-url error", err);
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  // Model 2: for reading file list only

  // check whether is admin, if so, show all files
  const isAdmin = userMeta?.is_admin === true;
  if (isAdmin) {
    const files = await prisma.files.findMany({ orderBy: { uploadedAt: "desc" } });
    return NextResponse.json(files);
  }

  // if just normal user, query all files for that user matched by params
  if (userId) {
    const files = await prisma.files.findMany({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
    });
    // return list of files as json
    return NextResponse.json(files);
  }
}
