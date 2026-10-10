import { PencilLine } from "lucide-react";

// Top-left block on the canvas: shows the model name + the first line of its
// description, and opens the "Model" sheet where both are edited.
export function ModelTitleBlock({ name, description, onOpen }: { name: string; description?: string; onOpen: () => void }) {
  const firstLine = (description ?? "").split("\n").find(l => l.trim())?.trim() ?? "";
  return (
    <button
      type="button"
      aria-label={`${name}. Edit model name and description`}
      onClick={onOpen}
      data-canvas-overlay
      onDoubleClick={e => e.stopPropagation()}
      className="absolute top-[14px] left-[15px] z-[14] flex w-[280px] max-w-[calc(100%-30px)] cursor-pointer items-center gap-2 rounded-[14px] border border-[#e5e5e5] bg-white px-3 py-2.5 text-left shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-[#fafafa]"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span title={name} className="truncate text-[14px] font-semibold text-slate-900">{name}</span>
        {firstLine
          ? <span className="truncate text-[12px] text-[#65676f]">{firstLine}</span>
          : <span className="truncate text-[12px] italic text-[#65676f]">Add a description</span>}
      </span>
      <PencilLine size={14} className="flex-shrink-0 text-[#65676f]" aria-hidden="true" />
    </button>
  );
}
