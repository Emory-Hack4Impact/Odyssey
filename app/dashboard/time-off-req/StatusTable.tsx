import React from 'react';

const StatusTable: React.FC = () => {
  return (
    <table className="mx-auto mt-10 p-6 rounded-lg shadow-lg text-black border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="py-2 px-4 bg-gray-100 border-b border-gray-200">Leave Type</th>
          <th className="py-2 px-4 bg-gray-100 border-b border-gray-200">Date From</th>
          <th className="py-2 px-4 bg-gray-100 border-b border-gray-200">Date To</th>
          <th className="py-2 px-4 bg-gray-100 border-b border-gray-200">Additional Info</th>
          <th className="py-2 px-4 bg-gray-100 border-b border-gray-200">Status</th>
        </tr>
      </thead>
      <tbody>
        {/* Sample row */}
        <tr>
          <td className="py-2 px-4 border-b border-gray-200">Annual Leave</td>
          <td className="py-2 px-4 border-b border-gray-200">01/01/2024</td>
          <td className="py-2 px-4 border-b border-gray-200">01/05/2024</td>
          <td className="py-2 px-4 border-b border-gray-200">Family vacation</td>
          <td className="py-2 px-4 border-b border-gray-200">Approved</td>
        </tr>
        {/* Add more rows here */}
      </tbody>
    </table>
  );
};

export default StatusTable;
