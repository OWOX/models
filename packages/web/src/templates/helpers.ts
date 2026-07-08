import type { ModelGraph, ModelNode, ModelEdge, InputSource, SchemaField } from "@mc/okf";

// ── tiny authoring helpers ─────────────────────────────────────────────────
export const f = (name: string, type: string, pk = false, description?: string): SchemaField =>
  ({ name, type, pk, ...(description ? { description } : {}) });
export const mart = (
  key: string,
  title: string,
  inputSource: InputSource,
  schema: SchemaField[],
  description?: string,
): ModelNode =>
  ({ key, title, inputSource, description, schema, position: { x: 0, y: 0 }, status: "pending", owoxId: null });
// Edges carry cardinality so the ERD/OKF export reads like a real star schema.
// Default N:1 because the common case is a fact row pointing at one dimension.
export const rel = (
  id: string,
  from: string,
  to: string,
  left: string,
  right: string,
  cardinality: ModelEdge["cardinality"] = "N:1",
  bidirectional = false,
): ModelEdge => ({ id, from, to, keys: [{ left, right }], bidirectional, cardinality });

export interface Template {
  id: string;                    // immutable — ?template=<id> deep links are public CTAs
  nicheId: string | null;        // NichePreset.id this template answers; null for datasets
  category: "industry" | "dataset";
  name: string;
  description: string;
  graph: ModelGraph;
}
