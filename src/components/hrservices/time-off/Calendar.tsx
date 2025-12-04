"use client";
import React, { useState, useEffect } from "react";
import { GetAllRequestsForCalendar } from "@/app/api/time-off-req";


interface CalendarRequest {
  id: number;
  startDate: Date;
  endDate: Date;
}

const Calendar = ({
  refreshTrigger = 0,
  selectedDateIso = null,
  onSelectDate,
}: {
  refreshTrigger?: number;
  selectedDateIso?: string | null;
  onSelectDate?: (iso: string | null) => void;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allRequests, setAllRequests] = useState<CalendarRequest[]>([]);

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const data = await GetAllRequestsForCalendar();
        setAllRequests(data);
      } catch (error) {
        console.error("Error fetching calendar requests:", error);
      }
    };

    void fetchAllRequests();
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

  const isDateRequested = (day: number | null): boolean => {
    if (!day) return false;

    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Normalize check date to avoid time component mismatches
    checkDate.setHours(12, 0, 0, 0);

    return allRequests.some((request) => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      // Normalize range to be fully inclusive from start through end
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
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
          <svg
            className="h-5 w-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
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
          <svg
            className="h-5 w-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
            className={`relative flex h-10 items-center justify-center text-sm ${day === null ? "" : "cursor-pointer hover:bg-gray-50"
              }`}
            onClick={() => {
              if (day === null) return;
              const iso = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                .toISOString()
                .slice(0, 10);
              onSelectDate?.(selectedDateIso === iso ? null : iso);
            }}
          >
            {day !== null && (
              <>
                <span
                  className={
                    isDateRequested(day) ? "font-semibold text-gray-900" : "text-gray-600"
                  }
                >
                  {day}
                </span>
                {isDateRequested(day) && (
                  <div className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-500"></div>
                )}
                {selectedDateIso ===
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                    .toISOString()
                    .slice(0, 10) && (
                    <div className="absolute inset-0 rounded ring-2 ring-gray-500"></div>
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
