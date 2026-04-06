"use client";

import { useEffect, useState } from "react";
import { useActionTrail } from "@/tracking/ActionTrailContext";
import type { ActionType, ActionEntry } from "@/hooks/useActionTracker";

const TYPE_COLORS: Record<ActionType | "default", string> = {
  navigation: "#3b82f6",
  click: "#10b981",
  form: "#f59e0b",
  modal: "#8b5cf6",
  filter: "#ec4899",
  default: "#6b7280",
  button: "#ef4444",
};

export function ActionTrailDebug({ refreshInterval = 500 }: { refreshInterval?: number }) {
  const { getTrail, clearTrail } = useActionTrail();
  const [open, setOpen] = useState(true);
  const [trail, setTrail] = useState<ActionEntry[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setTrail(getTrail());
    }, refreshInterval);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9999,
        fontFamily: "monospace",
        fontSize: 11,
        width: 300,
        borderRadius: 8,
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        background: "#0f172a",
        color: "#e2e8f0",
        overflow: "hidden",
        border: "1px solid #1e293b",
      }}
    >
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px",
          background: "#1e293b",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span> action trail</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span
            style={{
              background: "#334155",
              borderRadius: 4,
              padding: "1px 6px",
              fontSize: 10,
              color: "#94a3b8",
            }}
          >
            {trail.length} / 5
          </span>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              fontSize: 10,
              padding: "2px 6px",
              borderRadius: 4,
            }}
            onClick={(e) => {
              e.stopPropagation();
              clearTrail();
              setTrail([]);
            }}
          >
            clear
          </button>
          <span style={{ color: "#475569" }}>{open ? "▾" : "▸"}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: "6px 0" }}>
          {trail.length === 0 ? (
            <div style={{ padding: "10px 12px", color: "#475569" }}>No actions yet.</div>
          ) : (
            [...trail].reverse().map((entry, i) => {
              const color = TYPE_COLORS[entry.type] ?? TYPE_COLORS.default;
              const time = new Date(entry.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
              return (
                <div
                  key={i}
                  style={{
                    padding: "5px 12px",
                    borderBottom: i < trail.length - 1 ? "1px solid #1e293b" : "none",
                    opacity: i === 0 ? 1 : 0.6 + (trail.length - i) * 0.05,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{
                        color,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        fontSize: 9,
                      }}
                    >
                      {entry.type}
                    </span>
                    <span style={{ color: "#475569", fontSize: 9 }}>{time}</span>
                  </div>
                  <div style={{ color: "#cbd5e1" }}>{entry.description}</div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
