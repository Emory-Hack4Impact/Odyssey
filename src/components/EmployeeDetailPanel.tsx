"use client";
import React from "react";
import { Employee, fullName } from "../types/employee";

type Props = {
  employee?: Employee | null;
};

export default function EmployeeDetailPanel({ employee }: Props) {
  if (!employee) {
    return (
      <aside className="w-96 rounded-r-md bg-gray-50 p-6">
        <div className="mb-4 h-40 w-full rounded bg-gray-200" />
        <div className="mb-2 h-6 w-3/4 bg-gray-200" />
        <div className="mb-6 h-4 w-1/2 bg-gray-200" />
        <div className="space-y-6">
          <div className="h-6 rounded bg-gray-100" />
          <div className="h-6 rounded bg-gray-100" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-96 rounded-r-md bg-gray-50 p-6">
      <div className="flex items-center gap-4">
        <div className="h-28 w-28 rounded bg-gray-300" />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{fullName(employee)}</h2>
          <p className="text-sm text-gray-500">{employee.position || employee.role || "Role"}</p>
          <div className="mt-2 flex gap-2">
            {employee.availability && (
              <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                {employee.availability}
              </span>
            )}
            {employee.birthday && (
              <span className="rounded bg-gray-100 px-2 py-1 text-xs">
                Birthday: {employee.birthday}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700">Contact Info</h4>
        <div className="mt-2 space-y-1 text-xs text-gray-500">
          <div>Work Number: {employee.contact?.workNumber || ""}</div>
          <div>Mobile: {employee.contact?.mobile || ""}</div>
          <div>Email: {employee.contact?.email || ""}</div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700">Work Info</h4>
        <div className="mt-2 space-y-1 text-xs text-gray-500">
          <div>Department: {employee.department || ""}</div>
          <div>Location: {employee.location || ""}</div>
          <div>ID: {employee.id}</div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700">Personal Info</h4>
        <div className="mt-2 space-y-1 text-xs text-gray-500">
          <div>Pronouns: —</div>
          <div>Hometown: —</div>
        </div>
      </div>
    </aside>
  );
}
