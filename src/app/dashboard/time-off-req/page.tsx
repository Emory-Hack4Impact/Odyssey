"use client";
import React from "react";
import TimeOffForm from "./TimeOffForm";
import DaysInfo from "./DaysInfo";
import StatusTable from "./StatusTable";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="flex w-full flex-wrap">
        <div className="flex w-full items-center justify-center lg:w-1/4 lg:justify-start lg:pl-40">
          <DaysInfo />
        </div>
        <div className="w-full lg:mt-40 lg:w-3/4">
          <div>
            <TimeOffForm />
          </div>
          <div>
            <StatusTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
