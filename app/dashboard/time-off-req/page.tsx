'use client';
import React from 'react';
import TimeOffForm from './TimeOffForm';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Request Time Off</h1>
      <TimeOffForm />
    </div>
  );
};

export default Home;