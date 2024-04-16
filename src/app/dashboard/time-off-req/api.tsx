import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TimeOffRequest {
  leaveType: string;
  otherLeaveType: string;
  startDate: string;
  endDate: string;
  comments: string;
}

export async function submitFormData(formData: TimeOffRequest) {
  return await prisma.timeOffRequest.create({
    data: {
      employeeId: "00000000-0000-0000-0000-000000000001", // hard coded for now, need to fetch from session in practice
      leaveType: formData.leaveType,
      otherLeaveType: formData.otherLeaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      comments: formData.comments,
    }
  });
}