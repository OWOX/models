import { describe, it, expect, vi } from "vitest";
import { parseApiKey, exchangeToken, OwoxClient } from "../src/owox/client";

const KEY = "owox_key_" + Buffer.from(JSON.stringify({
  apiOrigin: "https://app.owox.com", apiKeyId: "kid_1", apiKeySecret: "sec_1",
})).toString("base64url");

describe("parseApiKey", () => {
  it("decodes origin/id/secret", () =>
    expect(parseApiKey(KEY)).toEqual({ apiOrigin: "https://app.owox.com", apiKeyId: "kid_1", apiKeySecret: "sec_1" }));
  it("rejects malformed keys", () => expect(() => parseApiKey("nope")).toThrow());
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
    const c = new OwoxClient("https://app.owox.com", "tok_1", fetchMock as any);
    expect((await c.listDataMarts()).map(m => m.id)).toEqual(["a", "b"]);
  });
});
