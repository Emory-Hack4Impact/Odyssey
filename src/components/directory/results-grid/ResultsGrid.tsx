import EmployeeCard from "./EmployeeCard";

export default function ResultsGrid() {
  return (
    //add vertical margin
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
    </div>
  );
}
