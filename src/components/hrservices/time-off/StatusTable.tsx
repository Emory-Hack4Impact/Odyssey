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
    <div className="card h-full w-full border border-base-content/5 bg-base-100 shadow-xl">
      <div className="card-body gap-5">
        <div>
          <p className="text-xs font-semibold tracking-wide text-base-content/70 uppercase">
            Recent activity
          </p>
          <h2 className="card-title text-2xl font-semibold">Request History</h2>
        </div>
        <div className="rounded-box border border-base-200">
          <table className="table-compact table w-full">
            <thead>
              <tr className="bg-base-200 text-xs font-semibold tracking-wide text-base-content uppercase">
                <th className="w-1/5">Leave Type</th>
                <th className="w-1/6">Date From</th>
                <th className="w-1/6">Date To</th>
                <th className="w-2/5">Additional Info</th>
                <th className="w-1/6 text-center">Status</th>
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
                requests.map((request) => {
                  const leaveLabel =
                    request.leaveType === "Other" ? request.otherLeaveType : request.leaveType;

                  return (
                    <tr key={request.id} className="text-sm">
                      <td className="align-top font-medium break-words">{leaveLabel}</td>
                      <td className="align-top whitespace-nowrap text-base-content/80">
                        {formatDate(request.startDate)}
                      </td>
                      <td className="align-top whitespace-nowrap text-base-content/80">
                        {formatDate(request.endDate)}
                      </td>
                      <td className="align-top break-words text-base-content/80">
                        {request.comments || "—"}
                      </td>
                      <td className="text-center align-top">
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatusTable;
