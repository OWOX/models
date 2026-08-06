import { describe, it, expect } from "vitest";
import { normalizeFieldType, FIELD_TYPES, EDITOR_FIELD_TYPES } from "../src/fieldType";
import { parseBundle } from "../src/parse";

// The enum OWOX validates a BigQuery mart schema against — confirmed live
// (PUT /api/data-marts/{id}/schema returns the full list in its 400 body).
const BIGQUERY_ENUM = [
  "INTEGER", "FLOAT", "NUMERIC", "BIGNUMERIC", "STRING", "BYTES", "BOOLEAN", "DATE",
  "TIME", "DATETIME", "TIMESTAMP", "GEOGRAPHY", "JSON", "RECORD", "STRUCT", "RANGE", "INTERVAL",
];

describe("normalizeFieldType", () => {
  it("passes canonical types through", () => {
    for (const t of FIELD_TYPES) expect(normalizeFieldType(t)).toBe(t);
  });

  it("uppercases — OWOX's enum is case-sensitive", () => {
    expect(normalizeFieldType("string")).toBe("STRING");
    expect(normalizeFieldType("Timestamp")).toBe("TIMESTAMP");
    expect(normalizeFieldType(" boolean ")).toBe("BOOLEAN");
  });

  it("maps dialect aliases", () => {
    expect(normalizeFieldType("INT64")).toBe("INTEGER");
    expect(normalizeFieldType("bigint")).toBe("INTEGER");
    expect(normalizeFieldType("FLOAT64")).toBe("FLOAT");
    expect(normalizeFieldType("double precision")).toBe("FLOAT");
    expect(normalizeFieldType("DECIMAL")).toBe("NUMERIC");
    expect(normalizeFieldType("BOOL")).toBe("BOOLEAN");
    expect(normalizeFieldType("text")).toBe("STRING");
    expect(normalizeFieldType("uuid")).toBe("STRING");
    expect(normalizeFieldType("timestamptz")).toBe("TIMESTAMP");
    expect(normalizeFieldType("jsonb")).toBe("JSON");
    expect(normalizeFieldType("bytea")).toBe("BYTES");
  });

  it("drops precision and length parameters", () => {
    expect(normalizeFieldType("NUMERIC(10,2)")).toBe("NUMERIC");
    expect(normalizeFieldType("varchar(255)")).toBe("STRING");
    expect(normalizeFieldType("decimal(38, 9)")).toBe("NUMERIC");
  });

  it("unwraps array notations to the element type", () => {
    expect(normalizeFieldType("ARRAY<STRING>")).toBe("STRING");
    expect(normalizeFieldType("array<int64>")).toBe("INTEGER");
    expect(normalizeFieldType("STRING[]")).toBe("STRING");
  });

  it("keeps nested structs as STRUCT/RECORD", () => {
    expect(normalizeFieldType("STRUCT<name STRING, age INT64>")).toBe("STRUCT");
    expect(normalizeFieldType("record")).toBe("RECORD");
  });

  it("falls back to STRING for empty or unknown input", () => {
    expect(normalizeFieldType("")).toBe("STRING");
    expect(normalizeFieldType(undefined)).toBe("STRING");
    expect(normalizeFieldType("Полное имя")).toBe("STRING");
    expect(normalizeFieldType("hll_sketch")).toBe("STRING");
  });

  it("never emits a type outside the canonical set", () => {
    const probes = ["int", "bool", "text", "datetime2", "smallmoney", "clob", "geometry", "??", "STRUCT<x INT>"];
    for (const p of probes) expect(FIELD_TYPES as readonly string[]).toContain(normalizeFieldType(p));
  });

  // The guarantee the canvas rests on: nothing we can produce or offer is rejected
  // by OWOX's BigQuery schema validation.
  it("every canonical type is a member of OWOX's BigQuery enum", () => {
    expect(FIELD_TYPES.filter(t => !BIGQUERY_ENUM.includes(t))).toEqual([]);
  });

  it("maps Snowflake's VARIANT onto BigQuery's JSON instead of offering it", () => {
    expect(normalizeFieldType("VARIANT")).toBe("JSON");
    expect(normalizeFieldType("variant")).toBe("JSON");
    expect(FIELD_TYPES as readonly string[]).not.toContain("VARIANT");
  });
});

describe("EDITOR_FIELD_TYPES", () => {
  it("is a subset of the canonical set", () => {
    for (const t of EDITOR_FIELD_TYPES) expect(FIELD_TYPES as readonly string[]).toContain(t);
  });

  it("offers the everyday types and hides the exotic ones", () => {
    expect(EDITOR_FIELD_TYPES).toEqual([
      "STRING", "INTEGER", "FLOAT", "NUMERIC", "BOOLEAN",
      "DATE", "TIME", "DATETIME", "TIMESTAMP", "BYTES", "GEOGRAPHY", "JSON",
    ]);
  });
});

describe("parseBundle field types", () => {
  it("normalises types from a schema table", () => {
    const md = `---
title: Sessions
---

# Schema

| Name | Type | Description |
| --- | --- | --- |
| session_id | string | PK. Session key. |
| starts_at | datetime | Local start. |
| price | decimal(10,2) | Ticket price. |
| is_paid | bool | Paid flag. |
| room_ids | ARRAY<INT64> | Rooms. |
| notes | mystery | Free text. |
`;
    const g = parseBundle({ "sessions.md": md });
    expect(g.nodes[0].schema.map(f => f.type)).toEqual([
      "STRING", "DATETIME", "NUMERIC", "BOOLEAN", "INTEGER", "STRING",
    ]);
  });

  it("normalises types from a bullet-list schema", () => {
    const md = `---
title: Tickets
---

# Schema

- \`ticket_id\` (INT64): Ticket key.
- \`issued_at\` (Timestamp): When it was issued.
- \`is_void\` (BOOL): Voided flag.
`;
    const g = parseBundle({ "tickets.md": md });
    expect(g.nodes[0].schema.map(f => f.type)).toEqual(["INTEGER", "TIMESTAMP", "BOOLEAN"]);
  });
});
