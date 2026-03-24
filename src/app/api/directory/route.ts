import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser, createServiceRoleClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const [employees, { data: authData }] = await Promise.all([
      prisma.userMetadata.findMany({
        select: {
          id: true,
          employeeFirstName: true,
          employeeLastName: true,
          position: true,
          department: true,
          jobTitle: true,
          location: true,
          bio: true,
          mobile: true,
          workNumber: true,
          birthday: true,
          avatarUrl: true,
        },
        orderBy: { id: "asc" },
      }),
      createServiceRoleClient().auth.admin.listUsers(),
    ]);

    const emailMap = new Map((authData?.users ?? []).map((u) => [u.id, u.email ?? ""]));

    const result = employees.map((e) => ({
      ...e,
      email: emailMap.get(e.id) ?? "",
      birthday: e.birthday ? e.birthday.toISOString().split("T")[0] : "",
    }));

    return NextResponse.json({ employees: result });
  } catch (error) {
    console.error("/api/directory GET error", error);
    return NextResponse.json({ error: "Failed to fetch directory employees" }, { status: 500 });
  }
}
