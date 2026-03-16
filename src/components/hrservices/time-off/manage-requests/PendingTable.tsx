import React from "react";

interface PendingRequest {
  id: number;
  name: string;
  leaveType: string;
  dateFrom: string;
  dateTo: string;
  additionalInfo: string;
  requestDate: string;
}

const PendingTable: React.FC = () => {
  const mockData: PendingRequest[] = [
    {
      id: 1,
      name: "Marcus",
      leaveType: "Annual Leave",
      dateFrom: "01/01/2024",
      dateTo: "01/05/2024",
      additionalInfo: "Family vacation",
      requestDate: "12/29/2023",
    },
    {
      id: 2,
      name: "Marcia",
      leaveType: "Maternity Leave",
      dateFrom: "01/01/2024",
      dateTo: "01/05/2024",
      additionalInfo: "It's a Girl!",
      requestDate: "12/29/2023",
    },
    {
      id: 3,
      name: "Marc",
      leaveType: "Sick Leave",
      dateFrom: "01/01/2024",
      dateTo: "01/05/2024",
      additionalInfo: "COVID-19",
      requestDate: "12/29/2023",
    },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-base-300 bg-base-200">
            <th className="px-4 py-3 text-left font-semibold text-base-content">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-base-content">Leave Type</th>
            <th className="px-4 py-3 text-left font-semibold text-base-content">Date From</th>
            <th className="px-4 py-3 text-left font-semibold text-base-content">Date To</th>
            <th className="px-4 py-3 text-left font-semibold text-base-content">Additional Info</th>
            <th className="px-4 py-3 text-left font-semibold text-base-content">Request Date</th>
            <th className="px-4 py-3 text-left font-semibold text-base-content">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((row) => (
            <tr key={row.id} className="border-b border-base-300 transition hover:bg-base-200">
              <td className="px-4 py-3 text-base-content">{row.name}</td>
              <td className="px-4 py-3 text-base-content">{row.leaveType}</td>
              <td className="px-4 py-3 text-base-content">{row.dateFrom}</td>
              <td className="px-4 py-3 text-base-content">{row.dateTo}</td>
              <td className="px-4 py-3 text-base-content/80">{row.additionalInfo}</td>
              <td className="px-4 py-3 text-base-content/80">{row.requestDate}</td>
              <td className="flex gap-2 px-4 py-3">
                <button className="btn btn-sm btn-success">Approve</button>
                <button className="btn btn-sm btn-error">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingTable;
