import EmployeeCard from "./EmployeeCard";
import type { DirectoryEmployee } from "../types";

export default function ResultsGrid({
  employees,
  activeCard,
  setActiveCard,
}: {
  employees: DirectoryEmployee[];
  activeCard: string;
  setActiveCard: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-col gap-8 px-4 py-8">
      <div>
        <h2 className="text-2xl font-bold text-base-content">Results:</h2>
      </div>
      <div className="flex flex-wrap gap-6 max-[1088px]:flex-col">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            isActive={employee.id === activeCard}
            onSelect={() => setActiveCard(employee.id)}
          />
        ))}
        {employees.length === 0 && <p>No employees found.</p>}
      </div>
    </div>
  );
}
