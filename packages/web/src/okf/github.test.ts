import { describe, it, expect } from "vitest";
import {
  parseGithubBundleUrl,
  isAllowedGithubHost,
  rawDirBase,
  rawFileUrl,
  OkfFetchError,
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
});
