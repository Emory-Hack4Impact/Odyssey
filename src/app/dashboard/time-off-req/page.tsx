"use client"
import React from 'react';
import TimeOffForm from './TimeOffForm';
import DaysInfo from './DaysInfo';
import StatusTable from './StatusTable';

const Home: React.FC = () => {
  return (
    <div className="bg-white min-h-screen w-full">
      <div className="flex flex-wrap w-full">
        <div className="w-full lg:w-1/4 flex justify-center lg:justify-start items-center lg:pl-40">
          <DaysInfo />
        </div>
        <div className="w-full lg:w-3/4 lg:mt-40">
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
