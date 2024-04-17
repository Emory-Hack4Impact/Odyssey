import { PrismaClient } from '@prisma/client';
import { FormData } from '../../dashboard/time-off-req/TimeOffForm';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// TODO: currently broken, need to check w/ Rafael if routing is correct
export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const formData: FormData = req.body;
  console.log("Submitting formdata, content: " + formData);
  try {
    const result = await createRequest(formData);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating time off request' });
  }
}

export async function createRequest(formData: FormData) {
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