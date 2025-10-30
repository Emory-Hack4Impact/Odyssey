import React from "react";
import { type TimeOffRequest } from "./TimeOffForm"; 

const formatDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'N/A';
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const StatusTable = ({ requests }: {requests: TimeOffRequest[]}) => {
  return (
    <table className="mx-auto mt-10 w-full max-w-full border-collapse rounded-lg border border-gray-200 p-6 text-black shadow-lg">
      <thead>
        <tr>
          <th className="border-b border-gray-200 bg-gray-100 px-4 py-2 text-left">Leave Type</th>
          <th className="border-b border-gray-200 bg-gray-100 px-4 py-2 text-left">Date From</th>
          <th className="border-b border-gray-200 bg-gray-100 px-4 py-2 text-left">Date To</th>
          <th className="border-b border-gray-200 bg-gray-100 px-4 py-2 text-left">Additional Info</th>
          <th className="border-b border-gray-200 bg-gray-100 px-4 py-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {requests.length === 0 ? (
          <tr>
            <td colSpan={5} className="border-b border-gray-200 px-4 py-4 text-center text-gray-500">
              No time off requests submitted yet.
            </td>
          </tr>
        ) : (
          requests.map((request) => (
            <tr key={request.id}>
              <td className="border-b border-gray-200 px-4 py-2">
                {request.leaveType === "Other"
                  ? request.otherLeaveType
                  : request.leaveType}
              </td>
              <td className="border-b border-gray-200 px-4 py-2">
                {formatDate(request.startDate)}
              </td>
              <td className="border-b border-gray-200 px-4 py-2">
                {formatDate(request.endDate)}
              </td>
              <td className="border-b border-gray-200 px-4 py-2">{request.comments}</td>
              <td className="border-b border-gray-200 px-4 py-2">
                {request.approved ? "Approved" : "Pending"}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default StatusTable;