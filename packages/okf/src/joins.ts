import type { JoinKey, ModelEdge, ModelNode } from "./types";
import { defaultJoinAlias } from "./formula";

// One mart may join another several times (QuickBooks: a bill payment points at its
// A/P account, its bank account and its card account — three joins to Accounts). Each
// join is its own edge, so an edge is identified by its direction and keys, not by
// the pair of marts it connects.

/** The same join seen from the other end. */
export function mirrorKeys(keys: JoinKey[]): JoinKey[] {
  return keys.map(k => ({ left: k.right, right: k.left }));
}

function keySig(keys: JoinKey[]): string {
  return keys.filter(k => k.left || k.right).map(k => `${k.left}=${k.right}`).sort().join("&");
}

/** True when no key is filled in (a placeholder `{left:"",right:""}` counts as none). */
export function hasNoKeys(keys: JoinKey[]): boolean {
  return keySig(keys) === "";
}

/** Same keys, in any order. */
export function sameKeys(a: JoinKey[], b: JoinKey[]): boolean {
  return keySig(a) === keySig(b);
}

type Join = { from: string; to: string; keys: JoinKey[] };

/**
 * How `next` relates to an already-known join `ex`:
 * - "same": the same direction with the same keys — a duplicate;
 * - "reverse": the other direction with mirrored keys — together they make one ↔ edge;
 * - null: a different join, its own edge (even between the same two marts).
 * With `keylessMatches`, a join without keys matches on direction alone (a bundle may
 * name the reverse direction of a join without repeating its keys).
 * A self-join is never the reverse of anything.
 */
export function joinRelation(ex: Join, next: Join, keylessMatches: boolean): "same" | "reverse" | null {
  const keyless = keylessMatches && (hasNoKeys(ex.keys) || hasNoKeys(next.keys));
  if (ex.from === next.from && ex.to === next.to && (keyless || sameKeys(ex.keys, next.keys))) return "same";
  if (ex.from !== ex.to && ex.from === next.to && ex.to === next.from && (keyless || sameKeys(ex.keys, mirrorKeys(next.keys)))) return "reverse";
  return null;
}

// The alias a join gets from its own FK column: `check_bank_account_id = id` →
// `check_bank_account`. A key equal on both sides (`realm_id = realm_id`) names the
// shared scope, not the join, so it is skipped.
function fkAlias(keys: JoinKey[]): string {
  const k = keys.find(x => x.left && x.left !== x.right);
  if (!k) return "";
  return defaultJoinAlias(k.left.replace(/_(id|key|fk)$/i, ""), "");
}

export interface EdgeAliases { forward: string; reverse?: string }

/**
 * The OWOX join alias of every edge direction (formulas write `<alias>.<field>`, and
 * OWOX requires aliases to be unique per source mart). An explicit alias always wins.
 * Otherwise a join takes the target's default alias, as it always has; a later join
 * from the same mart whose default is already taken — a parallel join — takes the
 * alias of its FK column instead, then a numbered one.
 */
export function edgeJoinAliases(nodes: Pick<ModelNode, "key" | "title">[], edges: ModelEdge[]): Map<string, EdgeAliases> {
  const byKey = new Map(nodes.map(n => [n.key, n]));
  type Dir = { edge: ModelEdge; reverse: boolean; source: string; target: string; keys: JoinKey[]; explicit?: string };
  const dirs: Dir[] = [];
  for (const e of edges) {
    dirs.push({ edge: e, reverse: false, source: e.from, target: e.to, keys: e.keys, explicit: e.alias?.trim() || undefined });
    if (e.bidirectional && e.from !== e.to) {
      dirs.push({ edge: e, reverse: true, source: e.to, target: e.from, keys: mirrorKeys(e.keys), explicit: e.reverseAlias?.trim() || undefined });
    }
  }
  const taken = new Map<string, Set<string>>();
  const takenBy = (source: string) => { let s = taken.get(source); if (!s) taken.set(source, s = new Set()); return s; };
  for (const d of dirs) if (d.explicit) takenBy(d.source).add(d.explicit);

  const out = new Map<string, EdgeAliases>();
  for (const d of dirs) {
    let alias = d.explicit;
    if (!alias) {
      const used = takenBy(d.source);
      const t = byKey.get(d.target);
      const base = defaultJoinAlias(t?.title || d.target, d.target);
      alias = base;
      if (used.has(alias)) alias = fkAlias(d.keys);
      if (!alias || used.has(alias)) {
        let i = 2;
        while (used.has(`${base}_${i}`)) i++;
        alias = `${base}_${i}`;
      }
      used.add(alias);
    }
    const cur = out.get(d.edge.id) ?? { forward: "" };
    if (d.reverse) cur.reverse = alias; else cur.forward = alias;
    out.set(d.edge.id, cur);
  }
  return out;
}
