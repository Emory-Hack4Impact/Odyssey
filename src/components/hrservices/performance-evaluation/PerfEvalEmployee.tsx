import React, { useState } from "react";
import { PerformanceReviewDashboard } from "./PerfReviewDashboard";
import EmployeePerfEvalForm from "./EmployeePerfEvalForm";

interface HRServicesProps {
  userId: string;
  username: string;
  userRole: string;
}

export default function PerfEvalEmployee({ userId, username, userRole }: HRServicesProps) {
  const [toggleForm, setToggleForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2025");

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

          <PerformanceReviewDashboard employeeId={userId} selectedYear={selectedYear} />
        </div>
      )}
    </>
  );
}
