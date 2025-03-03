"use client";
import PerfEval from "@/components/performance-evaluation/PerfEval";
import TimeOff from "@/components/time-off/TimeOff";
import { useState } from "react";

interface HRServicesProps {
  username: string;
}

export const HRServices = ({ username }: HRServicesProps) => {
  const [activeTab, setActiveTab] = useState("timeOff");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="mt-12 flex min-h-screen w-full items-start px-4">
      <div className="flex flex-1 flex-col gap-20 px-3 opacity-0 animate-in">
        <div className="flex w-full flex-col">
          <div className="flex justify-between border-b-2">
            <h1 className="mb-4 text-xl font-semibold">{`HR Services for ${username}`}</h1>
            <div className="flex">
              <button
                className={`px-4 ${activeTab === "timeOff" ? "border-b-2 border-black font-medium transition-all" : ""}`}
                onClick={() => handleTabChange("timeOff")}
              >
                Time Off
              </button>
              <button
                className={`px-4 ${activeTab === "careerDev" ? "border-b-2 border-black font-medium transition-all" : ""}`}
                onClick={() => handleTabChange("careerDev")}
              >
                Career Development
              </button>
              <button
                className={`px-4 ${activeTab === "perfEvals" ? "border-b-2 border-black font-medium transition-all" : ""}`}
                onClick={() => handleTabChange("perfEvals")}
              >
                Performance Evaluations
              </button>
              <button
                className={`px-4 ${activeTab === "benefits" ? "border-b-2 border-black font-medium transition-all" : ""}`}
                onClick={() => handleTabChange("benefits")}
              >
                Benefits
              </button>
              <button
                className={`px-4 ${activeTab === "docs" ? "border-b-2 border-black font-medium transition-all" : ""}`}
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
                <h2 className="mb-4 text-lg font-medium">Career Development</h2>
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
                <h2 className="mb-4 text-lg font-medium">Benefits</h2>
                {/* Insert content here */}
              </div>
            )}

            {activeTab === "docs" && (
              <div>
                <h2 className="mb-4 text-lg font-medium">Documents</h2>
                {/* Insert content here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
