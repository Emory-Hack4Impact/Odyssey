"use client";

import React from "react";
import type { UserMetadata } from "@/types";

interface AdminGateProps {
  userMetadata: UserMetadata | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * AdminGate - Only renders children if user is an admin
 *
 * Usage:
 * <AdminGate userMetadata={userMetadata} fallback={<EmployeeView />}>
 *   <AdminView />
 * </AdminGate>
 */
export function AdminGate({ userMetadata, children, fallback = null }: AdminGateProps) {
  const isAdmin = userMetadata?.is_admin ?? false;

  if (!isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
