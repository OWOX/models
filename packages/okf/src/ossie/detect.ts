import YAML from "yaml";

export type ModelFormat = "okf" | "ossie";

const OSSIE_EXT = /\.(ya?ml|json)$/i;
const OKF_EXT = /\.(zip|md|txt)$/i;
const OSSIE_KEY = /^(version|name|datasets|semantic_model)\s*:/;

/** Decide whether a model is an OKF bundle or an Apache Ossie document. The
 *  file extension wins; without one, sniff the first meaningful line of text. */
export function detectModelFormat(input: { fileName?: string; text: string }): ModelFormat {
  const { fileName, text } = input;
  if (fileName) {
    if (OSSIE_EXT.test(fileName)) return "ossie";
    if (OKF_EXT.test(fileName)) return "okf";
  }
  const lines = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n");
  let i = 0;
  while (i < lines.length && (lines[i].trim() === "" || lines[i].trimStart().startsWith("#"))) i++;
  if (i < lines.length && lines[i].trim() === "---") i++;
  const first = (lines[i] ?? "").trimStart();
  const looksOssie = first.startsWith("{") || OSSIE_KEY.test(first);
  // Frontmatter in OKF docs can also start with `name:` / `version:`, so also
  // require a top-level `datasets` / `semantic_model` key.
  const hasModelKey = /^(datasets|semantic_model)\s*:/m.test(lines.join("\n")) || /"(datasets|semantic_model)"\s*:/.test(text);
  return looksOssie && hasModelKey ? "ossie" : "okf";
}

/** True when the text parses (YAML or JSON) to an object with an array
 *  `datasets` or `semantic_model` — i.e. it is really an Ossie model. */
export function isOssieModelText(text: string): boolean {
  try {
    const raw = YAML.parse(text, { maxAliasCount: 100 }) as unknown;
    if (!raw || typeof raw !== "object") return false;
    const o = raw as Record<string, unknown>;
    return Array.isArray(o.datasets) || Array.isArray(o.semantic_model);
  } catch {
    return false;
  }
}
