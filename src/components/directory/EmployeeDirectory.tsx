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
    <div className="m-12 flex min-h-screen w-auto flex-col items-start border-2 px-4">hey</div>
  );
};
