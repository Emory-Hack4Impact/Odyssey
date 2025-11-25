"use client";
import React, { useEffect, useState } from "react";
import ManageStatusTable from "./ManageStatusTable";
import PendingTable from "./PendingTable";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { Value } from "node_modules/react-calendar/dist/esm/shared/types";
import { GetAllRequestsForCalendar, type TimeOffRequestWithUser } from "@/app/api/time-off-req";
import { RequestStatus } from "@prisma/client";

export default function TimeOffRequests() {
  const [date, setDate] = React.useState(new Date());
  const [requests, setRequests] = useState<TimeOffRequestWithUser[]>([]);
  const [selectedDateRequests, setSelectedDateRequests] = useState<TimeOffRequestWithUser[]>([]);

  useEffect(() => {
    void fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await GetAllRequestsForCalendar();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests for calendar:", error);
    }
  };

  const onChange = (newDate: Value) => {
    const selectedDate = newDate as Date;
    setDate(selectedDate);
    
    // Find requests that overlap with the selected date
    const overlappingRequests = requests.filter((request) => {
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      const selected = new Date(selectedDate);
      
      // Reset time to compare dates only
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      selected.setHours(0, 0, 0, 0);
      
      return selected >= startDate && selected <= endDate;
    });
    
    setSelectedDateRequests(overlappingRequests);
  };

  // Function to mark dates with requests
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const hasRequest = requests.some((request) => {
        const startDate = new Date(request.startDate);
        const endDate = new Date(request.endDate);
        const checkDate = new Date(date);
        
        // Reset time to compare dates only
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        checkDate.setHours(0, 0, 0, 0);
        
        return checkDate >= startDate && checkDate <= endDate;
      });

      if (hasRequest) {
        // Check if there are pending requests on this date
        const hasPending = requests.some((request) => {
          const startDate = new Date(request.startDate);
          const endDate = new Date(request.endDate);
          const checkDate = new Date(date);
          
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          checkDate.setHours(0, 0, 0, 0);
          
          return (
            checkDate >= startDate &&
            checkDate <= endDate &&
            request.status === RequestStatus.PENDING
          );
        });

        const hasApproved = requests.some((request) => {
          const startDate = new Date(request.startDate);
          const endDate = new Date(request.endDate);
          const checkDate = new Date(date);
          
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          checkDate.setHours(0, 0, 0, 0);
          
          return (
            checkDate >= startDate &&
            checkDate <= endDate &&
            request.status === RequestStatus.APPROVED
          );
        });

        if (hasPending) {
          return "bg-yellow-200 hover:bg-yellow-300";
        } else if (hasApproved) {
          return "bg-green-200 hover:bg-green-300";
        } else {
          return "bg-red-200 hover:bg-red-300";
        }
      }
    }
    return null;
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 p-4">
        <h1 className="mb-4 text-2xl font-semibold">Calendar</h1>
        <Calendar
          onChange={onChange}
          value={date}
          tileClassName={tileClassName}
          className="w-full"
        />
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold">Legend:</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-yellow-200"></div>
              <span>Pending Requests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-green-200"></div>
              <span>Approved Requests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-red-200"></div>
              <span>Declined Requests</span>
            </div>
          </div>
        </div>
        {selectedDateRequests.length > 0 && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
            <h3 className="mb-2 font-semibold">
              Requests for {formatDate(date)}:
            </h3>
            <ul className="list-disc pl-5 text-sm">
              {selectedDateRequests.map((request) => {
                const leaveTypeDisplay =
                  request.leaveType === "Other" ? request.otherLeaveType : request.leaveType;
                const statusColor =
                  request.status === RequestStatus.PENDING
                    ? "text-yellow-600"
                    : request.status === RequestStatus.APPROVED
                      ? "text-green-600"
                      : "text-red-600";
                return (
                  <li key={request.id} className="mb-1">
                        <span className="font-medium">{request.employeeName ?? request.employeeEmail}</span>
                    {" - "}
                    <span>{leaveTypeDisplay}</span>
                    {" ("}
                    <span className={statusColor}>{request.status}</span>
                    {")"}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <div className="flex-1 p-4">
        <div className="mt-5">
          <h1 className="text-xl font-semibold">Pending Employee Requests</h1>
          <PendingTable />
        </div>
        <div className="mt-5">
          <h1 className="text-xl font-semibold">Approved/Denied Employee Requests</h1>
          <ManageStatusTable />
        </div>
      </div>
    </div>
  );
}
