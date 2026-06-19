import type { ModelGraph } from "@mc/okf";

// The whole model lives in memory for the session, so a refresh or an
// accidental tab close would otherwise wipe it. We mirror it into localStorage
// on every change and rehydrate on load as a safety net (Push to OWOX is still
// the real "save").
const KEY = "mc.model.v1";

export function loadPersistedGraph(): Partial<ModelGraph> | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const g = JSON.parse(raw) as ModelGraph;
    if (!g || !Array.isArray(g.nodes) || !Array.isArray(g.edges)) return undefined;
    return g;
  } catch {
    return undefined;
  }
}

export function persistGraph(g: ModelGraph): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(g));
  } catch {
    // Ignore quota / private-mode failures — persistence is best-effort.
  }
}
