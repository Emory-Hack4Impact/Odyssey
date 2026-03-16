import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/utils/supabase/server";

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const employees = await prisma.userMetadata.findMany({
      select: {
        id: true,
        employeeFirstName: true,
        employeeLastName: true,
        position: true,
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ employees });
  } catch (error) {
    console.error("/api/directory GET error", error);
    return NextResponse.json({ error: "Failed to fetch directory employees" }, { status: 500 });
  }
}
