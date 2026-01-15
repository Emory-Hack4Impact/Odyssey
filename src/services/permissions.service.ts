/**
 * Permission service
 * Centralized permission checking logic
 */

import type { UserMetadata, Permission, UserRole } from "@/types";
import { PERMISSION_ROLES } from "@/types";

/**
 * Determines user role from metadata
 */
export function getUserRole(userMetadata: UserMetadata | null): UserRole {
  if (!userMetadata) return "employee";
  if (userMetadata.is_admin) return "admin";
  if (userMetadata.is_hr) return "hr";
  return "employee";
}

/**
 * Checks if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSION_ROLES[permission];
  return allowedRoles.includes(role);
}

/**
 * Checks if user metadata has a specific permission
 */
export function userHasPermission(
  userMetadata: UserMetadata | null,
  permission: Permission,
): boolean {
  const role = getUserRole(userMetadata);
  return hasPermission(role, permission);
}

/**
 * Check if user is admin
 */
export function isAdmin(userMetadata: UserMetadata | null): boolean {
  return userMetadata?.is_admin ?? false;
}

/**
 * Check if user is HR
 */
export function isHR(userMetadata: UserMetadata | null): boolean {
  return userMetadata?.is_hr ?? false;
}

/**
 * Check if user is admin or HR
 */
export function isAdminOrHR(userMetadata: UserMetadata | null): boolean {
  return isAdmin(userMetadata) || isHR(userMetadata);
}
