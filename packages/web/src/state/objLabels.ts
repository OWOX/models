// What each object card shows on the canvas. A per-browser view preference
// (not model data) — persisted in localStorage, mirroring relLabels/viewMode.
// The parts and their menu copy follow the OWOX Data Marts Models canvas, so a
// card here reads the same as a card in the product.
//
// The parts toggle independently, so any combination is expressible (e.g. keep
// the field count but drop the relationships). Stored as the set of HIDDEN
// parts: the empty set means "show everything", and a part added later defaults
// to visible for everyone who already has a preference stored.
//
// `fieldAlias` and `fieldDescription` are the optional lines of each field row,
// so they only change the ERD view and the field list a card opens.
export type ObjLabelPart =
  | "source"
  | "fields"
  | "relationships"
  | "status"
  | "fieldAlias"
  | "fieldDescription";
export type ObjHidden = Readonly<Record<ObjLabelPart, boolean>>;

export const OBJ_LABEL_PARTS: readonly ObjLabelPart[] = [
  "source",
  "fields",
  "relationships",
  "status",
  "fieldAlias",
  "fieldDescription",
];

/** The parts that change what the card itself shows, in card order. */
export const CARD_PARTS: readonly ObjLabelPart[] = ["source", "fields", "relationships", "status"];
/** The parts that change the field rows — they matter in the ERD view only. */
export const FIELD_ROW_PARTS: readonly ObjLabelPart[] = ["fieldAlias", "fieldDescription"];

export const OBJ_PART_META: Record<ObjLabelPart, { label: string; helper: string }> = {
  source: { label: "Input source", helper: "View, Table, SQL or Connector" },
  fields: { label: "Fields", helper: "Number of fields in the Output Schema — click it on a card to list them" },
  relationships: { label: "Relationships", helper: "Joins with other objects — click it on a card to list them" },
  status: { label: "Status badge", helper: "Draft, Creating or Error — nothing once the object is in OWOX" },
  fieldAlias: { label: "Field aliases", helper: "Output Schema alias in place of the name" },
  fieldDescription: { label: "Field descriptions", helper: "Output Schema description under each field" },
};

export const NOTHING_HIDDEN: ObjHidden = {
  source: false,
  fields: false,
  relationships: false,
  status: false,
  fieldAlias: false,
  fieldDescription: false,
};
export const ALL_HIDDEN: ObjHidden = {
  source: true,
  fields: true,
  relationships: true,
  status: true,
  fieldAlias: true,
  fieldDescription: true,
};

/**
 * What a card shows until the user picks otherwise: the field count (whose list
 * leads with the aliases) and nothing else — the lightest card that still says
 * what the object holds.
 */
export const DEFAULT_HIDDEN: ObjHidden = {
  source: true,
  fields: false,
  relationships: true,
  status: true,
  fieldAlias: false,
  fieldDescription: true,
};

const KEY = "mc.objLabels.v3";
const V2_KEY = "mc.objLabels.v2";
const V1_KEY = "mc.objLabels.v1";

// v2 had three parts (source / fields / status); v1 a single exclusive mode.
// Both map onto the current set, and a stored "title only" stays title only.
const V2_PARTS: readonly ObjLabelPart[] = ["source", "fields", "status"];
const V1_MODES: Record<string, readonly ObjLabelPart[]> = {
  all: [],
  noSource: ["source"],
  noFields: ["fields"],
  noStatus: ["status"],
  both: ["source", "fields"],
  none: V2_PARTS,
};

function isPart(v: string): v is ObjLabelPart {
  return (OBJ_LABEL_PARTS as readonly string[]).includes(v);
}

function fromParts(parts: readonly ObjLabelPart[]): ObjHidden {
  const hidden: Record<ObjLabelPart, boolean> = { ...NOTHING_HIDDEN };
  for (const part of parts) hidden[part] = true;
  return hidden;
}

function parse(csv: string): ObjLabelPart[] {
  return csv.split(",").map(t => t.trim()).filter(isPart);
}

// An older preference keeps the parts it knew; the parts added since take their
// defaults. One that hid every part it knew meant "title only" — keep it so.
function fromLegacy(parts: readonly ObjLabelPart[]): ObjHidden {
  if (V2_PARTS.every(p => parts.includes(p))) return fromParts([...parts, "relationships"]);
  const hidden: Record<ObjLabelPart, boolean> = { ...DEFAULT_HIDDEN };
  for (const p of V2_PARTS) hidden[p] = parts.includes(p);
  return hidden;
}

export function loadObjHidden(): ObjHidden {
  try {
    const v = localStorage.getItem(KEY);
    if (v !== null) return fromParts(parse(v));
    const v2 = localStorage.getItem(V2_KEY);
    if (v2 !== null) return fromLegacy(parse(v2).filter(p => V2_PARTS.includes(p)));
    const v1 = localStorage.getItem(V1_KEY);
    if (v1 !== null && v1 in V1_MODES) return fromLegacy(V1_MODES[v1]);
    return DEFAULT_HIDDEN;
  } catch {
    return DEFAULT_HIDDEN;
  }
}

export function persistObjHidden(hidden: ObjHidden): void {
  try {
    localStorage.setItem(KEY, OBJ_LABEL_PARTS.filter(p => hidden[p]).join(","));
    // Fully superseded — don't read them again.
    localStorage.removeItem(V2_KEY);
    localStorage.removeItem(V1_KEY);
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
