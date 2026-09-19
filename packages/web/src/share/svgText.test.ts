import { describe, it, expect } from "vitest";
import { measureText, truncateToWidth, wrapToLines, escapeXml, UI_FONT } from "./svgText";

const F = { size: 10 } as const; // jsdom has no 2D context → ~5.5px per glyph

describe("measureText", () => {
  it("grows with the length of the string", () => {
    expect(measureText("aaaa", F)).toBeGreaterThan(measureText("aa", F));
  });

  it("returns zero for an empty string", () => {
    expect(measureText("", F)).toBe(0);
  });
});

describe("truncateToWidth", () => {
  it("leaves text that already fits untouched", () => {
    expect(truncateToWidth("orders", 500, F)).toBe("orders");
  });

  it("clips overlong text and marks it with an ellipsis", () => {
    const out = truncateToWidth("a_very_long_data_mart_name", 40, F);
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThan("a_very_long_data_mart_name".length);
    expect(measureText(out, F)).toBeLessThanOrEqual(40);
  });

  it("degrades to a bare ellipsis when nothing fits", () => {
    expect(truncateToWidth("orders", 1, F)).toBe("…");
  });

  it("returns an empty string for empty input or no room", () => {
    expect(truncateToWidth("", 100, F)).toBe("");
    expect(truncateToWidth("orders", 0, F)).toBe("");
  });
});

describe("wrapToLines", () => {
  it("keeps a short title on one line", () => {
    expect(wrapToLines("orders", 200, 2, F)).toEqual(["orders"]);
  });

  it("wraps on word boundaries", () => {
    const lines = wrapToLines("daily revenue by channel", 60, 2, F);
    expect(lines.length).toBe(2);
    expect(lines[0]).not.toContain("revenue by channel");
  });

  it("never exceeds maxLines and ellipsises the overflow", () => {
    const lines = wrapToLines("one two three four five six seven eight", 40, 2, F);
    expect(lines).toHaveLength(2);
    expect(lines[1].endsWith("…")).toBe(true);
  });

  it("clips a single word that is wider than the line", () => {
    const [line] = wrapToLines("supercalifragilisticexpialidocious", 40, 1, F);
    expect(line.endsWith("…")).toBe(true);
    expect(measureText(line, F)).toBeLessThanOrEqual(40);
  });

  it("returns nothing for blank text", () => {
    expect(wrapToLines("   ", 200, 2, F)).toEqual([]);
  });
});

describe("escapeXml", () => {
  it("escapes every character that would break the markup", () => {
    expect(escapeXml(`a & b < c > d " e ' f`)).toBe(
      "a &amp; b &lt; c &gt; d &quot; e &apos; f",
    );
  });

  it("leaves ordinary text alone", () => {
    expect(escapeXml("orders_daily")).toBe("orders_daily");
  });
});

describe("UI_FONT", () => {
  it("matches the stack the canvas nodes render with", () => {
    expect(UI_FONT).toContain("-apple-system");
    expect(UI_FONT).toContain("Inter");
  });
});
