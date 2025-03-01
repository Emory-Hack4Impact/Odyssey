"use client"
import PerfEval from "@/components/performance-evaluation/PerfEval";
import TimeOff from "@/components/time-off/TimeOff";
import { TimerOff } from "lucide-react";
import { useState } from "react"

interface HRServicesProps {
  username: string; 
}

export const HRServices = ({ username }: HRServicesProps) => {

  const [activeTab, setActiveTab] = useState("timeOff");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex w-full min-h-screen items-start mt-12 px-4">
      <div className="animate-in flex flex-1 flex-col gap-20 px-3 opacity-0">
        <div className="flex flex-col w-full">
          <div className="flex justify-between border-b-2">
            <h1 className="text-xl font-semibold mb-4">{`HR Services for ${username}`}</h1>
            <div className="flex">
              <button 
                className={`px-4 ${activeTab === "timeOff" ? "border-b-2 border-black transition-all font-medium" : ""}`}
                onClick={() => handleTabChange("timeOff")}
              >
                Time Off
              </button>
              <button 
                className={`px-4 ${activeTab === "careerDev" ? "border-b-2 border-black transition-all font-medium" : ""}`}
                onClick={() => handleTabChange("careerDev")}
              >
                Career Development
              </button>
              <button 
                className={`px-4 ${activeTab === "perfEvals" ? "border-b-2 border-black transition-all font-medium" : ""}`}
                onClick={() => handleTabChange("perfEvals")}
              >
                Performance Evaluations
              </button>
              <button 
                className={`px-4 ${activeTab === "benefits" ? "border-b-2 border-black transition-all font-medium" : ""}`}
                onClick={() => handleTabChange("benefits")}
              >
                Benefits
              </button>
              <button 
                className={`px-4 ${activeTab === "docs" ? "border-b-2 border-black transition-all font-medium" : ""}`}
                onClick={() => handleTabChange("docs")}
              >
                Documents
              </button>
            </div>
          </div>
          
          <div className="mt-6 p-4">
            {activeTab === "timeOff" && (
              <div>
                <TimeOff />
              </div>
            )}
            
            {activeTab === "careerDev" && (
              <div>
                <h2 className="text-lg font-medium mb-4">Career Development</h2>
                {/* Insert Career Dev Component */}
              </div>
            )}
            
            {activeTab === "perfEvals" && (
              <div>
                <PerfEval />
              </div>
            )}
            
            {activeTab === "benefits" && (
              <div>
                <h2 className="text-lg font-medium mb-4">Benefits</h2>
                {/* Insert content here */}
              </div>
            )}
            
            {activeTab === "docs" && (
              <div>
                <h2 className="text-lg font-medium mb-4">Documents</h2>
                {/* Insert content here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}