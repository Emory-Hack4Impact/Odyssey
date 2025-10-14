import React, { useState, useEffect } from "react";
import { PerformanceReviewDashboard } from "./PerfReviewDashboard";
import EmployeePerfEvalForm from "./EmployeePerfEvalForm";
import { GetEmployeeEvals } from "@/app/api/employee-evals";

interface HRServicesProps {
  userId: string;
  username: string;
  userRole: string;
}

interface EvaluationData {
  id: number;
  employeeId: string;
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

export default function PerfEvalEmployee({ userId, username, userRole }: HRServicesProps) {
  const [toggleForm, setToggleForm] = useState(false);
  const [performanceData, setPerformanceData] = useState<EvaluationData | null>(null);
  const [selectedYear, setSelectedYear] = useState("2025");

  const fetchData = async () => {
    try {
      const evals = await GetEmployeeEvals(userId);
      console.log("Fetched evaluations:", evals);

      const relevantEval = selectedYear
        ? evals.find((evaluation) => evaluation.year.toString() === selectedYear)
        : evals[0];

      setPerformanceData(relevantEval ?? null);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, selectedYear]);

  //   const performanceData = {
  //     overallRating: 80,
  //     reviewerCount: 5,
  //     ratings: [
  //       { label: 'Communication', percentage: 100 },
  //       { label: 'Leadership', percentage: 75 },
  //       { label: 'Timeliness', percentage: 90 },
  //       { label: 'Skill', percentage: 50 },
  //       { label: 'Skill', percentage: 50 },
  //       { label: 'Skill', percentage: 50 }
  //     ],
  //    };

  return (
    <>
      {toggleForm && (
        <>
          <div className="relative mb-6 flex w-full items-center justify-between">
            <h1 className="text-xl">Submit Your Evaluation</h1>
            <button
              className="rounded-lg border-2 px-3 py-2"
              onClick={() => setToggleForm((prev) => !prev)}
            >
              View Evaluation
            </button>
          </div>
          <EmployeePerfEvalForm userId={userId} username={username} userRole={userRole} />
        </>
      )}

      {!toggleForm && (
        <div>
          <div className="relative mb-6 flex w-full items-center justify-between">
            <div>
              <h3 className="mb-2">Year</h3>
              <div className="rounded-3xl border-2 bg-white px-3 py-2 text-gray-400">
                <select
                  id="year"
                  name="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>
            <h1 className="text-xl">Performance Evaluations</h1>
            <button
              className="rounded-lg border-2 px-3 py-2"
              onClick={() => setToggleForm((prev) => !prev)}
            >
              Submit Evaluation
            </button>
          </div>

          {performanceData ? (
            <PerformanceReviewDashboard {...performanceData} />
          ) : (
            <div>No evaluation data found for the selected year.</div>
          )}
        </div>
      )}
    </>
  );
}
