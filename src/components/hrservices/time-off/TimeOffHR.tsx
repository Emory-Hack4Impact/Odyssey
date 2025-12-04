"use client";
import React, { useState } from "react";
import Calendar from "./Calendar";
import RequestsTabs from "./RequestsTabs";

interface TimeOffHRProps {
  employeeId: string;
}

const TimeOffHR: React.FC<TimeOffHRProps> = ({ employeeId }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDateIso, setSelectedDateIso] = useState<string | null>(null);

  const handleActionComplete = () => {
    // Increment trigger to refresh all components
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen w-full p-6">
      {/* Top Section: Calendar on Left, Requests Tabs on Right */}
      <div className="mb-6 flex w-full flex-col gap-2 lg:flex-row lg:flex-nowrap lg:gap-0">
        {/* Left Side - Calendar */}
        <div className="w-full lg:w-auto lg:min-w-[400px] lg:flex-shrink-0">
          <Calendar
            refreshTrigger={refreshTrigger}
            selectedDateIso={selectedDateIso}
            onSelectDate={setSelectedDateIso}
          />
        </div>

        {/* Right Side - Tabbed Pending/Status Views */}
        <div className="flex-1 lg:ml-2">
          <RequestsTabs approverId={employeeId} selectedDateIso={selectedDateIso} />
        </div>
      </div>
    </div>
  );
};

export default TimeOffHR;
