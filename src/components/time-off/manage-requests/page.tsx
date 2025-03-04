"use client";
import React from "react";
import ManageStatusTable from "./ManageStatusTable";
import PendingTable from "./PendingTable";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { Value } from "node_modules/react-calendar/dist/esm/shared/types";

export default function TimeOffRequests() {
  const [date, setDate] = React.useState(new Date());

  const onChange = (newDate: Value) => {
    setDate(newDate as Date);
    // Handle date change, e.g., fetch time-off requests for the selected date
  };

  return (
    <div className="flex">
      <div className="flex-1 p-4">
        <h1>Calendar</h1>
        <Calendar
          onChange={onChange}
          value={date}
          // Additional props can go here to customize the calendar
        />
      </div>
      <div className="flex-1 p-4">
        <div className="mt-5">
          <h1 className="text-xl">Pending Employee Requests</h1>
          <PendingTable />
        </div>
        <div className="mt-5">
          <h1 className="text-xl">Approved Employee Requests</h1>
          <ManageStatusTable />
        </div>
      </div>
    </div>
  );
}
