// What relationship-edge labels show on the canvas. A per-browser view
// preference (not model data) — persisted in localStorage, mirroring viewMode.
export type RelLabelMode = "all" | "defined" | "undefined" | "hidden";

const KEY = "mc.relLabels.v1";
const MODES: readonly RelLabelMode[] = ["all", "defined", "undefined", "hidden"];

export function loadRelLabelMode(): RelLabelMode {
  try {
    const v = localStorage.getItem(KEY);
    return v !== null && MODES.includes(v as RelLabelMode) ? (v as RelLabelMode) : "all";
  } catch {
    return "all";
  }
}

export function persistRelLabelMode(mode: RelLabelMode): void {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // best-effort; ignore quota / private-mode failures
  }
}

type KeyPair = { left: string; right: string };

// A key is "set" once either side names a real field; an all-blank key renders
// as "? = ?" on the canvas. Matches the `usable` filter in canvas/edges.ts.
export function isKeySet(k: KeyPair): boolean {
  return Boolean(k.left || k.right);
}

export function visibleKeys<T extends KeyPair>(keys: T[], mode: RelLabelMode): T[] {
  switch (mode) {
    case "all": return keys;
    case "defined": return keys.filter(isKeySet);
    case "undefined": return keys.filter(k => !isKeySet(k));
    case "hidden": return [];
  }
}

// The cardinality badge is meta-info that rides along with the keys: hidden in
// "hidden" mode, hidden when the edge HAS keys but the filter removed them all,
// and otherwise shown (including for an edge that has no keys to begin with).
export function showCardinality(keys: KeyPair[], mode: RelLabelMode): boolean {
  if (mode === "hidden") return false;
  if (keys.length === 0) return true;
  return visibleKeys(keys, mode).length > 0;
}
