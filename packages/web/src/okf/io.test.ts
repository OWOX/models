import { describe, it, expect } from "vitest";
import { bundleToZip, zipToFiles } from "./io";

describe("zip round-trip", () => {
  it("zips and unzips bundle files losslessly", () => {
    const files = { "demo/index.md": "# Demo\n", "demo/orders.md": "# Orders\n" };
    const buf = bundleToZip(files);
    expect(buf).toBeInstanceOf(Uint8Array);
    expect(zipToFiles(buf)).toEqual(files);
  });
});
