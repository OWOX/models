// What each object node shows on the canvas. A per-browser view preference
// (not model data) — persisted in localStorage, mirroring relLabels/viewMode.
export type ObjLabelMode = "all" | "noSource" | "noFields" | "both";

const KEY = "mc.objLabels.v1";
const MODES: readonly ObjLabelMode[] = ["all", "noSource", "noFields", "both"];

export function loadObjLabelMode(): ObjLabelMode {
  try {
    const v = localStorage.getItem(KEY);
    return v !== null && MODES.includes(v as ObjLabelMode) ? (v as ObjLabelMode) : "all";
  } catch {
    return "all";
  }
}

export function persistObjLabelMode(mode: ObjLabelMode): void {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // best-effort; ignore quota / private-mode failures
  }
}

// The source badge and the header accent stripe both encode inputSource colour,
// so they show/hide together.
export function showInputSource(mode: ObjLabelMode): boolean {
  return mode === "all" || mode === "noFields";
}

export function showFieldCount(mode: ObjLabelMode): boolean {
  return mode === "all" || mode === "noSource";
}
