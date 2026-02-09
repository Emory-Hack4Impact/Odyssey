import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
const db = prisma.careerDevArticles;

export async function GET() {
  try {
    // IMPORTANT: this Prisma delegate name must match your schema model name.
    // If this line errors, the model name is wrong (see section 2).
    const rows = await prisma.careerDevArticles.findMany({
      orderBy: { created_at: "desc" },
    });

    const ui = rows.map((r) => ({
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
    }));

    return NextResponse.json(
      rows.map((r) => ({
        id: r.id,
        title: r.title,
        author: r.author,
        blurb: r.blurb,
        body: r.body,
        // if Prisma date is DateTime, return YYYY-MM-DD:
        date: r.date.toISOString().slice(0, 10), // "YYYY-MM-DD"
        startTime: r.starttime.toISOString().slice(11, 16),
        endTime: r.endtime.toISOString().slice(11, 16),
        location: r.location,
        imageUrl: r.imageurl ?? null,
        image: r.imageurl ? { src: r.imageurl, alt: `${r.title} image` } : undefined,
      })),
    );

    return NextResponse.json(ui, { status: 200 });
  } catch (err) {
    console.error("GET /api/career-dev-articles failed:", err);
    return NextResponse.json({ error: "GET failed", message: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Convert "YYYY-MM-DD" into a real Date (midnight UTC-ish)
    const date = new Date(`${body.date}T00:00:00.000Z`);

    // Convert "HH:MM" into a Date object for the TIME columns
    // (the actual date part doesn't matter; only the time is used)
    const starttime = new Date(`1970-01-01T${body.startTime}:00.000Z`);
    const endtime = new Date(`1970-01-01T${body.endTime}:00.000Z`);

    const created = await db.create({
      data: {
        title: body.title,
        author: body.author,
        blurb: body.blurb,
        body: body.body ?? null,
        date,
        starttime,
        endtime,
        location: body.location,
        imageurl: body.imageUrl ?? null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/career-dev-articles failed:", err);
    return NextResponse.json({ error: "POST failed", message: String(err) }, { status: 500 });
  }
}
