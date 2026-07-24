export function slugify(text: string, fallback = ""): string {
  const s = (text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return s || fallback;
}
export function renderFrontmatter(obj: Record<string, unknown>, indent = ""): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    if (Array.isArray(v)) lines.push(`${indent}${k}: [${v.map(scalar).join(", ")}]`);
    else if (typeof v === "object") {
      const entries = Object.entries(v as Record<string, unknown>);
      const allScalar = entries.every(([, x]) => typeof x !== "object" || x === null);
      if (allScalar && entries.length <= 2 && entries.every(([, x]) => typeof x === "number"))
        lines.push(`${indent}${k}: { ${entries.map(([ek, ev]) => `${ek}: ${ev}`).join(", ")} }`);
      else { lines.push(`${indent}${k}:`); lines.push(renderFrontmatter(v as Record<string, unknown>, indent + "  ")); }
    } else if (typeof v === "string" && v.includes("\n")) {
      lines.push(`${indent}${k}: |`);
      const contentIndent = indent + "  ";
      for (const l of v.split("\n")) lines.push(l === "" ? "" : `${contentIndent}${l}`);
    } else lines.push(`${indent}${k}: ${scalar(v)}`);
  }
  return lines.join("\n");
}
function scalar(v: unknown): string {
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return `"${String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
export function parseFrontmatter(text: string): { data: Record<string, any>; body: string } {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text };
  return { data: parseYaml(m[1]), body: m[2] };
}
function parseYaml(src: string): Record<string, any> {
  const root: Record<string, any> = {}; const stack: { indent: number; obj: any }[] = [{ indent: -1, obj: root }];
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim()) continue;
    const indent = raw.match(/^ */)![0].length;
    const line = raw.trim(); const ci = line.indexOf(":"); if (ci < 0) continue;
    const key = line.slice(0, ci).trim(); const rest = line.slice(ci + 1).trim();
    while (stack.length && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].obj;
    const blockMatch = rest.match(/^([|>])(?:[+-])?$/);
    if (blockMatch) {
      const [, style] = blockMatch;
      const blockLines: string[] = [];
      let j = i + 1;
      for (; j < lines.length; j++) {
        const l = lines[j];
        if (!l.trim()) { blockLines.push(""); continue; }
        const lIndent = l.match(/^ */)![0].length;
        if (lIndent <= indent) break;
        blockLines.push(l);
      }
      // Trim trailing blank lines collected before we know the base indent.
      while (blockLines.length && blockLines[blockLines.length - 1] === "") blockLines.pop();
      let baseIndent = 0;
      for (const l of blockLines) { if (l.trim()) { baseIndent = l.match(/^ */)![0].length; break; } }
      const stripped = blockLines.map(l => (l === "" ? "" : l.slice(baseIndent)));
      // Chomping (-, +, default) all collapse to the same result here: descriptions
      // never need a trailing newline, so trailing whitespace is always trimmed.
      const joined = (style === "|" ? stripped.join("\n") : stripped.join(" ")).replace(/\s+$/, "");
      parent[key] = joined;
      i = j - 1;
      continue;
    }
    if (rest === "") { const obj: Record<string, any> = {}; parent[key] = obj; stack.push({ indent, obj }); }
    else parent[key] = parseValue(rest);
  }
  return root;
}
function parseValue(s: string): unknown {
  if (s.startsWith("[")) return s.slice(1, -1).split(",").map(x => parseValue(x.trim())).filter(x => x !== "");
  if (s.startsWith("{")) { const o: Record<string, number> = {};
    s.slice(1, -1).split(",").forEach(p => { const [k, v] = p.split(":").map(x => x.trim()); if (k) o[k] = Number(v); }); return o; }
  if (s.startsWith('"')) return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if (s === "true" || s === "false") return s === "true";
  return s;
}
