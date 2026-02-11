export interface EmployeeContact {
  workNumber?: string;
  mobile?: string;
  email?: string;
}

export interface EmployeeFile {
  id?: string;
  path?: string;
  bucket?: string;
  avatarUrl?: string;
}

export interface Employee {
  id: string;
  employeeFirstName?: string;
  employeeLastName?: string;
  position?: string;
  // UI fields (optional, injectable later)
  department?: string;
  role?: string;
  location?: string;
  bio?: string;
  availability?: string;
  birthday?: string;
  contact?: EmployeeContact;
  files?: EmployeeFile[];
}

export const fullName = (e: Employee) =>
  `${e.employeeFirstName || ""} ${e.employeeLastName || ""}`.trim();
