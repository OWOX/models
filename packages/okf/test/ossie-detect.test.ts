import { describe, it, expect } from "vitest";
import { detectModelFormat } from "../src/index";
describe("detectModelFormat", () => {
  it("uses the extension first", () => {
    expect(detectModelFormat({ fileName: "m.yaml", text: "" })).toBe("ossie");
    expect(detectModelFormat({ fileName: "m.JSON", text: "" })).toBe("ossie");
    expect(detectModelFormat({ fileName: "b.zip", text: "" })).toBe("okf");
    expect(detectModelFormat({ fileName: "a.md", text: "version: 1" })).toBe("okf");
  });
  it("sniffs pasted text, tolerating BOM, CRLF, comments and a leading ---", () => {
    expect(detectModelFormat({ text: "﻿# my model\r\n---\r\nversion: 0.2.0.dev0\r\nname: m\r\ndatasets: []" })).toBe("ossie");
    expect(detectModelFormat({ text: '{ "datasets": [] }' })).toBe("ossie");
    expect(detectModelFormat({ text: "semantic_model:\n  - name: x" })).toBe("ossie");
    expect(detectModelFormat({ text: "---\ntype: OWOX Data Mart\ntitle: Orders\n---\n# Orders" })).toBe("okf");
    expect(detectModelFormat({ text: "---\nname: Orders\ntitle: Orders\n---\n# Orders" })).toBe("okf");
    expect(detectModelFormat({ text: "<!-- shop/a.md -->\n---\ntitle: A\n---" })).toBe("okf");
  });
});
