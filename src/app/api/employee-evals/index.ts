"use server";

import { PrismaClient } from "@prisma/client";
import type { EmployeeEvaluation } from "@prisma/client";

export interface EmployeeEval {
  employeeId?: string | null;
  submitterId?: string | null;
  year: number;
  strengths: string;
  weaknesses: string;
  improvements: string;
  notes: string;
  communication: number;
  leadership: number;
  timeliness: number;
  skill1: number;
  skill2: number;
  skill3: number;
  submittedAt?: Date | string;
}

export async function SubmitEmployeeEval(data: EmployeeEval) {
  const prisma = new PrismaClient();
  try {
    // Enforce: manager/HR may not submit before the employee's own submission exists.
    // If submitterId !== employeeId (i.e. manager/HR), ensure a self-submission exists for same employee and year.
    if (data.employeeId && data.submitterId && data.submitterId !== data.employeeId) {
      let self = null;
      try {
        self = await prisma.employeeEvaluation.findFirst({
          where: {
            employeeId: data.employeeId,
            submitterId: data.employeeId,
            year: data.year,
          },
        });
      } catch (err) {
        // Fall back for DB schema/type mismatches (e.g. conversion errors) by
        // querying without the year and checking in JS.
        console.warn("Prisma findFirst with year failed, falling back to client-side filter:", err);
        const candidates = await prisma.employeeEvaluation.findMany({ where: { employeeId: data.employeeId, submitterId: data.employeeId } });
        self = candidates.find((c) => Number(c.year) === Number(data.year)) ?? null;
      }
      if (!self) {
        throw new Error("Employee must submit their evaluation before manager/HR can submit for the same year.");
      }
    }

    // Default: create a new evaluation row for non-self submissions
    try {
      return await prisma.employeeEvaluation.create({
        data: {
          employeeId: data.employeeId,
          year: data.year,
          strengths: data.strengths,
          weaknesses: data.weaknesses,
          improvements: data.improvements,
          notes: data.notes,
          communication: Number(data.communication),
          leadership: Number(data.leadership),
          timeliness: Number(data.timeliness),
          skill1: data.skill1,
          skill2: data.skill2,
          skill3: data.skill3,
          submitterId: data.submitterId,
          submittedAt: data.submittedAt ?? new Date(),
        },
      });
    } catch (err: unknown) {
      // If a unique-constraint violation occurred (P2002), another process
      // likely created the row concurrently. In that case, find the existing
      // record and update it instead of failing.
      const code = (err as { code?: unknown })?.code as string | undefined;
      const name = (err as { name?: unknown })?.name as string | undefined;
      if (code === "P2002" || name === "PrismaClientKnownRequestError") {
        // locate the existing row by the composite key
        const existing = await prisma.employeeEvaluation.findFirst({
          where: {
            employeeId: data.employeeId,
            submitterId: data.submitterId,
            year: data.year,
          },
        });
        if (existing) {
          return await prisma.employeeEvaluation.update({
            where: { id: existing.id },
            data: {
              strengths: data.strengths,
              weaknesses: data.weaknesses,
              improvements: data.improvements,
              notes: data.notes,
              communication: Number(data.communication),
              leadership: Number(data.leadership),
              timeliness: Number(data.timeliness),
              skill1: data.skill1,
              skill2: data.skill2,
              skill3: data.skill3,
              submittedAt: data.submittedAt ?? new Date(),
            },
          });
        }
      }
      // rethrow if it's not a handled case
      throw err;
    }
  } finally {
    await prisma.$disconnect();
  }
}

export async function GetAllEmployeeEvals() {
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.employeeEvaluation.findMany();
    return rows.map((r) => ({ ...r }));
  } finally {
    await prisma.$disconnect();
  }
}

export async function GetEmployeeEvals(employeeId: string) {
  const prisma = new PrismaClient();
  try {
    try {
      return await prisma.employeeEvaluation.findMany({
        where: { employeeId: employeeId },
        orderBy: { submittedAt: "desc" },
      });
    } catch (err) {
      // Some Prisma clients / schema states may not have `submittedAt` available
      // (unknown argument). Fall back to querying without orderBy and sort in JS.
      console.warn("Prisma ordering by submittedAt failed, falling back to client-side sort:", err);
      const rows: EmployeeEvaluation[] = await prisma.employeeEvaluation.findMany({ where: { employeeId: employeeId } });
      // sort by submittedAt if present, otherwise keep DB order
      const getTime = (val: unknown) => {
        if (!val) return 0;
        if (typeof val === "number") return val;
        if (typeof val === "string") return new Date(val).getTime();
        if (val instanceof Date) return val.getTime();
        return 0;
      };
      rows.sort((a, b) => getTime(b.submittedAt) - getTime(a.submittedAt));
      return rows;
    }
  } finally {
    await prisma.$disconnect();
  }
}

export async function GetLatestEmployeeEvalWithReviewers(employeeId: string, year: number) {
  const prisma = new PrismaClient();
  try {
    let evals: EmployeeEvaluation[] = [];
    try {
      evals = await prisma.employeeEvaluation.findMany({ where: { employeeId, year }, orderBy: { submittedAt: "desc" } });
    } catch (err) {
      console.warn("Prisma findMany with year/orderBy failed, falling back to client-side filter/sort:", err);
      // Try querying without year first (some DBs may have incompatible column types)
      try {
        evals = await prisma.employeeEvaluation.findMany({ where: { employeeId }, orderBy: { submittedAt: "desc" } });
      } catch (err2) {
        console.warn("Prisma ordering by submittedAt failed as well, falling back to client-side sort:", err2);
        evals = await prisma.employeeEvaluation.findMany({ where: { employeeId } });
        const getTime = (val: unknown) => {
          if (!val) return 0;
          if (typeof val === "number") return val;
          if (typeof val === "string") return new Date(val).getTime();
          if (val instanceof Date) return val.getTime();
          return 0;
        };
        evals.sort((a, b) => getTime(b.submittedAt) - getTime(a.submittedAt));
      }
      // Filter by year in JS so we avoid DB type-conversion errors
      evals = evals.filter((e) => Number(e.year) === Number(year));
    }

    const latest = evals.length > 0 ? evals[0] : null;
    // normalize reviewer/evaluation numeric fields before returning
    const normalizedLatest = latest ? { ...latest } : null;

    // gather distinct submitterIds (exclude null and the employee themself optional)
    const submitterIds = Array.from(new Set(evals.map((e) => e.submitterId).filter((id): id is string => !!id)));

    let reviewers: { id: string; initials: string }[] = [];
    if (submitterIds.length > 0) {
      const users = await prisma.userMetadata.findMany({ where: { id: { in: submitterIds } } });
      reviewers = users.map((u) => {
        const first = (u.employeeFirstName ?? "").trim();
        const last = (u.employeeLastName ?? "").trim();
        let initials = `${(first[0] ?? "").toUpperCase()}${(last[0] ?? "").toUpperCase()}`;
        if (!initials || initials === "") {
          // Fallback to first two letters of position (e.g., "HR") or id prefix
          const pos = (u.position ?? "").replace(/[^a-z]/gi, "").toUpperCase();
          if (pos.length >= 2) {
            initials = pos.slice(0, 2);
          } else if (u.id) {
            initials = u.id.slice(0, 2).toUpperCase();
          } else {
            initials = "??";
          }
        }
        return { id: u.id, initials };
      });
    }

    return { evaluation: normalizedLatest, reviewers };
  } finally {
    await prisma.$disconnect();
  }
}

export async function UpdateEmployeeEval(id: string, data: EmployeeEval) {
  const prisma = new PrismaClient();
  try {
    // Similar validation on update: if this update represents a manager/HR submission
    // (submitterId !== employeeId), ensure the employee's self-submission for that year exists.
    if (data.employeeId && data.submitterId && data.submitterId !== data.employeeId) {
      let self = null;
      try {
        self = await prisma.employeeEvaluation.findFirst({
          where: {
            employeeId: data.employeeId,
            submitterId: data.employeeId,
            year: data.year,
          },
        });
      } catch (err) {
        console.warn("Prisma findFirst with year failed in update, falling back to client-side filter:", err);
        const candidates = await prisma.employeeEvaluation.findMany({ where: { employeeId: data.employeeId, submitterId: data.employeeId } });
        self = candidates.find((c) => Number(c.year) === Number(data.year)) ?? null;
      }
      if (!self) {
        throw new Error("Employee must submit their evaluation before manager/HR can submit for the same year.");
      }
    }

    return await prisma.employeeEvaluation.update({
      where: {
        id: id,
      },
      data: {
        employeeId: data.employeeId,
        year: data.year,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        improvements: data.improvements,
        notes: data.notes,
        communication: Number(data.communication),
        leadership: Number(data.leadership),
        timeliness: Number(data.timeliness),
        skill1: data.skill1,
        skill2: data.skill2,
        skill3: data.skill3,
        submitterId: data.submitterId,
        submittedAt: data.submittedAt ?? new Date(),
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
