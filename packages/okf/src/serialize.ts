import type { ModelGraph, ModelNode, Cardinality } from "./types";
import { slugify, renderFrontmatter } from "./slug";
import { isCalculated, formulaLevel, defaultJoinAlias } from "./formula";
import { edgeJoinAliases, type EdgeAliases } from "./joins";

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
  const aliases = edgeJoinAliases(graph.nodes, graph.edges);
  for (const n of graph.nodes) files[`${folder}/${slugByKey.get(n.key)}.md`] = renderNode(n, graph, slugByKey, aliases);
  const rows = graph.nodes.map(n =>
    `| [${n.title}](./${slugByKey.get(n.key)}.md) | ${n.inputSource} | ${graph.storageId ?? "—"} |`).join("\n");
  files[`${folder}/index.md`] =
    `---\n${renderFrontmatter({ type: "index", title: projectTitle, description: graph.description?.trim() ? graph.description : "Index of exported OWOX data marts.", tags: ["owox", "index"] })}\n---\n\n# ${projectTitle}\n\n| Data Mart | Type | Storage |\n|-----------|------|---------|\n${rows}\n`;
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

function renderNode(n: ModelNode, g: ModelGraph, slugByKey: Map<string, string>, aliases: Map<string, EdgeAliases>): string {
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
  // The Alias column is emitted only when some field has one, so marts without
  // aliases keep the leaner 3-column table.
  const columns = n.schema.filter(f => !isCalculated(f));
  const withAlias = columns.some(f => f.alias);
  const header = withAlias
    ? "| Column | Type | Alias | Description |\n|--------|------|-------|-------------|\n"
    : "| Column | Type | Description |\n|--------|------|-------------|\n";
  const schema = columns.length
    ? "# Schema\n\n" + header +
      columns.map(f => {
        const parts: string[] = [];
        if (f.pk) parts.push("PK.");
        if (f.description) parts.push(f.description);
        const ref = fk.get(f.name);
        if (ref) parts.push(`FK to [${ref.title}](./${ref.slug}.md)`);
        const cells = withAlias
          ? [`\`${f.name}\``, f.type, f.alias ?? "", parts.join(" ").trim()]
          : [`\`${f.name}\``, f.type, parts.join(" ").trim()];
        return `| ${cells.join(" | ")} |`;
      }).join("\n") + "\n\n"
    : "";

  // A line opening with three-plus backticks would close the fence early. A leading
  // space keeps it inert (same rule as ODM's own OKF export of definitions).
  const fenceSafe = (s: string) => s.replace(/^( {0,3})(`{3,})/gm, " $1$2");
  const calc = n.schema.filter(isCalculated);
  const calculated = calc.length
    ? "## Calculated fields\n\n" + calc.map(f => {
        const level = formulaLevel(f.formula!) === "metric" ? "Metric" : "Column";
        const alias = f.alias ? `- **Alias:** ${f.alias}\n\n` : "";
        // A description line that reads as a heading or the alias line would end the
        // section or be taken as the alias on parse; a leading backslash keeps it inert.
        const escapeLine = (l: string) => /^\\*(#|- \*\*Alias:\*\*)/.test(l) ? `\\${l}` : l;
        const desc = f.description ? `${fenceSafe(f.description.trim()).split("\n").map(escapeLine).join("\n")}\n\n` : "";
        return `### \`${f.name}\` · ${f.type} · ${level}\n\n${alias}${desc}\`\`\`sql\n${fenceSafe(f.formula!.trim())}\n\`\`\`\n`;
      }).join("\n") + "\n"
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
        // An alias is written when set, or when a parallel join was given one other
        // than the default — so it reads the same after a round trip.
        const resolved = forward ? aliases.get(e.id)?.forward : aliases.get(e.id)?.reverse;
        const alias = (forward ? e.alias : e.reverseAlias)
          || (resolved && resolved !== defaultJoinAlias(other.title || other.key, other.key) ? resolved : undefined);
        const as = alias ? ` as \`${alias}\`` : "";
        // The description goes inline after the last marker, on the source line only.
        // A line with neither keys nor cardinality has no marker to anchor it, so there
        // it stays in the `- Description:` sub-bullet the parser also reads.
        const text = forward && e.description?.trim() ? e.description.replace(/\s*\n\s*/g, " ").trim() : "";
        const anchored = keys.length > 0 || !!card;
        const desc = !text ? "" : anchored ? ` — ${text}` : `\n  - Description: ${text}`;
        return `- [${other.title}](./${slugByKey.get(otherKey)}.md)${as} — ${cond}${suffix}${desc}`;
      }).join("\n") + "\n"
    : "";

  return `---\n${fm}\n---\n\n# ${n.title}\n${n.description ? "\n" + n.description + "\n" : ""}\n${overview}${schema}${calculated}${definition}${joins}`;
}
