import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser, createServiceRoleClient } from "@/utils/supabase/server";

interface DirectoryPatchBody {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  jobTitle: string;
  location: string;
  bio: string;
  mobile: string;
  workNumber: string;
  birthday: string;
  avatarUrl: string;
}

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

    const emailEntries: [string, string][] = (authData?.users ?? []).map((u) => [
      u.id,
      u.email ?? "",
    ]);

    const emailMap = new Map<string, string>(emailEntries);

    const result = employees.map((e) => {
      const email: string = emailMap.get(String(e.id)) ?? "";

      return {
        ...e,
        email,
        birthday: e.birthday ? e.birthday.toISOString().split("T")[0] : "",
      };
    });

    return NextResponse.json({ employees: result });
  } catch (error) {
    console.error("/api/directory GET error", error);
    return NextResponse.json({ error: "Failed to fetch directory employees" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = (await req.json()) as DirectoryPatchBody;
    if (!body.id) {
      return NextResponse.json({ error: "Employee id is required" }, { status: 400 });
    }

    const requester = await prisma.userMetadata.findUnique({
      where: { id: user.id },
      select: { is_admin: true },
    });

    const canEdit = requester?.is_admin === true || user.id === body.id;

    if (!canEdit) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const isAdmin = requester?.is_admin === true;

    const updated = await prisma.userMetadata.update({
      where: { id: body.id },
      data: {
        employeeFirstName: body.firstName,
        employeeLastName: body.lastName,
        ...(isAdmin ? { position: body.position } : {}),
        department: body.department,
        jobTitle: body.jobTitle,
        location: body.location,
        bio: body.bio,
        mobile: body.mobile,
        workNumber: body.workNumber,
        birthday: body.birthday ? new Date(body.birthday) : null,
        avatarUrl: body.avatarUrl,
      },
    });

    const {
      data: { user: authUser },
    } = await createServiceRoleClient().auth.admin.getUserById(updated.id);

    return NextResponse.json({
      id: updated.id,
      email: authUser?.email ?? "",
      employeeFirstName: updated.employeeFirstName ?? "",
      employeeLastName: updated.employeeLastName ?? "",
      position: updated.position ?? "",
      department: updated.department ?? "",
      jobTitle: updated.jobTitle ?? "",
      location: updated.location ?? "",
      bio: updated.bio ?? "",
      mobile: updated.mobile ?? "",
      workNumber: updated.workNumber ?? "",
      birthday: updated.birthday ? updated.birthday.toISOString().split("T")[0] : "",
      avatarUrl: updated.avatarUrl ?? "",
    });
  } catch (error) {
    console.error("/api/directory PATCH error", error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}
