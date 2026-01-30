import EmployeeCard from "./EmployeeCard";

export default function ResultsGrid() {
  return (
    //add vertical margin
    <div className="md:grid md:grid-cols-2 gap-6">
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
    </div>
  );
}
