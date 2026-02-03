"use client";

import SidePanel from "./side-panel/SidePanel";
import ResultsGrid from "./results-grid/ResultsGrid";
import { useState } from "react";

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
  const [search, setSearch] = useState("");
  const [activeCard, setActiveCard] = useState(userId);

  return (
    <div className="m-12 flex min-h-screen w-auto flex-col items-start px-4">
      <div className="flex w-full gap-8 max-[1183px]:flex-col">
        <div className="flex-1 min-[1183px]:max-w-80">
          <SidePanel setSearch={setSearch} />
        </div>

        <div className="flex-1">
          <ResultsGrid search={search} />
        </div>
      </div>
    </div>
  );
};
