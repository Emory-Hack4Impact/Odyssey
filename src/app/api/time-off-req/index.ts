"use server";

import { PrismaClient, RequestStatus } from "@prisma/client";

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
  leaveType: string;
  otherLeaveType: string;
  startDate: Date;
  endDate: Date;
  comments: string;
  status: RequestStatus;
  approvedBy: string | null;
  requestDate: Date;
  approvedDate: Date | null;
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
    const approvedRequests = allRequests.filter((req) => req.status === RequestStatus.APPROVED);
    const daysTaken = approvedRequests.reduce((total, request) => {
      return total + calculateDays(new Date(request.startDate), new Date(request.endDate));
    }, 0);

    const pendingRequests = allRequests.filter((req) => req.status === RequestStatus.PENDING).length;
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
        status: RequestStatus.PENDING,
      },
      include: {
        UserMetadata: {
          select: {
            id: true,
            position: true,
          },
        },
      },
      orderBy: {
        requestDate: "asc",
      },
    });

    return requests;
  } finally {
    await prisma.$disconnect();
  }
}

// Get all employee requests for HR/Admin view
export async function GetAllEmployeeRequests() {
  const prisma = new PrismaClient();

  try {
    const requests = await prisma.timeOffRequest.findMany({
      include: {
        UserMetadata: {
          select: {
            id: true,
            position: true,
          },
        },
        Approver: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        requestDate: "desc",
      },
    });

    return requests;
  } finally {
    await prisma.$disconnect();
  }
}

// Approve a time-off request
export async function ApproveTimeOffRequest(requestId: number, approverId: string) {
  const prisma = new PrismaClient();

  try {
    return await prisma.timeOffRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.APPROVED,
        approvedBy: approverId,
        approvedDate: new Date(),
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Decline a time-off request
export async function DeclineTimeOffRequest(requestId: number, approverId: string) {
  const prisma = new PrismaClient();

  try {
    return await prisma.timeOffRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.DECLINED,
        approvedBy: approverId,
        approvedDate: new Date(),
      },
    });
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

    const requests = await prisma.timeOffRequest.findMany({
      where: {
        status: RequestStatus.APPROVED,
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
      include: {
        UserMetadata: {
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    return requests;
  } finally {
    await prisma.$disconnect();
  }
}
