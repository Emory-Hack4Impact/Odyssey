"use client";

import React from "react";
import Image from "next/image";

interface EmployeeCardProps {
  name?: string;
  role?: string;
  department?: string;
  bio?: string;
  email?: string;
  pfp?: string;
  online?: boolean;
  vacation?: boolean;
}

export default function EmployeeCard({
  name = "First Last",
  role = "Role",
  department = "Department",
  bio = "Longer bio description as this is a desktop component and more can fit on the screen.",
  email = "user1@example.com",
  pfp,
  online = true,
  vacation = true,
}: EmployeeCardProps) {
  return (
    <div className="card card-side h-48 max-w-2xl overflow-hidden border border-base-content/5 bg-base-100 shadow-xl">
      {/* Profile Picture & Status Section */}
      <figure className="relative w-48 shrink-0 bg-base-200">
        {pfp ? (
          <Image src={pfp} alt={name} className="h-full w-full object-cover" fill sizes="192px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-base-300">
            <span className="text-4xl font-bold text-base-content/20">{name.charAt(0)}</span>
          </div>
        )}

        {/* Availability Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {online && (
            <span className="badge p-1.5 badge-xs shadow-sm badge-success" title="Online" />
          )}
          {vacation && (
            <span className="badge badge-outline bg-base-100 badge-sm font-bold tracking-tighter uppercase badge-info">
              Away
            </span>
          )}
        </div>
      </figure>

      {/* Content Section */}
      <div className="card-body w-2/3 gap-1">
        <div>
          <h2 className="card-title text-2xl font-semibold text-base-content">{name}</h2>
          <p className="text-xs font-semibold tracking-wide text-base-content/70 uppercase">
            {department} <span className="mx-1 opacity-30">|</span> {role}
          </p>
        </div>

        <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-base-content/80">{bio}</p>

        <div className="mt-auto card-actions justify-end">
          <a
            href={`mailto:${email}`}
            className="btn border-none font-medium normal-case shadow-md btn-sm btn-neutral"
          >
            Contact me
          </a>
        </div>
      </div>
    </div>
  );
}
