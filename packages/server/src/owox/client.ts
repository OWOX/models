import type { OwoxKeyParts, DataMartListItem, CreateDataMartInput, ImportMart, ImportRelationship } from "./types";
type FetchFn = typeof fetch;

// Allowlist for the apiOrigin embedded in a user-supplied key. Without this,
// a crafted key could point apiOrigin at internal hosts (cloud metadata,
// localhost, private IPs) and the server would fetch them — a classic SSRF.
// Suffixes starting with "." also match the bare apex (".owox.com" → owox.com).
const ALLOWED_ORIGIN_SUFFIXES = (process.env.OWOX_ALLOWED_ORIGIN_SUFFIXES || ".owox.com")
  .split(",").map((s) => s.trim()).filter(Boolean);

export function assertAllowedOrigin(origin: string): void {
  let u: URL;
  try { u = new URL(origin); } catch { throw new Error("API key has an invalid apiOrigin"); }
  if (u.protocol !== "https:") throw new Error("apiOrigin must use https");
  const host = u.hostname;
  const ok = ALLOWED_ORIGIN_SUFFIXES.some((suf) =>
    suf.startsWith(".") ? host === suf.slice(1) || host.endsWith(suf) : host === suf,
  );
  if (!ok) throw new Error("apiOrigin is not an allowed OWOX host");
}

export function parseApiKey(key: string): OwoxKeyParts {
  const k = key.trim();
  if (!k.startsWith("owox_key_")) throw new Error("API key must start with owox_key_");
  const json = JSON.parse(Buffer.from(k.slice("owox_key_".length), "base64url").toString("utf8"));
  if (!json.apiOrigin || !json.apiKeyId || !json.apiKeySecret) throw new Error("API key missing fields");
  const apiOrigin = String(json.apiOrigin).replace(/\/$/, "");
  assertAllowedOrigin(apiOrigin);
  return { apiOrigin, apiKeyId: json.apiKeyId, apiKeySecret: json.apiKeySecret };
}

export async function exchangeToken(p: OwoxKeyParts, f: FetchFn = fetch): Promise<string> {
  const res = await f(`${p.apiOrigin}/api/auth/api-keys/exchange`, {
    method: "POST", headers: { "Content-Type": "application/json", "X-OWOX-Api-Key-Id": p.apiKeyId },
    body: JSON.stringify({ apiKeySecret: p.apiKeySecret }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  const data = await res.json() as { accessToken?: string };
  if (!data.accessToken) throw new Error("No accessToken in exchange response");
  return data.accessToken;
}

export function decodeProjectFromToken(token: string): { projectTitle?: string; fullName?: string; email?: string } {
  // JWT payload fields confirmed against the live API: projectTitle, userFullName, userEmail.
  try {
    const p = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    return { projectTitle: p.projectTitle, fullName: p.userFullName, email: p.userEmail };
  } catch { return {}; }
}

// OWOX puts the actionable part of a validation error at the END of its message
// ("Invalid enum value. Expected 'INTEGER' | … , received 'VARIANT'"), so slicing
// the head off a raw error body hides exactly the bit the user needs — the enum
// list alone eats ~300 chars. Prefer the JSON `message` over the whole envelope
// (which repeats the path and timestamp) and, when it still must be shortened,
// keep both ends.
const MAX_ERROR_DETAIL = 600;

export function owoxErrorDetail(body: string): string {
  let detail = body;
  try {
    const j = JSON.parse(body) as { message?: unknown; error?: unknown };
    const msg = Array.isArray(j.message) ? j.message.join("; ") : j.message;
    if (typeof msg === "string" && msg) detail = msg;
    else if (typeof j.error === "string" && j.error) detail = j.error;
  } catch { /* not JSON — keep the raw body */ }
  detail = detail.replace(/\s+/g, " ").trim();
  if (detail.length <= MAX_ERROR_DETAIL) return detail;
  const head = Math.ceil((MAX_ERROR_DETAIL - 1) / 2);
  return `${detail.slice(0, head)}…${detail.slice(head - (MAX_ERROR_DETAIL - 1))}`;
}

export class OwoxClient {
  constructor(private origin: string, private token: string, private keyId: string, private f: FetchFn = fetch) {}
  // Every /api/* call needs BOTH x-owox-authorization AND X-OWOX-Api-Key-Id;
  // missing the key-id header makes OWOX respond 403 (confirmed against the live API).
  private h() { return { "x-owox-authorization": `Bearer ${this.token}`, "X-OWOX-Api-Key-Id": this.keyId, "Content-Type": "application/json" }; }
  private async json<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await this.f(`${this.origin}${path}`, { method, headers: this.h(), body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`OWOX ${method} ${path} -> ${res.status} ${owoxErrorDetail(body)}`);
    }
    return (res.status === 204 ? undefined : await res.json()) as T;
  }
  async listDataMarts(): Promise<DataMartListItem[]> {
    const out: DataMartListItem[] = []; let offset: number | undefined;
    for (;;) {
      const qs = offset !== undefined ? `?offset=${offset}` : "";
      const page = await this.json<{ items: DataMartListItem[]; nextOffset: number | null }>("GET", `/api/data-marts${qs}`);
      out.push(...page.items); if (page.nextOffset === null || page.nextOffset === undefined) break; offset = page.nextOffset;
    }
    return out;
  }
  getDataMart(id: string) { return this.json<any>("GET", `/api/data-marts/${encodeURIComponent(id)}`); }
  createDataMart(input: CreateDataMartInput) { return this.json<{ id: string }>("POST", "/api/data-marts", input); }
  updateTitle(id: string, title: string) { return this.json("PUT", `/api/data-marts/${id}/title`, { title }); }
  updateDescription(id: string, description: string) { return this.json("PUT", `/api/data-marts/${id}/description`, { description }); }
  updateDefinition(id: string, body: unknown) { return this.json("PUT", `/api/data-marts/${id}/definition`, body); }
  // body is the storage-specific envelope: { schema: { type, fields:[...] } }
  updateSchema(id: string, body: unknown) { return this.json("PUT", `/api/data-marts/${id}/schema`, body); }
  deleteDataMart(id: string) { return this.json("DELETE", `/api/data-marts/${id}`); }
  listStorages() { return this.json<any[]>("GET", "/api/data-storages"); }
  // Joinable relationship (confirmed live): POST .../{sourceId}/relationships,
  // body { targetDataMartId, targetAlias (required), joinConditions:[{sourceFieldName,targetFieldName}] }.
  createRelationship(sourceId: string, body: { targetDataMartId: string; targetAlias: string; joinConditions: { sourceFieldName: string; targetFieldName: string }[] }) {
    return this.json<{ id: string }>("POST", `/api/data-marts/${encodeURIComponent(sourceId)}/relationships`, body);
  }
  // A storage's marts, matched by storage title + type (list items carry
  // storage:{type,title} but NO storage id). Reuses listDataMarts (paginates),
  // which passes raw page items through unchanged so storage survives.
  async listDataMartsForStorage(storageTitle: string, storageType: string): Promise<{ id: string; title: string; status?: string }[]> {
    const all = (await this.listDataMarts()) as any[];
    return all
      .filter(m => m.storage?.title === storageTitle && m.storage?.type === storageType)
      .map(m => ({ id: m.id, title: m.title, status: m.status }));
  }

  async getImportMart(id: string): Promise<ImportMart> {
    const d = await this.getDataMart(id);
    const fields: any[] = d.schema?.fields ?? [];
    const dt: string | undefined = d.definitionType;
    const def = d.definition ?? {};
    // SQL → sqlQuery; VIEW/TABLE → fullyQualifiedName; CONNECTOR → null (config too complex).
    const definition =
      dt === "SQL" ? (def.sqlQuery ?? null)
      : (dt === "TABLE" || dt === "VIEW") ? (def.fullyQualifiedName ?? null)
      : null;
    const inputSource = (dt === "SQL" || dt === "TABLE" || dt === "VIEW" || dt === "CONNECTOR") ? dt : "SQL";
    return {
      id: d.id ?? id, title: d.title ?? "", status: d.status,
      ...(d.description ? { description: d.description } : {}),
      schema: fields.map(f => ({
        name: f.name, type: f.type, pk: !!f.isPrimaryKey,
        ...(f.alias ? { alias: f.alias } : {}),
        ...(f.description ? { description: f.description } : {}),
      })),
      inputSource, definition,
    };
  }

  // Read the relationship graph rooted at this mart. The graph spans the whole
  // connected component (transitive, with depth); every node.relationship is a
  // real DIRECT edge with its own join keys. Skip isCycleStub (cycle-break
  // duplicates) and dedupe by relationship.id within this call.
  async getRelationshipGraph(id: string): Promise<ImportRelationship[]> {
    const g = await this.json<{ nodes?: any[] }>("GET", `/api/data-marts/${encodeURIComponent(id)}/relationships/graph`).catch(() => ({ nodes: [] }));
    const seen = new Set<string>();
    const out: ImportRelationship[] = [];
    for (const n of g.nodes ?? []) {
      if (n.isCycleStub) continue;
      const r = n.relationship; if (!r || seen.has(r.id)) continue;
      seen.add(r.id);
      out.push({
        sourceId: r.sourceDataMart.id,
        targetId: r.targetDataMart.id,
        joinConditions: (r.joinConditions ?? []).map((j: any) => ({
          sourceFieldName: j.sourceFieldName, targetFieldName: j.targetFieldName,
        })),
      });
    }
    return out;
  }
}
