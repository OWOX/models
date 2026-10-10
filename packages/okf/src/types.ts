export type InputSource = "SQL" | "CONNECTOR" | "VIEW" | "TABLE";
export type NodeStatus = "pending" | "creating" | "created" | "error";
export type Cardinality = "1:1" | "1:N" | "N:1" | "N:N";

export interface SchemaField {
  name: string;
  type: string;
  pk: boolean;
  alias?: string;
  description?: string;
  /** Present ⇒ an OWOX calculated field: plain warehouse SQL, `<alias>.<field>` for joined marts. */
  formula?: string;
}
export interface JoinKey { left: string; right: string; }

export interface ModelNode {
  key: string;
  title: string;
  inputSource: InputSource;
  description?: string;
  definition?: string | null;   // optional source definition (SQL / table ref / view)
  schema: SchemaField[];
  position: { x: number; y: number };
  status: NodeStatus;
  owoxId?: string | null;
  // The OWOX storage this owoxId lives in. Push treats a "created" mart as
  // already-in-OWOX only when this matches the active storage, so switching
  // project/storage recreates a stale mart instead of silently skipping it.
  owoxStorageId?: string | null;
  createdAt?: string | null;
  createdBy?: string | null;
  error?: string | null;
}
export interface ModelEdge {
  id: string;
  from: string;
  to: string;
  keys: JoinKey[];
  bidirectional: boolean;
  cardinality?: Cardinality;
  /** OWOX join alias for from → to (formulas write `<alias>.<field>`). Unset ⇒ defaultJoinAlias(target title). */
  alias?: string;
  /** Join alias for to → from of a bidirectional edge. */
  reverseAlias?: string;
  /** Business meaning of the join, shared with AI assistants (OWOX relationship description). */
  description?: string;
  // Canvas-only hints for which ports the edge attaches to (not encoded in OKF).
  sourceHandle?: string | null;
  targetHandle?: string | null;
  // True for edges imported from OWOX (already exist there) — push skips them.
  existing?: boolean;
}
export interface ModelGraph {
  storageId: string | null;
  nodes: ModelNode[];
  edges: ModelEdge[];
}
