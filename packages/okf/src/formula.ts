import type { SchemaField } from "./types";

export type FormulaLevel = "metric" | "column";

// Every aggregate ODM recognises across its storages (docs: calculated fields → Types & Storage Support).
const AGGREGATES = [
  "SUM", "COUNT", "AVG", "MIN", "MAX", "STDDEV", "VARIANCE", "ANY_VALUE", "COUNTIF", "COUNT_IF",
  "STRING_AGG", "APPROX_COUNT_DISTINCT", "APPROX_DISTINCT", "ARRAY_AGG", "LISTAGG",
  "PERCENTILE_CONT", "PERCENTILE", "COLLECT_LIST",
];
const AGGREGATE_CALL = new RegExp(`\\b(?:${AGGREGATES.join("|")})\\s*\\(`, "i");

// Words that look like identifiers but are SQL syntax or type names, never fields.
const NOT_FIELDS = new Set([
  "SELECT", "FROM", "WHERE", "CASE", "WHEN", "THEN", "ELSE", "END", "AND", "OR", "NOT", "NULL", "TRUE", "FALSE",
  "AS", "IS", "IN", "LIKE", "BETWEEN", "DISTINCT", "INTERVAL", "IF", "OVER", "PARTITION", "BY", "ORDER",
  "ASC", "DESC", "LIMIT", "SAFE", "DAY", "WEEK", "MONTH", "QUARTER", "YEAR", "HOUR", "MINUTE", "SECOND",
  "STRING", "INT64", "INTEGER", "INT", "FLOAT64", "FLOAT", "NUMERIC", "BIGNUMERIC", "DECIMAL", "BOOL", "BOOLEAN",
  "DATE", "DATETIME", "TIME", "TIMESTAMP", "BYTES", "JSON", "VARCHAR",
  "ROWS", "RANGE", "UNBOUNDED", "PRECEDING", "FOLLOWING", "CURRENT", "ROW", "WITHIN", "GROUP", "FILTER", "NULLS",
  "FIRST", "LAST", "IGNORE", "RESPECT", "DAYOFWEEK", "DAYOFYEAR", "ISOWEEK", "ISOYEAR", "MILLISECOND", "MICROSECOND",
  "STRUCT", "ARRAY",
]);

export function isCalculated(f: Pick<SchemaField, "formula">): boolean {
  return f.formula !== undefined;
}

// Blank out string literals and comments (same length, so offsets stay valid):
// their contents must never read as calls or references.
function codeOnly(sql: string): string {
  const blank = (m: string) => m.replace(/[^\n]/g, " ");
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/--[^\n]*/g, blank)
    .replace(/'(?:[^'\\]|\\.)*'/g, blank)
    .replace(/"(?:[^"\\]|\\.)*"/g, blank);
}

export function formulaLevel(formula: string): FormulaLevel {
  return AGGREGATE_CALL.test(codeOnly(formula)) ? "metric" : "column";
}

interface ScannedRef { alias: string | null; field: string; start: number; end: number; keyword?: boolean }

// One scan for every identifier that reads as a field: `field` or `alias.field`, in
// code only (strings and comments blanked), skipping function calls and SQL words.
// Offsets point into the original formula.
function scanReferences(formula: string, withKeywords = false): ScannedRef[] {
  const out: ScannedRef[] = [];
  const code = codeOnly(formula);
  for (const m of code.matchAll(/(?<![\w.])([A-Za-z_]\w*)(?:\.([A-Za-z_]\w*))?(?!\w)/g)) {
    const start = m.index ?? 0;
    const end = start + m[0].length;
    if (/^\s*\(/.test(code.slice(end))) continue;                // a function call
    if (!m[2] && NOT_FIELDS.has(m[1].toUpperCase())) {
      // A keyword hit is reported only on request, and only where it can be a column:
      // not a type (AS DATE), a date part (YEAR FROM d) or an INTERVAL unit.
      if (!withKeywords) continue;
      const before = code.slice(0, start);
      const typeOrUnit = /\bAS\s+$/i.test(before) || /^\s*FROM\b/i.test(code.slice(end))
        || /(?:\d|\bINTERVAL)\s+$/i.test(before) || /\bINTERVAL\s+\S+\s+$/i.test(before);
      if (typeOrUnit) continue;
      out.push({ alias: null, field: m[1], start, end, keyword: true });
      continue;
    }
    out.push(m[2] ? { alias: m[1], field: m[2], start, end } : { alias: null, field: m[1], start, end });
  }
  return out;
}

export function formulaReferences(formula: string): { alias: string | null; field: string }[] {
  const out: { alias: string | null; field: string }[] = [];
  const seen = new Set<string>();
  for (const r of scanReferences(formula)) {
    const key = `${r.alias ?? ""}.${r.field}`;
    if (seen.has(key)) continue;
    seen.add(key); out.push({ alias: r.alias, field: r.field });
  }
  return out;
}

// ODM stores formulas with `{{ref path="alias" field="x"}}` tags; analysts see `alias.x`.
export function renderOwoxRefs(formula: string): string {
  return formula.replace(/\{\{\s*ref\b([^}]*)\}\}/g, (_, attrs: string) => {
    const field = /field="([^"]*)"/.exec(attrs)?.[1] ?? "";
    const path = /path="([^"]*)"/.exec(attrs)?.[1] ?? "";
    return path ? `${path}.${field}` : field;
  });
}

// OWOX join aliases are SQL identifiers: alphanumeric + underscore, no leading digit.
// A hyphenated alias makes OWOX reject the relationship with a generic 400.
export function defaultJoinAlias(title: string, fallback: string): string {
  const s = (title || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const safe = /^[0-9]/.test(s) ? `t_${s}` : s;
  return safe || fallback;
}

export interface FormulaContext {
  /** Every field name of the mart, calculated ones included (formulas may reference them). */
  own: string[];
  /** Marts this mart joins to, under the alias formulas use for them. */
  joined: { alias: string; title: string; fields: string[] }[];
}

export function formulaWarnings(formula: string, ctx: FormulaContext, selfName: string): string[] {
  const out: string[] = [];
  if (/\bOVER\s*\(/i.test(codeOnly(formula))) out.push("Window functions (OVER …) aren't supported in OWOX calculated fields");
  for (const r of formulaReferences(formula)) {
    if (r.alias === null) {
      if (r.field === selfName) out.push("A calculated field cannot reference itself");
      else if (!ctx.own.includes(r.field)) out.push(`Unknown field "${r.field}"`);
      continue;
    }
    const j = ctx.joined.find(x => x.alias === r.alias);
    if (!j) out.push(`Unknown relationship alias "${r.alias}"`);
    else if (!j.fields.includes(r.field)) out.push(`"${r.alias}" has no field "${r.field}"`);
  }
  return [...new Set(out)];
}

// The inverse of renderOwoxRefs: OWOX validates formulas only in the stored form, where
// every resolvable reference is a `{{ref}}` tag. Unresolved identifiers stay as written
// so OWOX reports them. Replaced right to left to keep earlier offsets valid.
export function toStoredFormula(formula: string, ctx: FormulaContext, selfName: string): string {
  const own = new Set(ctx.own);
  let out = formula;
  const refs = scanReferences(formula, true);
  for (let i = refs.length - 1; i >= 0; i--) {
    const r = refs[i];
    if (r.field.includes('"') || (r.alias ?? "").includes('"')) continue;
    let tag: string | null = null;
    if (r.alias === null) {
      if (r.field !== selfName && own.has(r.field)) tag = `{{ref field="${r.field}"}}`;
    } else {
      const j = ctx.joined.find(x => x.alias === r.alias);
      if (j && j.fields.includes(r.field)) tag = `{{ref path="${r.alias}" field="${r.field}"}}`;
    }
    if (tag) out = out.slice(0, r.start) + tag + out.slice(r.end);
  }
  return out;
}

export function joinAlias(explicit: string | undefined, target: { title: string; key: string }): string {
  return explicit?.trim() || defaultJoinAlias(target.title || target.key, target.key);
}

/** Replace every reference `resolve` maps to a string; others stay. Right to left. */
export function rewriteReferences(
  formula: string,
  resolve: (ref: { alias: string | null; field: string; keyword: boolean }) => string | null,
): string {
  let out = formula;
  const refs = scanReferences(formula, true);
  for (let i = refs.length - 1; i >= 0; i--) {
    const r = refs[i];
    const next = resolve({ alias: r.alias, field: r.field, keyword: !!r.keyword });
    if (next !== null) out = out.slice(0, r.start) + next + out.slice(r.end);
  }
  return out;
}
