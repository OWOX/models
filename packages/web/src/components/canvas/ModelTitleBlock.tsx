// Top-left block on the canvas: shows the model name and opens the "Model"
// sheet where the name and description are edited. Width follows the name but
// is capped, so a long name is truncated instead of stretching the block.
export function ModelTitleBlock({ name, onOpen }: { name: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label={`${name}. Edit model name and description`}
      onClick={onOpen}
      data-canvas-overlay
      onDoubleClick={e => e.stopPropagation()}
      className="absolute top-[14px] left-[15px] z-[14] flex w-fit max-w-[min(220px,calc(100%-30px))] cursor-pointer items-center rounded-[10px] border border-[#e5e5e5] bg-white px-2.5 py-1.5 text-left shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-[#fafafa]"
    >
      <span title={name} className="truncate text-[13px] font-semibold text-slate-900">{name}</span>
    </button>
  );
}
