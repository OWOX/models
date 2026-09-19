// Colours a mart node is painted with. Shared so the canvas component and the
// vector SVG export can't drift apart: the exported diagram has to match what
// the user is looking at.

export const SOURCE_COLOR: Record<string, string> = {
  SQL: "#10b981",
  CONNECTOR: "#f59e0b",
  VIEW: "#3b82f6",
  TABLE: "#8b5cf6",
};

export const SOURCE_FALLBACK = "#94a3b8";

export const STATUS_COLOR: Record<string, string> = {
  created: "#10b981",
  pending: "#cbd5e1", // slate-300
  creating: "#1e88e5",
  error: "#ef4444",
};

export const STATUS_FALLBACK = "#cbd5e1";

export function sourceColor(inputSource: string): string {
  return SOURCE_COLOR[inputSource] ?? SOURCE_FALLBACK;
}

export function statusColor(status: string): string {
  return STATUS_COLOR[status] ?? STATUS_FALLBACK;
}
