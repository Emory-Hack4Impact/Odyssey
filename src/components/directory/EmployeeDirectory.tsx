"use client";

import SidePanel from "./side-panel/SidePanel";
import ResultsGrid from "./results-grid/ResultsGrid";
import { useMemo, useState, useEffect } from "react";
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

// for fetching employee data from backend
interface EmployeeData {
  id: string;
  employeeFirstName: string;
  employeeLastName: string;
  position: string;
}
interface DirectoryApiResponse {
  employees: EmployeeData[];
}

// NOTE: hardcoded users
// const SAMPLE_EMPLOYEES: DirectoryEmployee[] = [
//   {
//     id: "e-1001",
//     email: "sarah.chen@odyssey.org",
//     firstName: "Sarah",
//     lastName: "Chen",
//     position: "Product Manager",
//     department: "Product",
//     role: "Product Manager",
//     location: "Atlanta",
//     bio: "Leads roadmap planning and cross-functional delivery for the recruiting platform.",
//     mobile: "(404) 555-0192",
//     workNumber: "(404) 555-0131",
//     birthday: "1991-09-14",
//     avatarUrl: "",
//     online: true,
//     away: false,
//   },
//   {
//     id: "e-1002",
//     email: "marcus.rivera@odyssey.org",
//     firstName: "Marcus",
//     lastName: "Rivera",
//     position: "UX Designer",
//     department: "Design",
//     role: "Senior Designer",
//     location: "Remote",
//     bio: "Designs and tests employee-facing workflows, with a focus on accessibility.",
//     mobile: "(917) 555-0118",
//     workNumber: "(917) 555-0107",
//     birthday: "1993-02-03",
//     avatarUrl: "",
//     online: false,
//     away: true,
//   },
//   {
//     id: "e-1003",
//     email: "elena.garcia@odyssey.org",
//     firstName: "Elena",
//     lastName: "Garcia",
//     position: "HR Generalist",
//     department: "People",
//     role: "HR Generalist",
//     location: "New York",
//     bio: "Supports onboarding, policy education, and employee engagement programs.",
//     mobile: "(646) 555-0141",
//     workNumber: "(646) 555-0185",
//     birthday: "1990-11-28",
//     avatarUrl: "",
//     online: true,
//     away: false,
//   },
//   {
//     id: "e-1004",
//     email: "david.ng@odyssey.org",
//     firstName: "David",
//     lastName: "Ng",
//     position: "Backend Engineer",
//     department: "Engineering",
//     role: "Backend Engineer",
//     location: "San Francisco",
//     bio: "Builds APIs and data integrations for internal HR systems.",
//     mobile: "(415) 555-0162",
//     workNumber: "(415) 555-0124",
//     birthday: "1989-05-20",
//     avatarUrl: "",
//     online: true,
//     away: false,
//   },
// ];

// NOTE: builds current user object
// function createCurrentUserEmployee({
//   userId,
//   username,
//   userRole,
//   userMetadata,
// }: EmployeeDirectoryProps): DirectoryEmployee {
//   const email = username.includes("@") ? username : `${userId}@odyssey.org`;
//   const emailPrefix = email.split("@")[0] ?? "you";
//   const fallbackFirstName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

//   return {
//     id: userId,
//     email,
//     firstName: userMetadata?.employeeFirstName ?? fallbackFirstName,
//     lastName: userMetadata?.employeeLastName ?? "",
//     position: userMetadata?.position ?? userRole,
//     department: "People",
//     role: userRole,
//     location: "Atlanta",
//     bio: "This is your profile. Switch to edit mode to update your information.",
//     mobile: "",
//     workNumber: "",
//     birthday: "",
//     avatarUrl: "",
//     online: true,
//     away: false,
//   };
// }

// NOTE: core React component for Directory page
export const EmployeeDirectory = ({
  // NOTE: 4 args fetched from src/app/dashboard/directory/page.tsx, from query findUnique
  userId,
  // unused vars for now:
  username,
  userRole,
  userMetadata,
}: EmployeeDirectoryProps) => {
  // NOTE: now fetch real employees from backend
  const [employees, setEmployees] = useState<DirectoryEmployee[]>([]);

  // for search box
  const [search, setSearch] = useState("");
  // store selected employee card ID
  const [activeCard, setActiveCard] = useState(userId);
  // stores currently selected filter values
  const [filters, setFilters] = useState<DirectoryFilters>({
    department: "all",
    role: "all",
    location: "all",
  });

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/directory");

        if (!res.ok) {
          throw new Error("Failed to fetch employees");
        }

        const data: DirectoryApiResponse = await res.json();

        const mappedEmployees: DirectoryEmployee[] = data.employees.map((employee) => ({
          id: employee.id,
          email: `${employee.id}@odyssey.org`,
          firstName: employee.employeeFirstName ?? "",
          lastName: employee.employeeLastName ?? "",
          position: employee.position ?? "",
          department: "",
          role: employee.position ?? "",
          location: "",
          bio: "",
          mobile: "",
          workNumber: "",
          birthday: "",
          avatarUrl: "",
          online: false,
          away: false,
        }));
        setEmployees(mappedEmployees);
      } catch (error) {
        console.error("Failed to fetch directory employees:", error);
      }
    }

    void fetchEmployees();
  }, []);

  // computes available filter dropdown choices from the employee list
  // only update when `employees` changes
  const filterOptions = useMemo<DirectoryFilterOptions>(() => {
    const departments = Array.from(
      new Set(employees.map((employee) => employee.department)),
    ).sort();
    const roles = Array.from(new Set(employees.map((employee) => employee.role))).sort();
    const locations = Array.from(new Set(employees.map((employee) => employee.location))).sort();

    return { departments, roles, locations };
  }, [employees]);

  // creates final list after search & filter
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

  // find the full employee object for the currently selected card
  const selectedEmployee = useMemo(() => {
    return employees.find((employee) => employee.id === activeCard) ?? employees[0] ?? null;
  }, [activeCard, employees]);

  // updates employee list in local state when a profile is edited
  const handleEmployeeSave = (updatedEmployee: DirectoryEmployee) => {
    setEmployees((prev) =>
      prev.map((employee) => (employee.id === updatedEmployee.id ? updatedEmployee : employee)),
    );
  };

  // resets selected card back to current user IF user clicks empty background areas INSTEAD OF cards
  const handleResultsBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setActiveCard(userId);
    }
  };

  // renders UI layout
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
