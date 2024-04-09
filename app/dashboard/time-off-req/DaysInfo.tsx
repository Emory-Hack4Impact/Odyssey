import React from 'react';

const DaysInfo: React.FC = () => {
  return (
    <div className="flex justify-around mt-10 text-black">
      <div className="p-4 bg-gray-200 rounded-md">
        <h2 className="text-lg font-semibold">Days Available</h2>
        <p className="text-xl font-bold">10</p>
      </div>
      <div className="p-4 bg-gray-200 rounded-md">
        <h2 className="text-lg font-semibold">Pending Requests</h2>
        <p className="text-xl font-bold">3</p>
      </div>
      <div className="p-4 bg-gray-200 rounded-md">
        <h2 className="text-lg font-semibold">Days Taken Off</h2>
        <p className="text-xl font-bold">5</p>
      </div>
      <div className="p-4 bg-gray-200 rounded-md">
        <h2 className="text-lg font-semibold">Total PTO per Year</h2>
        <p className="text-xl font-bold">20</p>
      </div>
    </div>
  );
};

export default DaysInfo;
