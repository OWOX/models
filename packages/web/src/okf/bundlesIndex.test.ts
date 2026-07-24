import { describe, it, expect, afterEach, vi } from "vitest";
import {
  parseBundlesIndex,
  firstImageSrc,
  bundleGithubUrl,
  fetchVerifiedBundleList,
  VERIFIED_BUNDLES_INDEX_URL,
} from "./bundlesIndex";

const TOP_INDEX = `---
title: "OKF Bundles"
---

# OKF Bundles

- [E-Commerce](./e-commerce/index.md) — 22 concept(s)
- [Finance](./finance/index.md) — 8 concept(s)
- [SaaS](./saas/index.md) — 10 concept(s)
- [Docs](https://example.com/readme.md) — external, skip
`;

describe("parseBundlesIndex", () => {
  it("extracts title, folder and mart count for each bundle row", () => {
    expect(parseBundlesIndex(TOP_INDEX)).toEqual([
      { title: "E-Commerce", folder: "e-commerce", martCount: 22 },
      { title: "Finance", folder: "finance", martCount: 8 },
      { title: "SaaS", folder: "saas", martCount: 10 },
    ]);
  });

  it("skips external (http) links", () => {
    expect(parseBundlesIndex(TOP_INDEX).some(b => b.title === "Docs")).toBe(false);
  });

  it("returns null martCount when the row has no count", () => {
    const md = "- [Retail](./retail/index.md)\n";
    expect(parseBundlesIndex(md)).toEqual([{ title: "Retail", folder: "retail", martCount: null }]);
  });
});

describe("firstImageSrc", () => {
  it("extracts the src of the first <img> tag", () => {
    const md = 'text\n<img width="10" src="https://github.com/user-attachments/assets/abc" />';
    expect(firstImageSrc(md)).toBe("https://github.com/user-attachments/assets/abc");
  });

  it("supports single-quoted src", () => {
    expect(firstImageSrc("<img src='https://x/y.png'>")).toBe("https://x/y.png");
  });

  it("returns null when there is no image", () => {
    expect(firstImageSrc("no image here")).toBeNull();
  });
});

describe("bundleGithubUrl", () => {
  it("builds the tree URL for a bundle folder", () => {
    expect(bundleGithubUrl("e-commerce")).toBe("https://github.com/OWOX/models/tree/main/bundles/e-commerce");
  });
});

describe("fetchVerifiedBundleList", () => {
  afterEach(() => vi.restoreAllMocks());

  it("fetches the top index and parses it", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, status: 200, text: () => Promise.resolve(TOP_INDEX),
    }));
    const list = await fetchVerifiedBundleList();
    expect(fetch).toHaveBeenCalledWith(VERIFIED_BUNDLES_INDEX_URL, expect.anything());
    expect(list.map(b => b.folder)).toEqual(["e-commerce", "finance", "saas"]);
  });

  it("throws a readable error on a failed fetch", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, text: () => Promise.resolve("") }));
    await expect(fetchVerifiedBundleList()).rejects.toThrow();
  });
});
