import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function submitFormData(formData: any) {
  return await prisma.timeOffRequest.create({
    data: {
      ...formData,
    },
  });
}