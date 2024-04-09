import React from 'react';

const StatusTable: React.FC = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-black">
      <h2 className="text-xl font-semibold mb-4">Status Table</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-100 border-b">Leave Type</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Dates</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Additional Info</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Sample row */}
          <tr>
            <td className="py-2 px-4 border-b">Annual Leave</td>
            <td className="py-2 px-4 border-b">01/01/2024 - 01/05/2024</td>
            <td className="py-2 px-4 border-b">Family vacation</td>
            <td className="py-2 px-4 border-b">Approved</td>
          </tr>
          {/* Add more rows here */}
        </tbody>
      </table>
    </div>
  );
};

export default StatusTable;
