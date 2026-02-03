import EmployeeCard, { type EmployeeCardProps } from "./EmployeeCard";

const testEmployee: EmployeeCardProps = {
  name: "John Doe",
  role: "Software Engineer",
  department: "Engineering",
  bio: "John is a full-stack engineer with 5 years of experience building scalable web applications.",
  email: "john.doe@example.com",
  pfp: "/logo.png", // must be a valid path in your /public folder
  online: true,
  vacation: false,
};

export default function ResultsGrid({
  search,
  setActiveCard,
}: {
  search: string;
  setActiveCard: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-col gap-8 px-4 py-8">
      <div>
        <h2 className="text-2xl font-bold text-base-content">Results:</h2>
      </div>
      <div className="flex flex-wrap gap-6">
        <EmployeeCard {...testEmployee} />
        <EmployeeCard {...testEmployee} />
        <EmployeeCard {...testEmployee} />
        <EmployeeCard {...testEmployee} />
        <EmployeeCard {...testEmployee} />
        <EmployeeCard {...testEmployee} />
        <EmployeeCard {...testEmployee} />
        <EmployeeCard {...testEmployee} />
      </div>
    </div>
  );
}
