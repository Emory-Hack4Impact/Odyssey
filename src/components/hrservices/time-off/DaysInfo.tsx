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
    <div className="w-full">
      <div className="rounded-2xl bg-base-100 p-6 shadow-xl">
        <h2 className="text-xl font-semibold">Your PTO Snapshot</h2>
        <div className="mt-6 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-base-content/5 bg-base-100 py-3 text-center shadow-lg">
            <p className="text-xs font-semibold tracking-wide text-base-content/70 uppercase">
              Days Available
            </p>
            <p className="text-3xl font-semibold text-base-content">{daysAvailable()}</p>
          </div>

          <div className="rounded-2xl border border-base-content/5 bg-base-100 py-3 text-center shadow-lg">
            <p className="text-xs font-semibold tracking-wide text-base-content/70 uppercase">
              Pending Requests
            </p>
            <p className="text-3xl font-semibold text-base-content">{pendingRequests()}</p>
          </div>

          <div className="rounded-2xl border border-base-content/5 bg-base-100 py-3 text-center shadow-lg">
            <p className="text-xs font-semibold tracking-wide text-base-content/70 uppercase">
              Days Taken Off
            </p>
            <p className="text-3xl font-semibold text-base-content">{daysTakenOff()}</p>
          </div>

          <div className="rounded-2xl border border-base-content/5 bg-base-100 py-3 text-center shadow-lg">
            <p className="text-xs font-semibold tracking-wide text-base-content/70 uppercase">
              Total PTO per Year
            </p>
            <p className="text-3xl font-semibold text-base-content">20</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaysInfo;
