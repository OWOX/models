import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify from "fastify";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { registerWebApp } from "../src/web";

let root: string;

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "mc-web-"));
  writeFileSync(join(root, "index.html"), "<!doctype html><title>app</title>");
  writeFileSync(join(root, "robots.txt"), "User-agent: *");
  mkdirSync(join(root, "assets"));
  writeFileSync(join(root, "assets", "index-abc123.js"), "console.log(1)");
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

function app() {
  const a = Fastify();
  registerWebApp(a, root);
  return a;
}

describe("registerWebApp", () => {
  it("serves the SPA at / with query params, revalidated on every load", async () => {
    const res = await app().inject({ method: "GET", url: "/?template=saas" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("<title>app</title>");
    expect(res.headers["cache-control"]).toBe("public, max-age=0");
  });

  it("caches hashed build assets for a year", async () => {
    const res = await app().inject({ method: "GET", url: "/assets/index-abc123.js" });
    expect(res.statusCode).toBe(200);
    expect(res.headers["cache-control"]).toBe("public, max-age=31536000, immutable");
  });

  it("keeps short caching for other static files", async () => {
    const res = await app().inject({ method: "GET", url: "/robots.txt" });
    expect(res.statusCode).toBe(200);
    expect(res.headers["cache-control"]).toBe("public, max-age=0");
  });

  it("answers unknown paths with a real 404 (the app shell as body, not a soft 404)", async () => {
    const res = await app().inject({ method: "GET", url: "/templates/ecommerce" });
    expect(res.statusCode).toBe(404);
    expect(res.headers["content-type"]).toContain("text/html");
    expect(res.body).toContain("<title>app</title>");
  });

  it("answers unknown API paths with a JSON 404", async () => {
    const res = await app().inject({ method: "GET", url: "/api/nonexistent" });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: "not_found" });
  });
});
