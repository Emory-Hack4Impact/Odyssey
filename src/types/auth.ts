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
