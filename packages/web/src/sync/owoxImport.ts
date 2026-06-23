import type { ModelGraph, ModelNode, ModelEdge, InputSource } from "@mc/okf";

export type ImportFilter = "all" | "published" | "with-relationships";

export interface ImportMart {
  id: string; title: string; status?: string;
  schema: { name: string; type: string; pk: boolean; alias?: string; description?: string }[];
  inputSource: InputSource; definition: string | null;
}
export interface ImportRelationship {
  sourceId: string; targetId: string;
  joinConditions: { sourceFieldName: string; targetFieldName: string }[];
}
export interface ImportPayload {
  storageId: string; total: number; truncated: boolean;
  marts: ImportMart[]; relationships: ImportRelationship[];
}

const isPublished = (status?: string) => (status ?? "").toLowerCase().includes("publish");

// Base filter, then "pull partner": re-include any mart referenced by a kept
// mart's relationship so relationships stay complete. Bounded to the payload's
// marts (the fetched ≤100 universe).
export function selectMartIds(payload: ImportPayload, filter: ImportFilter): Set<string> {
  const present = new Set(payload.marts.map(m => m.id));
  const inRel = new Set<string>();
  for (const r of payload.relationships) { inRel.add(r.sourceId); inRel.add(r.targetId); }

  let base: Set<string>;
  if (filter === "all") base = new Set(present);
  else if (filter === "published") base = new Set(payload.marts.filter(m => isPublished(m.status)).map(m => m.id));
  else base = new Set([...present].filter(id => inRel.has(id)));

  if (filter === "all") return base;
  const out = new Set(base);
  for (const r of payload.relationships) {
    if (out.has(r.sourceId) && present.has(r.targetId)) out.add(r.targetId);
    if (out.has(r.targetId) && present.has(r.sourceId)) out.add(r.sourceId);
  }
  return out;
}

export function payloadToGraph(payload: ImportPayload, filter: ImportFilter): ModelGraph {
  const keep = selectMartIds(payload, filter);
  const marts = payload.marts.filter(m => keep.has(m.id));

  const nodes: ModelNode[] = marts.map((m, i) => ({
    key: `n${i + 1}`, title: m.title, inputSource: m.inputSource, definition: m.definition,
    schema: m.schema.map(f => ({ name: f.name, type: f.type, pk: f.pk, ...(f.alias ? { alias: f.alias } : {}), ...(f.description ? { description: f.description } : {}) })),
    position: { x: 0, y: 0 }, status: "created", owoxId: m.id, createdAt: null,
  }));
  const keyByOwoxId = new Map(nodes.map(n => [n.owoxId!, n.key]));

  const edges: ModelEdge[] = [];
  const seen = new Map<string, ModelEdge>();
  for (const r of payload.relationships) {
    const from = keyByOwoxId.get(r.sourceId), to = keyByOwoxId.get(r.targetId);
    if (!from || !to) continue;                       // dangling → drop
    const pair = [from, to].sort().join("|");
    const existing = seen.get(pair);
    if (existing) { existing.bidirectional = true; continue; }
    const keys = r.joinConditions.map(j => ({ left: j.sourceFieldName, right: j.targetFieldName }));
    const e: ModelEdge = { id: `e${edges.length + 1}`, from, to, keys: keys.length ? keys : [{ left: "", right: "" }], bidirectional: false, existing: true };
    edges.push(e); seen.set(pair, e);
  }
  return { storageId: payload.storageId, nodes, edges };
}

// Merge incoming into current: marts with a matching owoxId are updated in place
// (keeping the current key + position); brand-new marts are appended. Edges are
// merged with de-dup by node pair. Returns the keys of newly added nodes so the
// caller can lay out only those.
export function mergeGraphs(current: ModelGraph, incoming: ModelGraph): { graph: ModelGraph; newKeys: Set<string> } {
  const byOwox = new Map(current.nodes.filter(n => n.owoxId).map(n => [n.owoxId!, n]));
  const keyRemap = new Map<string, string>(); // incoming key → final key
  const nodes = [...current.nodes];
  const newKeys = new Set<string>();
  let counter = Math.max(0, ...current.nodes.map(n => Number(/(\d+)$/.exec(n.key)?.[1] ?? 0)));

  for (const inc of incoming.nodes) {
    const match = inc.owoxId ? byOwox.get(inc.owoxId) : undefined;
    if (match) {
      keyRemap.set(inc.key, match.key);
      const idx = nodes.indexOf(match);
      nodes[idx] = { ...match, title: inc.title, schema: inc.schema, inputSource: inc.inputSource, definition: inc.definition, status: "created", owoxId: inc.owoxId };
    } else {
      const key = `n${++counter}`;
      keyRemap.set(inc.key, key);
      nodes.push({ ...inc, key });
      newKeys.add(key);
    }
  }

  const edges = [...current.edges];
  const pairs = new Set(current.edges.map(e => [e.from, e.to].sort().join("|")));
  let ec = Math.max(0, ...current.edges.map(e => Number(/(\d+)$/.exec(e.id)?.[1] ?? 0)));
  for (const inc of incoming.edges) {
    const from = keyRemap.get(inc.from)!, to = keyRemap.get(inc.to)!;
    const pair = [from, to].sort().join("|");
    if (pairs.has(pair)) continue;
    pairs.add(pair);
    edges.push({ ...inc, id: `e${++ec}`, from, to });
  }

  return { graph: { storageId: current.storageId ?? incoming.storageId, nodes, edges }, newKeys };
}
