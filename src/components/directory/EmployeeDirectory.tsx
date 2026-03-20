"use client";

import SidePanel from "./side-panel/SidePanel";
import ResultsGrid from "./results-grid/ResultsGrid";
import { useMemo, useState, useEffect } from "react";
import type { DirectoryEmployee, DirectoryFilterOptions, DirectoryFilters } from "./types";

// describes what the EmployeeDirectory React component receives from its parent
interface EmployeeDirectoryProps {
  id: string;
}

// shape of backend response data from /api/directory
interface DirectoryApiEmployee {
  id: string;
  email: string;
  department: string;
  role: string;
  bio: string;
  mobile: string;
  workNumber: string;
  birthday: string;
  avatarUrl: string;
  online: boolean;
  away: boolean;
  location: string;
  is_admin: boolean;
  is_hr: boolean;
  position: string;
  employeeFirstName: string;
  employeeLastName: string;
}

interface DirectoryApiResponse {
  employees: DirectoryApiEmployee[];
}

// NOTE: core React component for Directory page
export const EmployeeDirectory = ({
  // NOTE: 4 args fetched from src/app/dashboard/directory/page.tsx, from query findUnique
  id,
}: EmployeeDirectoryProps) => {
  // NOTE: now fetch real employees from backend
  const [employees, setEmployees] = useState<DirectoryEmployee[]>([]);

  // for search box
  const [search, setSearch] = useState("");
  // store selected employee card ID
  const [activeCard, setActiveCard] = useState(id);
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
          email: employee.email,
          firstName: employee.employeeFirstName ?? "",
          lastName: employee.employeeLastName ?? "",
          position: employee.position ?? "",
          department: employee.department ?? "",
          role: employee.role ?? "",
          location: employee.location ?? "",
          bio: employee.bio ?? "",
          mobile: employee.mobile ?? "",
          workNumber: employee.workNumber ?? "",
          birthday: employee.birthday ?? "",
          avatarUrl: employee.avatarUrl ?? "",
          online: employee.online ?? false,
          away: employee.away ?? false,
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
      setActiveCard(id);
    }
  };

  // renders UI layout
  return (
    <div className="m-12 flex min-h-screen w-auto flex-col items-start px-4">
      <div className="flex w-full gap-8 max-[1088px]:flex-col">
        <div className="flex-1 min-[1088px]:max-w-96">
          <SidePanel
            currentUserId={id}
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
