"use client";
import React, { useState, useEffect } from "react";
import { GetApprovedRequestsForCalendar } from "@/app/api/time-off-req";

interface CalendarProps {
  refreshTrigger?: number;
}

interface ApprovedRequest {
  id: number;
  startDate: Date;
  endDate: Date;
}

const Calendar: React.FC<CalendarProps> = ({ refreshTrigger = 0 }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [approvedRequests, setApprovedRequests] = useState<ApprovedRequest[]>([]);

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      try {
        const data = await GetApprovedRequestsForCalendar(month, year);
        setApprovedRequests(data);
      } catch (error) {
        console.error("Error fetching approved requests:", error);
      }
    };

    fetchApprovedRequests();
  }, [currentDate, refreshTrigger]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const isDateApproved = (day: number | null): boolean => {
    if (!day) return false;

    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    return approvedRequests.some((request) => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      return checkDate >= start && checkDate <= end;
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Calendar</h2>

      {/* Month Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="rounded p-1 hover:bg-gray-100"
          aria-label="Previous month"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-base font-medium text-gray-700">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="rounded p-1 hover:bg-gray-100"
          aria-label="Next month"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`relative flex h-10 items-center justify-center text-sm ${
              day === null ? "" : "hover:bg-gray-50"
            }`}
          >
            {day !== null && (
              <>
                <span className={`${isDateApproved(day) ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                  {day}
                </span>
                {isDateApproved(day) && (
                  <div className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-500"></div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
