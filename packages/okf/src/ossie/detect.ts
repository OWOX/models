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
  if (first.startsWith("{") || OSSIE_KEY.test(first)) return "ossie";
  return "okf";
}
