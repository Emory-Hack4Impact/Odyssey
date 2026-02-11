"use client";
import React from "react";
import { Employee, fullName } from "../types/employee";

type Props = {
  employee: Employee;
  onSelect: (e: Employee) => void;
};

export default function EmployeeCard({ employee, onSelect }: Props) {
  return (
    <div
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onSelect(employee);
      }}
      className="flex cursor-pointer items-start gap-4 rounded-md bg-gray-100 p-4 hover:shadow"
    >
      <div className="h-20 w-20 flex-none rounded-sm bg-gray-300" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">
            {fullName(employee) || "First Last"}
          </h3>
        </div>

        <p className="mt-1 text-xs text-gray-500">
          {employee.department || "Department"} {employee.role ? `| ${employee.role}` : ""}
        </p>
        <p className="mt-2 line-clamp-3 text-xs text-gray-600">
          {employee.bio ||
            "Longer bio description as this is a desktop component and more can fit on the screen."}
        </p>
        <div className="mt-3 flex gap-2">
          <div className="h-6 w-6 bg-gray-300" />
          <div className="h-6 w-6 bg-gray-300" />
          <div className="h-6 w-6 bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
