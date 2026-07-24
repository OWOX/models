import { useState } from "react";
import { Copy, Check } from "lucide-react";

/** Copy-to-clipboard deeplink button — the pattern used in ImportDialog's
 *  "Share". Click never bubbles to a parent row (stopPropagation). Hover /
 *  expanded visibility is the caller's job (pass utility classes via className). */
export function ShareButton({ deeplink, className = "" }: { deeplink: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(deeplink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked — no-op */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      title="Copy a shareable deeplink to this model"
      className={"flex items-center gap-1 text-[12px] text-slate-400 hover:text-slate-600 " + className}
    >
      {copied ? <><Check size={12} /> Deeplink copied</> : <><Copy size={12} /> Share</>}
    </button>
  );
}
