import SearchTile from "./SearchTile";
import ProfileTile from "./ProfileTile";
import type { DirectoryEmployee, DirectoryFilterOptions, DirectoryFilters } from "../types";

export default function SidePanel({
  currentUserId,
  selectedEmployee,
  onSaveEmployee,
  search,
  setSearch,
  filters,
  setFilters,
  filterOptions,
}: {
  currentUserId: string;
  selectedEmployee: DirectoryEmployee | null;
  onSaveEmployee: (employee: DirectoryEmployee) => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filters: DirectoryFilters;
  setFilters: React.Dispatch<React.SetStateAction<DirectoryFilters>>;
  filterOptions: DirectoryFilterOptions;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SearchTile
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
      />
      <ProfileTile
        currentUserId={currentUserId}
        selectedEmployee={selectedEmployee}
        onSaveEmployee={onSaveEmployee}
      />
    </div>
  );
}
