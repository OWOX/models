import { serializeBundle, parseBundle, type ModelGraph } from "@mc/okf";

export function graphToBundleFiles(g: ModelGraph, projectTitle: string): Record<string, string> {
  return serializeBundle(g, projectTitle).files;
}

export function filesToGraph(files: Record<string, string>): ModelGraph {
  return parseBundle(files);
}

export function downloadBundle(files: Record<string, string>, name = "model-okf") {
  const blob = new Blob(
    [Object.entries(files).map(([p, c]) => `<!-- ${p} -->\n${c}`).join("\n\n")],
    { type: "text/markdown" },
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name}.md`;
  a.click();
}

export function parsePastedMarkdown(text: string): Record<string, string> {
  const parts = text.split(/<!--\s*(.+?)\s*-->\n/).slice(1);
  if (parts.length === 0) return { "pasted/doc.md": text };
  const files: Record<string, string> = {};
  for (let i = 0; i < parts.length; i += 2) files[parts[i]] = parts[i + 1] || "";
  return files;
}
