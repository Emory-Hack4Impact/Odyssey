export interface DirectoryEmployee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  role: string;
  location: string;
  bio: string;
  mobile: string;
  workNumber: string;
  birthday: string;
  avatarUrl: string;
  online: boolean;
  away: boolean;
}

export interface DirectoryFilters {
  department: string;
  role: string;
  location: string;
}

export interface DirectoryFilterOptions {
  departments: string[];
  roles: string[];
  locations: string[];
}

export function getEmployeeName(employee: DirectoryEmployee): string {
  const first = employee.firstName.trim();
  const last = employee.lastName.trim();
  return `${first} ${last}`.trim();
}
