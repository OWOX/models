import YAML from "yaml";
import type { Cardinality, InputSource, ModelEdge, ModelGraph, ModelNode, SchemaField } from "../types";
import { normalizeFieldType } from "../fieldType";
import { formulaReferences, joinAlias, rewriteReferences } from "../formula";
import {
  OWOX_VENDOR, aiContextText, ossieToCanvasType, pickExpression, readOwoxExt,
  type OssieDataset, type OssieDoc, type OssieExt, type OssieMetric,
} from "./types";

export interface OssieImport {
  graph: ModelGraph;
  name?: string;
  /** What the file holds that the canvas has no place for. */
  notImported: string[];
  /** Things imported, but likely to fail or surprise later. */
  warnings: string[];
}

const joinText = (...parts: (string | undefined)[]) => parts.filter(Boolean).join("\n\n") || undefined;
const oneLine = (s: string) => s.replace(/\s*\n+\s*/g, "; ");
const uniqueKey = (base: string, taken: Set<string>) => {
  let k = base, n = 2;
  while (taken.has(k)) k = `${base}_${n++}`;
  taken.add(k);
  return k;
};

export function parseOssie(text: string): OssieImport {
  let raw: unknown;
  try { raw = YAML.parse(text); }
  catch (e) { throw new Error(`Couldn't read this Ossie file: ${(e as Error).message}`); }

  const notImported: string[] = [];
  const warnings: string[] = [];
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  let doc: OssieDoc;
  if (Array.isArray(obj.semantic_model) && obj.semantic_model.length) {
    const models = obj.semantic_model as OssieDoc[];
    doc = models[0];
    const extra = models.length - 1;
    if (extra > 0) notImported.push(extra === 1 ? "1 more model in this file wasn't imported" : `${extra} more models in this file weren't imported`);
  } else if (Array.isArray(obj.datasets)) {
    doc = obj as unknown as OssieDoc;
  } else {
    throw new Error("This file isn't an Ossie model");
  }

  const vendors: string[] = [];
  const seeExts = (exts?: OssieExt[]) => {
    for (const e of exts ?? []) if (e?.vendor_name && e.vendor_name !== OWOX_VENDOR && !vendors.includes(e.vendor_name)) vendors.push(e.vendor_name);
  };
  seeExts(doc.custom_extensions);
  if (doc.description || doc.ai_context) notImported.push("model description / AI context");

  // Datasets → nodes
  const taken = new Set<string>();
  const nodes: ModelNode[] = [];
  const keyOf = new Map<string, string>();
  for (const ds of doc.datasets ?? []) {
    seeExts(ds.custom_extensions);
    const ext = readOwoxExt<{ title: string; inputSource: InputSource; x: number; y: number }>(ds.custom_extensions);
    const key = uniqueKey(ds.name, taken);
    if (!keyOf.has(ds.name)) keyOf.set(ds.name, key);
    const pk = ds.primary_key ?? [];
    for (const uk of ds.unique_keys ?? []) {
      if (JSON.stringify(uk) !== JSON.stringify(pk)) notImported.push(`dataset "${ds.name}": unique keys ${JSON.stringify(uk)}`);
    }
    const schema: SchemaField[] = [];
    for (const f of ds.fields ?? []) {
      seeExts(f.custom_extensions);
      const fx = readOwoxExt<{ type: string; alias: string }>(f.custom_extensions);
      const expr = pickExpression(f.expression);
      if (expr === "") notImported.push(`field "${ds.name}.${f.name}": no expression`);
      const calculated = !(expr === "" || expr === f.name);
      const field: SchemaField = {
        name: f.name,
        type: fx.type ?? normalizeFieldType(ossieToCanvasType(f.datatype)),
        pk: pk.includes(f.name) && !calculated,
      };
      if (fx.alias) field.alias = fx.alias;
      const d = joinText(f.description, aiContextText(f.ai_context) || undefined);
      if (d) field.description = d;
      if (calculated) field.formula = expr;
      schema.push(field);
    }
    // A key column the dataset never lists as a field still has to exist on the canvas.
    for (const col of pk) {
      if (!schema.some(f => f.name === col)) schema.push({ name: col, type: normalizeFieldType(ossieToCanvasType()), pk: true });
    }
    nodes.push({
      key,
      title: ext.title ?? ds.name,
      inputSource: ext.inputSource ?? (/^\s*(select|with)\b/i.test(ds.source ?? "") ? "SQL" : "TABLE"),
      definition: ds.source,
      description: joinText(ds.description, aiContextText(ds.ai_context) || undefined),
      schema,
      position: typeof ext.x === "number" && typeof ext.y === "number" ? { x: ext.x, y: ext.y } : { x: 0, y: 0 },
      status: "pending",
      owoxId: null,
    });
  }
  const nodeByKey = new Map(nodes.map(n => [n.key, n]));
  const nodeOf = (datasetName: string) => nodeByKey.get(keyOf.get(datasetName)!)!;

  // Relationships → edges
  const edges: ModelEdge[] = [];
  for (const r of doc.relationships ?? []) {
    seeExts(r.custom_extensions);
    const from = keyOf.get(r.from), to = keyOf.get(r.to);
    if (!from || !to) { notImported.push(`relationship "${r.name}": unknown dataset`); continue; }
    const ext = readOwoxExt<{ alias: string; reverseAlias: string; bidirectional: boolean; cardinality: Cardinality }>(r.custom_extensions);
    const left = r.from_columns ?? [], right = r.to_columns ?? [];
    const e: ModelEdge = {
      id: `e${edges.length + 1}`,
      from, to,
      keys: left.map((l, i) => ({ left: l, right: right[i] })).filter(k => k.right !== undefined),
      bidirectional: ext.bidirectional ?? false,
      cardinality: ext.cardinality ?? "N:1",
    };
    if (ext.alias) e.alias = ext.alias;
    if (ext.reverseAlias) e.reverseAlias = ext.reverseAlias;
    edges.push(e);
    const ai = aiContextText(r.ai_context);
    if (ai) notImported.push(`relationship "${r.name}": ai_context (${oneLine(ai)})`);
  }

  // Metrics → calculated fields on a home dataset
  for (const m of doc.metrics ?? []) {
    seeExts(m.custom_extensions);
    importMetric(m);
  }

  function importMetric(m: OssieMetric) {
    const ext = readOwoxExt<{ type: string; alias: string; home: string }>(m.custom_extensions);
    const expr = pickExpression(m.expression);
    const used: string[] = [];
    for (const r of formulaReferences(expr)) {
      if (r.alias && keyOf.has(r.alias) && !used.includes(r.alias)) used.push(r.alias);
    }
    if (!used.length) { notImported.push(`metric "${m.name}": reads no dataset`); return; }
    const usedSet = new Set(used);
    const usedKeys = new Set(used.map(u => keyOf.get(u)!));
    let home: string;
    if (ext.home && keyOf.has(ext.home)) home = ext.home;
    else {
      home = used[0];
      let best = -1;
      for (const u of used) {
        const count = edges.filter(e => e.from === keyOf.get(u) && e.to !== e.from && usedKeys.has(e.to)).length;
        if (count > best) { best = count; home = u; }
      }
    }
    const edgeAlias = (other: string) => edges.find(e => e.from === keyOf.get(home) && e.to === keyOf.get(other))?.alias;
    const formula = rewriteReferences(expr, r => {
      if (r.alias === home) return r.field;
      if (r.alias && usedSet.has(r.alias)) return `${joinAlias(edgeAlias(r.alias), nodeOf(r.alias))}.${r.field}`;
      return null;
    });
    for (const u of used) {
      if (u === home) continue;
      if (!edges.some(e => e.from === keyOf.get(home) && e.to === keyOf.get(u))) {
        warnings.push(`"${m.name}" reads ${u} without a direct relationship from ${home}`);
      }
    }
    if (/\bOVER\s*\(/i.test(expr)) warnings.push(`"${m.name}": window functions aren't supported by OWOX — it will be refused on push`);
    const field: SchemaField = {
      name: m.name,
      type: ext.type ?? normalizeFieldType(ossieToCanvasType(m.datatype ?? "Decimal")),
      pk: false,
      formula,
    };
    const d = joinText(m.description, aiContextText(m.ai_context) || undefined);
    if (d) field.description = d;
    if (ext.alias) field.alias = ext.alias;
    nodeOf(home).schema.push(field);
  }

  if (vendors.length) notImported.push(`custom extensions: ${vendors.join(", ")}`);
  const modelExt = readOwoxExt<{ name: string }>(doc.custom_extensions);
  return { graph: { storageId: null, nodes, edges }, name: modelExt.name ?? doc.name, notImported, warnings };
}
