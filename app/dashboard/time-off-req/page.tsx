'use client';
import React from 'react';
import TimeOffForm from './TimeOffForm';
import DaysInfo from './DaysInfo';
import StatusTable from './StatusTable';

const Home: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-between">
      <div className="w-full md:w-1/4 flex items-center justify-center">
        <DaysInfo />
      </div>
      <div className="w-full md:w-3/4 flex flex-col">
        <TimeOffForm />
        <StatusTable />
      </div>
    </div>
  );
};

export default Home;