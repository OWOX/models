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
// A frame owns one container. `indent` is the column of the key that introduced
// it (-1 for the root, the dash column for a sequence), so a frame's children
// always sit at a deeper indent — except a sequence, whose dashes YAML allows at
// the same column as their key. `pending` is a key whose value shape is not yet
// known: the next line decides between a mapping and a sequence.
type Frame =
  | { kind: "map"; indent: number; obj: Record<string, any> }
  | { kind: "seq"; indent: number; arr: any[] }
  | { kind: "pending"; indent: number; parent: Record<string, any>; key: string };

// A pending frame that never got children keeps the pre-sequence behaviour of
// resolving to an empty mapping (`tags:` with nothing under it => {}).
function closeFrame(f: Frame): void {
  if (f.kind === "pending") f.parent[f.key] = {};
}

function parseYaml(src: string): Record<string, any> {
  const root: Record<string, any> = {};
  const stack: Frame[] = [{ kind: "map", indent: -1, obj: root }];
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim()) continue;
    const indent = raw.match(/^ */)![0].length;
    const line = raw.trim();

    // `- item` — a sequence entry. OKF v0.2 puts lists of mappings in the
    // frontmatter (`sources`, `verified`, `parameters`); without this branch
    // their nested keys leaked onto the root and clobbered same-named top-level
    // keys, so the last `sources[].title` won over the document's own title.
    const item = line.match(/^-(?:\s+(.*))?$/);
    if (item) {
      // Unwind to the frame that owns this sequence: either the sequence itself
      // (a sibling entry, dashes at the same column) or the key that introduces
      // it (at the same column or shallower).
      while (stack.length > 1) {
        const top = stack[stack.length - 1];
        if (top.kind === "seq" && top.indent === indent) break;
        if (top.kind === "pending" && top.indent <= indent) break;
        closeFrame(stack.pop()!);
      }
      const top = stack[stack.length - 1];
      let arr: any[];
      if (top.kind === "pending") {
        arr = [];
        top.parent[top.key] = arr;
        stack[stack.length - 1] = { kind: "seq", indent, arr };
      } else if (top.kind === "seq") {
        arr = top.arr;
      } else continue;                       // a sequence with no owning key
      const content = item[1] ?? "";
      if (content === "") {                  // `-` alone: mapping starts next line
        const obj: Record<string, any> = {};
        arr.push(obj);
        stack.push({ kind: "map", indent, obj });
        continue;
      }
      const ci = content.indexOf(":");
      // A scalar or an inline flow collection is the whole entry.
      if (ci < 0 || /^[[{"']/.test(content)) { arr.push(parseValue(content)); continue; }
      // `- key: value` opens a mapping entry whose first key lives on this line.
      const obj: Record<string, any> = {};
      arr.push(obj);
      stack.push({ kind: "map", indent, obj });
      i = assign(stack, obj, indent + (line.length - content.length), content, lines, i);
      continue;
    }

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) closeFrame(stack.pop()!);
    const top = stack[stack.length - 1];
    // A mapping key directly under a sequence (no dash) is malformed; skip it
    // rather than writing string keys onto an array.
    if (top.kind === "seq") continue;
    const parent = top.kind === "pending" ? materialize(stack) : top.obj;
    i = assign(stack, parent, indent, line, lines, i);
  }
  while (stack.length > 1) closeFrame(stack.pop()!);
  return root;
}

// Turn the pending frame on top of the stack into a mapping and return it.
function materialize(stack: Frame[]): Record<string, any> {
  const f = stack[stack.length - 1] as Extract<Frame, { kind: "pending" }>;
  const obj: Record<string, any> = {};
  f.parent[f.key] = obj;
  stack[stack.length - 1] = { kind: "map", indent: f.indent, obj };
  return obj;
}

// Assign one `key: value` line into `parent`. Block scalars consume following
// lines, so the index of the last line used is returned.
function assign(
  stack: Frame[], parent: Record<string, any>, indent: number,
  line: string, lines: string[], i: number,
): number {
  const ci = line.indexOf(":"); if (ci < 0) return i;
  const key = line.slice(0, ci).trim(); const rest = line.slice(ci + 1).trim();
  {
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
      return j - 1;
    }
  }
  // An empty value defers the shape decision to the next line (mapping vs list).
  if (rest === "") stack.push({ kind: "pending", indent, parent, key });
  else parent[key] = parseValue(rest);
  return i;
}
function parseValue(s: string): unknown {
  if (s.startsWith("[")) return s.slice(1, -1).split(",").map(x => parseValue(x.trim())).filter(x => x !== "");
  // Inline flow mapping. Split on the FIRST colon so actor values keep their own
  // (`by: human:kliu@acme`); values are parsed, not coerced, so `{ x: 1, y: 2 }`
  // still yields numbers while `{ by: agent/v1 }` stays a string.
  if (s.startsWith("{")) { const o: Record<string, unknown> = {};
    s.slice(1, -1).split(",").forEach(p => {
      const ci = p.indexOf(":"); if (ci < 0) return;
      const k = p.slice(0, ci).trim(); if (k) o[k] = parseValue(p.slice(ci + 1).trim());
    }); return o; }
  if (s.startsWith('"')) return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if (s === "true" || s === "false") return s === "true";
  return s;
}
