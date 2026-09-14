import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { api } from "./api";
import { API_KEY_STORAGE_KEY } from "./apiKey";

const KEY = "owox_key_demo";
const expired = () => new Response(JSON.stringify({ error: "OWOX POST /api/data-marts -> 401 Authentication failed", code: "owox_auth" }), { status: 401 });
const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe("api() silent re-connect", () => {
  it("re-connects with the stored key and replays the request once", async () => {
    localStorage.setItem(API_KEY_STORAGE_KEY, KEY);
    const calls: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (path: string) => {
      calls.push(path);
      if (path === "/api/auth/connect") return ok({ projectTitle: "Demo" });
      return calls.filter(c => c === "/api/data-marts").length === 1 ? expired() : ok({ id: "m1" });
    }));
    expect(await api("/api/data-marts", { method: "POST" })).toEqual({ id: "m1" });
    expect(calls).toEqual(["/api/data-marts", "/api/auth/connect", "/api/data-marts"]);
  });

  it("re-connects once for a whole batch of parallel calls", async () => {
    localStorage.setItem(API_KEY_STORAGE_KEY, KEY);
    let connects = 0;
    let firstRound = 5;
    vi.stubGlobal("fetch", vi.fn(async (path: string) => {
      if (path === "/api/auth/connect") { connects++; return ok({ projectTitle: "Demo" }); }
      if (firstRound-- > 0) return expired();
      return ok({ id: "m" });
    }));
    await Promise.all(Array.from({ length: 5 }, () => api("/api/data-marts", { method: "POST" })));
    expect(connects).toBe(1);
  });

  it("gives up and announces the expiry when no key is stored", async () => {
    const seen: Event[] = [];
    window.addEventListener("mc:auth-expired", e => seen.push(e));
    const fetchMock = vi.fn(async () => expired());
    vi.stubGlobal("fetch", fetchMock);
    await expect(api("/api/data-marts", { method: "POST" })).rejects.toThrow(/Authentication failed/);
    expect(fetchMock).toHaveBeenCalledTimes(1); // no pointless re-connect
    expect(seen.length).toBe(1);
  });

  it("drops a key OWOX no longer accepts, so the next load does not retry it", async () => {
    localStorage.setItem(API_KEY_STORAGE_KEY, KEY);
    vi.stubGlobal("fetch", vi.fn(async (path: string) =>
      path === "/api/auth/connect"
        ? new Response(JSON.stringify({ error: "Token exchange failed: 401" }), { status: 400 })
        : expired()));
    await expect(api("/api/data-marts", { method: "POST" })).rejects.toThrow();
    expect(localStorage.getItem(API_KEY_STORAGE_KEY)).toBeNull();
  });

  it("leaves an untagged 401 alone (/api/me decides for itself)", async () => {
    localStorage.setItem(API_KEY_STORAGE_KEY, KEY);
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ error: "Not connected" }), { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(api("/api/me")).rejects.toThrow(/Not connected/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
