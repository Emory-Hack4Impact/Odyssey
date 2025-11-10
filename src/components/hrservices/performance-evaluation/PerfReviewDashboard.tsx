import React, { useEffect, useState } from "react";
import { RatingItem } from "./RatingItem";

interface EmployeeEvaluationAPI {
  id: string;
  employeeId?: string | null;
  submitterId?: string | null;
  year: number;
  strengths: string;
  weaknesses: string;
  improvements: string;
  notes: string;
  communication: string | number;
  leadership: string | number;
  timeliness: string | number;
  skill1: number;
  skill2: number;
  skill3: number;
  submittedAt?: string | Date;
}

interface PerformanceReviewDashboardProps {
  employeeId: string;
  selectedYear?: string;
}

interface Reviewer {
  id: string;
  initials: string;
}

export const PerformanceReviewDashboard: React.FC<PerformanceReviewDashboardProps> = ({
  employeeId,
  selectedYear,
}) => {
  const [evaluation, setEvaluation] = useState<EmployeeEvaluationAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    void (async () => {
      try {
        const url = `/api/employee-evals?employeeId=${encodeURIComponent(employeeId)}${selectedYear ? `&year=${encodeURIComponent(selectedYear)}` : ""}`;
        const res = await fetch(url);
        const payload = (await res.json()) as unknown;
        if (!res.ok) {
          let message = String(res.statusText);
          if (payload && typeof payload === "object" && "error" in payload) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - payload has an 'error' property at runtime
            const maybeErr = (payload as Record<string, unknown>).error;
            message = typeof maybeErr === "string" ? maybeErr : message;
          }
          throw new Error(message);
        }
        if (selectedYear) {
          // server returns { evaluation, reviewers }
          const obj = payload as {
            evaluation?: EmployeeEvaluationAPI | null;
            reviewers?: Reviewer[];
          } | null;
          setEvaluation(obj?.evaluation ?? null);
          setReviewers(obj?.reviewers ?? []);
        } else {
          const data = payload as EmployeeEvaluationAPI[] | undefined | null;
          const first = Array.isArray(data) && data.length > 0 ? data[0] : null;
          setEvaluation(first ?? null);
          setReviewers([]);
        }
      } catch (err) {
        console.error("Failed to load evaluations", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [employeeId, selectedYear]);

  if (loading) return <div>Loading evaluation...</div>;
  if (error) return <div className="text-red-600">Error loading evaluation: {error}</div>;
  if (!evaluation) return <div>No evaluation submitted yet.</div>;

  const strengths = evaluation.strengths ?? "";
  const weaknesses = evaluation.weaknesses ?? "";
  const improvements = evaluation.improvements ?? "";
  const notes = evaluation.notes ?? "";
  const communication = String(evaluation.communication ?? "0");
  const leadership = String(evaluation.leadership ?? "0");
  const timeliness = String(evaluation.timeliness ?? "0");
  const skill1 = String(evaluation.skill1 ?? 0);
  const skill2 = String(evaluation.skill2 ?? 0);
  const skill3 = String(evaluation.skill3 ?? 0);

  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));
  const commNum = clamp(Number(communication));
  const leadNum = clamp(Number(leadership));
  const timeNum = clamp(Number(timeliness));
  const s1Num = clamp(Number(skill1));
  const s2Num = clamp(Number(skill2));
  const s3Num = clamp(Number(skill3));

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <div className="mx-auto rounded-lg p-6">
          {/* Overall Rating and Reviewers Section */}
          <div className="mb-8 flex items-center justify-center gap-6">
            <div className="flex flex-col items-center rounded-3xl border-2 px-4 py-4">
              <div className="text-4xl font-bold text-black">
                {Math.round((commNum + leadNum + timeNum + s1Num + s2Num + s3Num) / 6)}%
              </div>
              <div className="text-lg text-black">Overall Rating</div>
            </div>
            <div className="flex flex-col items-center rounded-3xl border-2 px-4 py-4">
              <div className="flex space-x-2">
                {reviewers.length > 0 ? (
                  reviewers.map((r) => (
                    <div
                      key={r.id}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-gray-300 text-sm font-medium"
                    >
                      {r.initials}
                    </div>
                  ))
                ) : (
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-300" />
                )}
              </div>
              <h3 className="text-lg">Reviewers</h3>
            </div>
          </div>

          {/* Job Performance Ratings Section */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Job Performance Ratings</h2>
            <RatingItem key={1} label="Communication" percentage={String(commNum)} />
            <RatingItem key={2} label="Leadership" percentage={String(leadNum)} />
            <RatingItem key={3} label={"Timeliness"} percentage={String(timeNum)} />
            <RatingItem key={4} label="Skill1" percentage={String(s1Num)} />
            <RatingItem key={5} label="Skill2" percentage={String(s2Num)} />
            <RatingItem key={6} label="Skill3" percentage={String(s3Num)} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-xl">Strengths</h3>
          {(() => {
            const splitBullets = (s: string) => {
              const lines = s
                .split(/\r?\n/)
                .map((t) => t.trim())
                .filter(Boolean);
              if (lines.length > 1) return lines;
              // fallback to period-split if no newlines present
              return s
                .split(".")
                .map((t) => t.trim())
                .filter(Boolean);
            };
            return (
              <ul className="ml-4 list-disc text-sm">
                {splitBullets(strengths).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          })()}
        </div>

        <div>
          <h3 className="mb-2 text-xl">Weaknesses</h3>
          {(() => {
            const splitBullets = (s: string) => {
              const lines = s
                .split(/\r?\n/)
                .map((t) => t.trim())
                .filter(Boolean);
              if (lines.length > 1) return lines;
              return s
                .split(".")
                .map((t) => t.trim())
                .filter(Boolean);
            };
            return (
              <ul className="ml-4 list-disc text-sm">
                {splitBullets(weaknesses).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          })()}
        </div>

        <div>
          <h3 className="mb-2 text-xl">Improvements</h3>
          {(() => {
            const splitBullets = (s: string) => {
              const lines = s
                .split(/\r?\n/)
                .map((t) => t.trim())
                .filter(Boolean);
              if (lines.length > 1) return lines;
              return s
                .split(".")
                .map((t) => t.trim())
                .filter(Boolean);
            };
            return (
              <ul className="ml-4 list-disc text-sm">
                {splitBullets(improvements).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          })()}
        </div>

        <div>
          <h3 className="mb-2 text-xl">Other Notes</h3>
          {(() => {
            const splitBullets = (s: string) => {
              const lines = s
                .split(/\r?\n/)
                .map((t) => t.trim())
                .filter(Boolean);
              if (lines.length > 1) return lines;
              return s
                .split(".")
                .map((t) => t.trim())
                .filter(Boolean);
            };
            return (
              <ul className="ml-4 list-disc text-sm">
                {splitBullets(notes).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
