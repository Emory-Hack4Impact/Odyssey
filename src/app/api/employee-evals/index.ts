"use server";

import { prisma } from "@/lib/prisma";
import type { EmployeeEvaluation, EmployeeEvaluationMetadata } from "@prisma/client";

export async function SubmitEmployeeEval(
  data: EmployeeEvaluation,
  metadata: EmployeeEvaluationMetadata,
) {
  try {
    // Enforce: manager/HR may not submit before the employee's own submission exists.
    // If submitterId !== employeeId (i.e. manager/HR), ensure a self-submission exists for same employee and year.
    if (
      metadata.employeeId &&
      metadata.submitterId &&
      metadata.submitterId !== metadata.employeeId
    ) {
      let self = null;
      try {
        self = await prisma.employeeEvaluationMetadata.findFirst({
          where: {
            employeeId: metadata.employeeId,
            submitterId: metadata.employeeId,
            year: metadata.year,
          },
        });
      } catch (err) {
        // Fall back for DB schema/type mismatches (e.g. conversion errors) by
        // querying without the year and checking in JS.
        console.warn("Prisma findFirst with year failed, falling back to client-side filter:", err);
        const candidates = await prisma.employeeEvaluationMetadata.findMany({
          where: { employeeId: metadata.employeeId, submitterId: metadata.employeeId },
        });
        self = candidates.find((c) => Number(c.year) === Number(metadata.year)) ?? null;
      }
      if (!self) {
        throw new Error(
          "Employee must submit their evaluation before manager/HR can submit for the same year.",
        );
      }
    }

    // Default: create a new evaluation row for non-self submissions
    try {
      const evalRow = await prisma.employeeEvaluation.create({
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
        },
      });

      const metaRow = await prisma.employeeEvaluationMetadata.create({
        data: {
          evaluationId: evalRow.id,
          employeeId: metadata.employeeId,
          submitterId: metadata.submitterId,
          year: metadata.year,
          submittedAt: metadata.submittedAt ?? new Date(),
        },
      });

      return { evaluation: evalRow, metadata: metaRow };
    } catch (err: unknown) {
      // If a unique-constraint violation occurred (P2002), another process
      // likely created the row concurrently. In that case, find the existing
      // record and update it instead of failing.
      const code = (err as { code?: unknown })?.code as string | undefined;
      const name = (err as { name?: unknown })?.name as string | undefined;
      if (code === "P2002" || name === "PrismaClientKnownRequestError") {
        // locate the existing row by the composite key
        const existing = await prisma.employeeEvaluationMetadata.findFirst({
          where: {
            employeeId: metadata.employeeId,
            submitterId: metadata.submitterId,
            year: metadata.year,
          },
        });
        if (existing) {
          const updatedEval = await prisma.employeeEvaluation.update({
            where: { id: existing.evaluationId },
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
            },
          });
          return { evaluation: updatedEval, metadata: existing };
        }
      }
      // rethrow if it's not a handled case
      throw err;
    }
  } finally {
  }
}

export async function GetAllEmployeeEvals() {
  try {
    const rows = await prisma.employeeEvaluation.findMany();
    return rows.map((r) => ({ ...r }));
  } finally {
  }
}

export async function GetAllEmployeeEvalsMetadata() {
  try {
    // Fetch all evaluation metadata with related evaluation and user data
    const rows = await prisma.employeeEvaluationMetadata.findMany({
      orderBy: { submittedAt: "desc" },
      include: { evaluation: true, submitter: true, reviewedEmployee: true },
    });

    // Flatten and normalize into a shape convenient for the admin listing
    return rows.map((r) => ({
      id: r.id,
      evaluationId: r.evaluationId,
      employeeId: r.employeeId ?? null,
      submitterId: r.submitterId ?? null,
      year: r.year,
      submittedAt: r.submittedAt,
      employeeFirstName: r.reviewedEmployee?.employeeFirstName ?? "",
      employeeLastName: r.reviewedEmployee?.employeeLastName ?? "",
    }));
  } catch (err) {
    console.error("GetAllEmployeeEvalsMetadata error", err);
    throw err;
  }
}

export async function GetEmployeeEvals(employeeId: string) {
  try {
    try {
      return await prisma.employeeEvaluationMetadata.findMany({
        where: { employeeId: employeeId },
        orderBy: { submittedAt: "desc" },
      });
    } catch (err) {
      // Some Prisma clients / schema states may not have `submittedAt` available
      // (unknown argument). Fall back to querying without orderBy and sort in JS.
      console.warn("Prisma ordering by submittedAt failed, falling back to client-side sort:", err);
      const rows: EmployeeEvaluationMetadata[] = await prisma.employeeEvaluationMetadata.findMany({
        where: { employeeId: employeeId },
      });
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
  }
}

export async function GetLatestEmployeeEvalWithReviewers(employeeId: string, year: number) {
  try {
    let evalsMeta: EmployeeEvaluationMetadata[] = [];
    try {
      evalsMeta = await prisma.employeeEvaluationMetadata.findMany({
        where: { employeeId, year },
        orderBy: { submittedAt: "desc" },
      });
    } catch (err) {
      console.warn(
        "Prisma findMany with year/orderBy failed, falling back to client-side filter/sort:",
        err,
      );
      // Try querying without year first (some DBs may have incompatible column types)
      try {
        evalsMeta = await prisma.employeeEvaluationMetadata.findMany({
          where: { employeeId },
          orderBy: { submittedAt: "desc" },
        });
      } catch (err2) {
        console.warn(
          "Prisma ordering by submittedAt failed as well, falling back to client-side sort:",
          err2,
        );
        evalsMeta = await prisma.employeeEvaluationMetadata.findMany({ where: { employeeId } });
        const getTime = (val: unknown) => {
          if (!val) return 0;
          if (typeof val === "number") return val;
          if (typeof val === "string") return new Date(val).getTime();
          if (val instanceof Date) return val.getTime();
          return 0;
        };
        evalsMeta.sort((a, b) => getTime(b.submittedAt) - getTime(a.submittedAt));
      }
      // Filter by year in JS so we avoid DB type-conversion errors
      evalsMeta = evalsMeta.filter((e) => Number(e.year) === Number(year));
    }

    const latest = evalsMeta.length > 0 ? evalsMeta[0] : null;
    // normalize reviewer/evaluation numeric fields before returning
    let normalizedLatest: (EmployeeEvaluation & Partial<EmployeeEvaluationMetadata>) | null = null;
    if (latest) {
      try {
        const evalRow = await prisma.employeeEvaluation.findUnique({
          where: { id: latest.evaluationId },
        });
        if (evalRow) {
          normalizedLatest = {
            ...evalRow,
            year: latest.year as unknown as number,
            submitterId: latest.submitterId,
            employeeId: latest.employeeId,
            submittedAt: latest.submittedAt,
          };
        } else {
          normalizedLatest = {
            ...(latest as unknown as EmployeeEvaluation & Partial<EmployeeEvaluationMetadata>),
          };
        }
      } catch (err) {
        console.warn(
          "Failed to fetch evaluation row for metadata, falling back to metadata-only response:",
          err,
        );
        normalizedLatest = {
          ...(latest as unknown as EmployeeEvaluation & Partial<EmployeeEvaluationMetadata>),
        };
      }
    }

    // gather distinct submitterIds (exclude null and the employee themself optional)
    const submitterIds = Array.from(
      new Set(evalsMeta.map((e) => e.submitterId).filter((id): id is string => !!id)),
    );

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
  }
}

export async function UpdateEmployeeEval(
  id: string,
  data: EmployeeEvaluation,
  metadata: EmployeeEvaluationMetadata,
) {
  try {
    // Similar validation on update: if this update represents a manager/HR submission
    // (submitterId !== employeeId), ensure the employee's self-submission for that year exists.
    if (
      metadata.employeeId &&
      metadata.submitterId &&
      metadata.submitterId !== metadata.employeeId
    ) {
      let self = null;
      try {
        self = await prisma.employeeEvaluationMetadata.findFirst({
          where: {
            employeeId: metadata.employeeId,
            submitterId: metadata.employeeId,
            year: metadata.year,
          },
        });
      } catch (err) {
        console.warn(
          "Prisma findFirst with year failed in update, falling back to client-side filter:",
          err,
        );
        const candidates = await prisma.employeeEvaluationMetadata.findMany({
          where: { employeeId: metadata.employeeId, submitterId: metadata.employeeId },
        });
        self = candidates.find((c) => Number(c.year) === Number(metadata.year)) ?? null;
      }
      if (!self) {
        throw new Error(
          "Employee must submit their evaluation before manager/HR can submit for the same year.",
        );
      }
    }

    return await prisma.employeeEvaluation.update({
      where: {
        id: id,
      },
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
      },
    });
  } finally {
  }
}
