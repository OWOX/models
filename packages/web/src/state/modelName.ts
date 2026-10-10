// The model's display name — shown (and edited) in the top bar, used as the
// default when saving to an account. Persisted so a refresh keeps it, mirroring
// how the model itself and the business goal are persisted.
const KEY = "mc.modelName.v1";

export const DEFAULT_MODEL_NAME = "My awesome data model";

/** Default name for a model started from a template, e.g. "My SaaS / Subscription data model with OWOX". */
export function templateModelName(templateName: string): string {
  return `My ${templateName} data model with OWOX`;
}

/** Old default / template wording ("OKF") → current wording. Custom names pass through. */
export function migrateModelName(name: string): string {
  if (name === "My first OKF with OWOX" || name === "My first data model with OWOX") return DEFAULT_MODEL_NAME;
  const m = /^My (.+) OKF with OWOX$/.exec(name);
  return m ? `My ${m[1]} data model with OWOX` : name;
}

export function loadModelName(): string {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? migrateModelName(stored) : DEFAULT_MODEL_NAME;
  } catch {
    return DEFAULT_MODEL_NAME;
  }
}

export function persistModelName(name: string): void {
  try {
    localStorage.setItem(KEY, name);
  } catch {
    // Ignore quota / private-mode failures — persistence is best-effort.
  }
}
