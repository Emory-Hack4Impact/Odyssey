import EmployeeCard from "./EmployeeCard";
import type { DirectoryEmployee } from "../types";

export default function ResultsGrid({
  employees,
  activeCard,
  isLoading,
  error,
  setActiveCard,
}: {
  employees: DirectoryEmployee[];
  activeCard: string;
  setActiveCard: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <div className="flex flex-col gap-8 px-4 py-8">
      <div>
        <h2 className="text-2xl font-bold text-base-content">Results:</h2>
      </div>
      <div className="flex flex-wrap gap-6 max-[1088px]:flex-col">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="card card-side h-48 w-xl overflow-hidden border border-base-content/5 bg-base-100 shadow-xl max-[1088px]:w-full"
              >
                <div className="h-full w-48 shrink-0 skeleton" />
                <div className="card-body w-2/3 gap-3">
                  <div className="space-y-2">
                    <div className="h-6 w-40 skeleton" />
                    <div className="h-4 w-28 skeleton" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full skeleton" />
                    <div className="h-3 w-5/6 skeleton" />
                    <div className="h-3 w-2/3 skeleton" />
                  </div>
                  <div className="mt-auto flex justify-end">
                    <div className="h-8 w-24 skeleton" />
                  </div>
                </div>
              </div>
            ))
          : employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                isActive={employee.id === activeCard}
                onSelect={() => setActiveCard(employee.id)}
              />
            ))}
        {!isLoading && !error && employees.length === 0 && <p>No employees found.</p>}
        {!isLoading && error && <p className="text-error">{error}</p>}
      </div>
    </div>
  );
}
