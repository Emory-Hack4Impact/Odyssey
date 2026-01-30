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
      <div className="flex w-full justify-between border-2">
        <div>hey</div>
        <div>hey</div>
      </div>
    </div>
  );
};
