import { describe, it, expect, beforeEach } from "vitest";
import { readTemplateModel, clearTemplateFromUrl, buildTemplateDeeplink } from "./templateLink";

const setUrl = (url: string) => history.replaceState(null, "", url);

beforeEach(() => setUrl("/"));

describe("readTemplateModel", () => {
  it("loads a known template by id", () => {
    setUrl("/?template=ecommerce");
    const g = readTemplateModel();
    expect(g).not.toBeNull();
    expect(g!.nodes.some(n => n.key === "dim_customer")).toBe(true);
    expect(g!.edges.length).toBeGreaterThan(0);
  });

  it("returns a fresh deep clone each call (the source template is never mutated)", () => {
    setUrl("/?template=ecommerce");
    const a = readTemplateModel()!;
    a.nodes[0].title = "MUTATED";
    const b = readTemplateModel()!;
    expect(b.nodes[0].title).not.toBe("MUTATED");
  });

  it("returns null for an unknown id", () => {
    setUrl("/?template=does-not-exist");
    expect(readTemplateModel()).toBeNull();
  });

  it("returns null when no template param is present", () => {
    setUrl("/?utm_source=newsletter");
    expect(readTemplateModel()).toBeNull();
  });
});

describe("clearTemplateFromUrl", () => {
  it("removes only the template param, preserving UTM params and the hash", () => {
    setUrl("/?template=saas&utm_source=newsletter#m=abc");
    clearTemplateFromUrl();
    expect(location.search).toBe("?utm_source=newsletter");
    expect(location.hash).toBe("#m=abc");
  });

  it("is a no-op when there is no template param", () => {
    setUrl("/?utm_source=x");
    clearTemplateFromUrl();
    expect(location.search).toBe("?utm_source=x");
  });
});

describe("buildTemplateDeeplink", () => {
  it("builds a ?template= deeplink at the current origin", () => {
    expect(buildTemplateDeeplink("ecommerce")).toBe(`${location.origin}/?template=ecommerce`);
  });

  it("encodes ids with reserved characters", () => {
    expect(buildTemplateDeeplink("a&b")).toBe(`${location.origin}/?template=a%26b`);
  });
});
