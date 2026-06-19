import type { ModelGraph, ModelNode, ModelEdge } from "@mc/okf";
export function createModelStore(initial?: Partial<ModelGraph>) {
  let g: ModelGraph = { storageId: null, nodes: [], edges: [], ...initial } as ModelGraph;
  // Per-store counter so independent stores (and HMR reloads) don't share ids.
  // Seed it past any restored/imported ids (n1, e1, …) so freshly minted keys
  // never collide with the ones we just rehydrated from localStorage.
  let counter = Math.max(0, ...[...g.nodes.map(n => n.key), ...g.edges.map(e => e.id)]
    .map(s => { const m = /(\d+)$/.exec(s); return m ? Number(m[1]) : 0; }));
  const uid = (p: string) => `${p}${++counter}`;
  const subs = new Set<() => void>(); const emit = () => subs.forEach(f => f());
  return {
    get: () => g,
    subscribe: (f: () => void) => { subs.add(f); return () => subs.delete(f); },
    set: (next: ModelGraph) => {
      g = next;
      // Keep the id counter ahead of whatever keys the new graph brought in.
      for (const s of [...g.nodes.map(n => n.key), ...g.edges.map(e => e.id)]) {
        const m = /(\d+)$/.exec(s); if (m) counter = Math.max(counter, Number(m[1]));
      }
      emit();
    },
    addNode(position: { x: number; y: number }): ModelNode {
      const n: ModelNode = { key: uid("n"), title: "New object", inputSource: "SQL", schema: [], position, status: "pending", owoxId: null };
      g = { ...g, nodes: [...g.nodes, n] }; emit(); return n;
    },
    updateNode(key: string, patch: Partial<ModelNode>) { g = { ...g, nodes: g.nodes.map(n => n.key === key ? { ...n, ...patch } : n) }; emit(); },
    removeNode(key: string) { g = { ...g, nodes: g.nodes.filter(n => n.key !== key), edges: g.edges.filter(e => e.from !== key && e.to !== key) }; emit(); },
    addEdge(from: string, to: string, sourceHandle?: string | null, targetHandle?: string | null): ModelEdge | null {
      if (from === to) return null;
      const pair = [from, to].sort().join("|");
      const existing = g.edges.find(e => [e.from, e.to].sort().join("|") === pair);
      if (existing) { g = { ...g, edges: g.edges.map(e => e === existing ? { ...e, bidirectional: true } : e) }; emit(); return existing; }
      const e: ModelEdge = { id: uid("e"), from, to, keys: [{ left: "", right: "" }], bidirectional: false, sourceHandle, targetHandle };
      g = { ...g, edges: [...g.edges, e] }; emit(); return e;
    },
    updateEdge(id: string, patch: Partial<ModelEdge>) { g = { ...g, edges: g.edges.map(e => e.id === id ? { ...e, ...patch } : e) }; emit(); },
    removeEdge(id: string) { g = { ...g, edges: g.edges.filter(e => e.id !== id) }; emit(); },
  };
}
export type ModelStore = ReturnType<typeof createModelStore>;
