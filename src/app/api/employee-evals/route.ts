import { NextResponse } from "next/server";
import type { EmployeeEvaluation, EmployeeEvaluationMetadata } from "@prisma/client";
import {
  GetEmployeeEvals,
  GetLatestEmployeeEvalWithReviewers,
  GetAllEmployeeEvals,
  GetEmployeeEvalByID,
  GetAllEmployeeEvalsMetadata,
  SubmitEmployeeEval,
  UpdateEmployeeEval,
} from "./index";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const employeeId = url.searchParams.get("employeeId");

    const yearParam = url.searchParams.get("year");
    if (employeeId && yearParam) {
      const year = Number(yearParam);
      if (Number.isNaN(year)) return NextResponse.json({ error: "invalid year" }, { status: 400 });
      const result = await GetLatestEmployeeEvalWithReviewers(employeeId, year);
      return NextResponse.json(result);
    }

    if (employeeId) {
      const evals = await GetEmployeeEvals(employeeId);
      return NextResponse.json(evals);
    }

    const metaParam = url.searchParams.get("meta");
    if (metaParam) {
      const metaRows = await GetAllEmployeeEvalsMetadata();
      return NextResponse.json(metaRows);
    }

    const idParam = url.searchParams.get("id");
    if (idParam) {
      const evalByID = await GetEmployeeEvalByID(idParam);
      return NextResponse.json(evalByID);
    }

    // no employeeId -> return all evaluations
    const all = await GetAllEmployeeEvals();
    return NextResponse.json(all);
  } catch (err) {
    console.error("/api/employee-evals GET error", err);
    let message: string;
    if (err && typeof err === "object" && "message" in err) {
      message = (err as unknown as { message?: unknown }).message as string;
    } else {
      message = String(err);
    }
    return NextResponse.json({ error: message ?? "unknown error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      data: EmployeeEvaluation;
      metadata: EmployeeEvaluationMetadata;
    };
    const { data, metadata } = body;

    if (!data || !metadata) {
      return NextResponse.json({ error: "data and metadata required" }, { status: 400 });
    }

    const created = await SubmitEmployeeEval(data, metadata);
    return NextResponse.json(created);
  } catch (err) {
    console.error("/api/employee-evals POST error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as {
      id: string;
      data: EmployeeEvaluation;
      metadata: EmployeeEvaluationMetadata;
    };

    const { id, data, metadata } = body;

    if (!id || !data || !metadata) {
      return NextResponse.json({ error: "id and data and metadata required" }, { status: 400 });
    }

    // basic runtime type guard for EmployeeEval to avoid passing `any`
    function isEmployeeEval(obj: unknown): obj is EmployeeEvaluation {
      return typeof obj === "object" && obj !== null;
    }

    if (!isEmployeeEval(data)) {
      return NextResponse.json({ error: "invalid data" }, { status: 400 });
    }

    const updated = await UpdateEmployeeEval(id, data, metadata);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("/api/employee-evals PUT error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
