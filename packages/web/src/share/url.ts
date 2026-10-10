import { gzipSync, gunzipSync, strToU8, strFromU8 } from "fflate";
import type { ModelGraph, ModelNode, ModelEdge } from "@mc/okf";
import { migrateModelName } from "../state/modelName";

// Shareable model links. The whole model is gzip-compressed and packed into the
// URL hash (#m=…) — no backend, fully anonymous, and the hash never leaves the
// browser for the server. Opening the link reopens the exact model (layout
// included). Every shared/forked model is a backlink and an impression: the
// growth loop for a free tool.

const HASH_KEY = "m";
const NAME_KEY = "n";

// OWOX-specific fields (owoxId, status, createdBy, …) are dropped: a shared model
// is a clean draft, and we never leak another project's ids into a public URL.
function sanitize(g: ModelGraph): ModelGraph {
  return {
    storageId: null,
    ...(typeof g.description === "string" && g.description ? { description: g.description } : {}),
    nodes: g.nodes.map((n): ModelNode => ({
      key: n.key,
      title: n.title,
      inputSource: n.inputSource,
      description: n.description,
      schema: n.schema,
      position: n.position,
      status: "pending",
      owoxId: null,
    })),
    edges: g.edges.map((e): ModelEdge => ({
      id: e.id,
      from: e.from,
      to: e.to,
      keys: e.keys,
      bidirectional: e.bidirectional,
      cardinality: e.cardinality,
      ...(typeof e.alias === "string" ? { alias: e.alias } : {}),
      ...(typeof e.reverseAlias === "string" ? { reverseAlias: e.reverseAlias } : {}),
      ...(typeof e.description === "string" && e.description ? { description: e.description } : {}),
    })),
  };
}

function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToBytes(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Compress a model graph into a compact, URL-safe payload string. */
export function encodeModel(graph: ModelGraph): string {
  const json = JSON.stringify(sanitize(graph));
  return bytesToB64url(gzipSync(strToU8(json), { level: 9 }));
}

/** Reverse of encodeModel. Returns null on any malformed/corrupt payload. */
export function decodeModel(payload: string): ModelGraph | null {
  try {
    const json = strFromU8(gunzipSync(b64urlToBytes(payload)));
    const g = JSON.parse(json) as ModelGraph;
    if (!g || !Array.isArray(g.nodes) || !Array.isArray(g.edges)) return null;
    return sanitize(g); // re-normalize (defends against hand-edited payloads)
  } catch {
    return null;
  }
}

/** Full shareable URL for the current page that reopens `graph`. */
export function buildShareUrl(graph: ModelGraph, name?: string): string {
  // The model name isn't part of the graph, so carry it alongside the payload as
  // a separate hash param — the recipient opens the model under the sender's name.
  const namePart = name && name.trim() ? `&${NAME_KEY}=${encodeURIComponent(name.trim())}` : "";
  return `${location.origin}${location.pathname}#${HASH_KEY}=${encodeModel(graph)}${namePart}`;
}

/** If the current URL carries a shared model, decode it; otherwise null. */
export function readSharedModel(): ModelGraph | null {
  const match = new RegExp(`[#&]${HASH_KEY}=([^&]+)`).exec(location.hash);
  return match ? decodeModel(match[1]) : null;
}

/** The model name carried in a shared link, if any. */
export function readSharedName(): string | null {
  const match = new RegExp(`[#&]${NAME_KEY}=([^&]+)`).exec(location.hash);
  if (!match) return null;
  try { return migrateModelName(decodeURIComponent(match[1])); } catch { return null; }
}

/** Strip the shared-model payload from the address bar (after we've loaded it),
 *  so a refresh doesn't re-clobber the canvas and the URL stays clean. */
export function clearSharedModelFromUrl(): void {
  if (new RegExp(`[#&]${HASH_KEY}=`).test(location.hash)) {
    history.replaceState(null, "", location.pathname + location.search);
  }
}
