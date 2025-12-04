"use client";
import React, { useEffect, useState } from "react";
// Use HTTP API route to update status to ensure client-side compatibility

// Props are typed inline in the component definition below

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

const PendingRequests = ({
  approverId: _approverId,
  refreshTrigger = 0,
  onActionComplete,
  selectedDateIso = null,
}: {
  approverId: string;
  refreshTrigger?: number;
  onActionComplete?: () => void;
  selectedDateIso?: string | null;
}) => {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<
    | "employeeName"
    | "leaveType"
    | "startDate"
    | "endDate"
    | "comments"
    | "requestDate"
    | null
  >(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

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

  const filteredRequests = (() => {
    if (!selectedDateIso) return requests;
    const selected = new Date(selectedDateIso);
    selected.setHours(12, 0, 0, 0);
    return requests.filter((r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return selected >= start && selected <= end;
    });
  })();

  const sortedRequests = (() => {
    const arr = [...filteredRequests];
    if (sortKey === null) {
      return arr; // no sorting by default
    }
    const compare = (a: PendingRequest, b: PendingRequest) => {
      const av = (() => {
        switch (sortKey) {
          case "employeeName":
            return getEmployeeName(a).toLowerCase();
          case "leaveType":
            return (a.leaveType === "Other" ? a.otherLeaveType : a.leaveType).toLowerCase();
          case "startDate":
            return new Date(a.startDate).getTime();
          case "endDate":
            return new Date(a.endDate).getTime();
          case "comments":
            return (a.comments || "").toLowerCase();
          case "requestDate":
            return new Date(a.requestDate ?? a.startDate).getTime();
          default:
            return 0;
        }
      })();
      const bv = (() => {
        switch (sortKey) {
          case "employeeName":
            return getEmployeeName(b).toLowerCase();
          case "leaveType":
            return (b.leaveType === "Other" ? b.otherLeaveType : b.leaveType).toLowerCase();
          case "startDate":
            return new Date(b.startDate).getTime();
          case "endDate":
            return new Date(b.endDate).getTime();
          case "comments":
            return (b.comments || "").toLowerCase();
          case "requestDate":
            return new Date(b.requestDate ?? b.startDate).getTime();
          default:
            return 0;
        }
      })();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    };
    arr.sort(compare);
    return arr;
  })();

  const toggleSort = (key: NonNullable<typeof sortKey>) => {
    setSortKey((prev) => (prev === key ? prev : key));
    setSortDir((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
  };

  if (loading) {
    return (
      <div className="w-full">
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
        <div className="overflow-x-auto rounded-lg bg-red-50 p-8 text-center text-red-700">
          Error: {errorMsg}
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="w-full">
        <div className="overflow-x-auto rounded-lg bg-gray-50 p-8">
          <p className="text-center text-gray-500">No pending requests</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(requests)) {
    return (
      <div className="w-full">
        <div className="overflow-x-auto rounded-lg bg-red-50 p-8 text-center text-red-700">
          Error: Unexpected requests state
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg bg-gray-50">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-100">
              <th className="px-4 py-3 font-medium text-gray-700">
                <button
                  type="button"
                  className="underline decoration-dotted underline-offset-4"
                  onClick={() => toggleSort("employeeName")}
                  title="Sort by Name"
                >
                  Name {sortKey === "employeeName" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-gray-700">
                <button
                  type="button"
                  className="underline decoration-dotted underline-offset-4"
                  onClick={() => toggleSort("leaveType")}
                  title="Sort by Leave Type"
                >
                  Leave Type {sortKey === "leaveType" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-gray-700">
                <button
                  type="button"
                  className="underline decoration-dotted underline-offset-4"
                  onClick={() => toggleSort("startDate")}
                  title="Sort by Date From"
                >
                  Date From {sortKey === "startDate" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-gray-700">
                <button
                  type="button"
                  className="underline decoration-dotted underline-offset-4"
                  onClick={() => toggleSort("endDate")}
                  title="Sort by Date To"
                >
                  Date To {sortKey === "endDate" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-gray-700">
                <button
                  type="button"
                  className="underline decoration-dotted underline-offset-4"
                  onClick={() => toggleSort("comments")}
                  title="Sort by Additional Info"
                >
                  Additional Info {sortKey === "comments" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-gray-700">
                <button
                  type="button"
                  className="underline decoration-dotted underline-offset-4"
                  onClick={() => toggleSort("requestDate")}
                  title="Sort by Request Date"
                >
                  Request Date {sortKey === "requestDate" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedRequests.map((request) => (
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
                      className="rounded-full p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-50 cursor-pointer"
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
                      className="rounded-full p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
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
