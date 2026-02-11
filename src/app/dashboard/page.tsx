"use client";
import React, { useMemo, useState } from "react";
import { Employee } from "../../types/employee";
import EmployeeDirectory from "../../components/EmployeeDirectory";
import EmployeeDetailPanel from "../../components/EmployeeDetailPanel";

const youEmployee: Employee = {
  id: "you",
  employeeFirstName: "You",
  employeeLastName: "",
  position: "Product Designer",
  department: "Design",
  role: "Senior Product Designer",
  location: "San Francisco",
  bio: "Designs user-centered experiences.",
  availability: "Available",
  birthday: "1992-03-22",
  contact: {
    email: "you@example.com",
    mobile: "+1 (415) 555-0134",
    workNumber: "(415) 555-0100",
  },
};

const sampleEmployees: Employee[] = [
  {
    id: "e1",
    employeeFirstName: "Alice",
    employeeLastName: "May",
    position: "Engineer",
    department: "Department A",
    role: "Software Engineer",
    location: "New York",
    bio: "Experienced frontend engineer.",
    availability: "Available",
    birthday: "1990-05-10",
    contact: { email: "alice@example.com" },
  },
  {
    id: "e2",
    employeeFirstName: "Bob",
    employeeLastName: "Jones",
    position: "Designer",
    department: "Department A",
    role: "Product Designer",
    location: "San Francisco",
    bio: "Designs delightful interfaces.",
    availability: "In a meeting",
    contact: { email: "bob@example.com" },
  },
  {
    id: "e3",
    employeeFirstName: "Carmen",
    employeeLastName: "Li",
    position: "Manager",
    department: "Department B",
    role: "People Manager",
    location: "London",
    bio: "Leads the growth team.",
    contact: { email: "carmen@example.com" },
  },
  {
    id: "e4",
    employeeFirstName: "David",
    employeeLastName: "Ng",
    position: "Engineer",
    department: "Department B",
    role: "Backend Engineer",
    location: "New York",
    bio: "API specialist.",
    contact: { email: "david@example.com" },
  },
  {
    id: "e5",
    employeeFirstName: "Elena",
    employeeLastName: "Garcia",
    position: "HR",
    department: "Department C",
    role: "HR Generalist",
    location: "Toronto",
    bio: "Supports hiring and culture.",
    contact: { email: "elena@example.com" },
  },
  {
    id: "e6",
    employeeFirstName: "Frank",
    employeeLastName: "O'Neil",
    position: "Support",
    department: "Department C",
    role: "Customer Support",
    location: "Remote",
    bio: "First-response support.",
    contact: { email: "frank@example.com" },
  },
];

export default function DashboardPage() {
  const [allEmployees] = useState<Employee[]>([youEmployee, ...sampleEmployees]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    department: [] as string[],
    role: [] as string[],
    location: [] as string[],
  });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(youEmployee);

  const filteredEmployees = useMemo(() => {
    return allEmployees.filter((e) => {
      // filters
      if (
        activeFilters.department.length &&
        !(e.department && activeFilters.department.includes(e.department))
      )
        return false;
      if (activeFilters.role.length && !(e.role && activeFilters.role.includes(e.role)))
        return false;
      if (
        activeFilters.location.length &&
        !(e.location && activeFilters.location.includes(e.location))
      )
        return false;

      // search
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      const matches = [e.employeeFirstName, e.employeeLastName, e.id].some((v) =>
        (v || "").toLowerCase().includes(q),
      );
      return matches;
    });
  }, [allEmployees, activeFilters, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-screen-2xl">
        <div className="flex-shrink-0">
          <EmployeeDetailPanel employee={selectedEmployee} />
        </div>
        <div className="flex-1" onClick={() => setSelectedEmployee(youEmployee)}>
          <EmployeeDirectory
            allEmployees={allEmployees}
            filteredEmployees={filteredEmployees}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            onSelect={(e) => setSelectedEmployee(e)}
          />
        </div>
      </div>
    </div>
  );
}
