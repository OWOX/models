import { describe, it, expect, beforeEach } from "vitest";
import { readOkfImportUrl, clearOkfFromUrl, buildOkfDeeplink, readOssieImportUrl, clearOssieFromUrl, buildOssieDeeplink } from "./okfLink";

const setUrl = (url: string) => history.replaceState(null, "", url);
beforeEach(() => setUrl("/"));

describe("readOkfImportUrl", () => {
  it("returns a valid GitHub URL from ?okf= (percent-encoded)", () => {
    const target = "https://github.com/OWOX/models/tree/main/bundles/demo-project";
    setUrl("/?okf=" + encodeURIComponent(target));
    expect(readOkfImportUrl()).toBe(target);
  });

  it("returns a valid GitHub URL from a RAW (human-readable) ?okf=", () => {
    const target = "https://github.com/OWOX/models/tree/main/bundles/demo-project";
    setUrl("/?okf=" + target); // no encoding — the readable marketing form
    expect(readOkfImportUrl()).toBe(target);
  });

  it("returns null when the param is absent", () => {
    setUrl("/?utm_source=x");
    expect(readOkfImportUrl()).toBeNull();
  });

  it("returns null for a non-GitHub host (allowlist guard)", () => {
    setUrl("/?okf=" + encodeURIComponent("https://evil.com/x/y"));
    expect(readOkfImportUrl()).toBeNull();
  });
});

describe("clearOkfFromUrl", () => {
  it("removes only the okf param, preserving UTM params and the hash", () => {
    setUrl("/?okf=" + encodeURIComponent("https://github.com/OWOX/models") + "&utm_source=news#m=abc");
    clearOkfFromUrl();
    expect(location.search).toBe("?utm_source=news");
    expect(location.hash).toBe("#m=abc");
  });
});

describe("buildOkfDeeplink", () => {
  it("builds an origin-rooted ?okf= link with a human-readable (raw) URL", () => {
    const bundle = "https://github.com/OWOX/models/tree/main/bundles/saas";
    const link = buildOkfDeeplink(bundle);
    expect(link).toBe(location.origin + "/?okf=" + bundle); // `/` and `:` stay raw
    // And it round-trips: readOkfImportUrl reads back the same URL.
    history.replaceState(null, "", link);
    expect(readOkfImportUrl()).toBe(bundle);
  });

  it("escapes only # and & so the query value can't break", () => {
    const link = buildOkfDeeplink("https://github.com/o/r/tree/main/a&b#c");
    expect(link).toBe(location.origin + "/?okf=https://github.com/o/r/tree/main/a%26b%23c");
  });
});

describe("?ossie= deeplink", () => {
  const target = "https://github.com/OWOX/models/blob/main/m.ossie.yaml";
  it("reads a valid GitHub URL, raw or encoded", () => {
    setUrl("/?ossie=" + target);
    expect(readOssieImportUrl()).toBe(target);
    setUrl("/?ossie=" + encodeURIComponent(target));
    expect(readOssieImportUrl()).toBe(target);
  });
  it("returns null when absent or for a non-GitHub host", () => {
    setUrl("/?utm_source=x");
    expect(readOssieImportUrl()).toBeNull();
    setUrl("/?ossie=" + encodeURIComponent("https://evil.com/x/y"));
    expect(readOssieImportUrl()).toBeNull();
  });
  it("does not read ?okf= and vice versa", () => {
    setUrl("/?okf=" + target);
    expect(readOssieImportUrl()).toBeNull();
    setUrl("/?ossie=" + target);
    expect(readOkfImportUrl()).toBeNull();
  });
  it("clears only the ossie param", () => {
    setUrl("/?ossie=" + encodeURIComponent(target) + "&utm_source=news#m=abc");
    clearOssieFromUrl();
    expect(location.search).toBe("?utm_source=news");
    expect(location.hash).toBe("#m=abc");
  });
  it("builds a readable link that round-trips and escapes # and &", () => {
    const link = buildOssieDeeplink(target);
    expect(link).toBe(location.origin + "/?ossie=" + target);
    history.replaceState(null, "", link);
    expect(readOssieImportUrl()).toBe(target);
    expect(buildOssieDeeplink("https://github.com/o/r/a&b#c")).toBe(location.origin + "/?ossie=https://github.com/o/r/a%26b%23c");
  });
});
