"use client";

import SidePanel from "./side-panel/SidePanel";
import ResultsGrid from "./results-grid/ResultsGrid";
import { useMemo, useState } from "react";
import type { DirectoryEmployee, DirectoryFilterOptions, DirectoryFilters } from "./types";

interface EmployeeDirectoryProps {
  userId: string;
  username: string;
  userRole: string;
  userMetadata: {
    is_admin: boolean;
    is_hr: boolean;
    position: string;
    employeeFirstName: string | null;
    employeeLastName: string | null;
  } | null;
}

const SAMPLE_EMPLOYEES: DirectoryEmployee[] = [
  {
    id: "e-1001",
    email: "sarah.chen@odyssey.org",
    firstName: "Sarah",
    lastName: "Chen",
    position: "Product Manager",
    department: "Product",
    role: "Product Manager",
    location: "Atlanta",
    bio: "Leads roadmap planning and cross-functional delivery for the recruiting platform.",
    mobile: "(404) 555-0192",
    workNumber: "(404) 555-0131",
    birthday: "1991-09-14",
    avatarUrl: "",
    online: true,
    away: false,
  },
  {
    id: "e-1002",
    email: "marcus.rivera@odyssey.org",
    firstName: "Marcus",
    lastName: "Rivera",
    position: "UX Designer",
    department: "Design",
    role: "Senior Designer",
    location: "Remote",
    bio: "Designs and tests employee-facing workflows, with a focus on accessibility.",
    mobile: "(917) 555-0118",
    workNumber: "(917) 555-0107",
    birthday: "1993-02-03",
    avatarUrl: "",
    online: false,
    away: true,
  },
  {
    id: "e-1003",
    email: "elena.garcia@odyssey.org",
    firstName: "Elena",
    lastName: "Garcia",
    position: "HR Generalist",
    department: "People",
    role: "HR Generalist",
    location: "New York",
    bio: "Supports onboarding, policy education, and employee engagement programs.",
    mobile: "(646) 555-0141",
    workNumber: "(646) 555-0185",
    birthday: "1990-11-28",
    avatarUrl: "",
    online: true,
    away: false,
  },
  {
    id: "e-1004",
    email: "david.ng@odyssey.org",
    firstName: "David",
    lastName: "Ng",
    position: "Backend Engineer",
    department: "Engineering",
    role: "Backend Engineer",
    location: "San Francisco",
    bio: "Builds APIs and data integrations for internal HR systems.",
    mobile: "(415) 555-0162",
    workNumber: "(415) 555-0124",
    birthday: "1989-05-20",
    avatarUrl: "",
    online: true,
    away: false,
  },
];

function createCurrentUserEmployee({
  userId,
  username,
  userRole,
  userMetadata,
}: EmployeeDirectoryProps): DirectoryEmployee {
  const email = username.includes("@") ? username : `${userId}@odyssey.org`;
  const emailPrefix = email.split("@")[0] ?? "you";
  const fallbackFirstName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

  return {
    id: userId,
    email,
    firstName: userMetadata?.employeeFirstName ?? fallbackFirstName,
    lastName: userMetadata?.employeeLastName ?? "",
    position: userMetadata?.position ?? userRole,
    department: "People",
    role: userRole,
    location: "Atlanta",
    bio: "This is your profile. Switch to edit mode to update your information.",
    mobile: "",
    workNumber: "",
    birthday: "",
    avatarUrl: "",
    online: true,
    away: false,
  };
}

export const EmployeeDirectory = ({
  userId,
  username,
  userRole,
  userMetadata,
}: EmployeeDirectoryProps) => {
  const [employees, setEmployees] = useState<DirectoryEmployee[]>(() => [
    createCurrentUserEmployee({ userId, username, userRole, userMetadata }),
    ...SAMPLE_EMPLOYEES,
  ]);
  const [search, setSearch] = useState("");
  const [activeCard, setActiveCard] = useState(userId);
  const [filters, setFilters] = useState<DirectoryFilters>({
    department: "all",
    role: "all",
    location: "all",
  });

  const filterOptions = useMemo<DirectoryFilterOptions>(() => {
    const departments = Array.from(
      new Set(employees.map((employee) => employee.department)),
    ).sort();
    const roles = Array.from(new Set(employees.map((employee) => employee.role))).sort();
    const locations = Array.from(new Set(employees.map((employee) => employee.location))).sort();

    return { departments, roles, locations };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      if (filters.department !== "all" && employee.department !== filters.department) {
        return false;
      }

      if (filters.role !== "all" && employee.role !== filters.role) {
        return false;
      }

      if (filters.location !== "all" && employee.location !== filters.location) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.id,
        employee.department,
        employee.role,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [employees, filters.department, filters.location, filters.role, search]);

  const selectedEmployee = useMemo(() => {
    return employees.find((employee) => employee.id === activeCard) ?? employees[0] ?? null;
  }, [activeCard, employees]);

  const handleEmployeeSave = (updatedEmployee: DirectoryEmployee) => {
    setEmployees((prev) =>
      prev.map((employee) => (employee.id === updatedEmployee.id ? updatedEmployee : employee)),
    );
  };

  const handleResultsBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setActiveCard(userId);
    }
  };

  return (
    <div className="m-12 flex min-h-screen w-auto flex-col items-start px-4">
      <div className="flex w-full gap-8 max-[1088px]:flex-col">
        <div className="flex-1 min-[1088px]:max-w-96">
          <SidePanel
            currentUserId={userId}
            selectedEmployee={selectedEmployee}
            onSaveEmployee={handleEmployeeSave}
            search={search}
            setSearch={setSearch}
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
          />
        </div>

        <div className="flex-1" onClick={handleResultsBackgroundClick}>
          <ResultsGrid
            employees={filteredEmployees}
            activeCard={activeCard}
            setActiveCard={setActiveCard}
          />
        </div>
      </div>
    </div>
  );
};
