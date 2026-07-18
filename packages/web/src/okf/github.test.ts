import { describe, it, expect, afterEach, vi } from "vitest";
import {
  parseGithubBundleUrl,
  isAllowedGithubHost,
  rawDirBase,
  rawFileUrl,
  OkfFetchError,
  extractMdLinks,
  fetchOkfBundleFromUrl,
} from "./github";

describe("parseGithubBundleUrl", () => {
  it("parses a github tree (directory) URL", () => {
    const r = parseGithubBundleUrl("https://github.com/OWOX/models/tree/main/bundles/demo-project");
    expect(r).toEqual({ owner: "OWOX", repo: "models", ref: "main", path: "bundles/demo-project", kind: "dir" });
  });

  it("parses a github blob (.md file) URL as a file", () => {
    const r = parseGithubBundleUrl("https://github.com/OWOX/models/blob/main/bundles/demo-project/orders.md");
    expect(r).toEqual({ owner: "OWOX", repo: "models", ref: "main", path: "bundles/demo-project/orders.md", kind: "file" });
  });

  it("parses a raw.githubusercontent.com URL", () => {
    const r = parseGithubBundleUrl("https://raw.githubusercontent.com/OWOX/models/main/bundles/demo-project/index.md");
    expect(r).toEqual({ owner: "OWOX", repo: "models", ref: "main", path: "bundles/demo-project/index.md", kind: "file" });
  });

  it("treats a bare repo root as a directory with empty path", () => {
    const r = parseGithubBundleUrl("https://github.com/OWOX/models");
    expect(r).toEqual({ owner: "OWOX", repo: "models", ref: "HEAD", path: "", kind: "dir" });
  });

  it("strips a trailing slash on a tree URL", () => {
    const r = parseGithubBundleUrl("https://github.com/OWOX/models/tree/main/bundles/demo-project/");
    expect(r.path).toBe("bundles/demo-project");
    expect(r.kind).toBe("dir");
  });

  it("rejects a non-GitHub host", () => {
    expect(() => parseGithubBundleUrl("https://evil.com/OWOX/models")).toThrow(OkfFetchError);
  });

  it("rejects a malformed URL", () => {
    expect(() => parseGithubBundleUrl("not a url")).toThrow(OkfFetchError);
  });

  it("does not throw on malformed percent-encoding in the path", () => {
    const r = parseGithubBundleUrl("https://github.com/OWOX/models/blob/main/bundles/x/bad%zz.md");
    expect(r.kind).toBe("file");
    expect(r.path.endsWith("bad%zz.md")).toBe(true);
  });
});

describe("isAllowedGithubHost", () => {
  it("accepts github + raw hosts, rejects others", () => {
    expect(isAllowedGithubHost("https://github.com/x/y")).toBe(true);
    expect(isAllowedGithubHost("https://raw.githubusercontent.com/x/y/main/z.md")).toBe(true);
    expect(isAllowedGithubHost("https://gitlab.com/x/y")).toBe(false);
    expect(isAllowedGithubHost("garbage")).toBe(false);
  });
});

describe("rawDirBase / rawFileUrl", () => {
  it("builds the raw directory base (trailing slash) for a dir ref", () => {
    const r = parseGithubBundleUrl("https://github.com/OWOX/models/tree/main/bundles/demo-project");
    expect(rawDirBase(r)).toBe("https://raw.githubusercontent.com/OWOX/models/main/bundles/demo-project/");
  });

  it("builds the raw dir base from a file ref by dropping the filename", () => {
    const r = parseGithubBundleUrl("https://raw.githubusercontent.com/OWOX/models/main/bundles/demo-project/index.md");
    expect(rawDirBase(r)).toBe("https://raw.githubusercontent.com/OWOX/models/main/bundles/demo-project/");
  });

  it("builds a raw file url", () => {
    const r = parseGithubBundleUrl("https://github.com/OWOX/models/blob/main/bundles/demo-project/orders.md");
    expect(rawFileUrl(r)).toBe("https://raw.githubusercontent.com/OWOX/models/main/bundles/demo-project/orders.md");
  });

  it("preserves percent-encoded reserved chars in a filename (e.g. %23 stays encoded, not a literal #)", () => {
    const r = parseGithubBundleUrl("https://github.com/OWOX/models/blob/main/bundles/x/notes%231.md");
    expect(rawFileUrl(r).endsWith("notes%231.md")).toBe(true);
  });
});

describe("extractMdLinks", () => {
  it("extracts relative .md links, strips ./, dedupes, drops index.md and externals", () => {
    const md = [
      "| [Orders](./orders.md) | VIEW |",
      "| [Customers](customers.md) | SQL |",
      "| [Orders again](./orders.md) | VIEW |",
      "| [Self](./index.md) | INDEX |",
      "| [External](https://example.com/x.md) | X |",
      "| [Docs](../readme.md) | X |",
    ].join("\n");
    expect(extractMdLinks(md).sort()).toEqual(["../readme.md", "customers.md", "orders.md"].sort());
  });

  it("returns an empty array when there are no md links", () => {
    expect(extractMdLinks("# Title\n\nNo links here.")).toEqual([]);
  });
});

describe("fetchOkfBundleFromUrl", () => {
  afterEach(() => vi.unstubAllGlobals());

  const mockFetch = (map: Record<string, { status?: number; body: string }>) => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      const hit = map[url];
      if (!hit) return { ok: false, status: 404, text: async () => "not found" } as Response;
      const status = hit.status ?? 200;
      return { ok: status >= 200 && status < 300, status, text: async () => hit.body, json: async () => JSON.parse(hit.body) } as Response;
    }));
  };

  it("fetches index.md then all linked files (raw, no API)", async () => {
    const base = "https://raw.githubusercontent.com/OWOX/models/main/bundles/demo-project/";
    mockFetch({
      [base + "index.md"]: { body: "[Orders](./orders.md)\n[Customers](./customers.md)" },
      [base + "orders.md"]: { body: "# orders" },
      [base + "customers.md"]: { body: "# customers" },
    });
    const files = await fetchOkfBundleFromUrl("https://github.com/OWOX/models/tree/main/bundles/demo-project");
    expect(Object.keys(files).sort()).toEqual(["customers.md", "index.md", "orders.md"]);
    expect(files["orders.md"]).toBe("# orders");
  });

  it("fetches a single .md file ref alone", async () => {
    const raw = "https://raw.githubusercontent.com/OWOX/models/main/bundles/demo-project/orders.md";
    mockFetch({ [raw]: { body: "# just orders" } });
    const files = await fetchOkfBundleFromUrl("https://github.com/OWOX/models/blob/main/bundles/demo-project/orders.md");
    expect(files).toEqual({ "orders.md": "# just orders" });
  });

  it("throws a friendly error on 404", async () => {
    mockFetch({}); // everything 404s
    await expect(
      fetchOkfBundleFromUrl("https://raw.githubusercontent.com/OWOX/models/main/bundles/x/orders.md"),
    ).rejects.toThrow(/public/i);
  });

  it("rejects a bundle over the file cap", async () => {
    const base = "https://raw.githubusercontent.com/OWOX/models/main/bundles/x/";
    const links = Array.from({ length: 101 }, (_, i) => `[m${i}](./m${i}.md)`).join("\n");
    mockFetch({ [base + "index.md"]: { body: links } });
    await expect(
      fetchOkfBundleFromUrl("https://github.com/OWOX/models/tree/main/bundles/x"),
    ).rejects.toThrow(/too large/i);
  });

  it("rejects (does not silently fall back) on a transient non-404 index.md failure", async () => {
    const base = "https://raw.githubusercontent.com/OWOX/models/main/bundles/x/";
    const api = "https://api.github.com/repos/OWOX/models/contents/bundles/x?ref=main";
    mockFetch({
      [base + "index.md"]: { status: 500, body: "server error" },
      // If the (buggy) code fell back to the API, this would let the fallback
      // succeed — so a passing test here proves we didn't take that path.
      [api]: { body: JSON.stringify([{ name: "orders.md", type: "file" }]) },
      [base + "orders.md"]: { body: "# orders" },
    });
    await expect(
      fetchOkfBundleFromUrl("https://github.com/OWOX/models/tree/main/bundles/x"),
    ).rejects.toThrow(/500/);
  });

  it("falls back to the Contents API when there is no index.md", async () => {
    const base = "https://raw.githubusercontent.com/OWOX/models/main/bundles/x/";
    const api = "https://api.github.com/repos/OWOX/models/contents/bundles/x?ref=main";
    mockFetch({
      [api]: { body: JSON.stringify([
        { name: "orders.md", type: "file" },
        { name: "index.md", type: "file" },
        { name: "sub", type: "dir" },
      ]) },
      [base + "orders.md"]: { body: "# orders" },
    });
    const files = await fetchOkfBundleFromUrl("https://github.com/OWOX/models/tree/main/bundles/x");
    expect(files).toEqual({ "orders.md": "# orders" });
  });
});
