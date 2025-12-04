import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function attachEmployeeNames(requests: any[]) {
  const uniqueIds = Array.from(new Set(requests.map((r) => r.employeeId)));
  const metas = await prisma.userMetadata.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true, employeeFirstName: true, employeeLastName: true, position: true },
  });
  const nameById = new Map<string, string>();
  for (const m of metas) {
    const full = [m.employeeFirstName, m.employeeLastName].filter(Boolean).join(" ");
    nameById.set(m.id, full || m.position || "Employee");
  }
  return requests.map((r) => ({ ...r, employeeName: nameById.get(r.employeeId) }));
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") || "all";
  const employeeId = req.nextUrl.searchParams.get("employeeId") || undefined;

  try {
    if (type === "employee") {
      try {
        if (!employeeId) {
          return Response.json({ error: "Missing employeeId" }, { status: 400 });
        }
        const requests = await prisma.timeOffRequest.findMany({
          where: { employeeId },
          orderBy: { startDate: "desc" },
        });
        return Response.json(requests);
      } catch (err) {
        console.error("Employee fetch error:", err);
        return Response.json(
          {
            error: "Failed to fetch employee requests",
            details: err instanceof Error ? err.message : String(err),
          },
          { status: 500 },
        );
      }
    }
    if (type === "pending") {
      try {
        const all = await prisma.timeOffRequest.findMany({ orderBy: { startDate: "asc" } });
        const requests = all.filter((r) => r.status === "PENDING" || !r.status);
        const withNames = await attachEmployeeNames(requests);
        return Response.json(withNames);
      } catch (err) {
        console.error("Pending fetch error:", err);
        return Response.json(
          {
            error: "Failed to fetch pending requests",
            details: err instanceof Error ? err.message : String(err),
          },
          { status: 500 },
        );
      }
    }

    if (type === "nonpending") {
      try {
        const all = await prisma.timeOffRequest.findMany({ orderBy: { startDate: "desc" } });
        const requests = all.filter((r) => r.status === "APPROVED" || r.status === "DECLINED");
        const withNames = await attachEmployeeNames(requests);
        return Response.json(withNames);
      } catch (err) {
        console.error("Non-pending fetch error:", err);
        return Response.json(
          {
            error: "Failed to fetch non-pending requests",
            details: err instanceof Error ? err.message : String(err),
          },
          { status: 500 },
        );
      }
    }

    try {
      const requests = await prisma.timeOffRequest.findMany({ orderBy: { startDate: "desc" } });
      const withNames = await attachEmployeeNames(requests);
      return Response.json(withNames);
    } catch (err) {
      console.error("All fetch error:", err);
      return Response.json(
        {
          error: "Failed to fetch requests",
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 },
      );
    }
  } catch (e) {
    console.error("Error in time-off-req route:", e);
    return Response.json(
      {
        error: "Internal Server Error",
        details: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const { id, status } = await req.json();

    if (typeof id !== "number" || !["APPROVED", "DECLINED", "PENDING"].includes(status)) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }

    const updated = await prisma.timeOffRequest.update({
      where: { id },
      data: { status },
    });

    return Response.json(updated);
  } catch (e) {
    console.error("Error in time-off-req POST:", e);
    return Response.json(
      {
        error: "Failed to update request status",
        details: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}
