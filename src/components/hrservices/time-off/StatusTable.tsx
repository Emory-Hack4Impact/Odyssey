"use client";
import React, { useEffect, useState } from "react";
import { GetTimeOffRequests } from "@/app/api/time-off-req";

// Props are typed inline in the component definition below

interface TimeOffRequest {
  id: number;
  leaveType: string;
  otherLeaveType: string;
  startDate: Date;
  endDate: Date;
  comments: string;
  status: string;
}

const StatusTable = ({ employeeId, refreshTrigger = 0 }: { employeeId: string; refreshTrigger?: number }) => {
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await GetTimeOffRequests(employeeId);
        setRequests(data);
      } catch (error) {
        console.error("Error fetching time off requests:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchRequests();
  }, [employeeId, refreshTrigger]);

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "APPROVED":
        return "text-green-600";
      case "DECLINED":
        return "text-red-600";
      case "PENDING":
      default:
        return "text-yellow-600";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "APPROVED":
        return "Accepted";
      case "DECLINED":
        return "Declined";
      case "PENDING":
      default:
        return "Pending";
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Status of Requests</h2>
        <div className="overflow-x-auto rounded-lg bg-gray-50 p-8">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Status of Requests</h2>
        <div className="overflow-x-auto rounded-lg bg-gray-50 p-8">
          <p className="text-center text-gray-500">No time off requests yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Status of Requests</h2>
      <div className="overflow-x-auto rounded-lg bg-gray-50">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-100">
              <th className="px-4 py-3 font-medium text-gray-700">Leave Type</th>
              <th className="px-4 py-3 font-medium text-gray-700">Date From</th>
              <th className="px-4 py-3 font-medium text-gray-700">Date To</th>
              <th className="px-4 py-3 font-medium text-gray-700">Additional Info</th>
              <th className="px-4 py-3 font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">
                  {request.leaveType === "Other" ? request.otherLeaveType : request.leaveType}
                </td>
                <td className="px-4 py-3 text-gray-700">{formatDate(request.startDate)}</td>
                <td className="px-4 py-3 text-gray-700">{formatDate(request.endDate)}</td>
                <td className="px-4 py-3 text-gray-700">{request.comments || "-"}</td>
                <td className={`px-4 py-3 font-medium ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusTable;
