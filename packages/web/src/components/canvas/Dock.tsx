import { useEffect } from "react";
import type { ViewMode } from "../../state/viewMode";

export type Tool = "select" | "add" | "connect" | "layout";

interface DockProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  viewMode: ViewMode;
  onToggleView: () => void;
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

interface ToolButtonProps {
  icon: React.ReactNode;
  tip: string;
  active?: boolean;
  onClick: () => void;
}

function ToolButton({ icon, tip, active, onClick }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      title={tip}
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
  );
}

export function Dock({ activeTool, onToolChange, viewMode, onToggleView }: DockProps) {
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
      className="absolute left-[14px] top-1/2 -translate-y-1/2 bg-white border border-[#d8dee8] rounded-xl p-[6px] flex flex-col gap-1 z-20 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
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
      <button
        onClick={onToggleView}
        title="ERD view — show fields & field-level links"
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
    </div>
  );
}
