"use client";

import React, { useEffect, useState } from "react";
import {
  GetPendingRequests,
  UpdateRequestStatus,
  type TimeOffRequestWithUser,
} from "@/app/api/time-off-req";
import { RequestStatus } from "@prisma/client";

const PendingTable: React.FC = () => {
  const [requests, setRequests] = useState<TimeOffRequestWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    void fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await GetPendingRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: number, status: RequestStatus) => {
    try {
      setProcessing(requestId);
      await UpdateRequestStatus(requestId, status);
      // Remove the request from the list after updating
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error updating request status:", error);
      alert("Failed to update request status. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="mx-auto mt-2 rounded-lg border border-gray-200 p-6 text-center text-black shadow-lg">
        Loading pending requests...
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="mx-auto mt-2 rounded-lg border border-gray-200 p-6 text-center text-black shadow-lg">
        No pending requests
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="mx-auto mt-2 w-full border-collapse rounded-lg border border-gray-200 p-6 text-black shadow-lg">
        <thead>
          <tr>
            <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">Name</th>
            <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">Leave Type</th>
            <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">Date From</th>
            <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">Date To</th>
            <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">Additional Info</th>
            <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">Request Date</th>
            <th className="border-b border-gray-200 bg-gray-100 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const leaveTypeDisplay =
              request.leaveType === "Other" ? request.otherLeaveType : request.leaveType;
            const isProcessing = processing === request.id;

            return (
              <tr key={request.id}>
                <td className="border-b border-gray-200 px-4 py-2">
                  {request.employeeName ?? request.employeeEmail}
                </td>
                <td className="border-b border-gray-200 px-4 py-2">{leaveTypeDisplay}</td>
                <td className="border-b border-gray-200 px-4 py-2">
                  {formatDate(request.startDate)}
                </td>
                <td className="border-b border-gray-200 px-4 py-2">
                  {formatDate(request.endDate)}
                </td>
                <td className="border-b border-gray-200 px-4 py-2">{request.comments || "-"}</td>
                <td className="border-b border-gray-200 px-4 py-2">
                  {formatDate(request.requestDate)}
                </td>
                <td className="border-b border-gray-200 px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(request.id, RequestStatus.APPROVED)}
                      disabled={isProcessing}
                      className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {isProcessing ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request.id, RequestStatus.DECLINED)}
                      disabled={isProcessing}
                      className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {isProcessing ? "Processing..." : "Decline"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PendingTable;
