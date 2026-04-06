"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useActionTrail } from "@/tracking/ActionTrailContext";

export function NavigationTracker() {
  const pathname = usePathname();
  const { trackAction } = useActionTrail();
  const trackActionRef = useRef(trackAction);

  useEffect(() => {
    trackActionRef.current = trackAction;
  }, [trackAction]);

  useEffect(() => {
    trackActionRef.current(`navigation`, `navigated to ${pathname}`);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      console.log("click tracked", e.target);
      const target = e.target as HTMLElement;
      const meaningful = target.closest<HTMLElement>("button, a, [role='button'], [data-track]");
      const el = meaningful ?? target;

      const label =
        el.getAttribute("data-track") ??
        el.innerText?.trim().slice(0, 60) ??
        el.getAttribute("aria-label") ??
        el.tagName.toLowerCase();

      if (!label) return;
      trackActionRef.current("click", `clicked "${label}"`);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
