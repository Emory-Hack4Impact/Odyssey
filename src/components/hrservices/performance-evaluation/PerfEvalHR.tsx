import React, { useEffect, useState } from "react";
import HRPerfEvalForm from "./HRPerfEvalForm";

interface HRServicesProps {
  userId: string;
  username: string;
  userRole: string;
}

interface FetchedEval {
  id: string;
  employeeId?: string | null;
  submitterId?: string | null;
  employeeFirstName: string;
  employeeLastName: string;
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
  submitterEmail?: string | null;
}

export default function PerfEvalHR({
  userId: _userId,
  username,
  userRole,
}: HRServicesProps) {
  const [employeeEvals, setEmployeeEvals] = useState<FetchedEval[]>([]);
  const [selectedEval, setSelectedEval] = useState<FetchedEval>({
    id: "",
    employeeId: null,
    submitterId: null,
    employeeFirstName: "",
    employeeLastName: "",
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
    submitterEmail: null,
  });
  const [isOpened, setIsOpened] = useState(false);

  //   console.log(selectedEmployee)
  //   console.log(isOpened)

  type RawEval = {
    id?: string | number;
    employeeId?: string | number | null;
    submitterId?: string | number | null;
    [key: string]: unknown;
  };

  const fetchEvals = async () => {
    try {
      const resp = await fetch("/api/employee-evals");
      const res = await resp.json();
      const normalized = (res as RawEval[]).map((e) => ({
        ...e,
        id: typeof e.id === "undefined" ? "" : String(e.id),
        employeeId:
          e.employeeId === null || e.employeeId === undefined
            ? null
            : String(e.employeeId),
        submitterId:
          e.submitterId === null || e.submitterId === undefined
            ? null
            : String(e.submitterId),
      })) as FetchedEval[];
      setEmployeeEvals(normalized ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void fetchEvals();
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
            employeeFirstName={selectedEval.employeeFirstName}
            employeeLastName={selectedEval.employeeLastName}
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
            // pass submitter info so the HR action can be recorded
            submitterUsername={username}
            submitterRole={userRole}
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
                    {employeeEval.employeeFirstName} {employeeEval.employeeLastName}
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
