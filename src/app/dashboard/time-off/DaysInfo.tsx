import React from "react";

const DaysInfo: React.FC = () => {
  const gridstyle =
    "rounded-md border border-gray-300 p-1 text-center lg:h-32 flex justify-center items-center flex-col";

  return (
    <div className="mx-auto mt-10 w-full max-w-lg p-10 text-black">
      <div className="grid grid-cols-2 gap-5">
        <div className={gridstyle}>
          <p className="text-2xl">10</p>
          <h2 className="text-xl">Days Available</h2>
        </div>
        <div className={gridstyle}>
          <p className="text-2xl">3</p>
          <h2 className="text-xl">Pending Requests</h2>
        </div>
        <div className={gridstyle}>
          <p className="text-2xl">5</p>
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
