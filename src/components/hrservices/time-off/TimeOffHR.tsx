"use client";
import React, { useState } from "react";
import Calendar from "./Calendar";
import PendingRequests from "./PendingRequests";
import StatusOfEmployeeRequests from "./StatusOfEmployeeRequests";

interface TimeOffHRProps {
  employeeId: string;
}

const TimeOffHR: React.FC<TimeOffHRProps> = ({ employeeId }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleActionComplete = () => {
    // Increment trigger to refresh all components
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen w-full p-6">
      {/* Top Section: Calendar on Left, Pending Requests on Right */}
      <div className="mb-10 flex w-full flex-wrap gap-6">
        {/* Left Side - Calendar */}
        <div className="w-full lg:w-auto lg:flex-shrink-0">
          <Calendar refreshTrigger={refreshTrigger} />
        </div>

        {/* Right Side - Pending Requests */}
        <div className="flex-1">
          <PendingRequests
            approverId={employeeId}
            refreshTrigger={refreshTrigger}
            onActionComplete={handleActionComplete}
          />
        </div>
      </div>

      {/* Bottom Section: Status of Employee Requests */}
      <div className="w-full">
        <StatusOfEmployeeRequests refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default TimeOffHR;
