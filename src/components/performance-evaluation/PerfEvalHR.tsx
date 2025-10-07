import React, { useEffect, useState } from "react";
import HRPerfEvalForm from "./HRPerfEvalForm";
import { GetAllEmployeeEvals } from "@/app/api/employee-evals";

interface HRServicesProps {
  userId: string;
  username: string;
  userRole: string;
}

interface Employee {
  id: string;
  role: string;
  evaluations: FetchedEval[];
}

interface FetchedEval {
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

export default function PerfEvalHR({
  userId,
  username,
  userRole,
}: HRServicesProps) {
  const [employeeEvals, setEmployeeEvals] = useState<FetchedEval[]>([]);
  const [selectedEval, setSelectedEval] = useState<FetchedEval>({
    id: 0,
    employeeId: "",
    year: 2025,
    strengths: "",
    weaknesses: "",
    improvements: "",
    notes: "",
    communication: "",
    leadership: "",
    timeliness: "",
    skill1: "",
    skill2: "",
    skill3: "",
  });
  const [isOpened, setIsOpened] = useState(false);

  //   console.log(selectedEmployee)
  //   console.log(isOpened)

  const fetchEvals = async () => {
    try {
      const res = await GetAllEmployeeEvals();
      // console.log(res)
      setEmployeeEvals(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvals();
  }, []);

  return (
    <>
      {isOpened && (
        <>
          <button
            onClick={() => setIsOpened((prev) => !prev)}
            className="mb-4 rounded-3xl border-2 px-3 py-2 text-gray-400 transition-all hover:border-black hover:text-black"
          >
            ← Back
          </button>
          <HRPerfEvalForm
            id={selectedEval.id}
            employeeId={selectedEval.employeeId}
            year={selectedEval.year}
            strengths={selectedEval.strengths}
            weaknesses={selectedEval.weaknesses}
            improvements={selectedEval.improvements}
            notes={selectedEval.notes}
            communication={selectedEval.communication}
            leadership={selectedEval.leadership}
            timeliness={selectedEval.timeliness}
            skill1={selectedEval.skill1}
            skill2={selectedEval.skill2}
            skill3={selectedEval.skill3}
          />
        </>
      )}

      {!isOpened && (
        <div>
          <div className="relative mb-6 flex w-full items-center justify-center">
            <h1 className="text-xl">Performance Evaluations</h1>
          </div>

          <div className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="Search Employee Evaluations"
              className="w-80 rounded-3xl border-2 bg-white px-3 py-2"
            />
            <button className="rounded-3xl border-2 border-gray-400 bg-white px-3 py-2 text-gray-400 transition-all hover:border-black hover:text-black">
              Go
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="ml-4 text-lg">
                {employeeEvals.map((employeeEval, index) => (
                  <div
                    key={index}
                    className="cursor-pointer border-2 px-3 py-2 hover:border-black"
                    onClick={() => {
                      setSelectedEval(employeeEval);
                      setIsOpened(true);
                    }}
                  >
                    {employeeEval.employeeId}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
