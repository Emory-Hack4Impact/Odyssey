import React from "react";

const StatusTable: React.FC = () => {
  return (
    <table className="mx-auto mt-10 border-collapse rounded-lg border border-gray-200 p-6 text-black shadow-lg">
      <thead>
        <tr>
          <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">
            Leave Type
          </th>
          <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">
            Date From
          </th>
          <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">
            Date To
          </th>
          <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">
            Additional Info
          </th>
          <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {/* Sample row */}
        <tr>
          <td className="border-b border-gray-200 px-4 py-2">Annual Leave</td>
          <td className="border-b border-gray-200 px-4 py-2">01/01/2024</td>
          <td className="border-b border-gray-200 px-4 py-2">01/05/2024</td>
          <td className="border-b border-gray-200 px-4 py-2">
            Family vacation
          </td>
          <td className="border-b border-gray-200 px-4 py-2">Approved</td>
        </tr>
        {/* Add more rows here */}
      </tbody>
    </table>
  );
};

export default StatusTable;
