import EmployeeCard from "./EmployeeCard";

export default function ResultsGrid() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
    </div>
  );
}
