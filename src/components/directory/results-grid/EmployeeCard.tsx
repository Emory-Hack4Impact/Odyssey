"use client";

import React from "react";
import Image from "next/image";
import type { DirectoryEmployee } from "../types";
import { getEmployeeName } from "../types";

export default function EmployeeCard({
  employee,
  isActive,
  onSelect,
}: {
  employee: DirectoryEmployee;
  isActive: boolean;
  onSelect: () => void;
}) {
  const fullName = getEmployeeName(employee);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onSelect();
        }
      }}
      className={`card card-side h-48 w-xl overflow-hidden border shadow-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 max-[1088px]:w-full ${
        isActive
          ? "border-primary bg-base-100 ring-2 ring-primary/25"
          : "border-base-content/5 bg-base-100"
      }`}
    >
      {/* Profile Picture & Status Section */}
      <figure className="relative w-48 shrink-0 bg-base-200">
        {employee.avatarUrl ? (
          <Image
            src={employee.avatarUrl}
            alt={fullName}
            className="h-full w-full object-cover"
            fill
            sizes="192px"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-base-300">
            <span className="text-4xl font-bold text-base-content/20">{fullName.charAt(0)}</span>
          </div>
        )}

        {/* Availability Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {employee.online && (
            <span className="badge p-1.5 badge-xs shadow-sm badge-success" title="Online" />
          )}
          {employee.away && (
            <span className="badge badge-outline bg-base-100 badge-sm font-bold tracking-tighter uppercase badge-info">
              Away
            </span>
          )}
        </div>
      </figure>

      {/* Content Section */}
      <div className="card-body w-2/3 gap-1">
        <div>
          <h2 className="card-title text-2xl font-semibold text-base-content">{fullName}</h2>
          <p className="text-xs font-semibold tracking-wide text-base-content/70 uppercase">
            {employee.department} <span className="mx-1 opacity-30">|</span> {employee.role}
          </p>
        </div>

        <p className="mt-2 line-clamp-4 overflow-y-scroll text-sm leading-relaxed text-base-content/80">
          {employee.bio}
        </p>

        <div className="mt-auto card-actions justify-end">
          <a
            href={`mailto:${employee.email}`}
            onClick={(event) => event.stopPropagation()}
            className="btn border-none font-medium normal-case shadow-md btn-sm btn-neutral"
          >
            Contact me
          </a>
        </div>
      </div>
    </article>
  );
}
