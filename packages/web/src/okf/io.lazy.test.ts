import { describe, it, expect, vi, afterEach } from "vitest";

// The Ossie reader/writer (with `yaml`) is a lazily loaded chunk. These tests
// replace it with a module that fails to load, like a network error or a stale
// chunk after a deploy.
const OSSIE = "version: 0.2.0.dev0\nname: shop\ndatasets:\n  - name: orders\n    source: p.d.o\n";
const OKF = "---\ntitle: A\n---\n# A";

async function freshIoWithBrokenOssie() {
  vi.resetModules();
  vi.doMock("@mc/okf/ossie", () => { throw new Error("Failed to fetch dynamically imported module"); });
  return import("./io");
}

afterEach(() => { vi.doUnmock("@mc/okf/ossie"); vi.resetModules(); });

describe("lazy Ossie module", () => {
  it("OKF import never needs the Ossie module", async () => {
    const io = await freshIoWithBrokenOssie();
    expect((await io.loadModelText(OKF)).format).toBe("okf");
    expect((await io.loadModelFiles({ "a.md": OKF })).format).toBe("okf");
  });

  it("an Ossie import, export or sniff fails with a clear message", async () => {
    const io = await freshIoWithBrokenOssie();
    await expect(io.loadModelText(OSSIE)).rejects.toThrow(io.OSSIE_LOAD_FAILED);
    await expect(io.loadModelFiles({ "m.yaml": OSSIE })).rejects.toThrow(io.OSSIE_LOAD_FAILED);
    await expect(io.downloadOssie({ storageId: null, nodes: [], edges: [] }, "m")).rejects.toThrow(io.OSSIE_LOAD_FAILED);
  });

  it("retries after a failed load", async () => {
    const io = await freshIoWithBrokenOssie();
    await expect(io.loadModelText(OSSIE)).rejects.toThrow(io.OSSIE_LOAD_FAILED);
    vi.doUnmock("@mc/okf/ossie");
    expect((await io.loadModelText(OSSIE)).format).toBe("ossie");
  });

  it("loads the module once and reuses it", async () => {
    vi.resetModules();
    const io = await import("./io");
    const a = io.loadOssieModule(), b = io.loadOssieModule();
    expect(a).toBe(b);
    expect(typeof (await a).parseOssie).toBe("function");
  });
});
