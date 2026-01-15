/**
 * Permission and role types
 *
 * Role hierarchy:
 * - admin: Full access (is_admin: true)
 * - hr: HR management access (is_hr: true)
 * - employee: Standard employee access (is_admin: false, is_hr: false)
 */

export type UserRole = "admin" | "hr" | "employee";

export type Permission =
  | "manage_evaluations"
  | "submit_evaluation_for_others"
  | "view_all_evaluations"
  | "manage_documents"
  | "upload_documents"
  | "approve_time_off"
  | "view_all_time_off";

export interface PermissionCheck {
  isAdmin: boolean;
  isHR: boolean;
  isEmployee: boolean;
  role: UserRole;
  can: (permission: Permission) => boolean;
}

/**
 * Maps permissions to required roles
 */
export const PERMISSION_ROLES: Record<Permission, UserRole[]> = {
  manage_evaluations: ["admin", "hr"],
  submit_evaluation_for_others: ["admin", "hr"],
  view_all_evaluations: ["admin", "hr"],
  manage_documents: ["admin"],
  upload_documents: ["admin", "hr"],
  approve_time_off: ["admin", "hr"],
  view_all_time_off: ["admin", "hr"],
};
