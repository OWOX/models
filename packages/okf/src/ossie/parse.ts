import YAML from "yaml";
import type { Cardinality, InputSource, ModelEdge, ModelGraph, ModelNode, SchemaField } from "../types";
import { normalizeFieldType } from "../fieldType";
import { formulaReferences, formulaWarnings, joinAlias, rewriteReferences } from "../formula";
import {
  OWOX_VENDOR, aiContextText, ossieToCanvasType, pickExpression, readOwoxExt,
  type OssieDataset, type OssieDoc, type OssieRelationship, type OssieExt, type OssieMetric,
} from "./types";

export interface OssieImport {
  graph: ModelGraph;
  name?: string;
  /** What the file holds that the canvas has no place for. */
  notImported: string[];
  /** Things imported, but likely to fail or surprise later. */
  warnings: string[];
}

const arr = (v: unknown): any[] => (Array.isArray(v) ? v : []);
const isObj = (v: unknown): v is Record<string, any> => !!v && typeof v === "object" && !Array.isArray(v);
const strArr = (v: unknown): string[] => arr(v).filter((x): x is string => typeof x === "string");
const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v : undefined);
const num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const oneOf = <T extends string>(v: unknown, list: readonly T[]): T | undefined => (list.includes(v as T) ? (v as T) : undefined);
const typeOf = (v: unknown): string | undefined => { const s = str(v); return s ? normalizeFieldType(s) : undefined; };
const INPUT_SOURCES = ["SQL", "TABLE", "VIEW", "CONNECTOR"] as const;
const CARDINALITIES = ["1:1", "1:N", "N:1", "N:N"] as const;
const joinText = (...parts: (string | undefined)[]) => parts.filter(Boolean).join("\n\n") || undefined;
const oneLine = (s: string) => s.replace(/\s*\n+\s*/g, "; ");
const uniqueKey = (base: string, taken: Set<string>) => {
  let k = base, n = 2;
  while (taken.has(k)) k = `${base}_${n++}`;
  taken.add(k);
  return k;
};

export function parseOssie(text: string): OssieImport {
  try { return convert(text); }
  catch (e) {
    if (e instanceof TypeError) throw new Error(`Couldn't read this Ossie file: ${e.message}`);
    throw e;
  }
}

function convert(text: string): OssieImport {
  let raw: unknown;
  try { raw = YAML.parse(text, { maxAliasCount: 100 }); }
  catch (e) { throw new Error(`Couldn't read this Ossie file: ${(e as Error).message}`); }

  const notImported: string[] = [];
  const warnings: string[] = [];
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  let doc: OssieDoc;
  if (Array.isArray(obj.semantic_model) && obj.semantic_model.length) {
    const models = obj.semantic_model as unknown[];
    if (!isObj(models[0])) throw new Error("This file isn't an Ossie model");
    doc = models[0] as unknown as OssieDoc;
    const extra = models.length - 1;
    if (extra > 0) notImported.push(extra === 1 ? "1 more model in this file wasn't imported" : `${extra} more models in this file weren't imported`);
  } else if (Array.isArray(obj.datasets)) {
    doc = obj as unknown as OssieDoc;
  } else {
    throw new Error("This file isn't an Ossie model");
  }

  const vendors: string[] = [];
  const seeExts = (exts?: unknown) => {
    for (const e of arr(exts) as OssieExt[]) if (e && typeof e.vendor_name === "string" && e.vendor_name && e.vendor_name !== OWOX_VENDOR && !vendors.includes(e.vendor_name)) vendors.push(e.vendor_name);
  };
  seeExts(doc.custom_extensions);

  // Datasets → nodes
  const taken = new Set<string>();
  const nodes: ModelNode[] = [];
  const keyOf = new Map<string, string>();
  for (const ds of arr(doc.datasets) as OssieDataset[]) {
    if (!isObj(ds)) continue;
    if (typeof ds.name !== "string") { notImported.push("dataset without a name"); continue; }
    seeExts(ds.custom_extensions);
    const ext = readOwoxExt<Record<string, unknown>>(ds.custom_extensions);
    const extX = num(ext.x), extY = num(ext.y);
    const key = uniqueKey(ds.name, taken);
    if (!keyOf.has(ds.name)) keyOf.set(ds.name, key);
    const pk = strArr(ds.primary_key);
    for (const uk of arr(ds.unique_keys)) {
      if (JSON.stringify(uk) !== JSON.stringify(pk)) notImported.push(`dataset "${ds.name}": unique keys ${JSON.stringify(uk)}`);
    }
    const schema: SchemaField[] = [];
    for (const f of arr(ds.fields)) {
      if (!isObj(f)) continue;
      if (typeof f.name !== "string") { notImported.push(`field without a name in dataset "${ds.name}"`); continue; }
      seeExts(f.custom_extensions);
      const fx = readOwoxExt<Record<string, unknown>>(f.custom_extensions);
      const expr = pickExpression(f.expression);
      if (expr === "") notImported.push(`field "${ds.name}.${f.name}": no expression`);
      const calculated = !(expr === "" || expr === f.name);
      const field: SchemaField = {
        name: f.name,
        type: typeOf(fx.type) ?? normalizeFieldType(ossieToCanvasType(f.datatype)),
        pk: pk.includes(f.name) && !calculated,
      };
      const fxAlias = str(fx.alias);
      if (fxAlias) field.alias = fxAlias;
      const d = joinText(typeof f.description === "string" ? f.description : undefined, aiContextText(f.ai_context) || undefined);
      if (d) field.description = d;
      if (calculated) field.formula = expr;
      schema.push(field);
    }
    // A key column the dataset never lists as a field still has to exist on the canvas.
    for (const col of pk) {
      if (!schema.some(f => f.name === col)) schema.push({ name: col, type: normalizeFieldType(ossieToCanvasType()), pk: true });
    }
    const own = schema.map(f => f.name);
    for (const f of schema) {
      if (f.formula && formulaWarnings(f.formula, { own, joined: [] }, f.name).some(w => w.startsWith("Unknown field"))) {
        warnings.push(`field "${ds.name}.${f.name}": expression references unknown column(s) — push will refuse it`);
      }
    }
    nodes.push({
      key,
      title: str(ext.title) ?? ds.name,
      inputSource: oneOf<InputSource>(ext.inputSource, INPUT_SOURCES) ?? (/^\s*(select|with)\b/i.test(typeof ds.source === "string" ? ds.source : "") ? "SQL" : "TABLE"),
      definition: typeof ds.source === "string" ? ds.source : null,
      description: joinText(typeof ds.description === "string" ? ds.description : undefined, aiContextText(ds.ai_context) || undefined),
      schema,
      position: extX !== undefined && extY !== undefined ? { x: extX, y: extY } : { x: 0, y: 0 },
      status: "pending",
      owoxId: null,
    });
  }
  const nodeByKey = new Map(nodes.map(n => [n.key, n]));
  const nodeOf = (datasetName: string) => nodeByKey.get(keyOf.get(datasetName)!)!;

  // Relationships → edges
  const edges: ModelEdge[] = [];
  for (const r of arr(doc.relationships) as OssieRelationship[]) {
    if (!isObj(r)) continue;
    if (typeof r.name !== "string") { notImported.push("relationship without a name"); continue; }
    seeExts(r.custom_extensions);
    const from = keyOf.get(r.from), to = keyOf.get(r.to);
    if (!from || !to) { notImported.push(`relationship "${r.name}": unknown dataset`); continue; }
    const ext = readOwoxExt<Record<string, unknown>>(r.custom_extensions);
    const left = strArr(r.from_columns), right = strArr(r.to_columns);
    const pairs = left.map((l, i) => ({ left: l, right: right[i] })).filter(k => k.right !== undefined);
    // The exporter turns a 1:N edge around (Ossie relationships run many → one); undo that.
    const swapped = ext.swapped === true;
    const e: ModelEdge = {
      id: `e${edges.length + 1}`,
      from: swapped ? to : from,
      to: swapped ? from : to,
      keys: swapped ? pairs.map(k => ({ left: k.right, right: k.left })) : pairs,
      bidirectional: ext.bidirectional === true,
      cardinality: oneOf<Cardinality>(ext.cardinality, CARDINALITIES) ?? "N:1",
    };
    const eAlias = str(ext.alias), eRev = str(ext.reverseAlias);
    if (eAlias) e.alias = eAlias;
    if (eRev) e.reverseAlias = eRev;
    const desc = str(ext.description) ?? ((typeof r.ai_context === "string" ? r.ai_context.trim() : aiContextText(r.ai_context)) || undefined);
    if (desc) e.description = desc;
    edges.push(e);
  }

  // Metrics → calculated fields on a home dataset
  for (const m of arr(doc.metrics) as OssieMetric[]) {
    if (!isObj(m)) continue;
    if (typeof m.name !== "string") { notImported.push("metric without a name"); continue; }
    seeExts(m.custom_extensions);
    importMetric(m);
  }

  function importMetric(m: OssieMetric) {
    const ext = readOwoxExt<Record<string, unknown>>(m.custom_extensions);
    const extHome = str(ext.home);
    const expr = pickExpression(m.expression);
    const used: string[] = [];
    for (const r of formulaReferences(expr)) {
      if (r.alias && keyOf.has(r.alias) && !used.includes(r.alias)) used.push(r.alias);
    }
    if (!used.length && !(extHome && keyOf.has(extHome))) { notImported.push(`metric "${m.name}": reads no dataset`); return; }
    const usedSet = new Set(used);
    const usedKeys = new Set(used.map(u => keyOf.get(u)!));
    let home: string;
    if (extHome && keyOf.has(extHome)) home = extHome;
    else {
      home = used[0];
      let best = -1;
      for (const u of used) {
        const count = edges.filter(e => e.to !== e.from && ((e.from === keyOf.get(u) && usedKeys.has(e.to)) || (e.bidirectional && e.to === keyOf.get(u) && usedKeys.has(e.from)))).length;
        if (count > best) { best = count; home = u; }
      }
    }
    // A join from home to `other`: a forward edge, or the far end of a bidirectional one.
    const link = (other: string): { alias?: string } | undefined => {
      const h = keyOf.get(home), o = keyOf.get(other);
      const fwd = edges.find(e => e.from === h && e.to === o);
      if (fwd) return { alias: fwd.alias };
      const back = edges.find(e => e.bidirectional && e.to === h && e.from === o);
      return back ? { alias: back.reverseAlias } : undefined;
    };
    const formula = rewriteReferences(expr, r => {
      if (r.alias === home) return r.field;
      if (r.alias && usedSet.has(r.alias)) return `${joinAlias(link(r.alias)?.alias, nodeOf(r.alias))}.${r.field}`;
      return null;
    });
    for (const u of used) {
      if (u === home) continue;
      if (!link(u)) {
        warnings.push(`"${m.name}" reads ${u} without a direct relationship from ${home}`);
      }
    }
    if (/\bOVER\s*\(/i.test(expr)) warnings.push(`"${m.name}": window functions aren't supported by OWOX — it will be refused on push`);
    const homeNode = nodeOf(home);
    let name = m.name;
    if (homeNode.schema.some(f => f.name === name)) {
      const taken = new Set(homeNode.schema.map(f => f.name));
      name = uniqueKey(`${m.name}_metric`, taken);
      warnings.push(`metric "${m.name}" renamed to "${name}" — the dataset already has a field with that name`);
    }
    const field: SchemaField = {
      name,
      type: typeOf(ext.type) ?? normalizeFieldType(ossieToCanvasType(m.datatype ?? "Decimal")),
      pk: false,
      formula,
    };
    const d = joinText(typeof m.description === "string" ? m.description : undefined, aiContextText(m.ai_context) || undefined);
    if (d) field.description = d;
    const mAlias = str(ext.alias);
    if (mAlias) field.alias = mAlias;
    homeNode.schema.push(field);
  }

  if (vendors.length) notImported.push(`custom extensions: ${vendors.join(", ")}`);
  const modelExt = readOwoxExt<Record<string, unknown>>(doc.custom_extensions);
  const description = str(modelExt.description)
    ?? joinText(typeof doc.description === "string" ? doc.description : undefined, aiContextText(doc.ai_context) || undefined);
  const graph: ModelGraph = { storageId: null, nodes, edges };
  if (description) graph.description = description;
  return { graph, name: str(modelExt.name) ?? str(doc.name), notImported, warnings };
}
