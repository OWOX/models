interface ClearCanvasDialogProps {
  counts: { marts: number; relationships: number };
  onDelete: () => void;           // wipe the canvas, no export
  onExportAndDelete: () => void;  // download an OKF bundle, then wipe
  onClose: () => void;            // cancel
}

// Destructive-action confirmation before clearing the whole canvas. Clearing is
// permanent and can't be undone, so we nudge the user to export an OKF bundle
// to their computer first. Two destructive paths (export-then-delete, or just
// delete) plus Cancel.
export function ClearCanvasDialog({ counts, onDelete, onExportAndDelete, onClose }: ClearCanvasDialogProps) {
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
          We recommend exporting an <span className="font-semibold">OKF</span> bundle to your computer first so you can re-import this model later.
        </p>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="text-[13px] font-[550] border border-[#d8dee8] bg-white text-slate-900 rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#f1f3f7]"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              onClick={onExportAndDelete}
              className="text-[13px] font-[550] border border-[#dc2626] bg-white text-[#dc2626] rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#fdf2f2]"
            >
              Export OKF &amp; delete
            </button>
            <button
              onClick={onDelete}
              className="text-[13px] font-[550] bg-[#dc2626] text-white border border-[#dc2626] rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#b91c1c]"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
