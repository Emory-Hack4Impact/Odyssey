"use client";

import React, { useMemo, useState } from "react";

// ---- Date Utilities ----

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function fromISODate(iso: string) {
  const [y = 0, m = 1, d = 1] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ---- MiniCalendar Component ----

const CalendarMini = ({
  events = [] as { date: string; label?: string; starttime?: string; endtime?: string }[],
}) => {
  const [cursor, setCursor] = useState<Date>(startOfMonth(new Date()));
  const [selectedISO, setSelectedISO] = useState<string>(toISODate(new Date()));

  const { weeks, monthName, year } = useMemo(() => {
    const first = startOfMonth(cursor);
    const last = endOfMonth(cursor);

    const monthName = first.toLocaleString(undefined, { month: "long" });
    const year = first.getFullYear();

    const days: Date[] = [];
    const padBefore = first.getDay();
    for (let i = 0; i < padBefore; i++)
      days.push(new Date(first.getFullYear(), first.getMonth(), 0 - (padBefore - 1 - i)));

    for (let d = 1; d <= last.getDate(); d++)
      days.push(new Date(first.getFullYear(), first.getMonth(), d));

    const total = Math.ceil(days.length / 7) * 7;
    for (let i = days.length; i < total; i++)
      days.push(
        new Date(last.getFullYear(), last.getMonth(), last.getDate() + (i - days.length) + 1),
      );

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

    return { weeks, monthName, year };
  }, [cursor]);

  const eventDates = useMemo(() => new Set(events.map((e) => e.date)), [events]);
  const todayISO = toISODate(new Date());

  const dayEvents = useMemo(
    () => events.filter((e) => e.date === selectedISO),
    [events, selectedISO],
  );

  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          aria-label="Previous month"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-base-300 hover:bg-base-200"
          onClick={() => setCursor((d) => addMonths(d, -1))}
        >
          ‹
        </button>
        <div className="text-sm font-medium text-base-content">
          {monthName} {year}
        </div>
        <button
          aria-label="Next month"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-base-300 hover:bg-base-200"
          onClick={() => setCursor((d) => addMonths(d, 1))}
        >
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 text-center text-xs text-base-content/60">
        {"SMTWTFS".split("").map((c, i) => (
          <div key={i} className="py-1">
            {c}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-sm">
        {weeks.map((wk, i) => (
          <React.Fragment key={i}>
            {wk.map((d, j) => {
              const inMonth = d.getMonth() === cursor.getMonth();
              const iso = toISODate(d);
              const hasEvent = eventDates.has(iso);
              const isToday = iso === todayISO;
              const isSelected = iso === selectedISO;
              return (
                <button
                  type="button"
                  aria-label={`Select ${iso}`}
                  key={j}
                  onClick={() => setSelectedISO(iso)}
                  disabled={!inMonth}
                  className={`relative aspect-square rounded-md text-center leading-6 transition ${
                    inMonth
                      ? "bg-base-100 hover:bg-base-200"
                      : "bg-transparent text-base-content/30"
                  } ${isToday ? "ring-1 ring-primary" : ""} ${
                    isSelected ? "outline-2 outline-primary" : ""
                  }`}
                >
                  <div className={inMonth ? "" : "opacity-40"}>{inMonth ? d.getDate() : ""}</div>
                  {hasEvent && (
                    <div className="absolute inset-x-0 bottom-1 mx-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-4">
        <div className="text-sm font-medium text-base-content">
          Events on{" "}
          {fromISODate(selectedISO).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </div>
        {dayEvents.length ? (
          <ul className="mt-2 space-y-1 text-sm">
            {dayEvents.map((e, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                <span className="text-base-content/80">
                  {e.label}
                  {e.starttime && e.endtime ? ` — ${e.starttime} to ${e.endtime}` : ""}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-base-content/60">No events for this day.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarMini;
