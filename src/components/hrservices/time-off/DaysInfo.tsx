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

  const gridstyle =
    "rounded-md border border-gray-300 p-1 text-center lg:h-32 flex justify-center items-center flex-col";

  return (
    <div className="mx-auto mt-10 w-full max-w-lg p-10 text-black">
      <div className="grid grid-cols-2 gap-5">
        <div className={gridstyle}>
          <p className="text-2xl">{daysAvailable()}</p>
          <h2 className="text-xl">Days Available</h2>
        </div>
        <div className={gridstyle}>
          <p className="text-2xl">{pendingRequests()}</p>
          <h2 className="text-xl">Pending Requests</h2>
        </div>
        <div className={gridstyle}>
          <p className="text-2xl">{daysTakenOff()}</p>
          <h2 className="text-xl">Days Taken Off</h2>
        </div>
        <div className={gridstyle}>
          <p className="text-2xl">20</p>
          <h2 className="text-xl">Total PTO per Year</h2>
        </div>
      </div>
    </div>
  );
};

export default DaysInfo;
