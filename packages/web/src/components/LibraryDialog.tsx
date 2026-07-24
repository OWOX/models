import { X } from "lucide-react";
import type { ModelGraph } from "@mc/okf";
import { LibraryIcon } from "../lib/icons";
import { TemplateGallery } from "./TemplateGallery";

interface Props {
  onUse: (graph: ModelGraph, name: string) => void;
  onClose: () => void;
}

export function LibraryDialog({ onUse, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="w-[620px] max-h-[88vh] flex flex-col overflow-hidden rounded-2xl border border-[#d8dee8] bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#d8dee8] flex-shrink-0">
          <LibraryIcon size={18} className="text-[#1e88e5]" />
          <h2 className="text-[15px] font-semibold flex-1">Template library</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-3">
          <TemplateGallery onUse={onUse} />
        </div>
      </div>
    </div>
  );
}
