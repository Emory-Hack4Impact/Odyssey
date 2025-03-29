import React, { useState } from 'react'
import { PerformanceReviewDashboard } from './PerfReviewDashboard';
import PerfEvalForm from './PerfEvalForm';

interface HRServicesProps {
    username: string;
    userRole: string;
}

export default function PerfEvalHR({ username, userRole }: HRServicesProps) {

  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [isOpened, setIsOpened] = useState(false)

  console.log(selectedEmployee)
  console.log(isOpened)

  const employees = [
    {
        name: "Example Employee 1",
        role: "employee"
    },
    {
        name: "Example Employee 2",
        role: "employee"
    },
    {
        name: "Example Employee 3",
        role: "employee"
    },
    {
        name: "Example Employee 4",
        role: "employee"
    },
    {
        name: "Example Employee 5",
        role: "employee"
    },
    {
        name: "Example Employee 6",
        role: "employee"
    },
    {
        name: "Example Employee 7",
        role: "employee"
    },
    {
        name: "Example Employee 8",
        role: "employee"
    },
    {
        name: "Example Employee 9",
        role: "employee"
    },
    {
        name: "Example Employee 10",
        role: "employee"
    },
  ];

  return (
    <>
        {isOpened && (
            <>
                <button onClick={() => setIsOpened(prev => !prev)} className="border-2 text-gray-400 px-3 py-2 rounded-3xl hover:text-black hover:border-black transition-all mb-4">← Back</button>
                <PerfEvalForm username={username} userRole={userRole} />
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
                        {employees.map((employee, index) => (
                            <div 
                                key={index}
                                className="cursor-pointer px-3 py-2 border-2 hover:border-black"
                                onClick={() => {
                                setSelectedEmployee(employee.name)
                                setIsOpened(true)
                            }}>
                                {employee.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>)}
    </>
  )
}
