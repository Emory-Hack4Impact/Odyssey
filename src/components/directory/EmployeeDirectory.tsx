"use client";

import SidePanel from "./side-panel/SidePanel";
import ResultsGrid from "./results-grid/ResultsGrid";
import { useMemo, useState, useEffect } from "react";
import type { DirectoryEmployee, DirectoryFilterOptions, DirectoryFilters } from "./types";

interface EmployeeDirectoryProps {
  id: string;
  isAdmin: boolean;
}

interface DirectoryApiEmployee {
  id: string;
  email: string;
  department: string;
  jobTitle: string;
  bio: string;
  mobile: string;
  workNumber: string;
  birthday: string;
  avatarUrl: string;
  location: string;
  position: string;
  employeeFirstName: string;
  employeeLastName: string;
}

interface DirectoryApiResponse {
  employees: DirectoryApiEmployee[];
}

export const EmployeeDirectory = ({ id, isAdmin }: EmployeeDirectoryProps) => {
  const [employees, setEmployees] = useState<DirectoryEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeCard, setActiveCard] = useState(id);
  const [filters, setFilters] = useState<DirectoryFilters>({
    department: "all",
    jobTitle: "all",
    location: "all",
  });

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/directory");

        if (!res.ok) {
          throw new Error("Failed to fetch employees");
        }

        const data: DirectoryApiResponse = await res.json();

        const mappedEmployees: DirectoryEmployee[] = data.employees.map((employee) => ({
          id: employee.id,
          email: employee.email ?? "",
          firstName: employee.employeeFirstName ?? "",
          lastName: employee.employeeLastName ?? "",
          position: employee.position ?? "",
          department: employee.department ?? "",
          jobTitle: employee.jobTitle ?? "",
          location: employee.location ?? "",
          bio: employee.bio ?? "",
          mobile: employee.mobile ?? "",
          workNumber: employee.workNumber ?? "",
          birthday: employee.birthday ?? "",
          avatarUrl: employee.avatarUrl ?? "",
        }));
        setEmployees(mappedEmployees);
      } catch (err) {
        console.error("Failed to fetch directory employees:", err);
        setError("Unable to load the employee directory. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    void fetchEmployees();
  }, []);

  const filterOptions = useMemo<DirectoryFilterOptions>(() => {
    const departments = Array.from(
      new Set(employees.map((employee) => employee.department)),
    ).sort();
    const jobTitles = Array.from(new Set(employees.map((employee) => employee.jobTitle))).sort();
    const locations = Array.from(new Set(employees.map((employee) => employee.location))).sort();

    return { departments, jobTitles, locations };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      if (filters.department !== "all" && employee.department !== filters.department) {
        return false;
      }

      if (filters.jobTitle !== "all" && employee.jobTitle !== filters.jobTitle) {
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
        employee.jobTitle,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [employees, filters.department, filters.location, filters.jobTitle, search]);

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
      setActiveCard(id);
    }
  };

  return (
    <div className="m-12 flex min-h-screen w-auto flex-col items-start px-4">
      <div className="flex w-full gap-8 max-[1088px]:flex-col">
        <div className="flex-1 min-[1088px]:max-w-96">
          <SidePanel
            currentUserId={id}
            isAdmin={isAdmin}
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
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};
