import { useMemo, useState } from "react";
import type { ModelGraph } from "@mc/okf";
import { api } from "../lib/api";
import type { StorageOption } from "./TopBar";
import { payloadToGraph, type ImportPayload, type ImportFilter } from "../sync/owoxImport";

interface Props {
  storages: StorageOption[];
  onConfirm: (graph: ModelGraph, mode: "replace" | "merge") => void;
  onClose: () => void;
}

export function OwoxImportDialog({ storages, onConfirm, onClose }: Props) {
  const [step, setStep] = useState<"storage" | "filter">("storage");
  const [storageId, setStorageId] = useState<string>(storages[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<ImportPayload | null>(null);
  const [filter, setFilter] = useState<ImportFilter>("all");
  const [mode, setMode] = useState<"replace" | "merge">("replace");

  async function loadGraph() {
    setError(null); setLoading(true);
    try {
      const p = await api<ImportPayload>(`/api/owox-import?storageId=${encodeURIComponent(storageId)}`);
      setPayload(p);
      setStep("filter");
    } catch (e) {
      setError((e as Error).message ?? "Failed to load data marts from OWOX.");
    } finally {
      setLoading(false);
    }
  }

  const counts = useMemo(() => {
    if (!payload) return { marts: 0, rels: 0 };
    const g = payloadToGraph(payload, filter);
    return { marts: g.nodes.length, rels: g.edges.length };
  }, [payload, filter]);

  const FILTERS: { value: ImportFilter; label: string }[] = [
    { value: "all", label: "Import all" },
    { value: "published", label: "Import only published Data Marts" },
    { value: "with-relationships", label: "Import only Data Marts with relationships" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-xl shadow-xl w-[480px] max-w-[95vw] p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-slate-900">Import from OWOX project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none px-1">✕</button>
        </div>

        {step === "storage" && (
          <>
            <p className="text-[13px] text-slate-600 -mt-1">Choose a storage. Import is scoped to one storage at a time.</p>
            <div className="flex flex-col gap-1.5 max-h-[40vh] overflow-y-auto">
              {storages.map(s => (
                <label key={s.id} className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer text-[13px] ${storageId === s.id ? "border-[#1e88e5] bg-[#e6f1fb]" : "border-[#d8dee8] hover:bg-[#f1f3f7]"}`}>
                  <input type="radio" name="storage" checked={storageId === s.id} onChange={() => setStorageId(s.id)} />
                  <span className="font-semibold text-slate-900">{s.title}</span>
                  <span className="text-slate-500">— {s.type}</span>
                </label>
              ))}
              {storages.length === 0 && <p className="text-[13px] text-slate-500">No storages available.</p>}
            </div>
            {error && <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex gap-2 justify-end">
              <button onClick={onClose} className="text-[13px] font-[550] border border-[#d8dee8] bg-white text-slate-900 rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#f1f3f7]">Cancel</button>
              <button onClick={loadGraph} disabled={!storageId || loading}
                className="text-[13px] font-[550] bg-[#1e88e5] text-white border border-[#1e88e5] rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#1976d2] disabled:opacity-50">
                {loading ? "Loading…" : "Continue"}
              </button>
            </div>
          </>
        )}

        {step === "filter" && payload && (
          <>
            {payload.truncated && (
              <p className="text-[13px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                This storage has {payload.total} data marts; only the first 100 will be imported.
              </p>
            )}
            <div className="flex flex-col gap-1.5">
              {FILTERS.map(f => (
                <label key={f.value} className="flex items-center gap-2 text-[13px] text-slate-800 cursor-pointer">
                  <input type="radio" name="filter" checked={filter === f.value} onChange={() => setFilter(f.value)} />
                  {f.label}
                </label>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3">
              <span className="text-[12px] font-medium text-slate-500">When applying to the canvas</span>
              {(["replace", "merge"] as const).map(m => (
                <label key={m} className="flex items-center gap-2 text-[13px] text-slate-800 cursor-pointer">
                  <input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} />
                  {m === "replace" ? "Replace the canvas" : "Merge into the canvas"}
                </label>
              ))}
            </div>
            <p className="text-[12px] text-slate-500">Will import {counts.marts} marts, {counts.rels} relationships.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setStep("storage")} className="text-[13px] font-[550] border border-[#d8dee8] bg-white text-slate-900 rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#f1f3f7]">Back</button>
              <button onClick={() => onConfirm(payloadToGraph(payload, filter), mode)} disabled={counts.marts === 0}
                className="text-[13px] font-[550] bg-[#1e88e5] text-white border border-[#1e88e5] rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#1976d2] disabled:opacity-50">
                Import
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
