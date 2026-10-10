// Top-left model name on the canvas: plain text with a dotted underline (no
// card, so it doesn't read as a mart). Opens the "Model" sheet where the name
// and description are edited. Capped width: a long name truncates.
export function ModelTitleBlock({ name, onOpen }: { name: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label={`${name}. Edit model name and description`}
      onClick={onOpen}
      data-canvas-overlay
      onDoubleClick={e => e.stopPropagation()}
      className="group absolute top-[14px] left-[15px] z-[14] flex w-fit max-w-[min(220px,calc(100%-30px))] cursor-pointer items-center rounded-[4px] px-0.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e88e5]"
    >
      <span title={name} className="truncate text-[14px] font-semibold text-slate-900 underline decoration-[#9ca3af] decoration-dotted decoration-[1.5px] underline-offset-[5px] group-hover:decoration-slate-900">{name}</span>
    </button>
  );
}
