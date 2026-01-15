/**
 * Hook for checking user permissions
 *
 * Usage:
 * const { isAdmin, isHR, can } = usePermissions(userMetadata);
 * if (can('manage_evaluations')) { ... }
 */

import type { UserMetadata, Permission, PermissionCheck, UserRole } from "@/types";
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
 * Hook to get permission checking utilities
 */
export function usePermissions(userMetadata: UserMetadata | null): PermissionCheck {
  const isAdmin = userMetadata?.is_admin ?? false;
  const isHR = userMetadata?.is_hr ?? false;
  const isEmployee = !isAdmin && !isHR;
  const role = getUserRole(userMetadata);

  const can = (permission: Permission): boolean => {
    return hasPermission(role, permission);
  };

  return {
    isAdmin,
    isHR,
    isEmployee,
    role,
    can,
  };
}
