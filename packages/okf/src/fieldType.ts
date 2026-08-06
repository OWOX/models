// Canonical OWOX schema field types and the normalisation that gets hand-written
// or LLM-generated OKF markdown into that set.
//
// OWOX validates a mart's output schema with a per-engine Zod enum and the enum
// is CASE-SENSITIVE. Confirmed live against app.owox.com for GOOGLE_BIGQUERY:
//   INTEGER FLOAT NUMERIC BIGNUMERIC STRING BYTES BOOLEAN DATE TIME DATETIME
//   TIMESTAMP GEOGRAPHY JSON RECORD STRUCT RANGE INTERVAL
// Anything else — `bool`, `text`, `int64`, `decimal(10,2)`, lowercase `string` —
// is rejected with 400 "Invalid enum value … received 'x'", which used to reach
// the user only as an unactionable schema error at push time.
//
// The canonical set IS the BigQuery enum. Engine-specific types that BigQuery has
// no member for — Snowflake's VARIANT above all — are deliberately absent and are
// mapped onto their BigQuery equivalent instead (VARIANT → JSON), because offering
// a type the target engine rejects only produces a 400 at push time.
// NOTE: only the BigQuery enum is confirmed live. If a Snowflake storage ever needs
// VARIANT back, make the mapping engine-aware rather than widening this set.
export const FIELD_TYPES = [
  "STRING", "INTEGER", "FLOAT", "NUMERIC", "BIGNUMERIC", "BOOLEAN",
  "DATE", "TIME", "DATETIME", "TIMESTAMP", "BYTES", "GEOGRAPHY",
  "JSON", "RECORD", "STRUCT", "RANGE", "INTERVAL",
] as const;

/** What the canvas offers in the field-type picker: the canonical set minus types
 *  that are valid but effectively never hand-picked while modelling — nested
 *  containers (RECORD/STRUCT), BigQuery exotica (RANGE/INTERVAL) and BIGNUMERIC.
 *  They still survive import and push; they just don't clutter the dropdown, and
 *  a field that already carries one keeps it (see SchemaEditor). */
export const EDITOR_FIELD_TYPES = FIELD_TYPES.filter(
  t => !["RECORD", "STRUCT", "RANGE", "INTERVAL", "BIGNUMERIC"].includes(t),
);

const CANONICAL = new Set<string>(FIELD_TYPES);

// Spellings of the same type from other SQL dialects (Postgres, MySQL, Snowflake,
// BigQuery's standard-SQL names) mapped onto the canonical name.
const ALIASES: Record<string, string> = {
  // integers
  INT: "INTEGER", INT2: "INTEGER", INT4: "INTEGER", INT8: "INTEGER", INT32: "INTEGER", INT64: "INTEGER",
  TINYINT: "INTEGER", SMALLINT: "INTEGER", MEDIUMINT: "INTEGER", BIGINT: "INTEGER", BYTEINT: "INTEGER",
  LONG: "INTEGER", SERIAL: "INTEGER", BIGSERIAL: "INTEGER",
  // floats
  FLOAT4: "FLOAT", FLOAT8: "FLOAT", FLOAT64: "FLOAT", DOUBLE: "FLOAT", "DOUBLE PRECISION": "FLOAT", REAL: "FLOAT",
  // fixed point
  DECIMAL: "NUMERIC", DEC: "NUMERIC", FIXED: "NUMERIC", NUMBER: "NUMERIC", MONEY: "NUMERIC",
  BIGDECIMAL: "BIGNUMERIC",
  // strings
  BOOL: "BOOLEAN",
  TEXT: "STRING", VARCHAR: "STRING", NVARCHAR: "STRING", CHAR: "STRING", NCHAR: "STRING",
  CHARACTER: "STRING", "CHARACTER VARYING": "STRING", CLOB: "STRING", UUID: "STRING", ENUM: "STRING",
  // dates & times
  TIMESTAMPTZ: "TIMESTAMP", TIMESTAMP_TZ: "TIMESTAMP", TIMESTAMP_LTZ: "TIMESTAMP", TIMESTAMP_NTZ: "TIMESTAMP",
  "TIMESTAMP WITH TIME ZONE": "TIMESTAMP", "TIMESTAMP WITHOUT TIME ZONE": "TIMESTAMP",
  DATETIME2: "DATETIME", DATETIMEOFFSET: "TIMESTAMP", SMALLDATETIME: "DATETIME", EPOCH: "TIMESTAMP",
  // binary
  BINARY: "BYTES", VARBINARY: "BYTES", BLOB: "BYTES", BYTEA: "BYTES",
  // semi-structured & spatial. VARIANT is Snowflake's schemaless container; its
  // BigQuery counterpart is JSON, so a bundle authored for Snowflake still pushes.
  JSONB: "JSON", OBJECT: "JSON", MAP: "JSON", VARIANT: "JSON", XML: "JSON",
  GEOMETRY: "GEOGRAPHY", POINT: "GEOGRAPHY",
};

/** Fallback for a type we cannot recognise. STRING is the only safe guess: it is
 *  valid in every OWOX engine, so the mart's schema still reaches OWOX and the
 *  user can correct one field instead of losing the whole schema to a 400. */
export const DEFAULT_FIELD_TYPE = "STRING";

/**
 * Coerce a raw type spelling into a canonical OWOX field type.
 * Handles case, parameters (`NUMERIC(10,2)`), array/repeated wrappers
 * (`ARRAY<STRING>`, `STRING[]` → the element type) and dialect aliases.
 * Unrecognised input falls back to STRING rather than being passed through —
 * passing it through is what makes OWOX reject the whole schema.
 */
export function normalizeFieldType(raw: string | null | undefined): string {
  let t = (raw ?? "").trim().toUpperCase();
  if (!t) return DEFAULT_FIELD_TYPE;

  // Unwrap array notations down to the element type. OWOX has no ARRAY member —
  // repeatedness lives in `mode`, which the canvas does not model.
  for (let i = 0; i < 3; i++) {
    const wrapped = t.match(/^(?:ARRAY|REPEATED|LIST|SET)\s*[<(]\s*(.+?)\s*[>)]$/) ?? t.match(/^(.+?)\s*\[\s*\]$/);
    if (!wrapped) break;
    t = wrapped[1].trim();
  }

  // Drop precision/length parameters, but keep STRUCT/RECORD field lists out of
  // the way first — STRUCT<a INT64> is still a STRUCT.
  if (/^(STRUCT|RECORD)\b/.test(t)) return t.startsWith("RECORD") ? "RECORD" : "STRUCT";
  t = t.replace(/\s*\([^)]*\)\s*$/, "").trim();

  if (CANONICAL.has(t)) return t;
  return ALIASES[t] ?? DEFAULT_FIELD_TYPE;
}
