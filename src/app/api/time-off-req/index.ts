"use server";

import { prisma } from "@/lib/prisma";

export interface SubmitTimeOffRequest {
  id: string;
  leaveType: string;
  otherLeaveType: string;
  startDate: string;
  endDate: string;
  comments: string;
  approved: boolean;
}

export async function SubmitTimeOff(data: SubmitTimeOffRequest) {
  return await prisma.timeOffRequest.create({
    data: {
      employeeId: data.id,
      leaveType: data.leaveType,
      otherLeaveType: data.otherLeaveType,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      comments: data.comments,
      approved: data.approved,
    },
  });
}

export async function FetchTimeOff(id: string) {
  return await prisma.timeOffRequest.findMany({
    where: {
      employeeId: {
        equals: id,
      },
    },
  });
}
