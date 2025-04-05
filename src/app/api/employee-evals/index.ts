"use server";

import { PrismaClient } from "@prisma/client";

export interface EmployeeEval {
  id: string;
  year: number;
  strengths: string;
  weaknesses: string;
  improvements: string;
  notes: string;
  communication: string;
  leadership: string;
  timeliness: string;
  skill1: string;
  skill2: string;
  skill3: string;
}

export async function SubmitEmployeeEval(data: EmployeeEval) {
  const prisma = new PrismaClient();
  return await prisma.employeeEvaluation.create({
    data: {
      employeeId: data.id,
      year: data.year,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      improvements: data.improvements,
      notes: data.notes,
      communication: data.communication,
      leadership: data.leadership,
      timeliness: data.timeliness,
      skill1: data.skill1,
      skill2: data.skill2,
      skill3: data.skill3,
    },
  });
}
