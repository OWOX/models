import { joinRelation, hasNoKeys, type ModelGraph, type ModelNode, type ModelEdge, type InputSource } from "@mc/okf";

export type ImportFilter = "all" | "published" | "with-relationships";

export interface ImportMart {
  id: string; title: string; status?: string; description?: string;
  schema: { name: string; type: string; pk: boolean; alias?: string; description?: string; formula?: string }[];
  inputSource: InputSource; definition: string | null;
}
export interface ImportRelationship {
  sourceId: string; targetId: string; targetAlias?: string; description?: string;
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
    ...(m.description ? { description: m.description } : {}),
    schema: m.schema.map(f => ({ name: f.name, type: f.type, pk: f.pk, ...(f.alias ? { alias: f.alias } : {}), ...(f.description ? { description: f.description } : {}), ...(f.formula !== undefined ? { formula: f.formula } : {}) })),
    // Tag the storage this owoxId belongs to — push compares it to the active
    // storage so the mart isn't treated as "already created" in another project.
    position: { x: 0, y: 0 }, status: "created", owoxId: m.id, owoxStorageId: payload.storageId, createdAt: null,
  }));
  const keyByOwoxId = new Map(nodes.map(n => [n.owoxId!, n.key]));

  // Every OWOX relationship is its own join (OWOX allows several between one pair of
  // marts, each under its own alias). B→A folds into an A→B edge as ↔ only when its
  // keys mirror A→B's; otherwise it is a separate edge.
  const edges: ModelEdge[] = [];
  for (const r of payload.relationships) {
    const from = keyByOwoxId.get(r.sourceId), to = keyByOwoxId.get(r.targetId);
    if (!from || !to) continue;                       // dangling → drop
    const keys = r.joinConditions.map(j => ({ left: j.sourceFieldName, right: j.targetFieldName }));
    const existing = edges.find(x => !x.bidirectional && joinRelation(x, { from, to, keys }, false) === "reverse");
    if (existing) {
      existing.bidirectional = true;
      if (r.targetAlias) existing.reverseAlias = r.targetAlias;
      if (r.description && !existing.description) existing.description = r.description;
      continue;
    }
    const e: ModelEdge = { id: `e${edges.length + 1}`, from, to, keys: keys.length ? keys : [{ left: "", right: "" }], bidirectional: false, existing: true, ...(r.targetAlias ? { alias: r.targetAlias } : {}), ...(r.description ? { description: r.description } : {}) };
    edges.push(e);
  }
  return { storageId: payload.storageId, nodes, edges };
}

// Merge incoming into current: marts with a matching owoxId are updated in place
// (keeping the current key + position); brand-new marts are appended. Edges are
// merged with de-dup by node pair; a paired edge takes OWOX's aliases. Returns
// the keys of newly added nodes so the caller can lay out only those.
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
      nodes[idx] = { ...match, title: inc.title, description: inc.description, schema: inc.schema, inputSource: inc.inputSource, definition: inc.definition, status: "created", owoxId: inc.owoxId, owoxStorageId: inc.owoxStorageId };
    } else {
      const key = `n${++counter}`;
      keyRemap.set(inc.key, key);
      nodes.push({ ...inc, key });
      newKeys.add(key);
    }
  }

  // An incoming edge lands on the canvas edge that is the same join: same direction
  // and keys, or the reverse direction with mirrored keys. A canvas edge without keys
  // between the same marts takes the first incoming join left unmatched. Each canvas
  // edge takes one incoming edge at most, so parallel joins stay apart.
  const edges = [...current.edges];
  const claimed = new Set<number>();
  let ec = Math.max(0, ...current.edges.map(e => Number(/(\d+)$/.exec(e.id)?.[1] ?? 0)));
  const incEdges = incoming.edges.map(inc => ({ inc, from: keyRemap.get(inc.from)!, to: keyRemap.get(inc.to)! }));
  const unmatched: typeof incEdges = [];
  const apply = (i: number, inc: ModelEdge, from: string) => {
    // OWOX is the source of truth for aliases of a relationship it already
    // has; map them onto the canvas edge's own direction.
    claimed.add(i);
    const x = edges[i], same = x.from === from;
    const alias = same ? inc.alias : inc.reverseAlias;
    const reverseAlias = same ? inc.reverseAlias : inc.alias;
    edges[i] = {
      ...x,
      ...(alias ? { alias } : {}),
      ...(reverseAlias ? { reverseAlias } : {}),
      ...(inc.description && !x.description ? { description: inc.description } : {}),
    };
  };
  for (const m of incEdges) {
    const j = { from: m.from, to: m.to, keys: m.inc.keys };
    const i = edges.findIndex((x, idx) => !claimed.has(idx) && idx < current.edges.length && !hasNoKeys(x.keys) && joinRelation(x, j, false) !== null);
    if (i >= 0) apply(i, m.inc, m.from); else unmatched.push(m);
  }
  const pairOf = (a: string, b: string) => [a, b].sort().join("|");
  const incomingPerPair = new Map<string, number>();
  for (const m of incEdges) incomingPerPair.set(pairOf(m.from, m.to), (incomingPerPair.get(pairOf(m.from, m.to)) ?? 0) + 1);
  for (const m of unmatched) {
    const pair = pairOf(m.from, m.to);
    const open = edges.map((x, idx) => idx).filter(idx => idx < current.edges.length && !claimed.has(idx) && pairOf(edges[idx].from, edges[idx].to) === pair);
    // A keyless canvas edge, or — when the pair has one join on each side — the only
    // one there (its keys were edited on the canvas): the same relationship as before.
    const i = open.find(idx => hasNoKeys(edges[idx].keys))
      ?? (open.length === 1 && incomingPerPair.get(pair) === 1 && current.edges.filter(x => pairOf(x.from, x.to) === pair).length === 1 ? open[0] : undefined);
    if (i !== undefined) { apply(i, m.inc, m.from); continue; }
    edges.push({ ...m.inc, id: `e${++ec}`, from: m.from, to: m.to });
  }

  return { graph: { storageId: current.storageId ?? incoming.storageId, nodes, edges, ...(current.description ? { description: current.description } : {}) }, newKeys };
}
