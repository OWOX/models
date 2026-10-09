import type { ExportFormat } from "../state/exportFormat";

const OPTIONS: { id: ExportFormat; label: string }[] = [
  { id: "okf", label: "OKF" },
  { id: "ossie", label: "Ossie" },
];

// Two-option segmented control used by the Clear canvas / New model dialogs.
export function ExportFormatToggle({ value, onChange }: { value: ExportFormat; onChange: (f: ExportFormat) => void }) {
  return (
    <div role="radiogroup" aria-label="Export format" className="inline-flex rounded-lg border border-[#d8dee8] bg-white p-[2px]">
      {OPTIONS.map((o, i) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          tabIndex={value === o.id ? 0 : -1}
          onClick={() => onChange(o.id)}
          onKeyDown={e => {
            const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
            if (!step) return;
            e.preventDefault();
            const next = OPTIONS[(i + step + OPTIONS.length) % OPTIONS.length];
            onChange(next.id);
            (e.currentTarget.parentElement?.children[OPTIONS.indexOf(next)] as HTMLElement | undefined)?.focus();
          }}
          className={`text-[12px] font-[550] rounded-md px-2.5 py-[4px] cursor-pointer ${value === o.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-[#f1f3f7]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
