import { describe, it, expect } from "vitest";
import type { ModelNode, SchemaField } from "@mc/okf";
import { ALL_HIDDEN, NOTHING_HIDDEN } from "../../state/objLabels";
import {
  CARD_BOTTOM_PADDING,
  CARD_FIRST_BADGE_ROW_HEIGHT,
  CARD_TITLE_ROW_HEIGHT,
  COMPACT_NODE_WIDTH,
  ERD_EXPAND_ROW_HEIGHT,
  ERD_NODE_WIDTH,
  ERD_ROW_EXTRA_LINE_HEIGHT,
  ERD_ROW_HEIGHT,
  cardBadges,
  collapsedRowCount,
  erdAwareNodeSize,
  fieldRowLabel,
  orderFields,
  packBadges,
} from "./layoutSize";

const f = (name: string, over: Partial<SchemaField> = {}): SchemaField => ({ name, type: "STRING", pk: false, ...over });

const mk = (fields: number, over: Partial<ModelNode> = {}): ModelNode => ({
  key: "n", title: "n", inputSource: "VIEW",
  schema: Array.from({ length: fields }, (_, i) => f(`f${i}`)),
  position: { x: 0, y: 0 }, status: "created", owoxId: null,
  ...over,
});

// A fixed glyph width keeps the packing independent of the test font.
const measure = (text: string) => text.length * 6;

describe("cardBadges", () => {
  it("lists source, fields and relationships in card order", () => {
    expect(cardBadges(mk(3), { relationshipCount: 2 })).toEqual([
      { kind: "source", label: "View" },
      { kind: "fields", label: "3 fields" },
      { kind: "relationships", label: "2 relationships" },
    ]);
  });

  it("shows no badge for a zero count", () => {
    expect(cardBadges(mk(0)).map(b => b.kind)).toEqual(["source"]);
  });

  it("uses the singular for one", () => {
    expect(cardBadges(mk(1), { relationshipCount: 1 }).map(b => b.label)).toEqual(["View", "1 field", "1 relationship"]);
  });

  it("drops each badge its object label hides", () => {
    expect(cardBadges(mk(3), { relationshipCount: 2, hidden: { ...NOTHING_HIDDEN, source: true, relationships: true } }))
      .toEqual([{ kind: "fields", label: "3 fields" }]);
    expect(cardBadges(mk(3), { relationshipCount: 2, hidden: ALL_HIDDEN })).toEqual([]);
  });
});

describe("packBadges", () => {
  const badges = cardBadges(mk(12), { relationshipCount: 6 });

  it("fills a line while the badges fit the card width", () => {
    const lines = packBadges(badges, "compact", measure);
    expect(lines.map(l => l.map(b => b.kind))).toEqual([["source", "fields"], ["relationships"]]);
  });

  it("starts a line per badge when none fit together", () => {
    const wide = () => 150;
    expect(packBadges(badges, "compact", wide)).toHaveLength(3);
  });
});

describe("field rows", () => {
  it("orders keys first — primary keys and relationship keys", () => {
    const schema = [f("a"), f("b", { pk: true }), f("c"), f("d")];
    expect(orderFields(schema, ["d"]).map(x => x.name)).toEqual(["b", "d", "a", "c"]);
  });

  it("keeps every key visible when collapsed, even past the cap", () => {
    const schema = Array.from({ length: 8 }, (_, i) => f(`k${i}`, { pk: i < 6 }));
    expect(collapsedRowCount(schema)).toBe(6);
    expect(collapsedRowCount(schema.slice(0, 2))).toBe(2);
  });

  it("leads with the alias unless aliases are unticked", () => {
    const field = f("user_id", { alias: "Customer" });
    expect(fieldRowLabel(field)).toBe("Customer");
    expect(fieldRowLabel(field, { ...NOTHING_HIDDEN, fieldAlias: true })).toBe("user_id");
    expect(fieldRowLabel(f("id", { alias: " id " }))).toBe("id");
  });
});

describe("erdAwareNodeSize", () => {
  it("sizes a compact card from its badge lines, not its field count", () => {
    const one = CARD_TITLE_ROW_HEIGHT + CARD_FIRST_BADGE_ROW_HEIGHT + CARD_BOTTOM_PADDING;
    expect(erdAwareNodeSize(mk(8), "compact", {}, measure)).toEqual({ width: COMPACT_NODE_WIDTH, height: one });
    expect(erdAwareNodeSize(mk(80), "compact", {}, measure).height).toBe(one);
  });

  it("shrinks to the title row when every label is hidden", () => {
    expect(erdAwareNodeSize(mk(8), "compact", { hidden: ALL_HIDDEN }, measure).height)
      .toBe(CARD_TITLE_ROW_HEIGHT + CARD_BOTTOM_PADDING);
  });

  it("adds the collapsed field rows and the toggle in ERD", () => {
    const header = erdAwareNodeSize(mk(0), "erd", {}, measure).height;
    expect(erdAwareNodeSize(mk(2), "erd", {}, measure).height).toBe(header + 2 * ERD_ROW_HEIGHT);
    expect(erdAwareNodeSize(mk(8), "erd", {}, measure))
      .toEqual({ width: ERD_NODE_WIDTH, height: header + 4 * ERD_ROW_HEIGHT + ERD_EXPAND_ROW_HEIGHT });
  });

  it("counts a shown description line, and not a hidden one", () => {
    const node = mk(1, { schema: [f("id", { description: "The id" })] });
    const base = erdAwareNodeSize(mk(1), "erd", {}, measure).height;
    expect(erdAwareNodeSize(node, "erd", {}, measure).height).toBe(base + ERD_ROW_EXTRA_LINE_HEIGHT);
    expect(erdAwareNodeSize(node, "erd", { hidden: { ...NOTHING_HIDDEN, fieldDescription: true } }, measure).height).toBe(base);
  });
});
