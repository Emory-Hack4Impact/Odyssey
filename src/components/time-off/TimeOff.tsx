"use client";
import React from "react";
import TimeOffForm from "./TimeOffForm";
import DaysInfo from "./DaysInfo";
import StatusTable from "./StatusTable";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full">
      <div className="flex w-full flex-wrap">
        <div className="flex w-full items-center justify-center lg:w-1/3 lg:justify-start lg:pl-20">
          <DaysInfo />
        </div>
        <div className="w-full lg:mb-10 lg:mt-20 lg:w-2/3">
          <div className="p-4">
            <TimeOffForm />
          </div>
          <div className="overflow-x-scroll p-4">
            <StatusTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
