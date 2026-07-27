// What each object node shows on the canvas. A per-browser view preference
// (not model data) — persisted in localStorage, mirroring relLabels/viewMode.
//
// The parts toggle independently, so any combination is expressible (e.g. keep
// the field count but drop the status dot). Stored as the set of HIDDEN parts:
// the empty set means "show everything", and a part added later defaults to
// visible for everyone who already has a preference stored.
export type ObjLabelPart = "source" | "fields" | "status";
export type ObjHidden = Readonly<Record<ObjLabelPart, boolean>>;

export const OBJ_LABEL_PARTS: readonly ObjLabelPart[] = ["source", "fields", "status"];

export const NOTHING_HIDDEN: ObjHidden = { source: false, fields: false, status: false };
export const ALL_HIDDEN: ObjHidden = { source: true, fields: true, status: true };

const KEY = "mc.objLabels.v2";
const LEGACY_KEY = "mc.objLabels.v1";

// v1 stored a single mutually exclusive mode; map each one onto the new set so
// an existing preference survives the switch to multi-select.
const LEGACY_MODES: Record<string, ObjHidden> = {
  all: NOTHING_HIDDEN,
  noSource: { source: true, fields: false, status: false },
  noFields: { source: false, fields: true, status: false },
  noStatus: { source: false, fields: false, status: true },
  both: { source: true, fields: true, status: false },
  none: ALL_HIDDEN,
};

function isPart(v: string): v is ObjLabelPart {
  return (OBJ_LABEL_PARTS as readonly string[]).includes(v);
}

function parse(csv: string): ObjHidden {
  const hidden: Record<ObjLabelPart, boolean> = { ...NOTHING_HIDDEN };
  for (const token of csv.split(",")) {
    const part = token.trim();
    if (isPart(part)) hidden[part] = true;
  }
  return hidden;
}

export function loadObjHidden(): ObjHidden {
  try {
    const v = localStorage.getItem(KEY);
    if (v !== null) return parse(v);
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy !== null && legacy in LEGACY_MODES) return LEGACY_MODES[legacy];
    return NOTHING_HIDDEN;
  } catch {
    return NOTHING_HIDDEN;
  }
}

export function persistObjHidden(hidden: ObjHidden): void {
  try {
    localStorage.setItem(KEY, OBJ_LABEL_PARTS.filter(p => hidden[p]).join(","));
    localStorage.removeItem(LEGACY_KEY); // fully superseded — don't read it again
  } catch {
    // best-effort; ignore quota / private-mode failures
  }
}

export function hiddenCount(hidden: ObjHidden): number {
  return OBJ_LABEL_PARTS.filter(p => hidden[p]).length;
}

export function isNothingHidden(hidden: ObjHidden): boolean {
  return hiddenCount(hidden) === 0;
}

export function isAllHidden(hidden: ObjHidden): boolean {
  return hiddenCount(hidden) === OBJ_LABEL_PARTS.length;
}

export function togglePart(hidden: ObjHidden, part: ObjLabelPart): ObjHidden {
  return { ...hidden, [part]: !hidden[part] };
}
