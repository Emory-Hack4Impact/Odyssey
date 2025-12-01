"use client";
import React, { useState, useEffect } from "react";
import TimeOffForm, { type TimeOffRequest } from "./TimeOffForm";
import DaysInfo from "./DaysInfo";
import StatusTable from "./StatusTable";
import { FetchTimeOff } from "@/app/api/time-off-req";

const Home = ({ userId }: { userId: string }) => {
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setError(null);

        const existingRequests = await FetchTimeOff(userId);

        setRequests(existingRequests as TimeOffRequest[]);
      } catch (e) {
        console.error("Failed to fetch initial time off requests:", e);
        setError("Failed to load existing requests.");
      }
    };
    if (userId) void loadRequests(); //don't understand this
  }, [userId]); //don't understand this either...

  if (error) {
    return <div className="p-10 text-center text-xl text-red-600">Error: {error}</div>; //redirect to error page
  }

  return (
    <section className="w-full py-6">
      <div className="mr-auto grid w-full max-w-7xl items-start gap-6 px-3 sm:px-4 lg:grid-cols-12 xl:max-w-[100rem]">
        <div className="flex flex-col gap-6 lg:col-span-6 xl:col-span-5">
          <DaysInfo stats={requests} />
          <TimeOffForm setRequests={setRequests} requests={requests} userId={userId} />
        </div>
        <div className="flex lg:col-span-6 xl:col-span-7">
          <div className="flex-1">
            <StatusTable requests={requests} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
