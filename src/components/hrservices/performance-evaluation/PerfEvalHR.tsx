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

interface FetchedEval extends FetchedEvalMeta {
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
    id: "",
    evaluationId: "",
    employeeId: "",
    submitterId: "",
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
  const [search, setSearch] = useState("");
  const [yearSearch, setYearSearch] = useState(0);

  const filteredEvals = employeeEvalsMeta.filter((evalItem) => {
    if (!search && !yearSearch) return true;
    const matchesSearch =
      !search || JSON.stringify(evalItem).toLowerCase().includes(search.toLowerCase());

    const matchesYear = !yearSearch || evalItem.year === yearSearch;
    return matchesSearch && matchesYear;
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
            <div className="flex w-90 flex-col gap-4">
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

              <div className="input flex cursor-pointer items-center justify-between">
                <div className="dropdown w-full">
                  <div
                    tabIndex={0}
                    role="button"
                    className="flex w-full items-center justify-between gap-2"
                  >
                    {/* Calendar icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-[1em] opacity-50"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>

                    {/* Text */}
                    <span className="flex-1 opacity-60">
                      {yearSearch ? yearSearch : "Search by year"}
                    </span>

                    {/* Dropdown caret */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 opacity-60"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu mt-4 w-full rounded-md bg-base-100 p-2 shadow-xl"
                  >
                    {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                      <li key={year}>
                        <a
                          onClick={() => {
                            setYearSearch((prev) => (prev === year ? 0 : year));
                            const activeElement = document.activeElement as HTMLElement;
                            if (activeElement) {
                              activeElement.blur();
                            }
                          }}
                        >
                          {year}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

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
                        <th className="w-1/4">Year</th>
                        <th className="w-1/2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvals.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-base-content/60">
                            No employee evaluations found.
                          </td>
                        </tr>
                      ) : (
                        filteredEvals.map((employeeEval, index) => (
                          <tr key={index} className="text-sm">
                            <td className="align-top font-medium">
                              {employeeEval.employeeLastName}, {employeeEval.employeeFirstName}
                            </td>
                            <td className="align-top font-medium">{employeeEval.year}</td>
                            <td className="text-center align-top">
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={async () => {
                                  const evalData = await fetchEvalByID(employeeEval.evaluationId);
                                  if (evalData) {
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
