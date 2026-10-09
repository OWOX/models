import { defaultJoinAlias, isCalculated, type FormulaContext, type ModelEdge, type ModelNode } from "@mc/okf";

// The alias OWOX knows a join by: the one set on the edge, else one derived from the
// target's title. Push step 3 and formula contexts both call this, so a formula's
// `alias.field` always matches the targetAlias that was actually pushed.
export function joinAlias(explicit: string | undefined, target: { title: string; key: string }): string {
  return explicit?.trim() || defaultJoinAlias(target.title || target.key, target.key);
}

// What a formula on `node` may reference: its own fields, and the real columns of
// every mart it joins to, under the alias OWOX gives that join. A joined mart's
// calculated fields are left out — ODM refuses them.
export function buildFormulaContext(node: ModelNode, nodes: ModelNode[], edges: ModelEdge[]): FormulaContext {
  const byKey = new Map(nodes.map(n => [n.key, n]));
  const joined: FormulaContext["joined"] = [];
  for (const e of edges) {
    const forward = e.from === node.key;
    if (!forward && !(e.bidirectional && e.to === node.key)) continue;
    const other = byKey.get(forward ? e.to : e.from);
    if (!other) continue;
    const alias = joinAlias(forward ? e.alias : e.reverseAlias, other);
    joined.push({ alias, title: other.title, fields: other.schema.filter(f => !isCalculated(f)).map(f => f.name) });
  }
  return { own: node.schema.map(f => f.name), joined };
}
