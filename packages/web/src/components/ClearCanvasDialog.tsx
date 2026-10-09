import { useState } from "react";
import { loadExportFormat, type ExportFormat } from "../state/exportFormat";
import { ExportFormatToggle } from "./ExportFormatToggle";

interface ClearCanvasDialogProps {
  counts: { marts: number; relationships: number };
  onDelete: () => void;           // wipe the canvas, no export
  onExportAndDelete: (format: ExportFormat) => string[] | void;  // download an export; returns what it could not hold. Empty → the caller wipes
  initialFormat?: ExportFormat;   // defaults to the remembered format
  onClose: () => void;            // cancel
}

// Destructive-action confirmation before clearing the whole canvas. Clearing is
// permanent and can't be undone, so we nudge the user to export the model (OKF or
// Ossie) to their computer first. Two destructive paths (export-then-delete, or just
// delete) plus Cancel.
export function ClearCanvasDialog({ counts, onDelete, onExportAndDelete, initialFormat, onClose }: ClearCanvasDialogProps) {
  const [format, setFormat] = useState<ExportFormat>(() => initialFormat ?? loadExportFormat());
  const [warnings, setWarnings] = useState<string[]>([]);
  const empty = counts.marts === 0 && counts.relationships === 0;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-xl w-[460px] max-w-[95vw] p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-slate-900">Clear canvas</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none px-1">✕</button>
        </div>

        <div className="rounded-lg border border-[#f4caca] bg-[#fdf2f2] px-4 py-3 text-[13px] leading-relaxed text-[#7f1d1d]">
          This permanently deletes everything on the canvas
          {!empty && (
            <> — <span className="font-semibold">{counts.marts} {counts.marts === 1 ? "mart" : "marts"}</span> and <span className="font-semibold">{counts.relationships} {counts.relationships === 1 ? "relationship" : "relationships"}</span></>
          )}
          . This can&apos;t be undone.
        </div>

        <p className="text-[13px] text-slate-600">
          We recommend exporting the model (OKF or Ossie) to your computer first so you can re-import it later.
        </p>

        {warnings.length > 0 && (
          <div role="alert" className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
            The Ossie file was downloaded, but it can&apos;t hold everything:
            <ul className="mt-1 list-disc pl-5">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="text-[13px] font-[550] border border-[#d8dee8] bg-white text-slate-900 rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#f1f3f7]"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {warnings.length > 0 ? (
              <button
                onClick={() => onExportAndDelete("okf")}
                className="text-[13px] font-[550] border border-[#dc2626] bg-white text-[#dc2626] rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#fdf2f2]"
              >
                Export OKF instead
              </button>
            ) : (
              <>
                <ExportFormatToggle value={format} onChange={setFormat} />
                <button
                  onClick={() => { const w = onExportAndDelete(format); if (w && w.length > 0) setWarnings(w); }}
                  className="text-[13px] font-[550] border border-[#dc2626] bg-white text-[#dc2626] rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#fdf2f2]"
                >
                  Export &amp; delete
                </button>
              </>
            )}
            <button
              onClick={onDelete}
              className="text-[13px] font-[550] bg-[#dc2626] text-white border border-[#dc2626] rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#b91c1c]"
            >
              {warnings.length > 0 ? "Delete anyway" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
