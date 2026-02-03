import SidePanel from "./side-panel/SidePanel";
import ResultsGrid from "./results-grid/ResultsGrid";

interface EmployeeDirectoryProps {
  userId: string;
  username: string;
  userRole: string;
  userMetadata: {
    is_admin: boolean;
    is_hr: boolean;
    position: string;
  } | null;
}

export const EmployeeDirectory = ({
  userId,
  username,
  userRole,
  userMetadata,
}: EmployeeDirectoryProps) => {
  return (
    <div className="m-12 flex min-h-screen w-auto flex-col items-start px-4">
      <div className="flex w-full gap-8">
        <div className="max-w-80 flex-1">
          <SidePanel />
        </div>

        <div className="flex-1">
          <ResultsGrid />
        </div>
      </div>
    </div>
  );
};
