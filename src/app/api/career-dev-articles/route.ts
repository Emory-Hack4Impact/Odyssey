import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const db = prisma.careerDevArticles;
const BUCKET = "Article";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// tiny helpers
function getString(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v : "";
}

function toDateOnly(yyyyMmDd: string) {
  return new Date(`${yyyyMmDd}T00:00:00.000Z`);
}

function toTimeOnly(hhmm: string) {
  return new Date(`1970-01-01T${hhmm}:00.000Z`);
}

async function uploadImageIfPresent(file: File | null, articleId: string) {
  if (!file) return null;

  if (!supabase) {
    throw new Error(
      "Supabase env vars missing. Need NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const path = `${articleId}/${randomUUID()}.${ext}`;

  // supabase-js accepts File/Blob directly in many setups,
  // but Uint8Array is reliable in route handlers:
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || "image/*",
    upsert: true,
  });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function GET() {
  try {
    const rows = await db.findMany({ orderBy: { created_at: "desc" } });

    return NextResponse.json(
      rows.map((r) => ({
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
      })),
    );
  } catch (err) {
    console.error("GET /api/career-dev-articles failed:", err);
    return NextResponse.json({ error: "GET failed", message: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
    console.error("POST failed:", err);
    return NextResponse.json({ error: "POST failed", message: String(err) }, { status: 500 });
  }
}

function isString(x: unknown): x is string {
  return typeof x === "string";
}

export async function PUT(req: Request) {
  try {
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
    if (isString(body.date) && body.date) {
      data.date = new Date(`${body.date}T00:00:00.000Z`);
    }
    if (isString(body.startTime) && body.startTime) {
      data.starttime = new Date(`1970-01-01T${body.startTime}:00.000Z`);
    }
    if (isString(body.endTime) && body.endTime) {
      data.endtime = new Date(`1970-01-01T${body.endTime}:00.000Z`);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await db.update({
      where: { id },
      data,
    });

    return NextResponse.json(
      {
        id: updated.id,
        title: updated.title,
        author: updated.author,
        blurb: updated.blurb,
        body: updated.body,
        date: updated.date.toISOString().slice(0, 10),
        startTime: updated.starttime.toISOString().slice(11, 16),
        endTime: updated.endtime.toISOString().slice(11, 16),
        location: updated.location,
        imageUrl: updated.imageurl ?? null,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("PUT /api/career-dev-articles failed:", err);
    return NextResponse.json({ error: "PUT failed", message: String(err) }, { status: 500 });
  }
}
