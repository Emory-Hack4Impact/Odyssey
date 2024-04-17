"use server";

import { PrismaClient } from "@prisma/client";

export interface SubmitTimeOffRequest {
  id: string;
  leaveType: string;
  otherLeaveType: string;
  startDate: string;
  endDate: string;
  comments: string;
}

export async function SubmitTimeOff(data: SubmitTimeOffRequest) {
  const prisma = new PrismaClient();
  return await prisma.timeOffRequest.create({
    data: {
      employeeId: data.id,
      leaveType: data.leaveType,
      otherLeaveType: data.otherLeaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      comments: data.comments,
    },
  });
}
