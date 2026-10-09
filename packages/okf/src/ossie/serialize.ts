import YAML from "yaml";
import type { ModelGraph, ModelNode, SchemaField } from "../types";
import { defaultJoinAlias, formulaLevel, isCalculated, joinAlias, rewriteReferences } from "../formula";
import {
  OSSIE_VERSION, canvasToOssieType, ossieToCanvasType, owoxExt,
  type OssieDataset, type OssieDoc, type OssieExpression, type OssieField, type OssieMetric, type OssieRelationship,
} from "./types";

const DIALECT = "BIGQUERY";
const expr = (e: string): OssieExpression => ({ dialects: [{ dialect: DIALECT, expression: e }] });
const unique = (base: string, taken: Set<string>) => {
  let k = base, n = 2;
  while (taken.has(k)) k = `${base}_${n++}`;
  taken.add(k);
  return k;
};
// The canvas type travels in the extension only when the Ossie datatype can't restore it.
const typeExt = (type: string) => (ossieToCanvasType(canvasToOssieType(type)) !== type ? type : undefined);

export function serializeOssie(graph: ModelGraph, modelName: string): { yaml: string; warnings: string[] } {
  const warnings: string[] = [];
  const nodeByKey = new Map(graph.nodes.map(n => [n.key, n]));

  const takenDatasets = new Set<string>();
  const dsName = new Map<string, string>();
  for (const n of graph.nodes) dsName.set(n.key, unique(defaultJoinAlias(n.title || n.key, n.key), takenDatasets));

  const datasets: OssieDataset[] = [];
  for (const n of graph.nodes) {
    const definition = n.definition?.trim();
    if (!definition) warnings.push(`"${n.title}" has no table/view/SQL source — exported with its title as source`);
    const fields: OssieField[] = [];
    for (const f of n.schema) {
      if (isCalculated(f) && formulaLevel(f.formula!) === "metric") continue;
      const field: OssieField = {
        name: f.name,
        expression: expr(isCalculated(f) ? f.formula! : f.name),
        datatype: canvasToOssieType(f.type),
      };
      if (f.description) field.description = f.description;
      const ext = owoxExt({ type: typeExt(f.type), alias: f.alias });
      if (ext) field.custom_extensions = ext;
      fields.push(field);
    }
    const pk = n.schema.filter(f => f.pk && !isCalculated(f)).map(f => f.name);
    const ds: OssieDataset = { name: dsName.get(n.key)!, source: definition || n.title };
    if (pk.length) ds.primary_key = pk;
    if (n.description) ds.description = n.description;
    ds.fields = fields;
    const ext = owoxExt({ title: n.title, inputSource: n.inputSource, x: n.position?.x, y: n.position?.y });
    if (ext) ds.custom_extensions = ext;
    datasets.push(ds);
  }

  // Relationships
  const relationships: OssieRelationship[] = [];
  const takenRels = new Set<string>();
  for (const e of graph.edges) {
    const a = nodeByKey.get(e.from), b = nodeByKey.get(e.to);
    if (!a || !b) continue;
    const label = `${dsName.get(e.from)} → ${dsName.get(e.to)}`;
    const keys = e.keys.filter(k => k.left && k.right);
    if (!keys.length) { warnings.push(`relationship ${label} has no join keys — not exported`); continue; }
    if (e.cardinality === "N:N") { warnings.push(`relationship ${label} is many-to-many — not exported`); continue; }
    const swapped = e.cardinality === "1:N";
    const from = swapped ? e.to : e.from, to = swapped ? e.from : e.to;
    const rel: OssieRelationship = {
      name: unique(`${dsName.get(from)}_to_${dsName.get(to)}`, takenRels),
      from: dsName.get(from)!,
      to: dsName.get(to)!,
      from_columns: keys.map(k => (swapped ? k.right : k.left)),
      to_columns: keys.map(k => (swapped ? k.left : k.right)),
    };
    const ext = owoxExt({
      alias: e.alias, reverseAlias: e.reverseAlias, bidirectional: e.bidirectional || undefined,
      cardinality: e.cardinality, swapped: swapped || undefined,
    });
    if (ext) rel.custom_extensions = ext;
    relationships.push(rel);
  }

  // Metrics
  const metrics: OssieMetric[] = [];
  const takenMetrics = new Set<string>();
  for (const n of graph.nodes) {
    const ds = dsName.get(n.key)!;
    const own = new Set(n.schema.map(f => f.name));
    const aliasToDataset = new Map<string, string>();
    for (const e of graph.edges) {
      if (e.from === n.key && nodeByKey.has(e.to)) aliasToDataset.set(joinAlias(e.alias, nodeByKey.get(e.to)!), dsName.get(e.to)!);
      if (e.to === n.key && e.bidirectional && nodeByKey.has(e.from)) aliasToDataset.set(joinAlias(e.reverseAlias, nodeByKey.get(e.from)!), dsName.get(e.from)!);
    }
    for (const f of n.schema) {
      if (!isCalculated(f) || formulaLevel(f.formula!) !== "metric") continue;
      const rewritten = rewriteReferences(f.formula!, r =>
        r.alias === null
          ? (own.has(r.field) ? `${ds}.${r.field}` : null)
          : (aliasToDataset.get(r.alias) ? `${aliasToDataset.get(r.alias)}.${r.field}` : null));
      const name = unique(f.name, takenMetrics);
      if (name !== f.name) warnings.push(`metric "${f.name}" of "${n.title}" clashes with another mart's metric — exported as "${name}"`);
      const m: OssieMetric = { name, expression: expr(rewritten), datatype: canvasToOssieType(f.type) };
      if (f.description) m.description = f.description;
      const ext = owoxExt({ home: ds, alias: f.alias, type: typeExt(f.type) });
      if (ext) m.custom_extensions = ext;
      metrics.push(m);
    }
  }

  const doc: OssieDoc = { version: OSSIE_VERSION, name: defaultJoinAlias(modelName, "model"), datasets };
  if (relationships.length) doc.relationships = relationships;
  if (metrics.length) doc.metrics = metrics;
  const ext = owoxExt({ generator: "model.owox.com", name: modelName });
  if (ext) doc.custom_extensions = ext;
  return { yaml: YAML.stringify(doc, { lineWidth: 0 }), warnings };
}
