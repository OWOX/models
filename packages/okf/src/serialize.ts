import type { ModelGraph, ModelNode, Cardinality } from "./types";
import { slugify, renderFrontmatter } from "./slug";

const FLIP_CARDINALITY: Record<Cardinality, Cardinality> = { "1:1": "1:1", "N:N": "N:N", "1:N": "N:1", "N:1": "1:N" };

export interface OkfBundle { files: Record<string, string>; }

export function serializeBundle(graph: ModelGraph, projectTitle = "Data Marts"): OkfBundle {
  const folder = slugify(projectTitle, "data-marts");
  const slugByKey = new Map<string, string>();
  const taken = new Set<string>();
  for (const n of graph.nodes) {
    const s = slugify(n.title, n.key);
    let u = s; let i = 2;
    while (taken.has(u)) u = `${s}-${i++}`;
    taken.add(u);
    slugByKey.set(n.key, u);
  }
  const files: Record<string, string> = {};
  for (const n of graph.nodes) files[`${folder}/${slugByKey.get(n.key)}.md`] = renderNode(n, graph, slugByKey);
  const rows = graph.nodes.map(n =>
    `| [${n.title}](./${slugByKey.get(n.key)}.md) | ${n.inputSource} | ${graph.storageId ?? "—"} |`).join("\n");
  files[`${folder}/index.md`] =
    `---\n${renderFrontmatter({ type: "index", title: projectTitle, description: "Index of exported OWOX data marts.", tags: ["owox", "index"] })}\n---\n\n# ${projectTitle}\n\n| Data Mart | Type | Storage |\n|-----------|------|---------|\n${rows}\n`;
  return { files };
}

// Map each of a node's own FK columns to the target mart it points at, so the
// FK note can be rendered inside that column's Description cell.
function fkColumns(n: ModelNode, g: ModelGraph, slugByKey: Map<string, string>): Map<string, { title: string; slug: string }> {
  const out = new Map<string, { title: string; slug: string }>();
  for (const e of g.edges) {
    if (e.from === n.key) {
      const t = g.nodes.find(x => x.key === e.to)!;
      for (const k of e.keys) out.set(k.left, { title: t.title, slug: slugByKey.get(e.to)! });
    } else if (e.bidirectional && e.to === n.key) {
      const t = g.nodes.find(x => x.key === e.from)!;
      for (const k of e.keys) out.set(k.right, { title: t.title, slug: slugByKey.get(e.from)! });
    }
  }
  return out;
}

function renderNode(n: ModelNode, g: ModelGraph, slugByKey: Map<string, string>): string {
  const fm = renderFrontmatter({
    type: "OWOX Data Mart", title: n.title, description: n.description || undefined,
    tags: ["owox", n.inputSource.toLowerCase()],
  });
  const overview = [
    "## Overview", "",
    `- **ID:** \`${n.owoxId ?? "—"}\``,
    `- **Status:** ${n.status === "created" ? "PUBLISHED" : "DRAFT"}`,
    `- **Definition type:** ${n.inputSource}`,
    `- **Storage:** ${g.storageId ?? "—"}`,
    "",
  ].join("\n");

  const fk = fkColumns(n, g, slugByKey);
  const schema = n.schema.length
    ? "# Schema\n\n| Column | Type | Description |\n|--------|------|-------------|\n" +
      n.schema.map(f => {
        const parts: string[] = [];
        if (f.pk) parts.push("PK.");
        if (f.description) parts.push(f.description);
        const ref = fk.get(f.name);
        if (ref) parts.push(`FK to [${ref.title}](./${ref.slug}.md)`);
        return `| \`${f.name}\` | ${f.type} | ${parts.join(" ").trim()} |`;
      }).join("\n") + "\n\n"
    : "";

  const definition = n.definition && n.definition.trim()
    ? `## Definition\n\n\`\`\`${n.inputSource === "SQL" ? "sql" : "text"}\n${n.definition.trim()}\n\`\`\`\n\n`
    : "";

  const outgoing = g.edges.filter(e => e.from === n.key || (e.bidirectional && e.to === n.key));
  const joins = outgoing.length
    ? "## Joins\n\n" + outgoing.map(e => {
        const forward = e.from === n.key;
        const otherKey = forward ? e.to : e.from;
        const other = g.nodes.find(x => x.key === otherKey)!;
        const keys = forward ? e.keys : e.keys.map(k => ({ left: k.right, right: k.left }));
        const cond = keys.map(k => `\`${k.left} = ${k.right}\``).join(", ");
        const card = e.cardinality ? (forward ? e.cardinality : FLIP_CARDINALITY[e.cardinality]) : undefined;
        const suffix = card ? ` [${card}]` : "";
        return `- [${other.title}](./${slugByKey.get(otherKey)}.md) — ${cond}${suffix}`;
      }).join("\n") + "\n"
    : "";

  return `---\n${fm}\n---\n\n# ${n.title}\n${n.description ? "\n" + n.description + "\n" : ""}\n${overview}${schema}${definition}${joins}`;
}
