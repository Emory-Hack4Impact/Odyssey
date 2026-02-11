"use client";
import React, { useMemo } from "react";
import { Employee } from "../types/employee";
import SearchBar from "./SearchBar";
import FilterDropdown from "./FilterDropdown";
import EmployeeCard from "./EmployeeCard";

type Filters = {
  department: string[];
  role: string[];
  location: string[];
};

type Props = {
  allEmployees: Employee[];
  filteredEmployees: Employee[];
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  activeFilters: Filters;
  setActiveFilters: (f: Filters) => void;
  onSelect: (e: Employee) => void;
};

export default function EmployeeDirectory({
  allEmployees,
  filteredEmployees,
  searchQuery,
  setSearchQuery,
  activeFilters,
  setActiveFilters,
  onSelect,
}: Props) {
  const departments = useMemo(
    () => Array.from(new Set(allEmployees.map((e) => e.department).filter(Boolean))) as string[],
    [allEmployees],
  );
  const roles = useMemo(
    () => Array.from(new Set(allEmployees.map((e) => e.role).filter(Boolean))) as string[],
    [allEmployees],
  );
  const locations = useMemo(
    () => Array.from(new Set(allEmployees.map((e) => e.location).filter(Boolean))) as string[],
    [allEmployees],
  );

  return (
    <div className="flex-1 px-8 py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-3xl flex-1">
          <SearchBar
            allEmployees={allEmployees}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelect={onSelect}
          />
        </div>
        <div className="flex items-center gap-3">
          <FilterDropdown
            label="Departments"
            options={departments}
            selected={activeFilters.department}
            onChange={(s) => setActiveFilters({ ...activeFilters, department: s })}
          />
          <FilterDropdown
            label="Roles"
            options={roles}
            selected={activeFilters.role}
            onChange={(s) => setActiveFilters({ ...activeFilters, role: s })}
          />
          <FilterDropdown
            label="Locations"
            options={locations}
            selected={activeFilters.location}
            onChange={(s) => setActiveFilters({ ...activeFilters, location: s })}
          />
        </div>
      </div>

      <h3 className="mt-6 text-sm font-semibold text-gray-700">Results:</h3>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
