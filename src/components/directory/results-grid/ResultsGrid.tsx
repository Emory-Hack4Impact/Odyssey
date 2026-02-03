import EmployeeCard from "./EmployeeCard";

export default function ResultsGrid() {
  return (
    <div className="flex flex-col gap-8 px-4 py-8 max-[1055px]:items-center">
      <div>
        <h2 className="text-2xl font-bold text-base-content">Results:</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 min-[1600px]:grid-cols-2">
        <EmployeeCard />
        <EmployeeCard />
        <EmployeeCard />
        <EmployeeCard />
        <EmployeeCard />
        <EmployeeCard />
      </div>
    </div>
  );
}
