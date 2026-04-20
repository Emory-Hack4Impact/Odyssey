import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/utils/supabase/server";

type CreateReportBody = {
  title?: string;
  description?: string;
  pagePath?: string;
  metadata?: Prisma.InputJsonValue | null;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateReportBody;
    // trim incoming report body
    const title = body.title?.trim();
    const description = body.description?.trim();
    const pagePath = body.pagePath?.trim();

    if (!title || !description || !pagePath) {
      return NextResponse.json(
        { error: "title, description, and pagePath are required" },
        { status: 400 },
      );
    }

    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    // create new report in db
    const createdReport = await prisma.report.create({
      data: {
        title,
        description,
        pagePath,
        userId: user.id,
        metadata: body.metadata ?? Prisma.JsonNull,
      },
    });

    return NextResponse.json(createdReport, { status: 201 });
  } catch (err) {
    console.error("/api/bug-report POST error", err);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
