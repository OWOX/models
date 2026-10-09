import { describe, it, expect, vi } from "vitest";
import { parseApiKey, exchangeToken, OwoxClient, owoxErrorDetail } from "../src/owox/client";
import list from "./fixtures/owox-list.json";
import detail from "./fixtures/owox-detail.json";
import graph from "./fixtures/owox-relationships-graph.json";

const KEY = "owox_key_" + Buffer.from(JSON.stringify({
  apiOrigin: "https://app.owox.com", apiKeyId: "kid_1", apiKeySecret: "sec_1",
})).toString("base64url");

const keyFor = (apiOrigin: string) =>
  "owox_key_" + Buffer.from(JSON.stringify({ apiOrigin, apiKeyId: "kid_1", apiKeySecret: "sec_1" })).toString("base64url");

describe("parseApiKey", () => {
  it("decodes origin/id/secret", () =>
    expect(parseApiKey(KEY)).toEqual({ apiOrigin: "https://app.owox.com", apiKeyId: "kid_1", apiKeySecret: "sec_1" }));
  it("rejects malformed keys", () => expect(() => parseApiKey("nope")).toThrow());
  // SSRF guard: apiOrigin must be an https owox.com host.
  it("rejects a non-owox apiOrigin", () => expect(() => parseApiKey(keyFor("https://evil.com"))).toThrow(/allowed OWOX host/));
  it("rejects an owox look-alike host", () => expect(() => parseApiKey(keyFor("https://evilowox.com"))).toThrow(/allowed OWOX host/));
  it("rejects the cloud metadata IP", () => expect(() => parseApiKey(keyFor("http://169.254.169.254"))).toThrow());
  it("rejects http (non-tls) origins", () => expect(() => parseApiKey(keyFor("http://app.owox.com"))).toThrow(/https/));
  it("accepts the apex and subdomains of owox.com", () => {
    expect(parseApiKey(keyFor("https://owox.com")).apiOrigin).toBe("https://owox.com");
    expect(parseApiKey(keyFor("https://app.owox.com")).apiOrigin).toBe("https://app.owox.com");
  });
});

describe("exchangeToken", () => {
  it("posts secret and returns the access token", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ accessToken: "tok_1" }), { status: 200 }));
    const tok = await exchangeToken(parseApiKey(KEY), fetchMock as any);
    expect(tok).toBe("tok_1");
    expect(fetchMock).toHaveBeenCalledWith("https://app.owox.com/api/auth/api-keys/exchange",
      expect.objectContaining({ method: "POST" }));
  });
});

describe("OwoxClient.listDataMarts", () => {
  it("pages until nextOffset is null", async () => {
    const pages = [
      new Response(JSON.stringify({ items: [{ id: "a" }], nextOffset: 1 }), { status: 200 }),
      new Response(JSON.stringify({ items: [{ id: "b" }], nextOffset: null }), { status: 200 }),
    ];
    const fetchMock = vi.fn(async () => pages.shift()!);
    const c = new OwoxClient("https://app.owox.com", "tok_1", "kid_1", fetchMock as any);
    expect((await c.listDataMarts()).map(m => m.id)).toEqual(["a", "b"]);
  });

  it("sends both x-owox-authorization and X-OWOX-Api-Key-Id headers", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ items: [], nextOffset: null }), { status: 200 }));
    const c = new OwoxClient("https://app.owox.com", "tok_1", "kid_1", fetchMock as any);
    await c.listDataMarts();
    const headers = (fetchMock.mock.calls[0][1] as any).headers;
    expect(headers["x-owox-authorization"]).toBe("Bearer tok_1");
    expect(headers["X-OWOX-Api-Key-Id"]).toBe("kid_1");
  });
});

// Verbatim 400 body from the live API (PUT /schema with an invalid field type).
// The part that tells the user what to fix — "received 'VARIANT'" — is at the very
// end, which is why the error must never be shortened from the front.
const SCHEMA_400 = JSON.stringify({
  statusCode: 400,
  timestamp: "2026-08-06T17:53:04.453Z",
  path: "/api/data-marts/6236005d-79bd-4615-8d57-ed42dbeb71e0/schema",
  message:
    "Failed to validate BigQuery schema:\nInvalid enum value. Expected 'INTEGER' | 'FLOAT' | 'NUMERIC' | " +
    "'BIGNUMERIC' | 'STRING' | 'BYTES' | 'BOOLEAN' | 'DATE' | 'TIME' | 'DATETIME' | 'TIMESTAMP' | " +
    "'GEOGRAPHY' | 'JSON' | 'RECORD' | 'STRUCT' | 'RANGE' | 'INTERVAL', received 'VARIANT'",
  errorDetails: { zodErrors: [{ received: "VARIANT", code: "invalid_enum_value", path: ["fields", 0, "type"] }] },
});

describe("owoxErrorDetail", () => {
  it("keeps the received value — the only actionable part of a schema 400", () => {
    const detail = owoxErrorDetail(SCHEMA_400);
    expect(detail).toContain("received 'VARIANT'");
    expect(detail).toContain("Failed to validate BigQuery schema");
    expect(detail).not.toContain("timestamp"); // envelope noise is dropped
  });

  it("joins Nest's array-shaped message", () => {
    expect(owoxErrorDetail(JSON.stringify({ message: ["a must be an array", "b is required"] })))
      .toBe("a must be an array; b is required");
  });

  it("falls back to `error`, then to the raw body", () => {
    expect(owoxErrorDetail(JSON.stringify({ error: "Bad Request" }))).toBe("Bad Request");
    expect(owoxErrorDetail("<html>502 Bad Gateway</html>")).toBe("<html>502 Bad Gateway</html>");
  });

  it("keeps both ends when it has to shorten", () => {
    const long = `START${"x".repeat(2000)}received 'DATETIME'`;
    const out = owoxErrorDetail(JSON.stringify({ message: long }));
    expect(out.length).toBeLessThanOrEqual(600);
    expect(out.startsWith("START")).toBe(true);
    expect(out.endsWith("received 'DATETIME'")).toBe(true);
  });

  it("surfaces the full detail through a failed request", async () => {
    const fetchMock = vi.fn(async () => new Response(SCHEMA_400, { status: 400 }));
    const c = new OwoxClient("https://app.owox.com", "tok", "kid", fetchMock as any);
    await expect(c.updateSchema("id_1", {})).rejects.toThrow(/received 'VARIANT'/);
  });
});

describe("OwoxClient read methods", () => {
  const clientWith = (body: unknown) => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status: 200 }));
    return { c: new OwoxClient("https://app.owox.com", "tok", "kid", fetchMock as any), fetchMock };
  };

  it("getImportMart normalizes schema (incl. pk/alias/description) + SQL definition", async () => {
    const { c } = clientWith(detail);
    const m = await c.getImportMart(detail.id);
    expect(m).toMatchObject({ id: detail.id, title: detail.title, inputSource: "SQL" });
    expect(m.description).toContain("Demo guide"); // mart-level description must be imported
    expect(m.definition).toContain("SELECT");
    // session_id is the primary key in the fixture
    expect(m.schema.find(f => f.name === "session_id")).toMatchObject({ type: "STRING", pk: true });
    expect(m.schema.find(f => f.name === "date")).toMatchObject({ pk: false });
  });

  it("getRelationshipGraph maps nodes to source/target ids, skips cycle stubs, dedupes by id", async () => {
    const { c } = clientWith(graph);
    const out = await c.getRelationshipGraph(graph.rootDataMartId);
    // fixture: 2 direct (depth 1) edges + 1 isCycleStub:true node → stub dropped
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({
      sourceId: "b4f59656-d52e-4ae3-847e-c34c025956bf",
      targetId: "61b3c045-b334-440d-9913-bf52bc622af4",
      targetAlias: "traffic_sources_e_commerce",
      joinConditions: [{ sourceFieldName: "traffic_source_id", targetFieldName: "traffic_source_id" }],
    });
  });

  it("listDataMartsForStorage matches on storage title + type", async () => {
    const { c } = clientWith(list);
    const out = await c.listDataMartsForStorage("BigQuery [Common]", "GOOGLE_BIGQUERY");
    expect(out.map(m => m.id)).toEqual([
      "d57170ef-8de5-4475-bbfb-61b20a72b051",
      "b4f59656-d52e-4ae3-847e-c34c025956bf",
    ]);
  });
});

// A push that fails on an expired OWOX token must be distinguishable from any
// other upstream failure, so the error carries the upstream status verbatim
// rather than only burying it in the message text.
describe("OwoxClient error status", () => {
  it("attaches the upstream status to the thrown error", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ message: "Authentication failed" }), { status: 401 }));
    const c = new OwoxClient("https://app.owox.com", "tok_expired", "kid_1", fetchMock as any);
    const err = await c.createDataMart({ title: "T", storageId: "st" } as any).catch(e => e);
    expect(err.owoxStatus).toBe(401);
    expect(err.message).toContain("401 Authentication failed");
  });
});

describe("OwoxClient import mapping", () => {
  it("maps a calculated field to plain SQL and keeps the relationship alias", async () => {
    const detail = { id: "m1", title: "Orders", definitionType: "TABLE", definition: { fullyQualifiedName: "p.d.t" },
      schema: { fields: [
        { name: "amount", type: "NUMERIC", isPrimaryKey: false },
        { name: "rpc", type: "NUMERIC", isPrimaryKey: false, calculated: { formula: 'SUM({{ref field="amount"}}) / COUNT({{ref path="cust" field="id"}})', level: "metric" } },
      ] } };
    const graph = { nodes: [{ isCycleStub: false, relationship: { id: "r1", sourceDataMart: { id: "m1" }, targetDataMart: { id: "m2" }, targetAlias: "cust", joinConditions: [] } }] };
    const fetchMock = vi.fn(async (url: string) => new Response(JSON.stringify(url.includes("/relationships/graph") ? graph : detail), { status: 200 }));
    const c = new OwoxClient("https://app.owox.com", "tok", "kid", fetchMock as any);
    const mart = await c.getImportMart("m1");
    expect(mart.schema[1]).toEqual({ name: "rpc", type: "NUMERIC", pk: false, formula: "SUM(amount) / COUNT(cust.id)" });
    expect(mart.schema[0].formula).toBeUndefined();
    expect((await c.getRelationshipGraph("m1"))[0].targetAlias).toBe("cust");
  });

  it("renders the calculated field of the recorded detail fixture", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(detail), { status: 200 }));
    const c = new OwoxClient("https://app.owox.com", "tok", "kid", fetchMock as any);
    const m = await c.getImportMart(detail.id);
    expect(m.schema.find(f => f.name === "unique_visitors")?.formula).toBe("COUNT(DISTINCT visitor_id)");
  });
});

// Live probe body (2026-10-09): the reason is only in errorDetails.errors[].message.
const CALC_400 = JSON.stringify({
  statusCode: 400,
  message: "Calculated field validation failed",
  errorDetails: { errors: [
    { code: "FORMULA_UNKNOWN_REFERENCE", field: "ctr", subject: "clicks", message: "Formula references no field \"clicks\" — it no longer exists" },
    { code: "FORMULA_AGGREGATE_WITHOUT_FIELD", field: "ctr", subject: "SUM", message: "Aggregate SUM has no field" },
  ] },
});

describe("owoxErrorDetail — calculated field errors", () => {
  it("appends each error's message to the headline", () => {
    const d = owoxErrorDetail(CALC_400);
    expect(d.startsWith("Calculated field validation failed: ")).toBe(true);
    expect(d).toContain("references no field");
    expect(d).toContain("Aggregate SUM has no field");
    expect(d).toContain("; ");
  });
});

describe("OwoxClient empty bodies, publish and actualize", () => {
  const mk = (fetchMock: any) => new OwoxClient("https://app.owox.com", "tok", "kid", fetchMock);

  it("resolves an empty 200 body (DELETE) instead of throwing", async () => {
    const fetchMock = vi.fn(async () => new Response("", { status: 200 }));
    await expect(mk(fetchMock).deleteDataMart("m1")).resolves.toBeUndefined();
  });

  it("publishDataMart PUTs /publish", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    await mk(fetchMock).publishDataMart("m1");
    expect(fetchMock.mock.calls[0][0]).toBe("https://app.owox.com/api/data-marts/m1/publish");
    expect((fetchMock.mock.calls[0][1] as any).method).toBe("PUT");
  });

  const triggerFetch = (statuses: string[], result: unknown) => vi.fn(async (url: string, init: any) => {
    if (init.method === "POST") return new Response(JSON.stringify({ triggerId: "t1" }), { status: 200 });
    if (url.endsWith("/status")) return new Response(JSON.stringify({ status: statuses.length > 1 ? statuses.shift() : statuses[0] }), { status: 200 });
    return new Response(JSON.stringify(result), { status: 200 });
  });

  it("polls READY → PROCESSING → SUCCESS, then reads the result", async () => {
    const f = triggerFetch(["READY", "PROCESSING", "SUCCESS"], { success: true });
    const sleep = vi.fn(async () => {});
    await expect(mk(f).actualizeSchema("m1", { sleep })).resolves.toEqual({ success: true });
    expect(sleep).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledWith(1000);
    const urls = f.mock.calls.map(c => `${(c[1] as any).method} ${c[0]}`);
    expect(urls[0]).toBe("POST https://app.owox.com/api/data-marts/m1/schema-actualize-triggers");
    expect(urls.at(-1)).toBe("GET https://app.owox.com/api/data-marts/m1/schema-actualize-triggers/t1");
  });

  it("reports the trigger's error on ERROR, or a default", async () => {
    expect(await mk(triggerFetch(["ERROR"], { success: false, error: "Table not found" })).actualizeSchema("m1", { sleep: async () => {} }))
      .toEqual({ success: false, error: "Table not found" });
    expect(await mk(triggerFetch(["ERROR"], { success: false })).actualizeSchema("m1", { sleep: async () => {} }))
      .toEqual({ success: false, error: "Schema actualization failed" });
  });

  it("stops on any terminal status, e.g. CANCELLED", async () => {
    const out = await mk(triggerFetch(["PROCESSING", "CANCELLED"], { success: false })).actualizeSchema("m1", { sleep: async () => {} });
    expect(out).toEqual({ success: false, error: "Schema actualization CANCELLED" });
  });

  it("times out when the trigger never finishes", async () => {
    const f = triggerFetch(["PROCESSING"], { success: true });
    const out = await mk(f).actualizeSchema("m1", { sleep: async () => {}, intervalMs: 1000, timeoutMs: 3000 });
    expect(out).toEqual({ success: false, error: "Schema check timed out" });
  });
});

describe("owoxErrorDetail — errorDetails without a top-level message", () => {
  it("returns just the joined reasons", () => {
    const body = JSON.stringify({ statusCode: 400, errorDetails: { errors: [{ message: "a is bad" }, { message: "b is bad" }] } });
    expect(owoxErrorDetail(body)).toBe("a is bad; b is bad");
  });
});
