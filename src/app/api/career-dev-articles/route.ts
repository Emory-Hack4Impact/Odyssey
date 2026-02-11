import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

const db = prisma.careerDevArticles;

// ---- helpers ----

function isString(x: unknown): x is string {
  return typeof x === "string";
}

function toDateOnly(yyyyMmDd: string) {
  return new Date(`${yyyyMmDd}T00:00:00.000Z`);
}

function toTimeOnly(hhmm: string) {
  return new Date(`1970-01-01T${hhmm}:00.000Z`);
}

/** Map a DB row to the camelCase shape the frontend expects. */
function toArticleResponse(r: {
  id: string;
  title: string;
  author: string;
  blurb: string;
  body: string | null;
  date: Date;
  starttime: Date;
  endtime: Date;
  location: string;
  imageurl: string | null;
}) {
  return {
    id: r.id,
    title: r.title,
    author: r.author,
    blurb: r.blurb,
    body: r.body,
    date: r.date.toISOString().slice(0, 10),
    startTime: r.starttime.toISOString().slice(11, 16),
    endTime: r.endtime.toISOString().slice(11, 16),
    location: r.location,
    imageUrl: r.imageurl ?? null,
    image: r.imageurl ? { src: r.imageurl, alt: `${r.title} image` } : undefined,
  };
}

/**
 * Verify the caller is an authenticated admin.
 * Returns the user id on success, or a NextResponse error to send back.
 */
async function requireAdmin(): Promise<{ userId: string } | NextResponse> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const metadata = await prisma.userMetadata.findUnique({
    where: { id: user.id },
    select: { is_admin: true },
  });

  if (!metadata?.is_admin) {
    return NextResponse.json({ error: "Forbidden: admin access required" }, { status: 403 });
  }

  return { userId: user.id };
}

// ---- route handlers ----

export async function GET() {
  try {
    const rows = await db.findMany({ orderBy: { created_at: "desc" } });
    return NextResponse.json(rows.map(toArticleResponse));
  } catch (err) {
    console.error("GET /api/career-dev-articles failed:", err);
    return NextResponse.json({ error: "GET failed", message: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const body = (await req.json()) as {
      title: string;
      author: string;
      blurb: string;
      body?: string | null;
      date: string;
      startTime: string;
      endTime: string;
      location: string;
      imageUrl?: string | null;
    };

    // Validate required fields
    if (
      !body.title ||
      !body.author ||
      !body.blurb ||
      !body.date ||
      !body.startTime ||
      !body.endTime ||
      !body.location
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const created = await db.create({
      data: {
        title: body.title,
        author: body.author,
        blurb: body.blurb,
        body: body.body ?? null,
        date: toDateOnly(body.date),
        starttime: toTimeOnly(body.startTime),
        endtime: toTimeOnly(body.endTime),
        location: body.location,
        imageurl: body.imageUrl ?? null,
      },
    });

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/career-dev-articles failed:", err);
    return NextResponse.json({ error: "POST failed", message: String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();

    const id = body?.id;
    if (!isString(id) || !id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};

    // Only update fields if they were provided
    if (isString(body.title)) data.title = body.title;
    if (isString(body.author)) data.author = body.author;
    if (isString(body.blurb)) data.blurb = body.blurb;
    if ("body" in body) data.body = body.body ?? null;
    if (isString(body.location)) data.location = body.location;

    // imageUrl can be string OR null (to clear)
    if ("imageUrl" in body) data.imageurl = body.imageUrl ?? null;

    // Date/time only if provided
    const dateVal: unknown = body.date;
    const startTimeVal: unknown = body.startTime;
    const endTimeVal: unknown = body.endTime;

    if (isString(dateVal) && dateVal) {
      data.date = toDateOnly(dateVal);
    }
    if (isString(startTimeVal) && startTimeVal) {
      data.starttime = toTimeOnly(startTimeVal);
    }
    if (isString(endTimeVal) && endTimeVal) {
      data.endtime = toTimeOnly(endTimeVal);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await db.update({
      where: { id },
      data,
    });

    return NextResponse.json(toArticleResponse(updated), { status: 200 });
  } catch (err) {
    console.error("PUT /api/career-dev-articles failed:", err);
    return NextResponse.json({ error: "PUT failed", message: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = (await req.json()) as { id?: string };

    if (!isString(id) || !id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await db.delete({ where: { id } });

    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/career-dev-articles failed:", err);
    return NextResponse.json({ error: "DELETE failed", message: String(err) }, { status: 500 });
  }
}
