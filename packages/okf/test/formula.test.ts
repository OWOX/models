import { describe, it, expect } from "vitest";
import { isCalculated, formulaLevel, formulaReferences, renderOwoxRefs, defaultJoinAlias, formulaWarnings, toStoredFormula } from "../src/index";

describe("isCalculated", () => {
  it("is true for any formula, even an empty draft", () => {
    expect(isCalculated({ formula: "" })).toBe(true);
    expect(isCalculated({ formula: "SUM(x)" })).toBe(true);
    expect(isCalculated({})).toBe(false);
  });
});

describe("formulaLevel", () => {
  it("classifies aggregates as metrics, case-insensitively", () => {
    expect(formulaLevel("SUM(clicks) / NULLIF(SUM(impressions), 0)")).toBe("metric");
    expect(formulaLevel("count ( distinct user_id )")).toBe("metric");
    expect(formulaLevel("APPROX_COUNT_DISTINCT(user_id)")).toBe("metric");
  });
  it("classifies row-level expressions as columns", () => {
    expect(formulaLevel("CONCAT(session_id, user_id)")).toBe("column");
    expect(formulaLevel("price * quantity")).toBe("column");
    expect(formulaLevel("")).toBe("column");
  });
  it("ignores aggregate names inside strings and comments", () => {
    expect(formulaLevel("CONCAT('SUM(', name)")).toBe("column");
    expect(formulaLevel("price -- SUM(price) later\n * 2")).toBe("column");
    expect(formulaLevel("price /* AVG(price) */ * 2")).toBe("column");
  });
  it("does not mistake a field named like a function for a call", () => {
    expect(formulaLevel("sum_total + 1")).toBe("column");
  });
});

describe("formulaReferences", () => {
  it("returns own fields and alias.field pairs, skipping functions, keywords and types", () => {
    expect(formulaReferences("SUM(orders.amount) / NULLIF(COUNT(DISTINCT customer_id), 0)")).toEqual([
      { alias: "orders", field: "amount" },
      { alias: null, field: "customer_id" },
    ]);
    expect(formulaReferences("CAST(price AS NUMERIC) * 1.0")).toEqual([{ alias: null, field: "price" }]);
    expect(formulaReferences("CASE WHEN status = 'paid' THEN amount ELSE 0 END")).toEqual([
      { alias: null, field: "status" }, { alias: null, field: "amount" },
    ]);
  });
  it("dedupes repeated references", () => {
    expect(formulaReferences("a + a")).toEqual([{ alias: null, field: "a" }]);
  });
});

describe("renderOwoxRefs", () => {
  it("turns ODM reference tags back into plain SQL", () => {
    expect(renderOwoxRefs('SUM({{ref field="clicks"}})')).toBe("SUM(clicks)");
    expect(renderOwoxRefs('SUM({{ref path="orders" field="amount"}})')).toBe("SUM(orders.amount)");
    expect(renderOwoxRefs('{{ ref field="a" path="o" }}')).toBe("o.a");
    expect(renderOwoxRefs("SUM(clicks)")).toBe("SUM(clicks)");
  });
});

describe("defaultJoinAlias", () => {
  it("makes a SQL identifier from a title", () => {
    expect(defaultJoinAlias("Posts Questions", "n1")).toBe("posts_questions");
    expect(defaultJoinAlias("2024 Orders", "n1")).toBe("t_2024_orders");
    expect(defaultJoinAlias("🥇", "n1")).toBe("n1");
  });
});

describe("formulaWarnings", () => {
  const ctx = { own: ["clicks", "user_id", "ctr"], joined: [{ alias: "orders", title: "Orders", fields: ["amount"] }] };
  it("is empty for a valid formula", () => {
    expect(formulaWarnings("SUM(clicks) + SUM(orders.amount)", ctx, "ctr")).toEqual([]);
  });
  it("flags unknown fields, aliases, joined fields and self-reference", () => {
    expect(formulaWarnings("SUM(click)", ctx, "ctr")).toEqual(['Unknown field "click"']);
    expect(formulaWarnings("SUM(users.id)", ctx, "ctr")).toEqual(['Unknown relationship alias "users"']);
    expect(formulaWarnings("SUM(orders.total)", ctx, "ctr")).toEqual(['"orders" has no field "total"']);
    expect(formulaWarnings("ctr * 2", ctx, "ctr")).toEqual(["A calculated field cannot reference itself"]);
  });
  it("flags window functions once and ignores frame keywords", () => {
    const wctx = { own: ["ss_ext_sales_price"], joined: [{ alias: "date_dim", title: "Date", fields: ["d_date"] }] };
    expect(formulaWarnings(
      "SUM(SUM(ss_ext_sales_price)) OVER (ORDER BY date_dim.d_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
      wctx, "cumulative_sales",
    )).toEqual(["Window functions (OVER …) aren't supported in OWOX calculated fields"]);
  });
  it("still checks references inside OVER", () => {
    expect(formulaWarnings("SUM(clicks) OVER (PARTITION BY nope)", ctx, "ctr")).toEqual([
      "Window functions (OVER …) aren't supported in OWOX calculated fields", 'Unknown field "nope"',
    ]);
  });
  it("does not treat date parts as fields", () => {
    expect(formulaWarnings("EXTRACT(DAYOFWEEK FROM d)", { own: ["d"], joined: [] }, "x")).toEqual([]);
  });
});

describe("toStoredFormula", () => {
  const ctx = {
    own: ["quantity", "order_id", "ctr", "clicks"],
    joined: [{ alias: "orders", title: "Orders", fields: ["amount"] }],
  };
  it("tags own fields", () => {
    expect(toStoredFormula("SUM(quantity)", ctx, "x")).toBe('SUM({{ref field="quantity"}})');
  });
  it("tags own and joined fields", () => {
    const f = "SUM(orders.amount) / NULLIF(COUNT(DISTINCT order_id), 0)";
    expect(toStoredFormula(f, ctx, "x")).toBe(
      'SUM({{ref path="orders" field="amount"}}) / NULLIF(COUNT(DISTINCT {{ref field="order_id"}}), 0)',
    );
  });
  it("never touches string literals", () => {
    expect(toStoredFormula("CONCAT(order_id, '-order_id')", ctx, "x")).toBe('CONCAT({{ref field="order_id"}}, \'-order_id\')');
  });
  it("leaves self references and unknown identifiers as written", () => {
    expect(toStoredFormula("ctr * 2", ctx, "ctr")).toBe("ctr * 2");
    expect(toStoredFormula("foo + clicks", ctx, "x")).toBe('foo + {{ref field="clicks"}}');
    expect(toStoredFormula("SUM(orders.nope)", ctx, "x")).toBe("SUM(orders.nope)");
  });
  it("tags own fields named like SQL words, but not types or date parts", () => {
    expect(toStoredFormula("MAX(date)", { own: ["date"], joined: [] }, "x")).toBe('MAX({{ref field="date"}})');
    expect(toStoredFormula("CAST(x AS DATE)", { own: ["x", "date"], joined: [] }, "y")).toBe('CAST({{ref field="x"}} AS DATE)');
    expect(toStoredFormula("EXTRACT(YEAR FROM d)", { own: ["d", "year"], joined: [] }, "y")).toBe('EXTRACT(YEAR FROM {{ref field="d"}})');
    expect(toStoredFormula("DATE_ADD(d, INTERVAL 1 DAY)", { own: ["d", "day"], joined: [] }, "y")).toBe('DATE_ADD({{ref field="d"}}, INTERVAL 1 DAY)');
    expect(toStoredFormula("MAX(Date)", { own: ["date"], joined: [] }, "x")).toBe("MAX(Date)");
    for (const f of ["MAX(date)", "CAST(x AS DATE)", "EXTRACT(YEAR FROM d)"]) {
      const c = { own: ["x", "date", "d", "year"], joined: [] };
      expect(renderOwoxRefs(toStoredFormula(f, c, "y"))).toBe(f);
    }
  });
  it("round-trips through renderOwoxRefs", () => {
    for (const [f, n] of [
      ["SUM(quantity)", "x"], ["SUM(orders.amount) / NULLIF(COUNT(DISTINCT order_id), 0)", "x"],
      ["CONCAT(order_id, '-order_id')", "x"], ["ctr * 2", "ctr"], ["foo + 1", "x"],
    ]) expect(renderOwoxRefs(toStoredFormula(f, ctx, n))).toBe(f);
  });
});
