"use server";

import { PrismaClient } from "@prisma/client";

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
  const prisma = new PrismaClient();
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
