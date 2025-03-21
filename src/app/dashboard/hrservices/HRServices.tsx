"use client";
import PerfEval from "@/components/performance-evaluation/PerfEval";
import TimeOff from "@/components/time-off/TimeOff";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";

interface HRServicesProps {
  username: string;
}

export const HRServices = ({ username }: HRServicesProps) => {
  const categories = [
    { key: "timeOff", label: "Time Off", component: <TimeOff /> },
    {
      key: "careerDev",
      label: "Career Development",
      component: (
        <div>
          <h2 className="mb-4 text-lg font-medium">Career Development</h2>
          {/* Insert Career Dev Component */}
        </div>
      ),
    },
    {
      key: "perfEvals",
      label: "Performance Evaluations",
      component: <PerfEval />,
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

  return (
    <div className="m-12 flex min-h-screen w-auto flex-col items-start px-4">
      <Tab.Group>
        <div className="flex w-full flex-row justify-between gap-20 border-b-2 px-3 opacity-0 animate-in">
          <h1 className="mb-4 text-xl font-semibold">{`HR Services for ${username}`}</h1>
          <Tab.List className="flex">
            {categories.map((category) => (
              <Tab key={category.key} as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`px-4 focus:outline-none ${selected ? "border-b-2 border-black font-medium transition-all" : ""}`}
                  >
                    {/* if we have more time, should try to fix the font-medium shifting the tab buttons slightly */}
                    {category.label}
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
        </div>
        {/* Tab panels */}
        <Tab.Panels className="mt-6 w-full p-4">
          {categories.map((category) => (
            <Tab.Panel key={category.key}>{category.component}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
