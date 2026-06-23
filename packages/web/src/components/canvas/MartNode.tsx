import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { KeyRound } from "lucide-react";
import type { ModelNode } from "@mc/okf";
import type { ViewMode } from "../../state/viewMode";
import { DataMartIcon } from "../../lib/icons";

const SOURCE_COLOR: Record<string, string> = {
  SQL: "#10b981",
  CONNECTOR: "#f59e0b",
  VIEW: "#3b82f6",
  TABLE: "#8b5cf6",
};

const STATUS_TIP: Record<string, string> = {
  created: "Created in OWOX",
  pending: "Draft — not pushed yet",
  creating: "Creating in OWOX…",
  error: "Error — check details",
};

export type MartNodeData = ModelNode & { _viewMode?: ViewMode };

function StatusDot({ status }: { status: string }) {
  const base = "absolute top-[10px] right-[10px] w-[9px] h-[9px] rounded-full z-10";
  const colors: Record<string, string> = {
    created: "bg-[#10b981]",
    pending: "bg-slate-300",
    creating: "bg-[#1e88e5] animate-pulse",
    error: "bg-[#ef4444]",
  };
  return (
    <span className={`${base} ${colors[status] ?? "bg-slate-300"}`} title={STATUS_TIP[status] ?? status} />
  );
}

// Node-level connectable ports (the only way to draw a new relationship).
function NodePorts() {
  const common = {
    width: 13, height: 13, borderRadius: "50%",
    background: "#fff", border: "2px solid #1e88e5",
    top: 24, opacity: 0, transition: "opacity 0.12s",
  } as const;
  return (
    <>
      <Handle type="source" position={Position.Left} id="left" style={{ ...common, left: -7 }} className="mart-handle" />
      <Handle type="source" position={Position.Right} id="right" style={{ ...common, right: -7 }} className="mart-handle" />
    </>
  );
}

function MartHeader({ node, color }: { node: MartNodeData; color: string }) {
  return (
    <div className="flex items-center gap-2 px-3 pt-[11px] pb-2">
      <span className="w-1 self-stretch min-h-[18px] rounded-sm flex-shrink-0" style={{ background: color }} />
      <DataMartIcon size={15} className="text-slate-400 flex-shrink-0" />
      <span className="text-[13.5px] font-semibold flex-1 leading-tight pr-3 text-slate-900 line-clamp-2">
        {node.title}
      </span>
    </div>
  );
}

// Display-only anchor handles on a field row. isConnectable={false} keeps them
// from starting new connections — they only give existing edges a place to land.
function FieldAnchors({ name }: { name: string }) {
  const base = { width: 1, height: 1, minWidth: 0, minHeight: 0, background: "transparent", border: "none", top: "50%" } as const;
  return (
    <>
      <Handle type="source" position={Position.Left} id={`fl:${name}`} isConnectable={false} style={{ ...base, left: 0 }} />
      <Handle type="source" position={Position.Right} id={`fr:${name}`} isConnectable={false} style={{ ...base, right: 0 }} />
    </>
  );
}

function ErdBody({ node }: { node: MartNodeData }) {
  if (node.schema.length === 0) {
    return <div className="px-3 pb-[10px] text-[11px] text-slate-400">no fields</div>;
  }
  return (
    <div className="border-t border-[#eef1f5]">
      {node.schema.map(f => (
        <div
          key={f.name}
          className="relative flex items-center gap-2 px-3 py-[5px] text-[11.5px] border-b border-[#f3f5f8] last:border-b-0"
        >
          <FieldAnchors name={f.name} />
          {f.pk
            ? <KeyRound size={11} className="text-amber-500 flex-shrink-0" />
            : <span className="w-[11px] flex-shrink-0" />}
          <span className="flex-1 text-slate-800 truncate">{f.name}</span>
          <span className="text-slate-400 font-mono text-[10.5px] truncate">{f.type}</span>
        </div>
      ))}
    </div>
  );
}

function MartNodeInner({ data }: NodeProps) {
  const node = data as unknown as MartNodeData;
  const viewMode = node._viewMode ?? "compact";
  const color = SOURCE_COLOR[node.inputSource] ?? "#94a3b8";
  const isErd = viewMode === "erd";
  const fieldCount = node.schema?.length ?? 0;
  const fieldText = fieldCount > 0 ? `${fieldCount} field${fieldCount > 1 ? "s" : ""}` : "no fields";

  return (
    <div
      className={`relative bg-white border-[1.5px] border-[#d8dee8] rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.05)] cursor-grab hover:border-[#c2cad8] select-none ${isErd ? "w-[250px]" : "w-[200px]"}`}
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif" }}
    >
      <StatusDot status={node.status} />
      <MartHeader node={node} color={color} />

      {/* Meta row: type chip + (compact) field count */}
      <div className="flex items-center gap-2 px-3 pb-[10px]">
        <span
          className="text-[10.5px] font-[650] uppercase tracking-[0.3px] px-[7px] py-[2px] rounded-full text-white"
          style={{ background: color }}
        >
          {node.inputSource}
        </span>
        {!isErd && <span className="text-[11px] text-slate-500">{fieldText}</span>}
      </div>

      {isErd && <ErdBody node={node} />}

      <NodePorts />
    </div>
  );
}

export const MartNode = memo(MartNodeInner);
