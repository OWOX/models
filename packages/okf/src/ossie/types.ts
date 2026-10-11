export const OSSIE_VERSION = "0.2.0.dev0";
export const OWOX_VENDOR = "OWOX";
export interface OssieExt { vendor_name: string; data: string }
export interface OssieExpression { dialects: { dialect: string; expression: string }[] }

/** Ossie dialect for expressions written for an OWOX storage type. Storages
 *  without an Ossie dialect of their own (Redshift, Athena) and no storage at
 *  all get ANSI_SQL, the dialect the Ossie spec's own examples use. */
export function ossieDialectForStorage(storageType?: string | null): string {
  if (!storageType) return "ANSI_SQL";
  if (/BIGQUERY$/.test(storageType)) return "BIGQUERY";
  if (storageType === "SNOWFLAKE" || storageType === "DATABRICKS") return storageType;
  return "ANSI_SQL";
}
export interface OssieField { name: string; expression: OssieExpression; datatype?: string; description?: string; label?: string; dimension?: { is_time?: boolean }; ai_context?: unknown; custom_extensions?: OssieExt[] }
export interface OssieDataset { name: string; source: string; primary_key?: string[]; unique_keys?: string[][]; description?: string; ai_context?: unknown; fields?: OssieField[]; custom_extensions?: OssieExt[] }
export interface OssieRelationship { name: string; from: string; to: string; from_columns: string[]; to_columns: string[]; ai_context?: unknown; custom_extensions?: OssieExt[] }
export interface OssieMetric { name: string; expression: OssieExpression; description?: string; datatype?: string; ai_context?: unknown; custom_extensions?: OssieExt[] }
export interface OssieDoc { version: string; name: string; description?: string; ai_context?: unknown; datasets: OssieDataset[]; relationships?: OssieRelationship[]; metrics?: OssieMetric[]; custom_extensions?: OssieExt[] }

const TO_CANVAS: Record<string, string> = { String: "STRING", Integer: "INTEGER", Decimal: "NUMERIC", Float: "FLOAT", Boolean: "BOOLEAN", Date: "DATE", Time: "TIME", DateTime: "DATETIME", DateTimeTz: "TIMESTAMP" };
const TO_OSSIE: Record<string, string> = { STRING: "String", INTEGER: "Integer", NUMERIC: "Decimal", BIGNUMERIC: "Decimal", FLOAT: "Float", BOOLEAN: "Boolean", DATE: "Date", TIME: "Time", DATETIME: "DateTime", TIMESTAMP: "DateTimeTz" };
export const ossieToCanvasType = (dt?: string) => (dt && TO_CANVAS[dt]) || "STRING";
export const canvasToOssieType = (t: string) => TO_OSSIE[t] ?? "Opaque";

export function readOwoxExt<T extends object = Record<string, unknown>>(exts?: unknown): Partial<T> {
  if (!Array.isArray(exts)) return {};
  const e = exts.find(x => x && typeof x === "object" && x.vendor_name === OWOX_VENDOR);
  if (!e || typeof e.data !== "string") return {};
  try { const v = JSON.parse(e.data); return v && typeof v === "object" && !Array.isArray(v) ? v : {}; } catch { return {}; }
}
export function owoxExt(data: Record<string, unknown>): OssieExt[] | undefined {
  const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined && v !== null && v !== ""));
  return Object.keys(clean).length ? [{ vendor_name: OWOX_VENDOR, data: JSON.stringify(clean) }] : undefined;
}
/** The well-formed dialect entries of an expression, as written in the file. */
export function expressionDialects(e?: OssieExpression): { dialect: string; expression: string }[] {
  const raw = (e as { dialects?: unknown } | null | undefined)?.dialects;
  return (Array.isArray(raw) ? raw : [])
    .filter(x => x && typeof x === "object" && typeof x.expression === "string")
    .map(x => ({ dialect: typeof x.dialect === "string" ? x.dialect : "", expression: x.expression as string }));
}
/** The expression text the canvas shows and pushes: the preferred (storage)
 *  dialect, else ANSI_SQL, else the first entry. */
export function pickExpression(e?: OssieExpression, prefer?: string): string {
  const d = expressionDialects(e);
  const hit = (prefer ? d.find(x => x.dialect === prefer) : undefined) ?? d.find(x => x.dialect === "ANSI_SQL") ?? d[0];
  return (hit?.expression ?? "").trim();
}
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
export function aiContextText(ai: unknown): string {
  if (!ai) return "";
  if (typeof ai === "string") return `AI context: ${ai}`;
  if (typeof ai !== "object") return "";
  const o = ai as { instructions?: unknown; synonyms?: unknown; examples?: unknown };
  const syn = strings(o.synonyms), ex = strings(o.examples);
  return [
    typeof o.instructions === "string" && o.instructions ? `AI instructions: ${o.instructions}` : "",
    syn.length ? `Synonyms: ${syn.join(", ")}` : "",
    ex.length ? `Example questions: ${ex.join("; ")}` : "",
  ].filter(Boolean).join("\n");
}
