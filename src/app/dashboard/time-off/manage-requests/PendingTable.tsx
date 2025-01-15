import React from "react";

const PendingTable: React.FC = () => {
  return (
    <table className="mx-auto mt-2 border-collapse rounded-lg border border-gray-200 p-6 text-black shadow-lg">
      <thead>
        <tr>
          <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">
            Name
          </th>
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
            Request Date
          </th>
          <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {/* Sample row */}
        <tr>
          <td className="border-b border-gray-200 px-4 py-2">Marcus</td>
          <td className="border-b border-gray-200 px-4 py-2">Annual Leave</td>
          <td className="border-b border-gray-200 px-4 py-2">01/01/2024</td>
          <td className="border-b border-gray-200 px-4 py-2">01/05/2024</td>
          <td className="border-b border-gray-200 px-4 py-2">
            Family vacation
          </td>
          <td className="border-b border-gray-200 px-4 py-2">12/29/2023</td>
          <td className="border-b border-gray-200 px-4 py-2">yes or no</td>
        </tr>
        <tr>
          <td className="border-b border-gray-200 px-4 py-2">Marcia</td>
          <td className="border-b border-gray-200 px-4 py-2">
            Maternity Leave
          </td>
          <td className="border-b border-gray-200 px-4 py-2">01/01/2024</td>
          <td className="border-b border-gray-200 px-4 py-2">01/05/2024</td>
          <td className="border-b border-gray-200 px-4 py-2">It's a Girl!</td>
          <td className="border-b border-gray-200 px-4 py-2">12/29/2023</td>
          <td className="border-b border-gray-200 px-4 py-2">yes or no</td>
        </tr>
        <tr>
          <td className="border-b border-gray-200 px-4 py-2">Marc</td>
          <td className="border-b border-gray-200 px-4 py-2">Sick Leave</td>
          <td className="border-b border-gray-200 px-4 py-2">01/01/2024</td>
          <td className="border-b border-gray-200 px-4 py-2">01/05/2024</td>
          <td className="border-b border-gray-200 px-4 py-2">COVID-19</td>
          <td className="border-b border-gray-200 px-4 py-2">12/29/2023</td>
          <td className="border-b border-gray-200 px-4 py-2">yes or no</td>
        </tr>
        {/* Add more rows here */}
      </tbody>
    </table>
  );
};

export default PendingTable;
