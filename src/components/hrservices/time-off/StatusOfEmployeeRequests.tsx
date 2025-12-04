"use client";
import React, { useEffect, useState } from "react";
// Use HTTP route to fetch non-pending requests

// Props are typed inline in the component definition below

interface EmployeeRequest {
  id: number;
  employeeId: string;
  employeeName?: string;
  leaveType: string;
  otherLeaveType: string;
  startDate: Date;
  endDate: Date;
  comments: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
}

const StatusOfEmployeeRequests: React.FC<{
  refreshTrigger?: number;
  selectedDateIso?: string | null;
}> = ({ refreshTrigger = 0, selectedDateIso = null }) => {
  const [requests, setRequests] = useState<EmployeeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<
    | "employeeName"
    | "leaveType"
    | "startDate"
    | "endDate"
    | "comments"
    | "status"
    | null
  >(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch("/api/time-off-req?type=nonpending", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setRequests(data as EmployeeRequest[]);
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
        console.error("Error fetching employee requests:", error);
        setErrorMsg(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    void fetchRequests();

    // Listen for status updates triggered from PendingRequests
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

  const updateStatus = async (requestId: number, nextStatus: "PENDING" | "APPROVED" | "DECLINED") => {
    try {
      const res = await fetch(`/api/time-off-req`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status: nextStatus }),
      });
      let payload: unknown = null;
      try {
        payload = await res.json();
      } catch { }
      if (!res.ok) {
        console.error("Status update failed:", payload);
        return;
      }
      // Optimistic local update: if moved back to PENDING, remove from non-pending view
      setRequests((prev) =>
        nextStatus === "PENDING"
          ? prev.filter((r) => r.id !== requestId)
          : prev.map((r) => (r.id === requestId ? { ...r, status: nextStatus } : r)),
      );
      // Notify other views and refetch via event listeners
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("timeoff:status-updated"));
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("timeoff:status-updated"));
        }, 200);
      }
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  const getEmployeeName = (request: EmployeeRequest): string => {
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
    const statusRank: Record<string, number> = { PENDING: 0, APPROVED: 1, DECLINED: 2 };
    const compare = (a: EmployeeRequest, b: EmployeeRequest) => {
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
          case "status":
            return statusRank[a.status] ?? 99;
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
          case "status":
            return statusRank[b.status] ?? 99;
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
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Status of Employee Requests</h2>
        <div className="overflow-x-auto rounded-lg bg-red-50 p-8 text-center text-red-700">
          Error: {errorMsg}
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Status of Employee Requests</h2>
        <div className="overflow-x-auto rounded-lg bg-gray-50 p-8">
          <p className="text-center text-gray-500">No employee requests yet</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(requests)) {
    return (
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Status of Employee Requests</h2>
        <div className="overflow-x-auto rounded-lg bg-red-50 p-8 text-center text-red-700">
          Error: Unexpected requests state
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Status of Employee Requests</h2>
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
                  onClick={() => toggleSort("status")}
                  title="Sort by Status"
                >
                  Status {sortKey === "status" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
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
                <td className={`px-4 py-3 font-medium ${getStatusColor(request.status)}`}>
                  <select
                    aria-label="Change status"
                    className="bg-transparent p-0 underline decoration-dotted underline-offset-4 focus:outline-none"
                    value={request.status}
                    onChange={(e) => {
                      const val = e.target.value as "PENDING" | "APPROVED" | "DECLINED";
                      void updateStatus(request.id, val);
                    }}
                  >
                    <option value="PENDING">{getStatusText("PENDING")}</option>
                    <option value="APPROVED">{getStatusText("APPROVED")}</option>
                    <option value="DECLINED">{getStatusText("DECLINED")}</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusOfEmployeeRequests;
