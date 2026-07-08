import { describe, it, expect } from "vitest";
import { TEMPLATES, INDUSTRY_TEMPLATES, DATASET_TEMPLATES } from "../src/templates";
import { NICHE_PRESETS } from "../src/state/goal";
import { serializeBundle, parseBundle } from "@mc/okf";

// Grows as template tasks land; the assertion pins the full expected library.
const EXPECTED_INDUSTRY_IDS = [
  "ecommerce", "saas", "marketplace", "marketing_ads", "mobile_gaming", "finance", "medical",
  "ott_media", "delivery_logistics", "insurance", "b2b_sales",
];
const EXPECTED_DATASET_IDS = ["crypto_bitcoin", "stackoverflow"];

it("ships the expected library", () => {
  expect(INDUSTRY_TEMPLATES.map(t => t.id).sort()).toEqual([...EXPECTED_INDUSTRY_IDS].sort());
  expect(DATASET_TEMPLATES.map(t => t.id).sort()).toEqual([...EXPECTED_DATASET_IDS].sort());
});

it("industry templates map 1:1 onto niche presets", () => {
  const nicheIds = new Set(NICHE_PRESETS.map(n => n.id));
  for (const t of INDUSTRY_TEMPLATES) {
    expect(nicheIds.has(t.nicheId!), `${t.id} → niche "${t.nicheId}" exists`).toBe(true);
  }
  const used = INDUSTRY_TEMPLATES.map(t => t.nicheId);
  expect(new Set(used).size, "one template per niche").toBe(used.length);
});

for (const t of TEMPLATES) {
  describe(t.name, () => {
    const byKey = new Map(t.graph.nodes.map(n => [n.key, n]));

    it("has unique node keys and edge ids", () => {
      expect(byKey.size).toBe(t.graph.nodes.length);
      expect(new Set(t.graph.edges.map(e => e.id)).size).toBe(t.graph.edges.length);
    });

    it("every node has a PK and fully described fields", () => {
      for (const n of t.graph.nodes) {
        expect(n.schema.length, `${n.title} has fields`).toBeGreaterThan(0);
        expect(n.schema.some(f => f.pk), `${n.title} has a PK`).toBe(true);
        expect(n.description?.trim(), `${n.title} has a description`).toBeTruthy();
        for (const f of n.schema) {
          expect(f.description?.trim(), `${n.title}.${f.name} is described`).toBeTruthy();
        }
      }
    });

    it("every edge resolves with matching join-key types and a cardinality", () => {
      for (const e of t.graph.edges) {
        const from = byKey.get(e.from);
        const to = byKey.get(e.to);
        expect(from, `${e.id} from ${e.from}`).toBeTruthy();
        expect(to, `${e.id} to ${e.to}`).toBeTruthy();
        expect(e.cardinality, `${e.id} has cardinality`).toBeTruthy();
        for (const k of e.keys) {
          const l = from!.schema.find(s => s.name === k.left);
          const r = to!.schema.find(s => s.name === k.right);
          expect(l, `${e.id}: ${e.from}.${k.left} exists`).toBeTruthy();
          expect(r, `${e.id}: ${e.to}.${k.right} exists`).toBeTruthy();
          expect(l!.type, `${e.id}: ${k.left} type matches ${k.right}`).toBe(r!.type);
        }
      }
    });

    it("round-trips through OKF", () => {
      const g = parseBundle(serializeBundle(t.graph, t.name).files);
      expect(g.nodes.length).toBe(t.graph.nodes.length);
      expect(g.edges.length).toBe(t.graph.edges.length);
    });
  });
}

// Money must be NUMERIC in industry templates (BigQuery convention); FLOAT is
// reserved for true rates/scores. Datasets stay schema-faithful to the source.
const MONEY = /revenue|cost|price|amount|gmv|mrr|spend|fee|salary|premium|payout|margin|_value|ltv|balance|payment/i;
const EXEMPT = /pct|rate|score|ratio|band|count|qty|quantity|_id$|days|mins|secs|hours|multiplier/i;

for (const t of INDUSTRY_TEMPLATES) {
  it(`${t.id}: money fields are NUMERIC`, () => {
    for (const n of t.graph.nodes) {
      for (const f of n.schema) {
        if (f.type === "FLOAT" && MONEY.test(f.name) && !EXEMPT.test(f.name)) {
          throw new Error(`${t.id}.${n.key}.${f.name} is FLOAT — money must be NUMERIC`);
        }
      }
    }
  });
}
