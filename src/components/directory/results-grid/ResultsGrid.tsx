import EmployeeCard, { type EmployeeCardProps } from "./EmployeeCard";

const testEmployees: EmployeeCardProps[] = [
  {
    name: "John Doe",
    role: "Software Engineer",
    department: "Engineering",
    bio: "Full-stack engineer with 5 years experience.",
    email: "john@example.com",
    pfp: "/logo.png",
    online: true,
    vacation: false,
  },
  {
    name: "Sarah Chen",
    role: "Product Manager",
    department: "Product",
    bio: "Leadsull-stack engineer withull-stack engineer withull-stack engineer withull-stack engineer with pronning.",
    email: "sarah@example.com",
    pfp: "/logo.png",
    online: false,
    vacation: false,
  },
  {
    name: "Marcus Rivera",
    role: "UX Designer",
    department: "Design",
    bio: "Focuses on accessibility and user-centered design.",
    email: "marcus@example.com",
    pfp: "/logo.png",
    online: true,
    vacation: true,
  },
];

export default function ResultsGrid({
  search,
  setActiveCard,
}: {
  search: string;
  setActiveCard: React.Dispatch<React.SetStateAction<string>>;
}) {
  const filteredEmployees = testEmployees.filter((employee) => {
    const query = search.toLowerCase();

    return (
      employee.name.toLowerCase().includes(query) ||
      employee.department.toLowerCase().includes(query) ||
      employee.role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-8 px-4 py-8">
      <div>
        <h2 className="text-2xl font-bold text-base-content">Results:</h2>
      </div>
      <div className="flex flex-wrap gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.email}
            onClick={() => setActiveCard(employee.email)}
            className="cursor-pointer"
          >
            <EmployeeCard {...employee} />
          </div>
        ))}
        {filteredEmployees.length === 0 && <p>No employees found.</p>}
      </div>
    </div>
  );
}
