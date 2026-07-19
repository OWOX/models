import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { filesToGraph, parsePastedMarkdown, zipToFiles } from "../okf/io";
import { fetchOkfBundleFromUrl } from "../okf/github";
import { parseFrontmatter, type ModelGraph } from "@mc/okf";

type TabId = "upload" | "paste" | "github";
const TABS: { id: TabId; label: string }[] = [
  { id: "upload", label: "Upload files" },
  { id: "paste", label: "Paste markdown" },
  { id: "github", label: "From GitHub" },
];

interface ImportDialogProps {
  onConfirm: (graph: ModelGraph, mode: "replace" | "merge") => void;
  onClose: () => void;
  /** When set (from a `?okf=` deeplink), open the GitHub tab, prefill the URL,
   *  and auto-fetch on mount so the preview is ready. */
  initialUrl?: string;
}

export function ImportDialog({ onConfirm, onClose, initialUrl }: ImportDialogProps) {
  const [activeTab, setActiveTab] = useState<TabId>(initialUrl ? "github" : "upload");
  const [pasteText, setPasteText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ModelGraph | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [mode, setMode] = useState<"replace" | "merge">("replace");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [fetching, setFetching] = useState(false);
  const [fetchedFiles, setFetchedFiles] = useState<Record<string, string> | null>(null);
  // Last URL that fetched successfully — so a blur/paste re-trigger for the same
  // already-loaded link is a no-op (but a failed URL can still be retried).
  const lastFetchedRef = useRef<string | null>(null);

  // Copy the AI authoring guide to the clipboard so the user can paste it into
  // Claude/ChatGPT to generate an importable OKF model. Falls back to opening
  // the raw guide if the clipboard is blocked.
  async function copyInstructions() {
    try {
      const md = await fetch("/okf-format.md").then(r => r.text());
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.open("/okf-format.md", "_blank");
    }
  }

  // Collect the files for a single tab only — each tab is an autonomous source,
  // so the preview reflects just the active tab's input (never a merge).
  async function filesForTab(tab: TabId, paste: string, fetched: Record<string, string> | null): Promise<Record<string, string>> {
    if (tab === "upload") {
      const files: Record<string, string> = {};
      const uploaded = fileInputRef.current?.files;
      if (uploaded && uploaded.length > 0) {
        for (const file of Array.from(uploaded)) {
          if (file.name.endsWith(".zip")) {
            Object.assign(files, zipToFiles(new Uint8Array(await file.arrayBuffer())));
          } else {
            files[file.name] = await file.text();
          }
        }
      }
      return files;
    }
    if (tab === "paste") return paste.trim() ? parsePastedMarkdown(paste.trim()) : {};
    return fetched ?? {}; // github
  }

  // Parse into a ModelGraph with pending nodes (OKF carries no OWOX identity).
  function toPendingGraph(files: Record<string, string>): ModelGraph {
    const graph = filesToGraph(files);
    return { ...graph, nodes: graph.nodes.map(n => ({ ...n, status: "pending" as const, owoxId: null })) };
  }

  // Model name from the bundle's index.md frontmatter title, when present.
  function modelNameOf(files: Record<string, string>): string | null {
    const idx = Object.entries(files).find(([p]) => p.toLowerCase().endsWith("index.md"));
    if (!idx) return null;
    try {
      const t = parseFrontmatter(idx[1]).data.title;
      return typeof t === "string" && t.trim() ? t.trim() : null;
    } catch {
      return null;
    }
  }

  // Re-parse the ACTIVE tab's source to drive the live preview/count. Empty
  // input clears it; a parse error is shown (and clears the preview) so the
  // count never lies. Only the active tab ever shows a preview + enabled Import.
  async function refresh(tab: TabId, opts?: { paste?: string; fetched?: Record<string, string> | null }) {
    const paste = opts?.paste ?? pasteText;
    const fetched = opts?.fetched ?? fetchedFiles;
    try {
      const files = await filesForTab(tab, paste, fetched);
      if (Object.keys(files).length === 0) { setPreview(null); setModelName(null); return; }
      setPreview(toPendingGraph(files));
      setModelName(modelNameOf(files));
      setError(null);
    } catch (e) {
      setPreview(null); setModelName(null);
      setError((e as Error).message ?? "Failed to parse OKF bundle.");
    }
  }

  // Switch tabs: each tab is autonomous, so clear any transient error and
  // recompute the preview from the newly-active tab's own input.
  function selectTab(tab: TabId) {
    setActiveTab(tab);
    setError(null);
    void refresh(tab);
  }

  // Fetch a public OKF bundle from a GitHub URL into the GitHub tab's preview.
  // Auto-triggered on paste / blur / Enter / deeplink — there is no Fetch button.
  // Skips re-fetching a URL that already loaded; a failed URL can be retried.
  async function fetchFromUrl(target: string) {
    const trimmed = target.trim();
    if (!trimmed || fetching) return;
    if (trimmed === lastFetchedRef.current && preview) return;
    setFetching(true); setError(null);
    try {
      const files = await fetchOkfBundleFromUrl(trimmed);
      lastFetchedRef.current = trimmed;
      setFetchedFiles(files);
      await refresh("github", { fetched: files });
    } catch (e) {
      lastFetchedRef.current = null;
      setFetchedFiles(null);
      setPreview(null); setModelName(null);
      setError((e as Error).message ?? "Failed to fetch bundle.");
    } finally {
      setFetching(false);
    }
  }

  // Deeplink entry: prefill + auto-fetch once on mount (GitHub tab is active).
  useEffect(() => {
    if (initialUrl) void fetchFromUrl(initialUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reveal the END of the URL (where the bundle/model name is) whenever it's set
  // programmatically — deeplink prefill or paste — without disturbing active
  // typing (a focused input already scrolls to the caret).
  useEffect(() => {
    const el = urlInputRef.current;
    if (el && document.activeElement !== el) el.scrollLeft = el.scrollWidth;
  }, [url]);

  // "No model yet? Generate one with AI" — shown on the upload & paste tabs.
  const aiBlock = (
    <div className="flex flex-col gap-1.5 rounded-lg border border-[#e6e9f0] bg-[#f7f8fa] px-3 py-2.5">
      <span className="text-[12.5px] text-slate-600">No model yet? Generate one with AI:</span>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={copyInstructions}
          className="flex items-center gap-[6px] rounded-lg bg-[#1e88e5] px-3 py-[6px] text-[12.5px] font-[550] text-white hover:bg-[#1976d2]"
        >
          {copied ? <><Check size={14} /> Copied — paste into Claude</> : <><Copy size={14} /> Copy AI instructions</>}
        </button>
        <a
          href="/ai-instructions.html"
          target="_blank"
          rel="noopener"
          className="text-[12.5px] text-[#1e88e5] hover:text-[#1976d2] underline underline-offset-2"
        >
          View guide ↗
        </a>
      </div>
    </div>
  );

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-xl w-[480px] max-w-[95vw] p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-slate-900">Import OKF bundle</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl leading-none px-1"
          >
            ✕
          </button>
        </div>

        {/* Source tabs — segmented control (upload / paste / GitHub). */}
        <div className="flex gap-1 rounded-lg bg-[#f1f3f7] p-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => selectTab(t.id)}
              className={
                "flex-1 rounded-md px-3 py-[6px] text-[12.5px] font-[550] transition " +
                (activeTab === t.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Upload tab */}
        {activeTab === "upload" && (
          <div className="flex flex-col gap-4">
            {aiBlock}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1">
                Upload .md / .txt / .zip files
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.txt,.zip"
                multiple
                onChange={() => void refresh("upload")}
                className="block w-full text-[13px] text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:border-[#d8dee8] file:bg-white file:text-[13px] file:font-medium file:cursor-pointer hover:file:bg-[#f1f3f7]"
              />
            </div>
          </div>
        )}

        {/* Paste tab */}
        {activeTab === "paste" && (
          <div className="flex flex-col gap-4">
            {aiBlock}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1">
                Paste markdown content
              </label>
              <textarea
                value={pasteText}
                onChange={(e) => { setPasteText(e.target.value); void refresh("paste", { paste: e.target.value }); }}
                placeholder={"<!-- path/to/file.md -->\n...content..."}
                rows={6}
                className="w-full text-[13px] font-mono border border-[#d8dee8] rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
              />
            </div>
          </div>
        )}

        {/* GitHub tab — fetches the bundle client-side from raw.githubusercontent.com. */}
        {activeTab === "github" && (
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1">
              Import from a public GitHub URL
            </label>
            <input
              ref={urlInputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPaste={(e) => { const el = e.currentTarget; setTimeout(() => { setUrl(el.value); void fetchFromUrl(el.value); }, 0); }}
              onBlur={() => { if (url.trim()) void fetchFromUrl(url); }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void fetchFromUrl(url); } }}
              placeholder="https://github.com/OWOX/models/tree/main/bundles/demo-project"
              className="w-full text-[13px] border border-[#d8dee8] rounded-lg px-3 py-[7px] focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
            />
            <p className="mt-1 text-[12px] text-slate-500">
              {fetching
                ? "Fetching bundle…"
                : "Paste a link to an OKF bundle folder — it loads automatically. Works with any public GitHub repo in the OKF format (like OWOX/models)."}
            </p>
          </div>
        )}

        {error && (
          <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Preview: model name + object list + apply mode + count. */}
        {preview && (
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
            {modelName && (
              <span className="text-[13px] font-semibold text-slate-900">{modelName}</span>
            )}
            {preview.nodes.length > 0 && (
              <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-100 divide-y divide-slate-50">
                {preview.nodes.map(n => (
                  <div key={n.key} className="flex items-center justify-between gap-2 px-2.5 py-1.5">
                    <span className="truncate text-[12.5px] text-slate-800">{n.title}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-slate-500">
                        {n.inputSource}
                      </span>
                      <span className="text-[11px] text-slate-400">{n.schema.length} fields</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            <span className="text-[12px] font-medium text-slate-500 mt-1">When applying to the canvas</span>
            {(["replace", "merge"] as const).map(m => (
              <label key={m} className="flex items-center gap-2 text-[13px] text-slate-800 cursor-pointer">
                <input type="radio" name="okf-mode" checked={mode === m} onChange={() => setMode(m)} />
                {m === "replace" ? "Replace the canvas" : "Merge into the canvas"}
              </label>
            ))}
            <p className="text-[12px] text-slate-500">
              Will import {preview.nodes.length} marts, {preview.edges.length} relationships.
            </p>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="text-[13px] font-[550] border border-[#d8dee8] bg-white text-slate-900 rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#f1f3f7]"
          >
            Cancel
          </button>
          <button
            onClick={() => preview && onConfirm(preview, mode)}
            disabled={!preview}
            className="text-[13px] font-[550] bg-[#1e88e5] text-white border border-[#1e88e5] rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#1976d2] disabled:opacity-50"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
