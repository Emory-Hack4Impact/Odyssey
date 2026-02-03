"use client";

import React from "react";

export default function SearchTile() {
  return (
    <div className="card border border-base-content/5 bg-base-100 shadow-xl min-[1055px]:w-80">
      <div className="card-body gap-6 p-6">
        {/* Simplified Search Input */}
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
            />
          </label>
        </div>
      </div>
    </div>
  );
}
