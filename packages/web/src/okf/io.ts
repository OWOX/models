import { serializeBundle, parseBundle, isBundleIndex, detectModelFormat, parseFrontmatter, slugify, type ModelGraph } from "@mc/okf";
import { zipSync, unzipSync, strToU8, strFromU8 } from "fflate";

// Branded footer appended to the bundle index — every exported model carries an
// attribution + links back to the tool, the platform and the source.
const OKF_FOOTER =
  "\n\n---\n\n" +
  "_Generated with [OWOX Data Marts](https://www.owox.com/) · " +
  "[Model Canvas](https://model.owox.com/) · " +
  "[open source](https://github.com/OWOX/models)_\n";

export function graphToBundleFiles(g: ModelGraph, projectTitle: string): Record<string, string> {
  const files = serializeBundle(g, projectTitle).files;
  // Append the OWOX footer to the bundle's index.md (per-mart docs stay clean).
  const indexKey = Object.keys(files).find(isBundleIndex);
  if (indexKey) files[indexKey] = files[indexKey].replace(/\s*$/, "") + OKF_FOOTER;
  return files;
}

export function filesToGraph(files: Record<string, string>): ModelGraph {
  return parseBundle(expandBundles(files));
}

// A downloaded OKF bundle is a single .md file with every doc concatenated
// behind `<!-- path -->` markers (see downloadBundle). When such a file is
// uploaded, expand it back into its constituent files so each doc keeps its
// own frontmatter; otherwise parseBundle treats the whole blob as one document.
const BUNDLE_MARKER = /<!--\s*.+?\s*-->\n/;
function expandBundles(files: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, content] of Object.entries(files)) {
    if (BUNDLE_MARKER.test(content)) Object.assign(out, parsePastedMarkdown(content));
    else out[name] = content;
  }
  return out;
}

export function bundleToZip(files: Record<string, string>): Uint8Array {
  const entries: Record<string, Uint8Array> = {};
  for (const [path, content] of Object.entries(files)) entries[path] = strToU8(content);
  return zipSync(entries, { level: 6 });
}

export function zipToFiles(buf: Uint8Array): Record<string, string> {
  const out: Record<string, string> = {};
  const unzipped = unzipSync(buf);
  for (const [path, bytes] of Object.entries(unzipped)) {
    if (path.endsWith("/")) continue;
    out[path] = strFromU8(bytes);
  }
  return out;
}

export function downloadBundle(files: Record<string, string>, name = "model-okf") {
  const blob = new Blob([bundleToZip(files).slice()], { type: "application/zip" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name}.zip`;
  a.click();
}

export function parsePastedMarkdown(text: string): Record<string, string> {
  const parts = text.split(/<!--\s*(.+?)\s*-->\n/).slice(1);
  if (parts.length === 0) return { "pasted/doc.md": text };
  const files: Record<string, string> = {};
  for (let i = 0; i < parts.length; i += 2) files[parts[i]] = parts[i + 1] || "";
  return files;
}

export type ModelFormat = "okf" | "ossie";

export interface LoadedModel {
  format: ModelFormat;
  graph: ModelGraph;
  name: string | null;
  notImported: string[];
  warnings: string[];
}

// Model name from the bundle's index frontmatter title, when present.
function okfModelName(files: Record<string, string>): string | null {
  const idx = Object.entries(files).find(([p]) => isBundleIndex(p));
  if (!idx) return null;
  try {
    const t = parseFrontmatter(idx[1]).data.title;
    return typeof t === "string" && t.trim() ? t.trim() : null;
  } catch {
    return null;
  }
}

// The Ossie reader/writer (and the `yaml` parser behind it) is a separate chunk,
// fetched the first time a user imports or exports Ossie — not on page load.
type OssieModule = typeof import("@mc/okf/ossie");
let ossieModule: Promise<OssieModule> | null = null;
export const OSSIE_LOAD_FAILED = "Couldn't load the Apache Ossie support. Check your connection, reload the page and try again.";
export function loadOssieModule(): Promise<OssieModule> {
  ossieModule ??= import("@mc/okf/ossie").catch(() => {
    ossieModule = null; // let the next attempt retry (offline, or a stale chunk after a deploy)
    throw new Error(OSSIE_LOAD_FAILED);
  });
  return ossieModule;
}

async function loadOssieText(text: string): Promise<LoadedModel> {
  const { parseOssie } = await loadOssieModule();
  const r = parseOssie(text);
  return { format: "ossie", graph: r.graph, name: r.name ?? null, notImported: r.notImported, warnings: r.warnings };
}

// The exporter's stock index description — not something the user wrote.
const DEFAULT_INDEX_DESCRIPTION = "Index of exported OWOX data marts.";

function okfModelDescription(files: Record<string, string>): string | null {
  const idx = Object.entries(files).find(([p]) => isBundleIndex(p));
  if (!idx) return null;
  try {
    const d = parseFrontmatter(idx[1]).data.description;
    return typeof d === "string" && d.trim() && d.trim() !== DEFAULT_INDEX_DESCRIPTION ? d.trim() : null;
  } catch {
    return null;
  }
}

function loadOkfFiles(files: Record<string, string>): LoadedModel {
  const graph = filesToGraph(files);
  const description = okfModelDescription(files);
  return { format: "okf", graph: description ? { ...graph, description } : graph, name: okfModelName(files), notImported: [], warnings: [] };
}

export const MAX_MODEL_BYTES = 5 * 1024 * 1024;
export const TOO_LARGE = "This file is too large (max 5 MB).";
const tooLarge = (texts: string[]) => texts.reduce((n, t) => n + t.length, 0) > MAX_MODEL_BYTES;

export async function loadModelFiles(files: Record<string, string>): Promise<LoadedModel> {
  if (tooLarge(Object.values(files))) throw new Error(TOO_LARGE);
  const names = Object.keys(files);
  const dataNames = names.filter(n => /\.(ya?ml|json)$/i.test(n));
  // A pure OKF upload never loads the Ossie chunk.
  const isOssieModelText = dataNames.length > 0 ? (await loadOssieModule()).isOssieModelText : () => false;
  const ossie = dataNames.filter(n => isOssieModelText(files[n]));
  const hasDocs = names.some(n => !dataNames.includes(n));
  if (ossie.length > 1) throw new Error("Import one Ossie file at a time");
  if (ossie.length === 1) {
    if (hasDocs) throw new Error("Import one format at a time");
    return loadOssieText(files[ossie[0]]);
  }
  // A lone data file that isn't an Ossie model: let the Ossie parser explain.
  if (dataNames.length > 0 && !hasDocs) return loadOssieText(files[dataNames[0]]);
  // Otherwise OKF; stray data files (package.json, configs) are ignored by parseBundle.
  return loadOkfFiles(files);
}

export async function loadModelText(text: string): Promise<LoadedModel> {
  if (tooLarge([text])) throw new Error(TOO_LARGE);
  if (detectModelFormat({ text }) === "ossie") return loadOssieText(text);
  return loadOkfFiles(parsePastedMarkdown(text));
}

export async function downloadOssie(graph: ModelGraph, modelName: string): Promise<string[]> {
  const { serializeOssie } = await loadOssieModule();
  const { yaml, warnings } = serializeOssie(graph, modelName);
  const blob = new Blob([yaml], { type: "application/yaml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${slugify(modelName, "model")}.ossie.yaml`;
  a.click();
  return warnings;
}
