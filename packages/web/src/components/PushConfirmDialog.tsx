interface PushConfirmDialogProps {
  projectTitle?: string;
  storage?: { title: string; type: string } | null;
  counts: { marts: number; relationships: number; alreadyPushed: number };
  onConfirm: () => void;        // proceed with the push
  onForcePush: () => void;      // push again, re-creating marts already in OWOX
  onChangeProject: () => void;  // sign out (detaches from OWOX) + open sign-in
  onClose: () => void;          // cancel
}

// Confirmation before pushing: shows exactly which project + storage the marts
// will land in (the user kept pushing to the wrong storage), plus how many marts
// and relationships will be sent. "Change project" detaches and re-signs-in.
export function PushConfirmDialog({ projectTitle, storage, counts, onConfirm, onForcePush, onChangeProject, onClose }: PushConfirmDialogProps) {
  // Marts already created in this project are skipped, which makes a plain push a
  // no-op — misleading unless we say so. The escape hatch lives inside the warning
  // (the button row is already full) and needs no second confirmation: this block
  // IS the confirmation.
  const nothingToPush = counts.marts === 0 && counts.relationships === 0;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-xl w-[460px] max-w-[95vw] p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-slate-900">Push to OWOX</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none px-1">✕</button>
        </div>

        <div className="flex flex-col gap-2.5 rounded-lg border border-[#d8dee8] bg-[#f7f8fa] px-4 py-3">
          <div className="flex items-baseline gap-2 text-[13px]">
            <span className="text-slate-500 w-[58px] flex-shrink-0">Project</span>
            <span className="text-slate-900 font-semibold">{projectTitle ?? "—"}</span>
          </div>
          <div className="flex items-baseline gap-2 text-[13px]">
            <span className="text-slate-500 w-[58px] flex-shrink-0">Storage</span>
            <span className="text-slate-900 font-semibold">
              {storage ? `${storage.title}` : "—"}
              {storage && <span className="text-slate-500 font-normal"> · {storage.type}</span>}
            </span>
          </div>
        </div>

        <p className="text-[13px] font-medium text-slate-700">
          {counts.marts} {counts.marts === 1 ? "mart" : "marts"} and {counts.relationships} {counts.relationships === 1 ? "relationship" : "relationships"} will be pushed.
        </p>

        {counts.alreadyPushed > 0 && (
          <div className="flex flex-col gap-2.5 rounded-lg border border-[#f0c88a] bg-[#fdf6e7] px-4 py-3">
            <p className="text-[13px] leading-[1.45] text-[#8a5a00]">
              <span className="font-semibold">
                {counts.alreadyPushed} {counts.alreadyPushed === 1 ? "mart is" : "marts are"} already created in this project
              </span>
              , so {counts.alreadyPushed === 1 ? "it is" : "they are"} skipped — unless {counts.alreadyPushed === 1 ? "it was" : "they were"} deleted
              in OWOX, which Push checks for and repairs by {counts.alreadyPushed === 1 ? "re-creating it" : "re-creating them"}. Want{" "}
              {counts.alreadyPushed === 1 ? "a mart that is still there" : "marts that are still there"} created again anyway? Force-push — anything
              still present in OWOX is named and left alone, so this can't produce duplicates.
            </p>
            <button
              onClick={onForcePush}
              className="self-end text-[13px] font-[550] border border-[#e0a94a] bg-white text-[#8a5a00] rounded-lg px-3 py-[7px] cursor-pointer hover:bg-[#fbeed3]"
            >
              Force push to OWOX again
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onChangeProject}
            className="text-[13px] font-[550] border border-[#d8dee8] bg-white text-slate-700 rounded-lg px-3 py-[7px] cursor-pointer hover:bg-[#f1f3f7]"
          >
            Change project (sign out)
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-[13px] font-[550] border border-[#d8dee8] bg-white text-slate-900 rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#f1f3f7]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={nothingToPush}
              className="text-[13px] font-[550] bg-[#1e88e5] text-white border border-[#1e88e5] rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#1976d2] disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-[#1e88e5]"
            >
              Push
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
