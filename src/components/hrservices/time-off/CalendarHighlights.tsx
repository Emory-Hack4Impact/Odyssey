"use client";
import React from "react";

export interface CalendarRange {
  startDate: Date | string;
  endDate: Date | string;
}

interface CalendarHighlightsProps {
  ranges: CalendarRange[];
}

// Utility: build a Set of ISO date strings to highlight
const buildHighlightSet = (ranges: CalendarRange[]) => {
  const set = new Set<string>();
  for (const r of ranges) {
    const start = new Date(r.startDate);
    const end = new Date(r.endDate);
    // normalize times
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      set.add(new Date(d).toISOString().slice(0, 10));
    }
  }
  return set;
};

// Simple current-month calendar that highlights provided dates
const CalendarHighlights = ({ ranges }: CalendarHighlightsProps) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay(); // 0=Sun..6=Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const highlightSet = buildHighlightSet(ranges);

  const cells: Array<{ day: number | null; iso?: string }> = [];
  // leading blanks
  for (let i = 0; i < startWeekday; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const iso = date.toISOString().slice(0, 10);
    cells.push({ day: d, iso });
  }

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {today.toLocaleString(undefined, { month: "long" })} {year}
        </h3>
        <span className="text-sm text-gray-500">Highlighted: requests</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-600">
        {weekdayLabels.map((w) => (
          <div key={w} className="py-1 font-medium">
            {w}
          </div>
        ))}
        {cells.map((c, idx) => {
          if (c.day === null) {
            return <div key={`blank-${idx}`} className="py-2" />;
          }
          const isHighlighted = c.iso ? highlightSet.has(c.iso) : false;
          return (
            <div
              key={`day-${c.day}`}
              className={
                "rounded py-2 " +
                (isHighlighted
                  ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                  : "text-gray-800")
              }
            >
              {c.day}
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-xs text-gray-500">
        <span className="inline-block rounded bg-blue-100 px-2 py-1 text-blue-700 ring-1 ring-blue-300">
          Highlighted
        </span>{" "}
        days indicate requested time off.
      </div>
    </div>
  );
};

export default CalendarHighlights;
