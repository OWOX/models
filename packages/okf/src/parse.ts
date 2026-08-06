import type { ModelGraph, ModelNode, ModelEdge, InputSource, Cardinality, SchemaField } from "./types";
import { parseFrontmatter } from "./slug";
import { normalizeFieldType } from "./fieldType";

const FLIP_CARDINALITY: Record<Cardinality, Cardinality> = { "1:1": "1:1", "N:N": "N:N", "1:N": "N:1", "N:1": "1:N" };

// Resolve a link target by its basename, tolerating ./rel paths, nested dirs,
// and (in the prose pass) absolute paths. The strict join regex only produces ./rel.
function basename(path: string): string {
  return path.split(/[\\/]/).pop()!.replace(/\.md$/i, "");
}

export function parseBundle(files: Record<string, string>): ModelGraph {
  const docs = Object.entries(files)
    .filter(([p]) => p.endsWith(".md") && !p.endsWith("index.md"))
    .filter(([, text]) => isMartDoc(text));
  const nodes: ModelNode[] = []; const slugToKey = new Map<string, string>();
  const pkByKey = new Map<string, string | undefined>();
  for (const [path, text] of docs) {
    const { data, body } = parseFrontmatter(text);
    const owox = data.owox || {};
    const ov = parseOverview(body);
    const title = data.title || "Untitled";
    const fileSlug = path.split("/").pop()!.replace(/\.md$/, "");
    const key = owox.key || fileSlug;
    slugToKey.set(fileSlug, key);
    const schema = parseSchema(body);
    pkByKey.set(key, schema.find(f => f.pk)?.name);
    const inputSource = (owox.inputSource || ov.definitionType || inferSource(data.tags) || sourceFromType(data.type) || "SQL") as InputSource;
    const owoxId = owox.id ?? (ov.id && ov.id !== "—" ? ov.id : null);
    nodes.push({
      key, title, inputSource,
      description: data.description || undefined, definition: parseDefinition(body), schema,
      position: owox.position || { x: 0, y: 0 },
      status: owoxId || ov.status === "PUBLISHED" ? "created" : "pending", owoxId,
    });
  }

  const raw: { from: string; to: string; keys: { left: string; right: string }[]; cardinality?: Cardinality }[] = [];
  for (const [path, text] of docs) {
    const { data, body } = parseFrontmatter(text);
    const fromSlug = path.split("/").pop()!.replace(/\.md$/, "");
    const fromKey = (data.owox && data.owox.key) || fromSlug;
    const fromSchema = parseSchema(body);
    for (const ln of body.split("\n")) {
      const m = ln.match(/^- \[.*?\]\(\.\/(.+?)\.md\)\s*(?:—|--)?\s*(.*)$/);
      if (!m) continue;
      const toKey = slugToKey.get(basename(m[1])); if (!toKey) continue;
      let keys = [...m[2].matchAll(/`([^`]+?)\s*=\s*([^`]+?)`/g)].map(g => ({ left: g[1].trim(), right: g[2].trim() }));
      if (keys.length === 0) {
        // Faithful-OWOX join: recover from a `FK to [Target]` note + target PK.
        const targetTitle = nodes.find(n => n.key === toKey)?.title ?? "";
        const fkCol = fromSchema.find(f => (f.description || "").includes(`FK to [${targetTitle}]`));
        const rightPk = pkByKey.get(toKey);
        if (fkCol && rightPk) keys = [{ left: fkCol.name, right: rightPk }];
      }
      const cm = m[2].match(/\[(1:1|1:N|N:1|N:N)\]/);
      const cardinality = cm ? (cm[1] as Cardinality) : undefined;
      raw.push({ from: fromKey, to: toKey, keys, cardinality });
    }
  }

  // Tolerant pass for Google OKF v0.1 prose joins, e.g.
  //   "...can be joined with the [users](users.md) table on `user_id`..."
  // Conservative: only lines that mention "join" AND link to a known mart, and
  // never list-item lines (those are the strict parser's job). An `on `key``
  // binds to the most recent preceding link; links without a key become keyless
  // edges. A discovered key upgrades an existing keyless edge for the same pair.
  const addProseEdge = (from: string, to: string, key: string | undefined) => {
    const keys = key ? [{ left: key, right: pkByKey.get(to) ?? key }] : [];
    const ex = raw.find(r => (r.from === from && r.to === to) || (r.from === to && r.to === from));
    if (ex) {
      if (keys.length && ex.keys.length === 0) {
        ex.keys = ex.from === from ? keys : keys.map(k => ({ left: k.right, right: k.left }));
      }
      return;
    }
    raw.push({ from, to, keys });
  };
  for (const [path, text] of docs) {
    const { data, body } = parseFrontmatter(text);
    if (typeof data.type === "string" && /^owox data mart$/i.test(data.type.trim())) continue;
    const fromKey = (data.owox && data.owox.key) || basename(path);
    for (const ln of body.split("\n")) {
      if (!/join/i.test(ln)) continue;
      if (/^[-*]\s+\[/.test(ln.trim())) continue;      // strict-parser list items
      let pending: string | null = null;
      for (const tk of ln.matchAll(/\[[^\]]+\]\(([^)]+\.md)\)|on\s+`([^`]+)`/gi)) {
        if (tk[1]) {
          if (pending) addProseEdge(fromKey, pending, undefined);
          const toKey = slugToKey.get(basename(tk[1]));
          pending = toKey && toKey !== fromKey ? toKey : null;
        } else if (tk[2] && pending) {
          addProseEdge(fromKey, pending, tk[2].trim());
          pending = null;
        }
      }
      if (pending) addProseEdge(fromKey, pending, undefined);
    }
  }

  const edges: ModelEdge[] = []; const seen = new Map<string, ModelEdge>();
  for (const r of raw) {
    const pairKey = [r.from, r.to].sort().join("|");
    const ex = seen.get(pairKey);
    if (ex) {
      ex.bidirectional = true;
      if (!ex.cardinality && r.cardinality) {
        ex.cardinality = ex.from === r.from ? r.cardinality : FLIP_CARDINALITY[r.cardinality];
      }
      continue;
    }
    const e: ModelEdge = { id: `e${edges.length + 1}`, from: r.from, to: r.to, keys: r.keys, bidirectional: false };
    if (r.cardinality) e.cardinality = r.cardinality;
    seen.set(pairKey, e); edges.push(e);
  }
  const storageId = (docs[0] && (parseFrontmatter(docs[0][1]).data.owox || {}).storageId) || null;
  return { storageId, nodes, edges };
}

function inferSource(tags: unknown): InputSource | undefined {
  const list = (Array.isArray(tags) ? tags : []).map(t => String(t).toUpperCase());
  return (["SQL", "CONNECTOR", "VIEW", "TABLE"] as const).find(s => list.includes(s));
}

// A doc is a mart unless its OKF type marks it as a non-table reference/dataset.
// OWOX docs (type: "OWOX Data Mart") and untyped docs are always marts.
const NON_MART_TYPE = /^(reference|bigquery dataset)\b/i;
function isMartDoc(text: string): boolean {
  const t = parseFrontmatter(text).data.type;
  return !(typeof t === "string" && NON_MART_TYPE.test(t.trim()));
}

// Map Google's frontmatter type onto our InputSource. OWOX docs never reach the
// "SQL" fallback via this path because they carry owox.inputSource/Overview.
function sourceFromType(type: unknown): InputSource | undefined {
  const t = String(type ?? "").toLowerCase();
  if (t.startsWith("bigquery view")) return "VIEW";
  if (t.startsWith("bigquery table")) return "TABLE";
  return undefined;
}

function parseOverview(body: string): { id?: string; status?: string; definitionType?: string } {
  const out: { id?: string; status?: string; definitionType?: string } = {};
  const grab = (label: string) => {
    const m = body.match(new RegExp(`^- \\*\\*${label}:\\*\\*\\s*\`?([^\`\\n]+?)\`?\\s*$`, "im"));
    return m ? m[1].trim() : undefined;
  };
  out.id = grab("ID"); out.status = grab("Status"); out.definitionType = grab("Definition type");
  return out;
}

// Schema-table header labels. Producers pick their own wording and column count
// — our own export writes `Column | Type | Description`, Google's regenerated
// v0.2 bundles write `Field Name | Type | Mode | Description` — so every column
// is located by label instead of assuming a fixed arity.
const H_NAME = /^(column|column name|field|field name|name)$/i;
const H_TYPE = /^(type|data type)$/i;
const H_DESC = /^(description|desc|notes?|comment|comments)$/i;
const H_PK = /^(pk|primary key)$/i;
const H_ALIAS = /^alias$/i;

// Cell text without the code ticks or the bold/italic markers a generator may
// wrap it in (`**gross_amount**`, `*event_params.key*`).
function cellText(s: string): string {
  return s.replace(/`/g, "").trim().replace(/^\*{1,3}/, "").replace(/\*{1,3}$/, "").trim();
}

// A field name carries no prose, so every emphasis marker in it is markup —
// including runs in the middle, which Google's nested-RECORD rows produce by
// butting an italic parent against a bold leaf (`*inputs.***index**`). Stripped
// only from the name cell: a description may legitimately contain an asterisk.
// Underscores are always left alone, being valid in names (`events_`).
function fieldName(s: string): string {
  return s.replace(/\*/g, "").trim();
}

function parseSchema(body: string): SchemaField[] {
  const out: SchemaField[] = [];
  const lines = body.split("\n"); let inSchema = false; let headerSeen = false;
  // Column positions come from the header row, so the canonical
  // `| Column | Type | Description |` form, the optional-Alias form, the legacy
  // `| Column | Type | PK | Alias | Description |` form and Google's
  // `| Field Name | Type | Mode | Description |` all parse without guessing at
  // the arity. Name/type/description fall back to the first three columns for
  // tables written without a header.
  let idxName = 0, idxType = 1, idxDesc = 2, idxPk = -1, idxAlias = -1;
  for (const ln of lines) {
    if (/^##?\s+Schema/i.test(ln)) { inSchema = true; continue; }
    if (!inSchema) continue;
    if (/^##?\s+/.test(ln)) break;
    if (!/^\s*\|/.test(ln)) continue;
    const cells = ln.split("|").slice(1, -1).map(cellText);
    if (cells.length < 2) continue;
    if (/^:?-+:?$/.test(cells[0])) continue; // separator
    const labels = [H_NAME, H_TYPE, H_DESC, H_PK, H_ALIAS].map(re => cells.findIndex(c => re.test(c)));
    const [hName, hType, hDesc, hPk, hAlias] = labels;
    // Two recognized labels mark a header row. One is not enough — a real field
    // can be called `name` or `type`, and by the time such a row is reached the
    // table's own header has already been consumed.
    if (!headerSeen && (!cells[0] || labels.filter(i => i >= 0).length >= 2)) {
      headerSeen = true;
      if (hName >= 0) idxName = hName;
      if (hType >= 0) idxType = hType;
      idxPk = hPk; idxAlias = hAlias;
      idxDesc = hDesc >= 0 ? hDesc : (hPk === 2 || hAlias === 2 ? -1 : 2);
      continue;
    }
    const at = (i: number) => (i >= 0 ? cells[i] ?? "" : "");
    const name = fieldName(at(idxName));
    if (!name) continue;
    // The type cell is free text in hand-written / LLM-generated bundles, so it
    // is normalised rather than trusted: OWOX's schema enum is case-sensitive and
    // rejects the whole mart schema over one `bool` or `decimal(10,2)`.
    const field: SchemaField = { name, type: normalizeFieldType(at(idxType)), pk: false };
    if (idxPk >= 0) field.pk = /^(✓|x|X)$/.test(at(idxPk));
    let desc = at(idxDesc);
    if (/^PK\.\s*/.test(desc)) { field.pk = true; desc = desc.replace(/^PK\.\s*/, "").trim(); }
    const alias = at(idxAlias);
    if (alias) field.alias = alias;
    if (desc) field.description = desc;
    out.push(field);
  }
  if (out.length === 0) return parseSchemaBullets(body);
  return out;
}

const TYPE_WORDS =
  "STRING|BYTES|INTEGER|INT64|FLOAT|FLOAT64|NUMERIC|BIGNUMERIC|BOOLEAN|BOOL|" +
  "TIMESTAMP|DATE|DATETIME|TIME|RECORD|STRUCT|GEOGRAPHY|JSON|INTERVAL";
const TYPE_RE = new RegExp(`\\b(${TYPE_WORDS})\\b`, "i");

// Fallback for Google OKF v0.1 bundles, whose `# Schema` sections are bullet
// lists rather than markdown tables. Top-level bullets only; nested RECORD
// children (indented) are skipped. Runs only when the table parser found nothing.
function parseSchemaBullets(body: string): SchemaField[] {
  const out: SchemaField[] = [];
  let inSchema = false; let schemaLevel = 0;
  for (const ln of body.split("\n")) {
    const h = ln.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      if (/^schema\b/i.test(h[2].trim())) { inSchema = true; schemaLevel = level; continue; }
      if (inSchema && level <= schemaLevel) break;   // section ends at same/higher heading
      continue;                                       // sub-header inside Schema (GA4 "## event")
    }
    if (!inSchema) continue;
    const m = ln.match(/^[-*]\s+`([^`]+)`(.*)$/);     // top-level bullet, no leading indent
    if (!m) continue;
    const name = m[1].trim();
    if (!/^[\w.]+$/.test(name)) continue;             // skip enum-value rows like `key = 'x'`
    out.push(parseFieldRest(name, m[2]));
  }
  return out;
}

// Extract type + description from the text after a field's backticked name,
// tolerating: " (TYPE): desc", " (TYPE) - desc", " TYPE MODE: desc", ": TYPE".
function parseFieldRest(name: string, rest: string): SchemaField {
  let type = "STRING"; let description = "";
  const paren = rest.match(/^\s*\(([^)]+)\)\s*[-:]?\s*(.*)$/);
  if (paren) {
    type = (paren[1].match(TYPE_RE)?.[1] ?? paren[1].trim()).toUpperCase();
    description = paren[2].trim();
  } else {
    const tail = rest.replace(/^\s*[-:]\s*/, "");     // drop a leading separator
    type = (tail.match(TYPE_RE)?.[1] ?? "STRING").toUpperCase();
    const colon = tail.indexOf(":");
    description = colon >= 0 ? tail.slice(colon + 1).trim() : "";
  }
  // TYPE_WORDS deliberately accepts dialect spellings (INT64, BOOL, STRUCT …);
  // normalisation maps them onto the canonical names OWOX actually accepts.
  const field: SchemaField = { name, type: normalizeFieldType(type), pk: false };
  if (description) field.description = description;
  return field;
}

function parseDefinition(body: string): string | null {
  const m = body.match(/^##?\s+Definition\s*\n+```[^\n]*\n([\s\S]*?)\n```/im);
  return m ? m[1].trim() : null;
}
