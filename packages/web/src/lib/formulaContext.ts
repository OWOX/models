import { defaultJoinAlias, isCalculated, type FormulaContext, type ModelEdge, type ModelNode } from "@mc/okf";

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
    const alias = (forward ? e.alias : e.reverseAlias)?.trim() || defaultJoinAlias(other.title, other.key);
    joined.push({ alias, title: other.title, fields: other.schema.filter(f => !isCalculated(f)).map(f => f.name) });
  }
  return { own: node.schema.map(f => f.name), joined };
}
