"use client";
import React, { useState } from "react";
import PendingRequests from "./PendingRequests";
import StatusOfEmployeeRequests from "./StatusOfEmployeeRequests";

export default function RequestsTabs({
  approverId,
  selectedDateIso = null,
}: {
  approverId: string;
  selectedDateIso?: string | null;
}) {
  const [activeTab, setActiveTab] = useState<"pending" | "status">("pending");

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          className={`btn rounded-full px-4 py-2 ${activeTab === "pending" ? "bg-black text-white" : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Employee Requests
        </button>
        <button
          type="button"
          className={`btn rounded-full px-4 py-2 ${activeTab === "status" ? "bg-black text-white" : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          onClick={() => setActiveTab("status")}
        >
          Status of Employee Requests
        </button>
      </div>

      <div className="rounded-lg bg-gray-50 p-2">
        {activeTab === "pending" ? (
          <PendingRequests approverId={approverId} selectedDateIso={selectedDateIso} />
        ) : (
          <StatusOfEmployeeRequests selectedDateIso={selectedDateIso} />
        )}
      </div>
    </div>
  );
}
