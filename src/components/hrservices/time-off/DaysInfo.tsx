import React from "react";
import { type TimeOffRequest } from "./TimeOffForm";

const DaysInfo = ({ stats }: { stats: TimeOffRequest[] }) => {
  const daysAvailable = () => {
    return 20 - daysTakenOff();
  };

  const pendingRequests = () => {
    return stats.filter((stats) => !stats.approved).length;
  };

  const daysTakenOff = () => {
    const approved = stats.filter((stats) => stats.approved);

    const totalDays = approved.reduce((total, request) => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);

      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      return total + days;
    }, 0);

    return totalDays;
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="stats shadow-lg">
          <div className="stat place-items-center rounded-box border border-base-content/5">
            <div className="stat-title">Days Available</div>
            <div className="stat-value">{daysAvailable()}</div>
          </div>
        </div>

        <div className="stats shadow-lg">
          <div className="stat place-items-center rounded-box border border-base-content/5">
            <div className="stat-title">Pending Requests</div>
            <div className="stat-value">{pendingRequests()}</div>
          </div>
        </div>

        <div className="stats shadow-lg">
          <div className="stat place-items-center rounded-box border border-base-content/5">
            <div className="stat-title">Days Taken Off</div>
            <div className="stat-value">{daysTakenOff()}</div>
          </div>
        </div>

        <div className="stats shadow-lg">
          <div className="stat place-items-center rounded-box border border-base-content/5">
            <div className="stat-title">Total PTO per Year</div>
            <div className="stat-value">20</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaysInfo;
