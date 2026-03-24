/**
 * User authentication and metadata types
 */

export interface UserMetadata {
  id: string;
  is_admin: boolean;
  is_hr: boolean;
  position: string;
  employeeFirstName: string | null;
  employeeLastName: string | null;
  department: string;
  jobTitle: string;
  bio: string;
  mobile: string;
  workNumber: string;
  birthday: string | null;
  avatarUrl: string;
  location: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface Session {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
