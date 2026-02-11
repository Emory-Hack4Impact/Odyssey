"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Employee, fullName } from "../types/employee";

type Props = {
  allEmployees: Employee[];
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  onSelect: (e: Employee) => void;
};

export default function SearchBar({ allEmployees, searchQuery, setSearchQuery, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allEmployees.filter((e) => {
      return (
        (e.employeeFirstName || "").toLowerCase().includes(q) ||
        (e.employeeLastName || "").toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
      );
    });
  }, [allEmployees, searchQuery]);

  useEffect(() => {
    setOpen(suggestions.length > 0);
  }, [suggestions]);

  return (
    <div className="relative">
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        onClick={(e) => e.stopPropagation()}
        placeholder="Name or ID"
        className="h-10 w-full max-w-3xl rounded bg-gray-100 px-3 py-2"
      />

      {open && suggestions.length > 0 && (
        <div className="absolute right-0 left-0 z-20 mt-2 max-h-64 overflow-auto rounded border bg-white shadow">
          {suggestions.map((s) => (
            <div
              key={s.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(s);
                setSearchQuery("");
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-50"
            >
              <div className="font-medium">{fullName(s) || s.id}</div>
              <div className="text-xs text-gray-500">{s.position || s.role || s.department}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
