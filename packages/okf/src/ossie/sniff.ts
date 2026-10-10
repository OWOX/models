import YAML from "yaml";

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
