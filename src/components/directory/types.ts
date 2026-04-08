export interface DirectoryEmployee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  jobTitle: string;
  location: string;
  bio: string;
  mobile: string;
  workNumber: string;
  birthday: string;
  avatarUrl: string;
}

export interface DirectoryFilters {
  department: string;
  jobTitle: string;
  location: string;
}

export interface DirectoryFilterOptions {
  departments: string[];
  jobTitles: string[];
  locations: string[];
}

export interface DirectoryApiEmployee {
  id: string;
  email: string;
  department: string;
  jobTitle: string;
  bio: string;
  mobile: string;
  workNumber: string;
  birthday: string;
  avatarUrl: string;
  location: string;
  position: string;
  employeeFirstName: string;
  employeeLastName: string;
}

export function getEmployeeName(employee: DirectoryEmployee): string {
  const first = employee.firstName.trim();
  const last = employee.lastName.trim();
  return `${first} ${last}`.trim();
}
