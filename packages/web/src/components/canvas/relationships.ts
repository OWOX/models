import type { ModelEdge, ModelNode } from "@mc/okf";

/**
 * One relationship seen from an object's side: which object it joins and on
 * which fields. `outgoing` means this object is the relationship's `from` end;
 * a bidirectional relationship reads `both` from either side.
 */
export type CardRelationship = {
  id: string;
  direction: "outgoing" | "incoming" | "both";
  otherTitle: string;
  /** `field` belongs to this object, `otherField` to the other one. */
  joinFields: { field: string; otherField: string }[];
  /** Business meaning of the join (OWOX relationship description). */
  description?: string;
};

/**
 * The relationships list of every card, keyed by node key — what the card's
 * relationships badge counts and opens. A self-join is listed once.
 */
export function relationshipsByNode(nodes: readonly ModelNode[], edges: readonly ModelEdge[]): Map<string, CardRelationship[]> {
  const titles = new Map(nodes.map(n => [n.key, n.title]));
  const byNode = new Map<string, CardRelationship[]>();
  const add = (key: string, rel: CardRelationship) => {
    const list = byNode.get(key);
    if (list) list.push(rel);
    else byNode.set(key, [rel]);
  };
  for (const e of edges) {
    const keys = e.keys.filter(k => k.left || k.right);
    add(e.from, {
      id: e.id,
      direction: e.bidirectional ? "both" : "outgoing",
      otherTitle: titles.get(e.to) ?? e.to,
      joinFields: keys.map(k => ({ field: k.left || "?", otherField: k.right || "?" })),
      ...(e.description ? { description: e.description } : {}),
    });
    if (e.to === e.from) continue;
    add(e.to, {
      id: e.id,
      direction: e.bidirectional ? "both" : "incoming",
      otherTitle: titles.get(e.from) ?? e.from,
      joinFields: keys.map(k => ({ field: k.right || "?", otherField: k.left || "?" })),
      ...(e.description ? { description: e.description } : {}),
    });
  }
  return byNode;
}
