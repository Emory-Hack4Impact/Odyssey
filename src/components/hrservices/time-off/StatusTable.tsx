import React from "react";
import { type TimeOffRequest } from "./TimeOffForm";

const formatDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "N/A";
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });
};

const StatusTable = ({ requests }: { requests: TimeOffRequest[] }) => {
  return (
    <div className="mt-10 overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200 text-base-content">
            <th>Leave Type</th>
            <th>Date From</th>
            <th>Date To</th>
            <th>Additional Info</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-base-content/60">
                No time off requests submitted yet.
              </td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr key={request.id}>
                <td>
                  {request.leaveType === "Other" ? request.otherLeaveType : request.leaveType}
                </td>
                <td>{formatDate(request.startDate)}</td>
                <td>{formatDate(request.endDate)}</td>
                <td>{request.comments}</td>
                <td>
                  <span
                    className={`badge ${
                      request.approved
                        ? "badge-outline badge-success"
                        : "badge-outline badge-warning"
                    }`}
                  >
                    {request.approved ? "Approved" : "Pending"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StatusTable;
