import { X } from "lucide-react";
import type { PushResult } from "../sync/push";

// Push result toast (sticky — dismissed by the user, not on a timer).
// Three outcomes to tell apart: a clean push, real failures, and a forced push
// that was held back because the marts are still in OWOX. The last one is not an
// error the user can fix here — it's an instruction to delete them in OWOX first,
// so it gets its own headline instead of the success one.
export function PushToast({ result, onClose }: { result: PushResult; onClose: () => void }) {
  const blocked = result.blocked ?? 0;
  const failed = result.failed + result.relationshipsFailed;
  const pushedNothing = result.created === 0 && result.relationshipsCreated === 0;

  const tone = failed > 0 ? "error" : blocked > 0 ? "warn" : "ok";
  const title =
    blocked > 0 && pushedNothing ? "Nothing pushed"
    : failed > 0 || blocked > 0 ? "Push completed with errors"
    : "Push complete";

  const parts: string[] = [];
  if (result.created > 0 || blocked === 0) parts.push(`${result.created} mart${result.created === 1 ? "" : "s"} created`);
  if (result.relationshipsCreated) parts.push(`${result.relationshipsCreated} link${result.relationshipsCreated === 1 ? "" : "s"} created`);
  if (failed) parts.push(`${failed} failed`);

  const dot = tone === "error" ? "bg-red-500" : tone === "warn" ? "bg-amber-500" : "bg-emerald-500";
  const border = tone === "error" ? "border-red-300" : tone === "warn" ? "border-amber-300" : "border-emerald-300";

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-[420px] max-h-[60vh] overflow-y-auto rounded-xl shadow-2xl border text-[13px] bg-white ${border}`}>
      <div className="flex items-start gap-2 px-4 py-3 border-b border-slate-100">
        <span className={`mt-[2px] h-2 w-2 rounded-full flex-shrink-0 ${dot}`} />
        <div className="flex-1 font-semibold text-slate-800">
          {title}
          {parts.length > 0 && (
            <div className="font-normal text-slate-500 text-[12px] mt-0.5">{parts.join(", ")}</div>
          )}
          {blocked > 0 && (
            <div className="font-normal text-[12px] mt-1 text-[#8a5a00] leading-snug">
              {blocked} {blocked === 1 ? "mart still exists" : "marts still exist"} in OWOX (draft/active), so{" "}
              {blocked === 1 ? "it was" : "they were"} not pushed again. Delete {blocked === 1 ? "it" : "them"} in OWOX
              first — otherwise you end up with duplicates.
            </div>
          )}
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700" title="Dismiss"><X size={16} /></button>
      </div>
      {result.errors.length > 0 && (
        <ul className="px-4 py-2 flex flex-col gap-1.5">
          {result.errors.map((err, i) => (
            <li key={i} className={`text-[12px] leading-snug break-words font-mono ${tone === "warn" ? "text-[#8a5a00]" : "text-red-600"}`}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
