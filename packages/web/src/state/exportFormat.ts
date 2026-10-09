// The export format the user picked last ("okf" bundle or "ossie" YAML).
// Remembered so the Clear / New-model dialogs preselect it.
const KEY = "mc.exportFormat.v1";

export type ExportFormat = "okf" | "ossie";

export function loadExportFormat(): ExportFormat {
  try {
    return localStorage.getItem(KEY) === "ossie" ? "ossie" : "okf";
  } catch {
    return "okf";
  }
}

export function persistExportFormat(format: ExportFormat): void {
  try {
    localStorage.setItem(KEY, format);
  } catch {
    // Ignore quota / private-mode failures — persistence is best-effort.
  }
}
