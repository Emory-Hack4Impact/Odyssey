"use client";

import { createContext, useContext } from "react";
import { useActionTracker } from "@/hooks/useActionTracker";
import type { ActionType, ActionEntry } from "@/hooks/useActionTracker";

interface ActionTrailContextValue {
  trackAction: (type: ActionType, description: string) => void;
  getTrail: () => ActionEntry[];
  clearTrail: () => void;
}

const ActionTrailContext = createContext<ActionTrailContextValue | null>(null);

export function ActionTrailProvider({ children }: { children: React.ReactNode }) {
  const tracker = useActionTracker();
  return <ActionTrailContext.Provider value={tracker}>{children}</ActionTrailContext.Provider>;
}

export function useActionTrail(): ActionTrailContextValue {
  const ctx = useContext(ActionTrailContext);
  if (!ctx) throw new Error("useActionTrail must be used inside <ActionTrailProvider>");
  return ctx;
}
