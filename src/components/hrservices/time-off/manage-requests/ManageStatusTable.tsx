import React from "react";

interface ApprovedRequest {
  id: number;
  name: string;
  leaveType: string;
  dateFrom: string;
  dateTo: string;
  additionalInfo: string;
  status: "Accepted" | "Pending" | "Rejected";
}

const ManageStatusTable: React.FC = () => {
  const mockData: ApprovedRequest[] = [
    {
      id: 1,
      name: "Marcus",
      leaveType: "Annual Leave",
      dateFrom: "01/01/2024",
      dateTo: "01/05/2024",
      additionalInfo: "Family vacation",
      status: "Accepted",
    },
    {
      id: 2,
      name: "Marcia",
      leaveType: "Maternity Leave",
      dateFrom: "01/01/2024",
      dateTo: "01/05/2024",
      additionalInfo: "It's a Girl!",
      status: "Pending",
    },
    {
      id: 3,
      name: "Marc",
      leaveType: "Sick Leave",
      dateFrom: "01/01/2024",
      dateTo: "01/05/2024",
      additionalInfo: "COVID-19",
      status: "Rejected",
    },
  ];

  const getStatusBadgeClass = (status: "Accepted" | "Pending" | "Rejected") => {
    switch (status) {
      case "Accepted":
        return "badge badge-success";
      case "Pending":
        return "badge badge-warning";
      case "Rejected":
        return "badge badge-error";
      default:
        return "badge";
    }
  };

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
            <th className="px-4 py-3 text-left font-semibold text-base-content">Status</th>
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
              <td className="px-4 py-3">
                <span className={getStatusBadgeClass(row.status)}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageStatusTable;
