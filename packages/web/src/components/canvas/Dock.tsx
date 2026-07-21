import { useEffect, useRef, useState } from "react";
import type { ViewMode } from "../../state/viewMode";
import type { RelLabelMode } from "../../state/relLabels";
import type { ObjLabelMode } from "../../state/objLabels";

export type Tool = "select" | "add" | "connect" | "layout";

const REL_LABEL_GLYPH: Record<RelLabelMode, string> = {
  all: "≡",
  defined: "=",
  undefined: "?",
  hidden: "⊘",
};

const REL_LABEL_OPTIONS: { mode: RelLabelMode; label: string; helper: string }[] = [
  { mode: "all", label: "Show everything", helper: "All join keys and cardinality on every relationship" },
  { mode: "defined", label: "Defined keys only", helper: "Show keys and cardinality only where the join is filled in; hide labels that are still blank" },
  { mode: "undefined", label: "Undefined keys only", helper: "Show only relationships whose keys aren't set yet — spot what's left to define" },
  { mode: "hidden", label: "Hide all labels", helper: "Just the connector lines — no keys, no cardinality" },
];

const OBJ_LABEL_GLYPH: Record<ObjLabelMode, string> = {
  all: "≡",
  noSource: "⬚",
  noFields: "#",
  both: "⊘",
};

const OBJ_LABEL_OPTIONS: { mode: ObjLabelMode; label: string; helper: string }[] = [
  { mode: "all", label: "Show everything", helper: "Input source and field count on every object" },
  { mode: "noSource", label: "Hide input source", helper: "Hide the source badge (VIEW / TABLE / SQL / CONNECTOR) and its accent" },
  { mode: "noFields", label: "Hide field count", helper: "Hide the field-count line under each object" },
  { mode: "both", label: "Hide both", helper: "Just the object title — no source badge, no field count" },
];

interface DockProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  viewMode: ViewMode;
  onToggleView: () => void;
  onClear: () => void;
  clearDisabled?: boolean;
  relLabelMode?: RelLabelMode;
  onRelLabelModeChange?: (mode: RelLabelMode) => void;
  objLabelMode?: ObjLabelMode;
  onObjLabelModeChange?: (mode: ObjLabelMode) => void;
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

// The Connect dock button, augmented with a hover-delay flyout for the
// "Relationship labels" view setting and an always-visible corner badge showing
// the active mode's glyph. Clicking the button still activates the Connect tool;
// the flyout (revealed after ~0.5s hover) is a separate, view-only control.
function ConnectToolButton({
  active,
  onActivate,
  relLabelMode,
  onRelLabelModeChange,
}: {
  active: boolean;
  onActivate: () => void;
  relLabelMode: RelLabelMode;
  onRelLabelModeChange?: (mode: RelLabelMode) => void;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
  };
  const handleEnter = () => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(true), 500);
  };
  const handleLeave = () => {
    clearTimer();
    setOpen(false);
  };
  useEffect(() => clearTimer, []);

  return (
    <div className="relative group" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={onActivate}
        aria-label="Connect (C) — or drag from a node's port"
        className={`
          relative w-[38px] h-[38px] rounded-[9px] border-none flex items-center justify-center cursor-pointer transition-colors
          ${active
            ? "bg-[#e6f1fb] text-[#1e88e5]"
            : "bg-transparent text-slate-500 hover:bg-[#f1f3f7] hover:text-slate-900"
          }
        `}
      >
        <ConnectIcon />
        <span
          data-testid="rel-label-badge"
          aria-hidden
          className="absolute -top-[3px] -right-[3px] min-w-[14px] h-[14px] px-[2px] rounded-full bg-slate-900 text-white text-[9px] leading-[14px] font-semibold text-center shadow-[0_1px_2px_rgba(15,23,42,0.4)]"
        >
          {REL_LABEL_GLYPH[relLabelMode]}
        </span>
      </button>

      {!open && <DockTip label="Connect (C) — or drag from a node's port" />}

      {open && (
        <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-50">
          {/* invisible bridge so the cursor can travel from button to menu without closing */}
          <span className="absolute right-full top-0 h-full w-[12px]" />
          <div className="w-[260px] rounded-xl border border-[#d8dee8] bg-white p-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.14)]">
            <div className="px-2 pt-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Relationship labels
            </div>
            {REL_LABEL_OPTIONS.map(opt => {
              const selected = opt.mode === relLabelMode;
              return (
                <button
                  key={opt.mode}
                  onClick={() => { onRelLabelModeChange?.(opt.mode); setOpen(false); }}
                  className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${selected ? "bg-[#e6f1fb]" : "hover:bg-[#f1f3f7]"}`}
                >
                  <span className={`mt-[1px] w-[16px] flex-shrink-0 text-center text-[12px] font-bold ${selected ? "text-[#1e88e5]" : "text-slate-400"}`}>
                    {REL_LABEL_GLYPH[opt.mode]}
                  </span>
                  <span className="flex flex-col">
                    <span className={`text-[13px] font-semibold ${selected ? "text-[#1e88e5]" : "text-slate-800"}`}>{opt.label}</span>
                    <span className="text-[11px] leading-snug text-slate-500">{opt.helper}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// The Add-object dock button, augmented with a hover-delay flyout for the
// "Object labels" view setting and an always-visible corner badge showing the
// active mode's glyph. Clicking the button activates the Add tool; the flyout
// (revealed after ~0.5s hover) is a separate, view-only control.
function AddObjectToolButton({
  active,
  onActivate,
  objLabelMode,
  onObjLabelModeChange,
}: {
  active: boolean;
  onActivate: () => void;
  objLabelMode: ObjLabelMode;
  onObjLabelModeChange?: (mode: ObjLabelMode) => void;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
  };
  const handleEnter = () => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(true), 500);
  };
  const handleLeave = () => {
    clearTimer();
    setOpen(false);
  };
  useEffect(() => clearTimer, []);

  return (
    <div className="relative group" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={onActivate}
        aria-label="Add object (N) — or double-click canvas"
        className={`
          relative w-[38px] h-[38px] rounded-[9px] border-none flex items-center justify-center cursor-pointer transition-colors
          ${active
            ? "bg-[#e6f1fb] text-[#1e88e5]"
            : "bg-transparent text-slate-500 hover:bg-[#f1f3f7] hover:text-slate-900"
          }
        `}
      >
        <AddIcon />
        <span
          data-testid="obj-label-badge"
          aria-hidden
          className="absolute -top-[3px] -right-[3px] min-w-[14px] h-[14px] px-[2px] rounded-full bg-slate-900 text-white text-[9px] leading-[14px] font-semibold text-center shadow-[0_1px_2px_rgba(15,23,42,0.4)]"
        >
          {OBJ_LABEL_GLYPH[objLabelMode]}
        </span>
      </button>

      {!open && <DockTip label="Add object (N) — or double-click canvas" />}

      {open && (
        <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-50">
          {/* invisible bridge so the cursor can travel from button to menu without closing */}
          <span className="absolute right-full top-0 h-full w-[12px]" />
          <div className="w-[260px] rounded-xl border border-[#d8dee8] bg-white p-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.14)]">
            <div className="px-2 pt-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Object labels
            </div>
            {OBJ_LABEL_OPTIONS.map(opt => {
              const selected = opt.mode === objLabelMode;
              return (
                <button
                  key={opt.mode}
                  onClick={() => { onObjLabelModeChange?.(opt.mode); setOpen(false); }}
                  className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${selected ? "bg-[#e6f1fb]" : "hover:bg-[#f1f3f7]"}`}
                >
                  <span className={`mt-[1px] w-[16px] flex-shrink-0 text-center text-[12px] font-bold ${selected ? "text-[#1e88e5]" : "text-slate-400"}`}>
                    {OBJ_LABEL_GLYPH[opt.mode]}
                  </span>
                  <span className="flex flex-col">
                    <span className={`text-[13px] font-semibold ${selected ? "text-[#1e88e5]" : "text-slate-800"}`}>{opt.label}</span>
                    <span className="text-[11px] leading-snug text-slate-500">{opt.helper}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function Dock({ activeTool, onToolChange, viewMode, onToggleView, onClear, clearDisabled, relLabelMode = "all", onRelLabelModeChange, objLabelMode = "all", onObjLabelModeChange }: DockProps) {
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
      data-dock
      className="absolute left-[14px] top-[calc(50%-34px)] -translate-y-1/2 bg-white border border-[#d8dee8] rounded-xl p-[6px] flex flex-col gap-1 z-20 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif" }}
    >
      <ToolButton
        icon={<SelectIcon />}
        tip="Select & move (V)"
        active={activeTool === "select"}
        onClick={() => onToolChange("select")}
      />
      <AddObjectToolButton
        active={activeTool === "add"}
        onActivate={() => onToolChange("add")}
        objLabelMode={objLabelMode}
        onObjLabelModeChange={onObjLabelModeChange}
      />
      <ConnectToolButton
        active={activeTool === "connect"}
        onActivate={() => onToolChange("connect")}
        relLabelMode={relLabelMode}
        onRelLabelModeChange={onRelLabelModeChange}
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
