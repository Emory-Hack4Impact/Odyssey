import { NextResponse } from "next/server";
import type { EmployeeEval } from "./index";
import {
  GetEmployeeEvals,
  GetLatestEmployeeEvalWithReviewers,
  GetAllEmployeeEvals,
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
    const body = (await req.json()) as EmployeeEval;
    const created = await SubmitEmployeeEval(body);
    return NextResponse.json(created);
  } catch (err) {
    console.error("/api/employee-evals POST error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    // expect { id: string, data: EmployeeEval }
    const { id, data } = body as { id?: string; data?: unknown };
    if (!id || data === undefined)
      return NextResponse.json({ error: "id and data required" }, { status: 400 });

    // basic runtime type guard for EmployeeEval to avoid passing `any`
    function isEmployeeEval(obj: unknown): obj is EmployeeEval {
      return typeof obj === "object" && obj !== null;
    }

    if (!isEmployeeEval(data)) {
      return NextResponse.json({ error: "invalid data" }, { status: 400 });
    }

    const updated = await UpdateEmployeeEval(id, data);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("/api/employee-evals PUT error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
