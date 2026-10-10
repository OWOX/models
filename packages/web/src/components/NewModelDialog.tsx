import { useState } from "react";
import { X } from "lucide-react";
import { loadExportFormat, type ExportFormat } from "../state/exportFormat";
import { ExportFormatToggle } from "./ExportFormatToggle";

// Shown when starting a new model from the rail while the canvas has *unsaved*
// work (a never-saved model, or edits since the last Save). When the open model
// is already saved and unchanged we skip this entirely and start fresh — there's
// nothing to lose. Unlike Clear canvas, this is a calm "start fresh", not a red
// destructive warning, and it always offers an export (OKF or Ossie) first.
export function NewModelDialog({
  counts, savedModel, onStart, onExportAndStart, initialFormat, onClose,
}: {
  counts: { marts: number; relationships: number };
  savedModel: boolean; // saved before, but with edits since (vs never saved)
  onStart: () => void;
  onExportAndStart: (format: ExportFormat) => string[] | void | Promise<string[] | void>; // returns what the export could not hold; empty → the caller starts fresh
  initialFormat?: ExportFormat; // defaults to the remembered format
  onClose: () => void;
}) {
  const [format, setFormat] = useState<ExportFormat>(() => initialFormat ?? loadExportFormat());
  const [warnings, setWarnings] = useState<string[]>([]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="w-[460px] rounded-2xl bg-white p-7 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Start a new model?</h1>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X size={18} /></button>
        </div>

        <p className="mt-3 text-[13.5px] leading-relaxed text-slate-600">
          This clears the canvas — {counts.marts} object{counts.marts === 1 ? "" : "s"} and {counts.relationships} relationship{counts.relationships === 1 ? "" : "s"} — so you can start fresh.{" "}
          {savedModel
            ? "Your saved model keeps its last saved version, but changes since then will be lost. Export the model to keep them."
            : "Your current model isn't saved yet — export the model first if you want to keep a copy."}
        </p>

        {warnings.length > 0 && (
          <div role="alert" className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
            The Ossie file was downloaded, but it can&apos;t hold everything:
            <ul className="mt-1 list-disc pl-5">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-[13px] font-[550] text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
          {warnings.length > 0 ? (
            <button onClick={() => void onExportAndStart("okf")} className="rounded-lg border border-[#d8dee8] px-4 py-2 text-[13px] font-[550] text-slate-700 hover:border-[#1e88e5] hover:text-[#1e88e5] cursor-pointer">Export OKF instead</button>
          ) : (
            <>
              <ExportFormatToggle value={format} onChange={setFormat} />
              <button onClick={async () => { const w = await onExportAndStart(format); if (w && w.length > 0) setWarnings(w); }} className="rounded-lg border border-[#d8dee8] px-4 py-2 text-[13px] font-[550] text-slate-700 hover:border-[#1e88e5] hover:text-[#1e88e5] cursor-pointer">Export &amp; start</button>
            </>
          )}
          <button onClick={onStart} className="rounded-lg bg-[#1e88e5] px-4 py-2 text-[13px] font-[600] text-white hover:bg-[#1976d2] cursor-pointer">{warnings.length > 0 ? "Start anyway" : "Start new model"}</button>
        </div>
      </div>
    </div>
  );
}
