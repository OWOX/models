import { describe, it, expect, vi } from "vitest";
import { pushModel, pushPreview } from "../src/sync/push";
import { createModelStore } from "../src/state/model";
import type { ModelGraph, ModelEdge } from "@mc/okf";

describe("pushPreview", () => {
  const mk = (over: Partial<ModelGraph>): ModelGraph => ({ storageId: "st_1", nodes: [], edges: [], ...over });

  it("counts a stale 'created' mart (different storage) as to-be-pushed", () => {
    const g = mk({ nodes: [
      { key: "n1", title: "A", inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "created", owoxId: "a", owoxStorageId: "OLD" },
    ] });
    expect(pushPreview(g, "st_1").marts).toBe(1);
  });
  it("does not count a mart already live in the active storage", () => {
    const g = mk({ nodes: [
      { key: "n1", title: "A", inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "created", owoxId: "a", owoxStorageId: "st_1" },
    ] });
    expect(pushPreview(g, "st_1").marts).toBe(0);
  });
  it("skips an existing edge only when both endpoints stay (else counts it)", () => {
    const live = { inputSource: "SQL" as const, schema: [], position: { x: 0, y: 0 }, status: "created" as const };
    const skipBoth = mk({
      nodes: [
        { key: "n1", title: "A", ...live, owoxId: "a", owoxStorageId: "st_1" },
        { key: "n2", title: "B", ...live, owoxId: "b", owoxStorageId: "st_1" },
      ],
      edges: [{ id: "e1", from: "n1", to: "n2", keys: [], bidirectional: false, existing: true }],
    });
    expect(pushPreview(skipBoth, "st_1").relationships).toBe(0);
    const staleEnd = mk({
      nodes: [
        { key: "n1", title: "A", ...live, owoxId: "a", owoxStorageId: "OLD" },
        { key: "n2", title: "B", ...live, owoxId: "b", owoxStorageId: "st_1" },
      ],
      edges: [{ id: "e1", from: "n1", to: "n2", keys: [], bidirectional: false, existing: true }],
    });
    expect(pushPreview(staleEnd, "st_1").relationships).toBe(1);
  });
  it("reports how many marts are already live here, so the dialog can explain the skip", () => {
    const live = { inputSource: "SQL" as const, schema: [], position: { x: 0, y: 0 }, status: "created" as const };
    const g = mk({ nodes: [
      { key: "n1", title: "A", ...live, owoxId: "a", owoxStorageId: "st_1" },
      { key: "n2", title: "B", ...live, owoxId: "b", owoxStorageId: "st_1" },
      { key: "n3", title: "C", ...live, owoxId: "c", owoxStorageId: "OLD" }, // other storage → not "already pushed here"
      { key: "n4", title: "D", inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "pending" },
    ] });
    expect(pushPreview(g, "st_1").alreadyPushed).toBe(2);
    expect(pushPreview(g, "st_1").marts).toBe(2); // n3 + n4
  });
});

describe("pushModel", () => {
  it("creates pending nodes, stores owoxId, sets created", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.addNode({ x: 0, y: 0 });
    const calls: string[] = [];
    const apiMock = vi.fn(async (path: string) => { calls.push(path); return { id: "owox_a" }; });
    const res = await pushModel(s, apiMock as any);
    expect(calls).toContain("/api/data-marts");
    expect(s.get().nodes[0].status).toBe("created");
    expect(s.get().nodes[0].owoxId).toBe("owox_a");
    expect(s.get().nodes[0].owoxStorageId).toBe("stor_1"); // tagged with the storage it was created in
    expect(res.created).toBe(1); expect(res.failed).toBe(0);
  });
  it("pushes the input-source type in the definition envelope", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    const n = s.addNode({ x: 0, y: 0 });
    s.updateNode(n.key, { inputSource: "TABLE", definition: "proj.ds.orders" });
    const bodies: Record<string, any> = {};
    const apiMock = vi.fn(async (path: string, init?: any) => {
      if (init?.body) bodies[path] = JSON.parse(init.body);
      return { id: "owox_a" };
    });
    await pushModel(s, apiMock as any);
    const defBody = bodies["/api/data-marts/owox_a/definition"];
    expect(defBody).toEqual({ definitionType: "TABLE", definition: { fullyQualifiedName: "proj.ds.orders" } });
  });

  it("pushes VIEW as a fully-qualified reference, not a SQL query", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    const n = s.addNode({ x: 0, y: 0 });
    s.updateNode(n.key, { inputSource: "VIEW", definition: "proj.ds.sessions_v" });
    const bodies: Record<string, any> = {};
    const apiMock = vi.fn(async (path: string, init?: any) => {
      if (init?.body) bodies[path] = JSON.parse(init.body);
      return { id: "owox_a" };
    });
    await pushModel(s, apiMock as any);
    expect(bodies["/api/data-marts/owox_a/definition"])
      .toEqual({ definitionType: "VIEW", definition: { fullyQualifiedName: "proj.ds.sessions_v" } });
  });

  it("pushes per-field alias and description in the output schema", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    const n = s.addNode({ x: 0, y: 0 });
    s.updateNode(n.key, { schema: [{ name: "id", type: "STRING", pk: true, alias: "user_id", description: "Unique id" }] });
    const bodies: Record<string, any> = {};
    const apiMock = vi.fn(async (path: string, init?: any) => {
      if (init?.body) bodies[path] = JSON.parse(init.body);
      return { id: "owox_a" };
    });
    await pushModel(s, apiMock as any, "GOOGLE_BIGQUERY");
    const field = bodies["/api/data-marts/owox_a/schema"].schema.fields[0];
    expect(field).toMatchObject({ name: "id", alias: "user_id", description: "Unique id", isPrimaryKey: true });
  });

  it("derives the schema discriminator by storage engine, stripping LEGACY_/GOOGLE_/AWS_ prefixes", async () => {
    const cases: Array<[string, string]> = [
      ["GOOGLE_BIGQUERY", "bigquery-data-mart-schema"],
      ["LEGACY_GOOGLE_BIGQUERY", "bigquery-data-mart-schema"],
      ["AWS_ATHENA", "athena-data-mart-schema"],
    ];
    for (const [storageType, expected] of cases) {
      const s = createModelStore({ storageId: "stor_1" });
      const n = s.addNode({ x: 0, y: 0 });
      s.updateNode(n.key, { schema: [{ name: "id", type: "STRING", pk: true }] });
      const bodies: Record<string, any> = {};
      const apiMock = vi.fn(async (path: string, init?: any) => {
        if (init?.body) bodies[path] = JSON.parse(init.body);
        return { id: "owox_a" };
      });
      await pushModel(s, apiMock as any, storageType);
      expect(bodies["/api/data-marts/owox_a/schema"].schema.type).toBe(expected);
    }
  });

  it("marks a node error on failure and counts it", async () => {
    const s = createModelStore({ storageId: "stor_1" }); s.addNode({ x: 0, y: 0 });
    const apiMock = vi.fn(async () => { throw new Error("boom"); });
    const res = await pushModel(s, apiMock as any);
    expect(s.get().nodes[0].status).toBe("error");
    expect(res.failed).toBe(1);
  });

  it("never sends cardinality in the relationship body", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      nodes: [
        { key: "n1", title: "Orders", inputSource: "SQL", schema: [{ name: "customer_id", type: "STRING", pk: false }], position: { x: 0, y: 0 }, status: "created", owoxId: "owox_a", owoxStorageId: "stor_1" },
        { key: "n2", title: "Customers", inputSource: "SQL", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 100, y: 0 }, status: "created", owoxId: "owox_b", owoxStorageId: "stor_1" },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2", keys: [{ left: "customer_id", right: "id" }], bidirectional: false, cardinality: "N:1" },
      ],
    });
    const relationshipBodies: string[] = [];
    const apiMock = vi.fn(async (path: string, init?: any) => {
      if (path.includes("/relationships") && init?.body) relationshipBodies.push(init.body as string);
      return { id: "owox_rel" };
    });
    await pushModel(s, apiMock as any);
    expect(relationshipBodies.length).toBeGreaterThan(0);
    for (const b of relationshipBodies) expect(b).not.toContain("cardinality");
  });

  it("skips an imported edge (existing: true) — no relationship POST for a join that already exists in OWOX", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      nodes: [
        { key: "n1", title: "Orders", inputSource: "SQL", schema: [{ name: "customer_id", type: "STRING", pk: false }], position: { x: 0, y: 0 }, status: "created", owoxId: "owox_a", owoxStorageId: "stor_1" },
        { key: "n2", title: "Customers", inputSource: "SQL", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 100, y: 0 }, status: "created", owoxId: "owox_b", owoxStorageId: "stor_1" },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2", keys: [{ left: "customer_id", right: "id" }], bidirectional: false, existing: true },
      ],
    });
    const relationshipCalls: string[] = [];
    const apiMock = vi.fn(async (path: string) => {
      if (path.includes("/relationships")) relationshipCalls.push(path);
      return { id: "owox_rel" };
    });
    const res = await pushModel(s, apiMock as any);
    expect(relationshipCalls).toHaveLength(0);
    expect(res.relationshipsCreated).toBe(0);
    expect(res.relationshipsFailed).toBe(0);
    expect(res.errors).toHaveLength(0);
  });

  it("recreates a 'created' mart whose owoxStorageId is a different storage (project/storage switch)", async () => {
    const s = createModelStore({ storageId: "stor_NEW" });
    s.set({
      storageId: "stor_NEW",
      // Imported from another project: created + owoxId, but tagged to a different storage.
      nodes: [
        { key: "n1", title: "Orders", inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "created", owoxId: "old_id", owoxStorageId: "stor_OLD" },
      ],
      edges: [],
    });
    const calls: string[] = [];
    const apiMock = vi.fn(async (path: string) => { calls.push(path); return { id: "new_id" }; });
    const res = await pushModel(s, apiMock as any);
    expect(calls).toContain("/api/data-marts");        // recreated, not skipped
    expect(res.created).toBe(1);
    expect(s.get().nodes[0].owoxId).toBe("new_id");
    expect(s.get().nodes[0].owoxStorageId).toBe("stor_NEW"); // re-tagged to the active storage
  });

  it("pushes an imported (existing) edge when an endpoint was recreated in a different storage", async () => {
    const s = createModelStore({ storageId: "stor_NEW" });
    s.set({
      storageId: "stor_NEW",
      nodes: [
        { key: "n1", title: "Orders", inputSource: "SQL", schema: [{ name: "customer_id", type: "STRING", pk: false }], position: { x: 0, y: 0 }, status: "created", owoxId: "old_a", owoxStorageId: "stor_OLD" },
        { key: "n2", title: "Customers", inputSource: "SQL", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 100, y: 0 }, status: "created", owoxId: "old_b", owoxStorageId: "stor_OLD" },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2", keys: [{ left: "customer_id", right: "id" }], bidirectional: false, existing: true },
      ],
    });
    const relationshipCalls: string[] = [];
    const apiMock = vi.fn(async (path: string) => { if (path.includes("/relationships")) relationshipCalls.push(path); return { id: "x" }; });
    const res = await pushModel(s, apiMock as any);
    // Marts were recreated in stor_NEW, so the join doesn't exist there yet → must be pushed.
    expect(relationshipCalls.length).toBeGreaterThan(0);
    expect(res.relationshipsCreated).toBeGreaterThan(0);
  });

  // A forced push checks what is actually in OWOX first (GET /api/data-marts),
  // so it can refuse to duplicate a mart the user did not in fact delete.
  const forceApi = (liveMarts: Array<{ id: string; title: string; status?: string }>, calls: string[] = []) =>
    vi.fn(async (path: string, init?: any) => {
      const method = init?.method ?? "GET";
      calls.push(`${method} ${path}`);
      if (path === "/api/data-marts" && method === "GET") return liveMarts;
      return { id: "fresh_id" };
    });

  it("force re-creates a mart that is gone from OWOX", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      nodes: [
        { key: "n1", title: "Orders", inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "created", owoxId: "gone_id", owoxStorageId: "stor_1" },
      ],
      edges: [],
    });
    const calls: string[] = [];
    const res = await pushModel(s, forceApi([{ id: "other_id", title: "Sessions" }], calls) as any, undefined, { force: true });
    expect(calls).toContain("POST /api/data-marts");
    expect(res.created).toBe(1);
    expect(res.blocked).toBe(0);
    expect(s.get().nodes[0].owoxId).toBe("fresh_id"); // the old id pointed at a deleted mart
    expect(s.get().nodes[0].status).toBe("created");
  });

  it("force refuses to duplicate a mart that still exists in OWOX, naming its status", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      nodes: [
        { key: "n1", title: "Orders", inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "created", owoxId: "still_there", owoxStorageId: "stor_1" },
      ],
      edges: [],
    });
    const calls: string[] = [];
    const res = await pushModel(s, forceApi([{ id: "still_there", title: "Orders", status: "DRAFT" }], calls) as any, undefined, { force: true });
    expect(calls).not.toContain("POST /api/data-marts"); // no duplicate created
    expect(res.created).toBe(0);
    expect(res.blocked).toBe(1);
    expect(res.failed).toBe(0); // nothing broke — we deliberately held back
    expect(res.errors[0]).toMatch(/Orders.*still exists in OWOX.*DRAFT/i);
    expect(s.get().nodes[0].status).toBe("created"); // it IS in OWOX, so the green dot is honest
    expect(s.get().nodes[0].owoxId).toBe("still_there");
  });

  it("force holds back the blocked marts but pushes the deleted ones", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      nodes: [
        { key: "n1", title: "Orders", inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "created", owoxId: "still_there", owoxStorageId: "stor_1" },
        { key: "n2", title: "Customers", inputSource: "SQL", schema: [], position: { x: 100, y: 0 }, status: "created", owoxId: "gone", owoxStorageId: "stor_1" },
      ],
      edges: [],
    });
    const bodies: string[] = [];
    const apiMock = vi.fn(async (path: string, init?: any) => {
      if (path === "/api/data-marts" && (init?.method ?? "GET") === "GET") return [{ id: "still_there", title: "Orders", status: "PUBLISHED" }];
      if (path === "/api/data-marts") bodies.push(String(init?.body));
      return { id: "fresh_id" };
    });
    const res = await pushModel(s, apiMock as any, undefined, { force: true });
    expect(res.created).toBe(1);
    expect(res.blocked).toBe(1);
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toContain("Customers"); // only the deleted one was recreated
  });

  it("force does not re-push a relationship between two blocked marts", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      nodes: [
        { key: "n1", title: "Orders", inputSource: "SQL", schema: [{ name: "customer_id", type: "STRING", pk: false }], position: { x: 0, y: 0 }, status: "created", owoxId: "live_a", owoxStorageId: "stor_1" },
        { key: "n2", title: "Customers", inputSource: "SQL", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 100, y: 0 }, status: "created", owoxId: "live_b", owoxStorageId: "stor_1" },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2", keys: [{ left: "customer_id", right: "id" }], bidirectional: false, existing: true },
      ],
    });
    const calls: string[] = [];
    const res = await pushModel(
      s,
      forceApi([{ id: "live_a", title: "Orders", status: "DRAFT" }, { id: "live_b", title: "Customers", status: "DRAFT" }], calls) as any,
      undefined,
      { force: true },
    );
    expect(calls.filter(c => c.includes("/relationships"))).toHaveLength(0);
    expect(res.blocked).toBe(2);
    expect(res.relationshipsCreated).toBe(0);
  });

  it("force pushes an existing edge once both endpoints were re-created", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      nodes: [
        { key: "n1", title: "Orders", inputSource: "SQL", schema: [{ name: "customer_id", type: "STRING", pk: false }], position: { x: 0, y: 0 }, status: "created", owoxId: "old_a", owoxStorageId: "stor_1" },
        { key: "n2", title: "Customers", inputSource: "SQL", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 100, y: 0 }, status: "created", owoxId: "old_b", owoxStorageId: "stor_1" },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2", keys: [{ left: "customer_id", right: "id" }], bidirectional: false, existing: true },
      ],
    });
    const calls: string[] = [];
    const res = await pushModel(s, forceApi([], calls) as any, undefined, { force: true }); // OWOX is empty — both were deleted
    expect(calls.filter(c => c.includes("/relationships"))).toHaveLength(1);
    expect(res.relationshipsCreated).toBe(1);
  });

  it("force aborts without pushing anything when it cannot check what is in OWOX", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      nodes: [
        { key: "n1", title: "Orders", inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "created", owoxId: "a", owoxStorageId: "stor_1" },
      ],
      edges: [],
    });
    const calls: string[] = [];
    const apiMock = vi.fn(async (path: string, init?: any) => {
      calls.push(`${init?.method ?? "GET"} ${path}`);
      if (path === "/api/data-marts" && (init?.method ?? "GET") === "GET") throw new Error("HTTP 500");
      return { id: "fresh_id" };
    });
    const res = await pushModel(s, apiMock as any, undefined, { force: true });
    expect(calls).not.toContain("POST /api/data-marts"); // duplicates are unrecoverable, so don't guess
    expect(res.created).toBe(0);
    expect(res.errors[0]).toMatch(/could not check|HTTP 500/i);
  });

  // A normal push now lists the project's marts too: the local "already created"
  // flag is not evidence that the mart still exists (it can be deleted in OWOX).
  it("lists OWOX marts on a normal push to verify the ids it holds", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.addNode({ x: 0, y: 0 });
    const calls: string[] = [];
    const apiMock = vi.fn(async (path: string, init?: any) => {
      calls.push(`${init?.method ?? "GET"} ${path}`);
      if (path === "/api/data-marts" && (init?.method ?? "GET") === "GET") return [];
      return { id: "owox_a" };
    });
    await pushModel(s, apiMock as any);
    expect(calls).toContain("GET /api/data-marts");
  });

  it("uses an underscore identifier (not a hyphenated slug) for targetAlias", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      nodes: [
        { key: "n1", title: "Comments", inputSource: "TABLE", schema: [{ name: "post_id", type: "INTEGER", pk: false }], position: { x: 0, y: 0 }, status: "created", owoxId: "owox_a", owoxStorageId: "stor_1" },
        { key: "n2", title: "Posts Questions", inputSource: "TABLE", schema: [{ name: "id", type: "INTEGER", pk: true }], position: { x: 100, y: 0 }, status: "created", owoxId: "owox_b", owoxStorageId: "stor_1" },
      ],
      edges: [{ id: "e1", from: "n1", to: "n2", keys: [{ left: "post_id", right: "id" }], bidirectional: false }],
    });
    const bodies: any[] = [];
    const apiMock = vi.fn(async (path: string, init?: any) => {
      if (path.includes("/relationships") && init?.body) bodies.push(JSON.parse(init.body));
      return { id: "owox_rel" };
    });
    await pushModel(s, apiMock as any);
    expect(bodies[0].targetAlias).toBe("posts_questions");
    expect(bodies[0].targetAlias).not.toContain("-");
  });

  it("creates a missing join field with the counterpart's type, not STRING", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      // newobj has an empty schema; the join pairs newobj.id with badges.id (INTEGER).
      nodes: [
        { key: "newobj", title: "New object", inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "created", owoxId: "owox_a", owoxStorageId: "stor_1" },
        { key: "badges", title: "Badges", inputSource: "TABLE", schema: [{ name: "id", type: "INTEGER", pk: true }], position: { x: 100, y: 0 }, status: "created", owoxId: "owox_b", owoxStorageId: "stor_1" },
      ],
      edges: [{ id: "e1", from: "newobj", to: "badges", keys: [{ left: "id", right: "id" }], bidirectional: false }],
    });
    const apiMock = vi.fn(async () => ({ id: "owox_rel" }));
    await pushModel(s, apiMock as any);
    const added = s.get().nodes.find(n => n.key === "newobj")!.schema.find(f => f.name === "id");
    expect(added?.type).toBe("INTEGER");
  });

  it("coerces an existing FK field's type to match the referenced PK", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      // newobj.id ALREADY exists as STRING (created in an earlier session); tags.id is an INTEGER PK.
      nodes: [
        { key: "newobj", title: "New object", inputSource: "SQL", schema: [{ name: "id", type: "STRING", pk: false }], position: { x: 0, y: 0 }, status: "created", owoxId: "owox_a", owoxStorageId: "stor_1" },
        { key: "tags", title: "Tags", inputSource: "TABLE", schema: [{ name: "id", type: "INTEGER", pk: true }], position: { x: 100, y: 0 }, status: "created", owoxId: "owox_b", owoxStorageId: "stor_1" },
      ],
      edges: [{ id: "e1", from: "newobj", to: "tags", keys: [{ left: "id", right: "id" }], bidirectional: true }],
    });
    const apiMock = vi.fn(async () => ({ id: "owox_rel" }));
    await pushModel(s, apiMock as any);
    expect(s.get().nodes.find(n => n.key === "newobj")!.schema.find(f => f.name === "id")!.type).toBe("INTEGER");
  });

  // A link drawn on the canvas starts with no join keys. OWOX accepts a
  // relationship with joinConditions: [] (confirmed live: 201) and shows it as
  // "Join not configured", so the link is pushed instead of reported as an error.
  it("pushes a keyless edge as an unconfigured join instead of failing it", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      nodes: [
        { key: "n1", title: "Session", inputSource: "SQL", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 0, y: 0 }, status: "created", owoxId: "owox_a", owoxStorageId: "stor_1" },
        { key: "n2", title: "Room", inputSource: "SQL", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 100, y: 0 }, status: "created", owoxId: "owox_b", owoxStorageId: "stor_1" },
      ],
      edges: [{ id: "e1", from: "n1", to: "n2", keys: [{ left: "", right: "" }], bidirectional: false }],
    });
    const bodies: any[] = [];
    const apiMock = vi.fn(async (path: string, init?: any) => {
      if (path.includes("/relationships") && init?.body) bodies.push(JSON.parse(init.body));
      return { id: "owox_rel" };
    });
    const res = await pushModel(s, apiMock as any);
    expect(bodies).toHaveLength(1);
    // The field must be present and an array — OWOX 400s when it is omitted.
    expect(bodies[0].joinConditions).toEqual([]);
    expect(bodies[0].targetAlias).toBe("room");
    expect(res.relationshipsCreated).toBe(1);
    expect(res.relationshipsWithoutKeys).toBe(1);
    expect(res.relationshipsFailed).toBe(0);
    expect(res.errors).toEqual([]);
  });

  it("still fails a link whose mart was never created", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    s.set({
      storageId: "stor_1",
      nodes: [
        { key: "n1", title: "Session", inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "created", owoxId: "owox_a", owoxStorageId: "stor_1" },
        { key: "n2", title: "Room", inputSource: "SQL", schema: [], position: { x: 100, y: 0 }, status: "pending", owoxId: null },
      ],
      edges: [{ id: "e1", from: "n1", to: "n2", keys: [], bidirectional: false }],
    });
    const apiMock = vi.fn(async (path: string) => {
      if (path === "/api/data-marts") throw new Error("boom"); // n2 never gets an id
      return { id: "owox_rel" };
    });
    const res = await pushModel(s, apiMock as any);
    expect(res.relationshipsCreated).toBe(0);
    expect(res.relationshipsFailed).toBe(1);
    expect(res.errors.some(e => /both marts must be created first/.test(e))).toBe(true);
  });

  // ── ghosts: marts we think we created, but OWOX no longer has ────────────────
  // Reported case: a model imported from OWOX (or pushed earlier), then deleted in
  // OWOX. The canvas kept the stale owoxId, the skip fired on local state alone,
  // and the relationship POST 404'd against a mart that no longer existed.
  describe("a mart deleted in OWOX", () => {
    // live: what GET /api/data-marts returns; every other call returns a fresh id.
    const apiWith = (live: Array<{ id: string; title?: string; status?: string }>, calls: string[] = [], bodies: any[] = []) =>
      vi.fn(async (path: string, init?: any) => {
        const method = init?.method ?? "GET";
        calls.push(`${method} ${path}`);
        if (path === "/api/data-marts" && method === "GET") return live;
        if (init?.body) bodies.push({ path, body: JSON.parse(init.body) });
        return { id: "fresh_id" };
      });

    const twoMarts = (edge: Partial<ModelEdge> = {}) => {
      const s = createModelStore({ storageId: "stor_1" });
      s.set({
        storageId: "stor_1",
        nodes: [
          { key: "n1", title: "A", inputSource: "SQL", schema: [{ name: "b_id", type: "STRING", pk: false }], position: { x: 0, y: 0 }, status: "created", owoxId: "ghost_a", owoxStorageId: "stor_1" },
          { key: "n2", title: "B", inputSource: "SQL", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 100, y: 0 }, status: "created", owoxId: "ghost_b", owoxStorageId: "stor_1" },
        ],
        edges: [{ id: "e1", from: "n1", to: "n2", keys: [{ left: "b_id", right: "id" }], bidirectional: false, ...edge }],
      });
      return s;
    };

    it("re-creates it instead of skipping, and reports the repair", async () => {
      const s = twoMarts();
      const res = await pushModel(s, apiWith([]) as any); // OWOX has neither mart
      expect(res.created).toBe(2);
      expect(res.recreated).toBe(2);
      expect(res.failed).toBe(0);
      expect(s.get().nodes.map(n => n.owoxId)).toEqual(["fresh_id", "fresh_id"]);
    });

    it("points the relationship at the NEW id — the reported 404", async () => {
      const s = twoMarts();
      const calls: string[] = [];
      const res = await pushModel(s, apiWith([], calls) as any);
      expect(calls).toContain("POST /api/data-marts/fresh_id/relationships");
      expect(calls).not.toContain("POST /api/data-marts/ghost_a/relationships");
      expect(res.relationshipsCreated).toBe(1);
      expect(res.errors).toEqual([]);
    });

    it("pushes an imported edge too, instead of reporting a silent success", async () => {
      // Both endpoints gone: the old skip made this push a no-op that still said
      // "Push complete" — nothing in OWOX, no error, nothing to act on.
      const s = twoMarts({ existing: true });
      const res = await pushModel(s, apiWith([]) as any);
      expect(res.created).toBe(2);
      expect(res.relationshipsCreated).toBe(1);
    });

    it("leaves a mart that is still there alone", async () => {
      const s = twoMarts();
      const calls: string[] = [];
      const bodies: any[] = [];
      const res = await pushModel(s, apiWith([{ id: "ghost_a", title: "A" }], calls, bodies) as any);
      expect(res.created).toBe(1);          // only B was missing
      expect(res.recreated).toBe(1);
      expect(bodies.filter(b => b.path === "/api/data-marts").map(b => b.body.title)).toEqual(["B"]);
      expect(s.get().nodes[0].owoxId).toBe("ghost_a"); // A keeps its id
    });

    it("keeps skipping when the listing can't be read — a guess would duplicate", async () => {
      const s = twoMarts();
      const calls: string[] = [];
      const apiMock = vi.fn(async (path: string, init?: any) => {
        const method = init?.method ?? "GET";
        calls.push(`${method} ${path}`);
        if (path === "/api/data-marts" && method === "GET") throw new Error("HTTP 500");
        return { id: "fresh_id" };
      });
      const res = await pushModel(s, apiMock as any);
      expect(calls).not.toContain("POST /api/data-marts");
      expect(res.created).toBe(0);
      expect(res.recreated).toBe(0);
    });
  });

  // Defence in depth for models saved before types were normalised on import:
  // OWOX's schema enum is case-sensitive and rejects the whole mart schema over
  // one bad field.
  it("normalises field types in the schema body", async () => {
    const s = createModelStore({ storageId: "stor_1" });
    const n = s.addNode({ x: 0, y: 0 });
    s.updateNode(n.key, { schema: [
      { name: "id", type: "int64", pk: true },
      { name: "starts_at", type: "Datetime", pk: false },
      { name: "price", type: "DECIMAL(10,2)", pk: false },
      { name: "is_paid", type: "bool", pk: false },
    ] });
    const bodies: Record<string, any> = {};
    const apiMock = vi.fn(async (path: string, init?: any) => {
      if (init?.body) bodies[path] = JSON.parse(init.body);
      return { id: "owox_a" };
    });
    await pushModel(s, apiMock as any, "GOOGLE_BIGQUERY");
    expect(bodies["/api/data-marts/owox_a/schema"].schema.fields.map((f: any) => f.type))
      .toEqual(["INTEGER", "DATETIME", "NUMERIC", "BOOLEAN"]);
  });
});
