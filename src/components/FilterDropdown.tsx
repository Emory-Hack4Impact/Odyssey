"use client";
import React, { useState } from "react";

type Props = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export default function FilterDropdown({ label, options, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter((s) => s !== opt));
    else onChange([...selected, opt]);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        aria-expanded={open}
        className="inline-flex min-w-[9rem] items-center justify-between rounded bg-gray-100 px-3 py-2 text-left"
      >
        <span className="mr-2 text-sm">{label}</span>
        <div className="flex items-center">
          {selected.length ? (
            <span className="mr-2 text-xs text-gray-500">{`${selected.length} selected`}</span>
          ) : null}
          <svg
            className={`h-3 w-3 transform transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5 8l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded border bg-white shadow">
          {options.map((o) => (
            <label
              key={o}
              onClick={(e) => {
                e.stopPropagation();
                toggle(o);
              }}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(o)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggle(o);
                }}
              />
              <span className="text-sm">{o}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
