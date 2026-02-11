"use client";

import React from "react";

interface AuthGateProps {
  userId: string | null | undefined;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * AuthGate - Only renders children if user is authenticated
 *
 * Usage:
 * <AuthGate userId={userId} fallback={<LoginPrompt />}>
 *   <AuthenticatedContent />
 * </AuthGate>
 */
export function AuthGate({ userId, children, fallback = null }: AuthGateProps) {
  if (!userId) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
