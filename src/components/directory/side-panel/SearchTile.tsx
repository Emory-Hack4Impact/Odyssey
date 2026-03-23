"use client";

import React from "react";
import type { DirectoryFilterOptions, DirectoryFilters } from "../types";

export default function SearchTile({
  search,
  setSearch,
  filters,
  setFilters,
  filterOptions,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filters: DirectoryFilters;
  setFilters: React.Dispatch<React.SetStateAction<DirectoryFilters>>;
  filterOptions: DirectoryFilterOptions;
}) {
  return (
    <div className="card border border-base-content/5 bg-base-100 shadow-xl min-[1088px]:w-96">
      <div className="card-body gap-6 p-6">
        {/* Search */}
        <div className="flex flex-col gap-2">
          <p className="ml-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
            Search
          </p>
          <label className="input-bordered input flex h-12 w-full items-center gap-3 border-none bg-base-200/50">
            <svg
              className="h-[1.1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              className="grow text-sm font-medium placeholder:text-base-content/40"
              placeholder="Name or ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </label>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="form-control">
            <span className="mb-1 ml-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              Department
            </span>
            <select
              className="select-bordered select w-full"
              value={filters.department}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, department: event.target.value }));
              }}
            >
              <option value="all">All departments</option>
              {filterOptions.departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="mb-1 ml-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              Role
            </span>
            <select
              className="select-bordered select w-full"
              value={filters.role}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, role: event.target.value }));
              }}
            >
              <option value="all">All roles</option>
              {filterOptions.roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control sm:col-span-2">
            <span className="mb-1 ml-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              Location
            </span>
            <select
              className="select-bordered select w-full"
              value={filters.location}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, location: event.target.value }));
              }}
            >
              <option value="all">All locations</option>
              {filterOptions.locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
