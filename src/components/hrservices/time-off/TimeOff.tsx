"use client";
import React, { useState, useEffect } from "react";
import TimeOffForm, { type TimeOffRequest } from "./TimeOffForm";
import React, { useState, useEffect } from "react";
import TimeOffForm, { type TimeOffRequest } from "./TimeOffForm";
import DaysInfo from "./DaysInfo";
import StatusTable from "./StatusTable";
import { FetchTimeOff } from "@/app/api/time-off-req";

const EMPLOYEE_ID = "00000000-0000-0000-0000-000000000001"; // Use a constant for the ID

const Home: React.FC = () => {
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setError(null);

        const existingRequests = await FetchTimeOff(EMPLOYEE_ID);

        setRequests(existingRequests as TimeOffRequest[]);
      } catch (e) {
        console.error("Failed to fetch initial time off requests:", e);
        setError("Failed to load existing requests.");
      }
    };

    // REMOVE: The fix: Use the 'void' operator when calling the async function
    // REMOVE: This tells ESLint you know it's a Promise but you've handled the error (with try/catch inside)
    void loadRequests();
  }, []);

  if (error) {
    return <div className="p-10 text-center text-xl text-red-600">Error: {error}</div>; //redirect to error page
  }

  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setError(null);

        const existingRequests = await FetchTimeOff(EMPLOYEE_ID);

        setRequests(existingRequests as TimeOffRequest[]);
      } catch (e) {
        console.error("Failed to fetch initial time off requests:", e);
        setError("Failed to load existing requests.");
      }
    };

    // REMOVE: The fix: Use the 'void' operator when calling the async function
    // REMOVE: This tells ESLint you know it's a Promise but you've handled the error (with try/catch inside)
    void loadRequests();
  }, []);

  if (error) {
    return <div className="p-10 text-center text-xl text-red-600">Error: {error}</div>; //redirect to error page
  }

  return (
    <div className="min-h-screen w-full">
      <div className="flex w-full flex-wrap">
        <div className="flex w-full items-center justify-center lg:w-1/3 lg:justify-start lg:pl-20">
          <DaysInfo stats={requests} />
        </div>
        <div className="w-full lg:mt-20 lg:mb-10 lg:w-2/3">
          <div className="p-4">
            <TimeOffForm setRequests={setRequests} />
            <TimeOffForm setRequests={setRequests} />
          </div>
          <div className="overflow-x-scroll p-4">
            <StatusTable requests={requests} />
            <StatusTable requests={requests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
