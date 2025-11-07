"use client";
import React, { useState } from "react";
import TimeOffForm from "./TimeOffForm";
import DaysInfo from "./DaysInfo";
import StatusTable from "./StatusTable";
import TimeOffRequests from "./manage-requests/page";

interface TimeOffProps {
  userMetadata?: {
    is_admin: boolean;
    is_hr: boolean;
    position: string;
  } | null;
}

const Home: React.FC<TimeOffProps> = ({ userMetadata }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSubmit = () => {
    // Trigger refresh of statistics and table
    setRefreshKey(prev => prev + 1);
  };

  // Show admin view for HR users or admins
  if (userMetadata?.is_hr || userMetadata?.is_admin) {
    return <TimeOffRequests />;
  }

  // Show employee view for regular users
  return (
    <div className="w-full">
      {/* Request Time Off Form - Top Center */}
      <div className="mb-8">
        <TimeOffForm onSuccess={handleFormSubmit} />
      </div>

      {/* Bottom Section: Statistics on Left, Status Table on Right */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Time Off Statistics - Left */}
        <div className="w-full lg:w-2/5 lg:pr-4">
          <DaysInfo key={`stats-${refreshKey}`} />
        </div>

        {/* Status of Requests Table - Right (takes up more space) */}
        <div className="w-full lg:w-3/5 lg:pl-4">
          <StatusTable 
            key={`table-${refreshKey}`} 
            userMetadata={userMetadata}
            onRefresh={handleFormSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
