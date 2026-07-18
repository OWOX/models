import { describe, it, expect, beforeEach } from "vitest";
import { readOkfImportUrl, clearOkfFromUrl, buildOkfDeeplink } from "./okfLink";

const setUrl = (url: string) => history.replaceState(null, "", url);
beforeEach(() => setUrl("/"));

describe("readOkfImportUrl", () => {
  it("returns a valid GitHub URL from ?okf=", () => {
    const target = "https://github.com/OWOX/models/tree/main/bundles/demo-project";
    setUrl("/?okf=" + encodeURIComponent(target));
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
  it("builds an origin-rooted ?okf= link with an encoded URL", () => {
    const link = buildOkfDeeplink("https://github.com/OWOX/models/tree/main/bundles/saas");
    expect(link).toBe(location.origin + "/?okf=" + encodeURIComponent("https://github.com/OWOX/models/tree/main/bundles/saas"));
  });
});
