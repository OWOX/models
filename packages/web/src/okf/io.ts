import { serializeBundle, parseBundle, type ModelGraph } from "@mc/okf";
import { zipSync, unzipSync, strToU8, strFromU8 } from "fflate";

export function graphToBundleFiles(g: ModelGraph, projectTitle: string): Record<string, string> {
  return serializeBundle(g, projectTitle).files;
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
