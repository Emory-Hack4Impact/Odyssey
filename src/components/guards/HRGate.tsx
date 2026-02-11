"use client";

import React from "react";
import type { UserMetadata } from "@/types";

interface HRGateProps {
  userMetadata: UserMetadata | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * HRGate - Only renders children if user is HR or admin
 *
 * Usage:
 * <HRGate userMetadata={userMetadata} fallback={<EmployeeView />}>
 *   <HRView />
 * </HRGate>
 */
export function HRGate({ userMetadata, children, fallback = null }: HRGateProps) {
  const isHR = userMetadata?.is_hr ?? false;
  const isAdmin = userMetadata?.is_admin ?? false;

  if (!isHR && !isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
