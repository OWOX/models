import { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronDown, Rocket, BadgeCheck } from "lucide-react";
import type { ModelGraph } from "@mc/okf";
import { parseFrontmatter } from "@mc/okf";
import { INDUSTRY_TEMPLATES, DATASET_TEMPLATES, type Template } from "../templates";
import { DataMartIcon, JoinIcon } from "../lib/icons";
import { ShareButton } from "./ShareButton";
import { buildTemplateDeeplink } from "../lib/templateLink";
import { buildOkfDeeplink } from "../share/okfLink";
import {
  fetchVerifiedBundleList,
  bundleGithubUrl,
  firstImageSrc,
  type VerifiedBundle,
} from "../okf/bundlesIndex";
import { fetchOkfBundleFromUrl } from "../okf/github";
import { filesToGraph } from "../okf/io";

interface Props {
  onUse: (graph: ModelGraph, name: string) => void;
}

const BUNDLES_URL = "https://github.com/OWOX/models/tree/main/bundles";

// Verified bundle folder → built-in template id. Only divergent names need an
// entry; the rest fall back to slug-normalization (dashes → underscores), which
// already matches ids like "marketplace" and "mobile_gaming".
const FOLDER_TO_TEMPLATE_ID: Record<string, string> = {
  "e-commerce": "ecommerce",
  "healthcare": "medical",
  "marketing-leadgen": "marketing_ads",
};
function templateIdForFolder(folder: string): string {
  return FOLDER_TO_TEMPLATE_ID[folder] ?? folder.replace(/-/g, "_");
}
// Name to hand `onUse` for a verified bundle. When the bundle matches a built-in
// template, use that template's name so Canvas's TEMPLATE_NICHE lookup fires
// (Business-Goal pre-pick + niche-flavored model name); otherwise fall back to
// the bundle's own title. The GitHub graph is used regardless — only the name.
export function verifiedTemplateName(folder: string, fallbackTitle: string): string {
  const id = templateIdForFolder(folder);
  return [...INDUSTRY_TEMPLATES, ...DATASET_TEMPLATES].find(t => t.id === id)?.name ?? fallbackTitle;
}
// Until the verified list loads, fall back to the known set so Others never
// flashes a duplicate for the common case.
const DEFAULT_DEDUP = ["ecommerce", "saas", "finance", "medical", "marketing_ads"];

// Shared gallery body — Verified templates (auto-discovered from the OWOX/models
// bundles index) followed by Others (built-in templates not yet migrated to
// verified bundles). Rendered by both LibraryDialog and WelcomeDialog so the two
// entry points stay visually and behaviorally consistent.
export function TemplateGallery({ onUse }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const [verified, setVerified] = useState<VerifiedBundle[] | null>(null);
  const [verifiedError, setVerifiedError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchVerifiedBundleList({ signal: ctrl.signal })
      .then(list => setVerified(list))
      .catch(e => { if (e.name !== "AbortError") setVerifiedError(e.message ?? "Failed to load."); });
    return () => ctrl.abort();
  }, []);

  const dedupIds = new Set(verified ? verified.map(b => templateIdForFolder(b.folder)) : DEFAULT_DEDUP);
  const others = [...INDUSTRY_TEMPLATES, ...DATASET_TEMPLATES].filter(t => !dedupIds.has(t.id));

  return (
    <div className="flex flex-col gap-2">
      {/* Verified Templates Gallery — auto-discovered community bundles. */}
      <div className="px-1">
        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
          <BadgeCheck size={15} className="text-[#16a34a]" /> Verified templates gallery
        </div>
        <p className="mt-0.5 text-[12px] text-slate-500">
          Ready-to-use, free community bundles maintained by OWOX ·{" "}
          <a href={BUNDLES_URL} target="_blank" rel="noopener noreferrer" className="text-[#1e88e5] hover:text-[#1976d2] underline underline-offset-2">
            browse on GitHub ↗
          </a>
        </p>
      </div>
      {verifiedError && (
        <p className="mx-1 text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{verifiedError}</p>
      )}
      {!verified && !verifiedError && (
        <p className="px-1 text-[12px] text-slate-400">Loading verified bundles…</p>
      )}
      {verified?.map(b => (
        <VerifiedTemplateRow
          key={b.folder}
          bundle={b}
          open={openId === `v:${b.folder}`}
          onToggle={() => setOpenId(openId === `v:${b.folder}` ? null : `v:${b.folder}`)}
          onUse={onUse}
        />
      ))}

      {/* Others — built-in templates not yet migrated to verified bundles. */}
      <div className="px-1 pt-3 text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">Others</div>
      <div data-testid="others-section" className="flex flex-col gap-2">
        {others.map(t => (
          <TemplateRow
            key={t.id}
            template={t}
            open={openId === `t:${t.id}`}
            onToggle={() => setOpenId(openId === `t:${t.id}` ? null : `t:${t.id}`)}
            onUse={() => onUse(structuredClone(t.graph), t.name)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Verified bundle row (lazy fetch on expand) ──────────────────────────────
function VerifiedTemplateRow({
  bundle, open, onToggle, onUse,
}: { bundle: VerifiedBundle; open: boolean; onToggle: () => void; onUse: (g: ModelGraph, name: string) => void }) {
  const [graph, setGraph] = useState<ModelGraph | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);
  const inFlightRef = useRef<Promise<ModelGraph | null> | null>(null);
  const mountedRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const url = bundleGithubUrl(bundle.folder);

  // On unmount, stop guarding state AND abort any in-flight bundle fetch so a
  // dialog closed mid-load doesn't leave the network request running.
  useEffect(() => () => { mountedRef.current = false; abortRef.current?.abort(); }, []);

  function load(): Promise<ModelGraph | null> {
    if (loadedRef.current && graph) return Promise.resolve(graph);
    if (inFlightRef.current) return inFlightRef.current;

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const promise = (async () => {
      try {
        const files = await fetchOkfBundleFromUrl(url, { signal: ctrl.signal });
        const parsed = filesToGraph(files);
        // OKF carries no OWOX identity — mark nodes pending (mirrors ImportDialog).
        const g: ModelGraph = { ...parsed, nodes: parsed.nodes.map(n => ({ ...n, status: "pending" as const, owoxId: null })) };
        const idx = Object.entries(files).find(([p]) => p.toLowerCase().endsWith("index.md"))?.[1] ?? "";
        let desc: string | null = null;
        try { const t = parseFrontmatter(idx).data.description; desc = typeof t === "string" && t.trim() ? t.trim() : null; } catch { /* ignore */ }
        if (mountedRef.current) { setGraph(g); setDescription(desc); setImageSrc(firstImageSrc(idx)); }
        loadedRef.current = true;
        return g;
      } catch (e) {
        // Aborted on unmount — not a real failure, and the component is gone.
        if ((e as Error).name === "AbortError") return null;
        if (mountedRef.current) setError((e as Error).message ?? "Failed to load bundle.");
        return null;
      } finally {
        inFlightRef.current = null;
        if (mountedRef.current) setLoading(false);
      }
    })();

    inFlightRef.current = promise;
    setLoading(true); setError(null);
    return promise;
  }

  // Fetch the moment the row opens.
  useEffect(() => { if (open && !loadedRef.current) void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [open]);

  async function handleUse(e: React.MouseEvent) {
    e.stopPropagation();
    const g = graph ?? (await load());
    if (g) onUse(g, verifiedTemplateName(bundle.folder, bundle.title));
  }

  return (
    <div className="group shrink-0 rounded-xl border border-[#e2e6ec] overflow-hidden">
      <div onClick={onToggle} role="button" className="flex items-center gap-3 px-4 py-3 hover:bg-[#f8fafc] text-left cursor-pointer">
        {open ? <ChevronDown size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold truncate">{bundle.title}</div>
        </div>
        {graph
          ? <span className="text-[11px] text-slate-500 whitespace-nowrap flex-shrink-0">{graph.nodes.length} marts · {graph.edges.length} links</span>
          : bundle.martCount != null && <span className="text-[11px] text-slate-500 whitespace-nowrap flex-shrink-0">{bundle.martCount} marts</span>}
        <ShareButton deeplink={buildOkfDeeplink(url)} className={open ? "" : "opacity-0 group-hover:opacity-100 transition"} />
        <button
          onClick={handleUse}
          title="Roll out this model onto the canvas"
          className="flex items-center gap-[6px] rounded-lg bg-[#1e88e5] px-3 py-[6px] text-[12px] font-semibold text-white hover:bg-[#1976d2] whitespace-nowrap"
        >
          <Rocket size={13} /> Use
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-1 bg-[#fbfcfe] border-t border-[#eef1f5] overflow-y-auto" style={{ maxHeight: "46vh" }}>
          {loading && <p className="mt-2 text-[12px] text-slate-400">Loading bundle…</p>}
          {error && <p className="mt-2 text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          {description && <p className="mt-2 text-[12.5px] text-slate-600 whitespace-pre-line">{description}</p>}
          {imageSrc && (
            <img src={imageSrc} alt={`${bundle.title} model`} className="mt-3 w-full rounded-lg border border-[#e9edf2]" loading="lazy" />
          )}
          {graph && <MartsAndRelationships nodes={graph.nodes} edges={graph.edges} />}
        </div>
      )}
    </div>
  );
}

// ── Built-in template row (Others) ──────────────────────────────────────────
function TemplateRow({ template, open, onToggle, onUse }: { template: Template; open: boolean; onToggle: () => void; onUse: () => void }) {
  const { nodes, edges } = template.graph;
  return (
    <div className="group shrink-0 rounded-xl border border-[#e2e6ec] overflow-hidden">
      <div onClick={onToggle} role="button" className="flex items-center gap-3 px-4 py-3 hover:bg-[#f8fafc] text-left cursor-pointer">
        {open ? <ChevronDown size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold truncate">{template.name}</div>
          <div className="text-[12px] text-slate-500 truncate">{template.description}</div>
        </div>
        <span className="text-[11px] text-slate-500 whitespace-nowrap flex-shrink-0">{nodes.length} marts · {edges.length} links</span>
        <ShareButton deeplink={buildTemplateDeeplink(template.id)} className={open ? "" : "opacity-0 group-hover:opacity-100 transition"} />
        <button
          onClick={e => { e.stopPropagation(); onUse(); }}
          title="Roll out this model onto the canvas"
          className="flex items-center gap-[6px] rounded-lg bg-[#1e88e5] px-3 py-[6px] text-[12px] font-semibold text-white hover:bg-[#1976d2] whitespace-nowrap"
        >
          <Rocket size={13} /> Use
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-1 bg-[#fbfcfe] border-t border-[#eef1f5] overflow-y-auto" style={{ maxHeight: "46vh" }}>
          <MartsAndRelationships nodes={nodes} edges={edges} />
        </div>
      )}
    </div>
  );
}

// ── Shared expanded body: data marts + relationships (both row types) ───────
function MartsAndRelationships({ nodes, edges }: { nodes: ModelGraph["nodes"]; edges: ModelGraph["edges"] }) {
  return (
    <>
      <div className="flex flex-col gap-1.5 mt-3">
        {nodes.map(n => <MartRow key={n.key} title={n.title} fields={n.schema} />)}
      </div>
      {edges.length > 0 && (
        <div className="mt-3">
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Relationships</div>
          <ul className="flex flex-col gap-1">
            {edges.map(e => {
              const from = nodes.find(n => n.key === e.from)?.title ?? e.from;
              const to = nodes.find(n => n.key === e.to)?.title ?? e.to;
              const cond = e.keys.map(k => `${k.left} = ${k.right}`).join(", ");
              return (
                <li key={e.id} className="flex items-center gap-2 text-[12px] text-slate-600">
                  <JoinIcon size={13} className="text-slate-400 flex-shrink-0" />
                  <span><b className="text-slate-800">{from}</b> {e.bidirectional ? "↔" : "→"} <b className="text-slate-800">{to}</b></span>
                  <span className="text-slate-400">·</span>
                  <code className="text-[11px] text-slate-500">{cond}</code>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

function MartRow({ title, fields }: { title: string; fields: { name: string; type: string; pk: boolean }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-[#e9edf2] bg-white">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#f8fafc]">
        {open ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
        <DataMartIcon size={14} className="text-slate-500" />
        <span className="text-[13px] font-medium flex-1">{title}</span>
        <span className="text-[11px] text-slate-500">{fields.length} fields</span>
      </button>
      {open && (
        <table className="w-full text-[12px] border-t border-[#eef1f5]">
          <tbody>
            {fields.map(f => (
              <tr key={f.name} className="border-b border-[#f3f5f8] last:border-0">
                <td className="px-3 py-1.5 font-mono text-slate-700">{f.name}</td>
                <td className="px-3 py-1.5 text-slate-500">{f.type}</td>
                <td className="px-3 py-1.5 text-right text-[10.5px] text-[#1e88e5] font-semibold">{f.pk ? "PK" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
