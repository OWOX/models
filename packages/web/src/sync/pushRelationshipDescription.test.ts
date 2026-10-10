import { describe, it, expect, vi } from "vitest";
import { pushModel } from "./push";
import { createModelStore } from "../state/model";

const node = (key: string, id: string) => ({
  key, title: key, inputSource: "TABLE" as const, status: "created" as const, owoxId: id, owoxStorageId: "st",
  position: { x: 0, y: 0 }, schema: [{ name: "id", type: "STRING", pk: true }],
});

describe("push relationship description", () => {
  it("sends the description in both directions of a bidirectional edge, and omits it when unset", async () => {
    const store = createModelStore({
      storageId: "st",
      nodes: [node("a", "ida"), node("b", "idb")],
      edges: [
        { id: "e1", from: "a", to: "b", keys: [{ left: "id", right: "id" }], bidirectional: true, description: "One a per b" },
        { id: "e2", from: "b", to: "a", keys: [{ left: "id", right: "id" }], bidirectional: false },
      ],
    });
    const calls: { url: string; body: any }[] = [];
    const api = vi.fn(async (url: string, init?: RequestInit) => {
      if (url === "/api/data-marts" && !init) return [{ id: "ida" }, { id: "idb" }];
      if (url.endsWith("/relationships")) calls.push({ url, body: JSON.parse(String(init?.body)) });
      return {};
    });
    await pushModel(store, api as any, "GOOGLE_BIGQUERY", {});
    expect(calls.map(c => c.url)).toEqual([
      "/api/data-marts/ida/relationships", "/api/data-marts/idb/relationships", "/api/data-marts/idb/relationships",
    ]);
    expect(calls[0].body.description).toBe("One a per b");
    expect(calls[1].body.description).toBe("One a per b");
    expect("description" in calls[2].body).toBe(false);
  });
});
