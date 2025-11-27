import React, { useEffect, useState } from "react";
import HRPerfEvalForm from "./HRPerfEvalForm";

interface HRServicesProps {
  userId: string;
  username: string;
  userRole: string;
}

interface FetchedEvalMeta {
  id: string;
  evaluationId: string;
  employeeId?: string | null;
  submitterId?: string | null;
  employeeFirstName: string;
  employeeLastName: string;
  year: number;
}

interface FetchedEval {
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

export default function PerfEvalHR({ userId: _userId, username, userRole }: HRServicesProps) {
  const [employeeEvalsMeta, setEmployeeEvalsMeta] = useState<FetchedEvalMeta[]>([]);
  const [selectedEval, setSelectedEval] = useState<FetchedEval>({
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
  const [search, setSearch] = useState("");

  const filteredEvals = employeeEvalsMeta.filter((evalItem) => {
    if (!search) return true;
    return JSON.stringify(evalItem).toLowerCase().includes(search.toLowerCase());
  });

  //   console.log(selectedEmployee)
  //   console.log(isOpened)

  type RawEval = {
    id?: string | number;
    employeeId?: string | number | null;
    submitterId?: string | number | null;
    [key: string]: unknown;
  };

  const fetchEvalByID = async (id: string) => {
    try {
      const resp = await fetch(`/api/employee-evals?id=${id}`);
      if (!resp.ok) {
        throw new Error(`Failed to fetch evaluation: ${resp.status}`);
      }
      const res = await resp.json();
      return res as FetchedEval;
    } catch (error) {
      console.error("Error fetching evaluation:", error);
      return null;
    }
  };

  const fetchEvalMeta = async () => {
    try {
      const resp = await fetch("/api/employee-evals?meta=true");
      const res = await resp.json();
      const normalized = (res as RawEval[]).map((meta) => ({
        id: String(meta.id),
        evaluationId: String(meta.evaluationId),
        employeeId: String(meta.employeeId),
        submitterId: String(meta.submitterId),
        employeeFirstName: meta.employeeFirstName,
        employeeLastName: meta.employeeLastName,
        year: Number(meta.year ?? 0),
      })) as FetchedEvalMeta[];
      setEmployeeEvalsMeta(normalized ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void fetchEvalMeta();
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
          <div className="flex gap-6">
            <label className="input">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <div className="card h-full w-full border border-base-content/5 bg-base-100 shadow-xl">
              <div className="card-body gap-5">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-base-content/70 uppercase">
                    Employees
                  </p>
                  <h2 className="card-title text-2xl font-semibold">Evaluation List</h2>
                </div>

                <div className="rounded-box border border-base-200">
                  <table className="table-compact table w-full">
                    <thead>
                      <tr className="bg-base-200 text-xs font-semibold tracking-wide text-base-content uppercase">
                        <th className="w-1/2">Name</th>
                        <th className="w-1/2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvals.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="py-6 text-center text-base-content/60">
                            No employee evaluations found.
                          </td>
                        </tr>
                      ) : (
                        filteredEvals.map((employeeEval, index) => (
                          <tr key={index} className="text-sm">
                            <td className="align-top font-medium">
                              {employeeEval.employeeLastName}, {employeeEval.employeeFirstName}
                            </td>
                            <td className="text-center align-top">
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={async () => {
                                  const evalData = await fetchEvalByID(employeeEval.evaluationId);
                                  if (evalData) {
                                    alert(JSON.stringify(evalData));
                                    setSelectedEval({ ...employeeEval, ...evalData });
                                    setIsOpened(true);
                                  } else {
                                    alert("Failed to load evaluation");
                                  }
                                }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
