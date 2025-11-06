"use client";

import PerfEval from "@/components/hrservices/performance-evaluation/PerfEval";
import PerfEvalEmployee from "@/components/hrservices/performance-evaluation/PerfEvalEmployee";
import PerfEvalHR from "@/components/hrservices/performance-evaluation/PerfEvalHR";
import TimeOff from "@/components/hrservices/time-off/TimeOff";
import CareerDev from "@/components/hrservices/career-dev/CareerDev";
import { useState } from "react";

interface HRServicesProps {
  userId: string;
  username: string;
  userRole: string;
}

export const HRServices = ({ userId, username, userRole }: HRServicesProps) => {
  const getPerformanceEvaluationComponent = () => {
    switch (userRole) {
      case "Employee":
        return <PerfEvalEmployee userId={userId} username={username} userRole={userRole} />;
      case "HR":
        return <PerfEvalHR userId={userId} username={username} userRole={userRole} />;
      case "Manager":
        return <PerfEval />;
      default:
        return <PerfEval />;
    }
  };

  const categories = [
    { key: "timeOff", label: "Time Off", component: <TimeOff /> },
    {
      key: "careerDev",
      label: "Career Development",
      component: <CareerDev />,
    },
    {
      key: "perfEvals",
      label: "Performance Evaluations",
      component: getPerformanceEvaluationComponent(),
    },
    {
      key: "benefits",
      label: "Benefits",
      component: (
        <div>
          <h2 className="mb-4 text-lg font-medium">Benefits</h2>
          {/* Insert content here */}
        </div>
      ),
    },
    {
      key: "docs",
      label: "Documents",
      component: (
        <div>
          <h2 className="mb-4 text-lg font-medium">Documents</h2>
          {/* Insert content here */}
        </div>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState<string>(categories[0]?.key ?? "");

  return (
    <div className="m-12 flex min-h-screen w-auto flex-col items-start px-4">
      <div className="flex w-full flex-row justify-between gap-6 border-b-2 border-base-300 px-3">
        <h1 className="mb-4 text-xl font-semibold">{`HR Services for ${username}`}</h1>
        <div className="tabs">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveTab(category.key)}
              className={`tab-lifted tab text-lg ${activeTab === category.key ? "tab-active" : ""}`}
              aria-current={activeTab === category.key ? "true" : undefined}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 w-full p-4">
        {categories.map((category) => (
          <div key={category.key} className={`${activeTab === category.key ? "block" : "hidden"}`}>
            {category.component}
          </div>
        ))}
      </div>
    </div>
  );
};
