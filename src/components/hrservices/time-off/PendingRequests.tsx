"use client";
import React, { useEffect, useState } from "react";
// Use HTTP API route to update status to ensure client-side compatibility

interface PendingRequestsProps {
  approverId: string;
  refreshTrigger?: number;
  onActionComplete?: () => void;
}

interface PendingRequest {
  id: number;
  employeeId: string;
  employeeName?: string;
  leaveType: string;
  otherLeaveType: string;
  startDate: Date;
  endDate: Date;
  comments: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  requestDate?: Date | string;
}

const PendingRequests: React.FC<PendingRequestsProps> = ({
  approverId: _approverId,
  refreshTrigger = 0,
  onActionComplete,
}) => {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    void fetchRequests();

    // Listen for global status updates to refresh pending list
    const handler = () => {
      void fetchRequests();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("timeoff:status-updated", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("timeoff:status-updated", handler);
      }
    };
  }, [refreshTrigger]);

  const fetchRequests = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/time-off-req?type=pending", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data as PendingRequest[]);
      } else if (data && typeof data === "object" && "error" in data) {
        const errObj = data as { error: unknown; details?: unknown };
        const errText = [errObj.error, errObj.details]
          .filter((v) => typeof v === "string")
          .join(" — ") || "Unknown error";
        setErrorMsg(errText);
        setRequests([]);
      } else {
        setErrorMsg("Unexpected response format");
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      setErrorMsg(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    setProcessingId(requestId);
    try {
      const res = await fetch("/api/time-off-req", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status: "APPROVED" }),
      });
      let payload: unknown = null;
      try {
        payload = await res.json();
      } catch { }
      if (!res.ok) {
        console.error("Approve failed:", payload);
      }
      // Optimistic update: remove the request from local pending list
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      // Also refetch to ensure consistency
      await fetchRequests();
      // Notify other views to refresh (e.g., StatusOfEmployeeRequests)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("timeoff:status-updated"));
        // Fallback: dispatch again shortly in case listeners were late to attach
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("timeoff:status-updated"));
        }, 200);
      }
      onActionComplete?.();
    } catch (error) {
      console.error("Error approving request:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (requestId: number) => {
    setProcessingId(requestId);
    try {
      const res = await fetch("/api/time-off-req", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status: "DECLINED" }),
      });
      let payload: unknown = null;
      try {
        payload = await res.json();
      } catch { }
      if (!res.ok) {
        console.error("Decline failed:", payload);
      }
      // Optimistic update: remove the request from local pending list
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      await fetchRequests();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("timeoff:status-updated"));
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("timeoff:status-updated"));
        }, 200);
      }
      onActionComplete?.();
    } catch (error) {
      console.error("Error declining request:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // Helper to get employee name from email (from employeeId)
  const getEmployeeName = (request: PendingRequest): string => {
    return request.employeeName ?? "Employee";
  };

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Pending Employee Requests</h2>
        <div className="overflow-x-auto rounded-lg bg-gray-50 p-8">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Pending Employee Requests</h2>
        <div className="overflow-x-auto rounded-lg bg-red-50 p-8 text-center text-red-700">
          Error: {errorMsg}
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Pending Employee Requests</h2>
        <div className="overflow-x-auto rounded-lg bg-gray-50 p-8">
          <p className="text-center text-gray-500">No pending requests</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(requests)) {
    return (
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Pending Employee Requests</h2>
        <div className="overflow-x-auto rounded-lg bg-red-50 p-8 text-center text-red-700">
          Error: Unexpected requests state
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Pending Employee Requests</h2>
      <div className="overflow-x-auto rounded-lg bg-gray-50">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-100">
              <th className="px-4 py-3 font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 font-medium text-gray-700">Leave Type</th>
              <th className="px-4 py-3 font-medium text-gray-700">Date From</th>
              <th className="px-4 py-3 font-medium text-gray-700">Date To</th>
              <th className="px-4 py-3 font-medium text-gray-700">Additional Info</th>
              <th className="px-4 py-3 font-medium text-gray-700">Request Date</th>
              <th className="px-4 py-3 font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{getEmployeeName(request)}</td>
                <td className="px-4 py-3 text-gray-700">
                  {request.leaveType === "Other" ? request.otherLeaveType : request.leaveType}
                </td>
                <td className="px-4 py-3 text-gray-700">{formatDate(request.startDate)}</td>
                <td className="px-4 py-3 text-gray-700">{formatDate(request.endDate)}</td>
                <td className="px-4 py-3 text-gray-700">{request.comments || "-"}</td>
                <td className="px-4 py-3 text-gray-700">{formatDate(new Date(request.requestDate ?? request.startDate))}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={processingId === request.id}
                      className="rounded-full p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-50"
                      title="Approve"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDecline(request.id)}
                      disabled={processingId === request.id}
                      className="rounded-full p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      title="Decline"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingRequests;
