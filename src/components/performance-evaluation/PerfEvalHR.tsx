import React, { use, useEffect, useState } from 'react'
import { PerformanceReviewDashboard } from './PerfReviewDashboard';
import HRPerfEvalForm from './HRPerfEvalForm';
import { GetAllEmployeeEvals } from '@/app/api/employee-evals';

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

export default function PerfEvalHR({ userId, username, userRole }: HRServicesProps) {

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
    skill3: ""
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
    fetchEvals()
  }, []);

  return (
    <>
        {isOpened && (
            <>
                <button onClick={() => setIsOpened(prev => !prev)} className="border-2 text-gray-400 px-3 py-2 rounded-3xl hover:text-black hover:border-black transition-all mb-4">← Back</button>
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

        {!isOpened && (<div>
            <div className="relative flex justify-center items-center w-full mb-6">
                <h1 className="text-xl">Performance Evaluations</h1>
            </div>

            <div className="flex gap-4 mb-6">
                <input 
                    type="text"
                    placeholder="Search Employee Evaluations"
                    className="w-80 border-2 bg-white rounded-3xl px-3 py-2"
                />
                <button className="border-2 border-gray-400 bg-white text-gray-400 rounded-3xl px-3 py-2 hover:text-black hover:border-black transition-all">Go</button>
            </div>
            
            <div className="space-y-6">
                <div>
                    <div className="ml-4 text-lg">
                        {employeeEvals.map((employeeEval, index) => (
                            <div 
                                key={index}
                                className="cursor-pointer px-3 py-2 border-2 hover:border-black"
                                onClick={() => {
                                setSelectedEval(employeeEval)
                                setIsOpened(true)
                            }}>
                                {employeeEval.employeeId}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>)}
    </>
  )
}
