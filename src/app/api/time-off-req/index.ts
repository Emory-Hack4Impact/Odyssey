"use server";

import { PrismaClient, type RequestStatus, type TimeOffRequest } from "@prisma/client";

export interface SubmitTimeOffRequest {
  id: string;
  leaveType: string;
  otherLeaveType: string;
  startDate: string;
  endDate: string;
  comments: string;
}

export interface TimeOffRequestData {
  id: number;
  employeeId: string;
  employeeName?: string;
  leaveType: string;
  otherLeaveType: string;
  startDate: Date;
  endDate: Date;
  comments: string;
  requestDate: Date;
  status: RequestStatus;
}

type TimeOffRequestWithDate = TimeOffRequest & { requestDate?: Date };
const mapRequestWithUser = (request: TimeOffRequestWithDate): TimeOffRequestData => {
  return {
    id: request.id,
    employeeId: request.employeeId,
    leaveType: request.leaveType,
    otherLeaveType: request.otherLeaveType,
    startDate: request.startDate,
    endDate: request.endDate,
    comments: request.comments,
    requestDate: request.requestDate ?? request.startDate,
    status: request.status,
  };
};

async function attachEmployeeNames<T extends TimeOffRequest>(
  prisma: PrismaClient,
  requests: T[],
): Promise<TimeOffRequestData[]> {
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
  return requests.map((r) => ({ ...mapRequestWithUser(r), employeeName: nameById.get(r.employeeId) }));
}

export async function SubmitTimeOff(data: SubmitTimeOffRequest) {
  const prisma = new PrismaClient();

  // Convert date strings to DateTime objects
  const startDateTime = new Date(data.startDate + "T00:00:00.000Z");
  const endDateTime = new Date(data.endDate + "T23:59:59.999Z");

  try {
    return await prisma.timeOffRequest.create({
      data: {
        employeeId: data.id,
        leaveType: data.leaveType,
        otherLeaveType: data.otherLeaveType,
        startDate: startDateTime,
        endDate: endDateTime,
        comments: data.comments,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GetTimeOffRequests(employeeId: string) {
  const prisma = new PrismaClient();

  try {
    const requests = await prisma.timeOffRequest.findMany({
      where: {
        employeeId: employeeId,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return requests;
  } finally {
    await prisma.$disconnect();
  }
}

export async function GetTimeOffStats(employeeId: string) {
  const prisma = new PrismaClient();

  try {
    const allRequests = await prisma.timeOffRequest.findMany({
      where: {
        employeeId: employeeId,
      },
    });

    // Calculate days for each request
    const calculateDays = (startDate: Date, endDate: Date): number => {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      return diffDays;
    };

    // Only count approved requests as "taken"
    const approvedRequests = allRequests.filter((req) => req.status === "APPROVED");
    const daysTaken = approvedRequests.reduce((total, request) => {
      return total + calculateDays(new Date(request.startDate), new Date(request.endDate));
    }, 0);

    const pendingRequests = allRequests.filter((req) => req.status === "PENDING").length;
    const totalPTOPerYear = 20; // This could be fetched from user settings
    const daysAvailable = totalPTOPerYear - daysTaken;

    return {
      daysAvailable: Math.max(0, daysAvailable),
      pendingRequests,
      daysTaken,
      totalPTOPerYear,
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Get all pending requests for HR/Admin to approve
export async function GetPendingRequests() {
  const prisma = new PrismaClient();

  try {
    const requests = await prisma.timeOffRequest.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return await attachEmployeeNames(prisma, requests);
  } finally {
    await prisma.$disconnect();
  }
}

// Get all employee requests for HR/Admin view
export async function GetAllEmployeeRequests() {
  const prisma = new PrismaClient();

  try {
    const requests = await prisma.timeOffRequest.findMany({
      where: {
        NOT: { status: "PENDING" },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return await attachEmployeeNames(prisma, requests);
  } finally {
    await prisma.$disconnect();
  }
}

// Approve a time-off request
export async function ApproveTimeOffRequest(requestId: number, _approverId: string) {
  const prisma = new PrismaClient();

  try {
    return await prisma.timeOffRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Decline a time-off request
export async function DeclineTimeOffRequest(requestId: number, _approverId: string) {
  const prisma = new PrismaClient();

  try {
    return await prisma.timeOffRequest.update({
      where: { id: requestId },
      data: {
        status: "DECLINED",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function UpdateRequestStatus(
  requestId: number,
  status: RequestStatus,
  _approverId?: string,
) {
  const prisma = new PrismaClient();

  try {
    const request = await prisma.timeOffRequest.update({
      where: { id: requestId },
      data: {
        status,
      },
    });

    return mapRequestWithUser(request);
  } finally {
    await prisma.$disconnect();
  }
}

// Get all requests for calendar view (includes pending/declined)
export async function GetAllRequestsForCalendar() {
  const prisma = new PrismaClient();

  try {
    const requests = await prisma.timeOffRequest.findMany({
      orderBy: {
        startDate: "asc",
      },
    });

    return await attachEmployeeNames(prisma, requests);
  } finally {
    await prisma.$disconnect();
  }
}

// Get approved requests for calendar view
export async function GetApprovedRequestsForCalendar(month: number, year: number) {
  const prisma = new PrismaClient();

  try {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    // Avoid using `status` in Prisma where clause to bypass client/schema mismatch at runtime.
    const requests = await prisma.timeOffRequest.findMany({
      where: {
        OR: [
          {
            startDate: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          {
            endDate: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        ],
      },
      orderBy: { startDate: "asc" },
    });

    const approvedOnly = requests.filter((r) => r.status === "APPROVED");

    return await attachEmployeeNames(prisma, approvedOnly);
  } finally {
    await prisma.$disconnect();
  }
}
