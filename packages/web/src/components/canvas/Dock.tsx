import { useEffect } from "react";
import type { ViewMode } from "../../state/viewMode";

export type Tool = "select" | "add" | "connect" | "layout";

interface DockProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  viewMode: ViewMode;
  onToggleView: () => void;
  onClear: () => void;
  clearDisabled?: boolean;
}

const SelectIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={19} height={19}>
    <path d="M4 3l7 17 2.5-6.5L20 11z" />
  </svg>
);

const AddIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={19} height={19}>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="M12 9v6M9 12h6" />
  </svg>
);

const ConnectIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={19} height={19}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="18" r="3" />
    <path d="M8.5 8.5l7 7" />
  </svg>
);

const LayoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={19} height={19}>
    <rect x="3" y="4" width="7" height="6" rx="1" />
    <rect x="14" y="4" width="7" height="6" rx="1" />
    <rect x="8" y="14" width="7" height="6" rx="1" />
    <path d="M6.5 10v2.5M17.5 10v2.5M11.5 12.5h-5M11.5 12.5h6" />
  </svg>
);

const ErdIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={19} height={19}>
    <rect x="3" y="4" width="8" height="16" rx="1" />
    <rect x="14" y="4" width="7" height="9" rx="1" />
    <path d="M11 8h3M7 9v6M17 13v3M17 16h-6" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={19} height={19}>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

interface ToolButtonProps {
  icon: React.ReactNode;
  tip: string;
  active?: boolean;
  onClick: () => void;
}

// Styled hover tooltip shown to the right of a dock button (the dock sits on the
// left edge). Clearer and faster than the native title tooltip.
function DockTip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-[12px] font-medium px-2 py-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all z-50 shadow-[0_6px_18px_rgba(15,23,42,0.28)]">
      {label}
    </span>
  );
}

function ToolButton({ icon, tip, active, onClick }: ToolButtonProps) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        aria-label={tip}
        className={`
          w-[38px] h-[38px] rounded-[9px] border-none flex items-center justify-center cursor-pointer transition-colors
          ${active
            ? "bg-[#e6f1fb] text-[#1e88e5]"
            : "bg-transparent text-slate-500 hover:bg-[#f1f3f7] hover:text-slate-900"
          }
        `}
      >
        {icon}
      </button>
      <DockTip label={tip} />
    </div>
  );
}

export function Dock({ activeTool, onToolChange, viewMode, onToggleView, onClear, clearDisabled }: DockProps) {
  // Keyboard shortcuts V/N/C
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if (e.key === "v") onToolChange("select");
      if (e.key === "n") onToolChange("add");
      if (e.key === "c") onToolChange("connect");
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onToolChange]);

  return (
    <div
      className="absolute left-[14px] top-[calc(50%-34px)] -translate-y-1/2 bg-white border border-[#d8dee8] rounded-xl p-[6px] flex flex-col gap-1 z-20 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif" }}
    >
      <ToolButton
        icon={<SelectIcon />}
        tip="Select & move (V)"
        active={activeTool === "select"}
        onClick={() => onToolChange("select")}
      />
      <ToolButton
        icon={<AddIcon />}
        tip="Add object (N) — or double-click canvas"
        active={activeTool === "add"}
        onClick={() => onToolChange("add")}
      />
      <ToolButton
        icon={<ConnectIcon />}
        tip="Connect (C) — or drag from a node's port"
        active={activeTool === "connect"}
        onClick={() => onToolChange("connect")}
      />
      <div className="h-px bg-[#d8dee8] mx-1 my-[3px]" />
      <ToolButton
        icon={<LayoutIcon />}
        tip="Auto-layout (Dagre)"
        active={false}
        onClick={() => onToolChange("layout")}
      />
      <div className="h-px bg-[#d8dee8] mx-1 my-[3px]" />
      <div className="relative group">
        <button
          onClick={onToggleView}
          aria-label="ERD view — show fields & field-level links"
          aria-pressed={viewMode === "erd"}
          className={`
            w-[38px] h-[38px] rounded-[9px] border-none flex items-center justify-center cursor-pointer transition-colors
            ${viewMode === "erd"
              ? "bg-[#e6f1fb] text-[#1e88e5]"
              : "bg-transparent text-slate-500 hover:bg-[#f1f3f7] hover:text-slate-900"
            }
          `}
        >
          <ErdIcon />
        </button>
        <DockTip label={viewMode === "erd" ? "ERD view — fields & field-level links (on)" : "ERD view — show fields & field-level links"} />
      </div>
      <div className="h-px bg-[#d8dee8] mx-1 my-[3px]" />
      <div className="relative group">
        <button
          onClick={onClear}
          disabled={clearDisabled}
          aria-label="Clear canvas — delete everything"
          className={`
            w-[38px] h-[38px] rounded-[9px] border-none flex items-center justify-center transition-colors
            ${clearDisabled
              ? "bg-transparent text-slate-300 cursor-not-allowed"
              : "bg-transparent text-slate-500 cursor-pointer hover:bg-[#fdf2f2] hover:text-[#dc2626]"
            }
          `}
        >
          <TrashIcon />
        </button>
        <DockTip label={clearDisabled ? "Clear canvas — nothing to clear" : "Clear canvas — delete everything"} />
      </div>
    </div>
  );
}
