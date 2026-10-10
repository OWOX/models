import { useState, useCallback } from "react";

export type RightPanelId = "inspect" | "models" | "history" | "share" | "enable" | "account" | "model";

/**
 * Pure gating function: models/history require a signed-in account.
 * When signed out, clicking either routes to the "enable" panel instead.
 * Inspect and Share are always open to signed-out users.
 */
export function gatedPanelId(id: RightPanelId, signedIn: boolean): RightPanelId {
  return (id === "models" || id === "history") && !signedIn ? "enable" : id;
}

export function useRightPanel() {
  const [active, setActive] = useState<RightPanelId | null>(null);
  const open = useCallback((id: RightPanelId) => setActive(id), []);
  const close = useCallback(() => setActive(null), []);
  return { active, open, close };
}
