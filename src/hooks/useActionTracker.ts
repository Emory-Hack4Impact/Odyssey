import { useRef, useCallback } from "react";

const MAX_TRAIL = 20;

export type ActionType = "navigation" | "click" | "form" | "modal" | "filter" | "button";

export interface ActionEntry {
  type: ActionType;
  description: string;
  timestamp: string;
}

export function useActionTracker() {
  const trailRef = useRef<ActionEntry[]>([]);

  const trackAction = useCallback((type: ActionType, description: string) => {
    const entry: ActionEntry = {
      type,
      description,
      timestamp: new Date().toISOString(),
    };
    trailRef.current = [...trailRef.current, entry].slice(-MAX_TRAIL);
  }, []);

  const getTrail = useCallback((): ActionEntry[] => {
    return [...trailRef.current];
  }, []);

  const clearTrail = useCallback((): void => {
    trailRef.current = [];
  }, []);

  return { trackAction, getTrail, clearTrail };
}
