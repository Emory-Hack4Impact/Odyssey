"use client";
import React, { useEffect, useState } from "react";
import { GetTimeOffStats } from "@/app/api/time-off-req";

interface DaysInfoProps {
  employeeId: string;
  refreshTrigger?: number;
}

type TimeOffStats = {
  daysAvailable: number;
  pendingRequests: number;
  daysTaken: number;
  totalPTOPerYear: number;
};

const DaysInfo: React.FC<DaysInfoProps> = ({ employeeId, refreshTrigger = 0 }) => {
  const [stats, setStats] = useState<TimeOffStats>({
    daysAvailable: 0,
    pendingRequests: 0,
    daysTaken: 0,
    totalPTOPerYear: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data: TimeOffStats = await GetTimeOffStats(employeeId);
        setStats(data);
      } catch (error) {
        console.error("Error fetching time off stats:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
  }, [employeeId, refreshTrigger]);

  const gridstyle =
    "rounded-md border border-gray-300 p-1 text-center lg:h-32 flex justify-center items-center flex-col";

  if (loading) {
    return (
      <div className="mx-auto mt-10 w-full max-w-lg p-10 text-black">
        <div className="grid grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={gridstyle}>
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-lg p-10 text-black">
      <div className="grid grid-cols-2 gap-5">
        <div className={gridstyle}>
          <p className="text-2xl">{stats.daysAvailable}</p>
          <h2 className="text-xl">Days Available</h2>
        </div>
        <div className={gridstyle}>
          <p className="text-2xl">{stats.pendingRequests}</p>
          <h2 className="text-xl">Pending Requests</h2>
        </div>
        <div className={gridstyle}>
          <p className="text-2xl">{stats.daysTaken}</p>
          <h2 className="text-xl">Days Taken Off</h2>
        </div>
        <div className={gridstyle}>
          <p className="text-2xl">{stats.totalPTOPerYear}</p>
          <h2 className="text-xl">Total PTO per Year</h2>
        </div>
      </div>
    </div>
  );
};

export default DaysInfo;
