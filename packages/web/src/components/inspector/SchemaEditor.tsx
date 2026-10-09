import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GripVertical } from "lucide-react";
import { type SchemaField, type FormulaContext, EDITOR_FIELD_TYPES, isCalculated, formulaLevel, formulaWarnings } from "@mc/okf";
import { InfoTip } from "./InfoTip";
import { CALC_COLOR } from "../canvas/nodeStyle";

// One source of truth for types — see @mc/okf/fieldType. Every entry is a member of
// OWOX's BigQuery enum (confirmed live), so a pick here can never fail the schema
// push: DATETIME is offered, Snowflake's VARIANT is gone (it normalises to JSON).
const FIELD_TYPES: string[] = [...EDITOR_FIELD_TYPES];

interface SchemaEditorProps {
  schema: SchemaField[];
  onChange: (schema: SchemaField[]) => void;
  formulaContext?: FormulaContext;
}

export function SchemaEditor({ schema, onChange, formulaContext }: SchemaEditorProps) {
  // Row being dragged and the row it's hovering over — for reordering fields.
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  // Calculated field whose formula popover is open (index into `schema`) and where to anchor it.
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [anchor, setAnchor] = useState<{ left: number; top: number; width: number } | null>(null);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const popRef = useRef<HTMLDivElement | null>(null);
  const skipFocusOpen = useRef(false);
  // Identity of the field the popover was opened for (name + schema length), to detect schema swaps.
  const openFor = useRef<{ name: string; len: number } | null>(null);

  // Runs once when the popover textarea mounts: caret goes to the end of the formula.
  const caretToEnd = useCallback((el: HTMLTextAreaElement | null) => {
    if (el) el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  function openPopover(i: number) {
    const el = inputRefs.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth || 1024;
    const width = Math.min(Math.max(r.width, 420), vw - 16);
    setAnchor({ left: Math.max(8, Math.min(r.left, vw - width - 8)), top: r.bottom + 4, width });
    openFor.current = { name: schema[i].name, len: schema.length };
    setOpenIdx(i);
  }

  function closePopover(refocus = false) {
    const el = openIdx !== null ? inputRefs.current[openIdx] : null;
    setOpenIdx(null);
    if (refocus && el) { skipFocusOpen.current = true; el.focus(); skipFocusOpen.current = false; }
  }

  // A mousedown outside both the popover and its row input closes it.
  useEffect(() => {
    if (openIdx === null) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || inputRefs.current[openIdx!]?.contains(t)) return;
      setOpenIdx(null);
    }
    // The popover is positioned once on open, so scrolling or resizing closes it
    // (the formula is already saved through onChange). The textarea may scroll itself.
    function onScroll(e: Event) {
      if (e.target instanceof Node && popRef.current?.contains(e.target)) return;
      setOpenIdx(null);
    }
    function onResize() { setOpenIdx(null); }
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [openIdx]);

  // Close the popover when the schema changes under it (field removed, editor reused for another mart).
  useEffect(() => {
    if (openIdx === null) return;
    const f = schema[openIdx];
    const o = openFor.current;
    if (!f || !isCalculated(f) || !o || f.name !== o.name || schema.length !== o.len) setOpenIdx(null);
  }, [schema, openIdx]);

  function updateField(i: number, patch: Partial<SchemaField>) {
    onChange(schema.map((f, idx) => idx === i ? { ...f, ...patch } : f));
  }

  function removeField(i: number) {
    onChange(schema.filter((_, idx) => idx !== i));
  }

  function addField() {
    onChange([...schema, { name: "", type: "STRING", pk: false }]);
  }

  function addCalculatedField() {
    onChange([...schema, { name: "", type: "NUMERIC", pk: false, formula: "" }]);
  }

  // Move a field from one position to another, preserving the order of the rest.
  // A drop onto a row of the other kind (regular vs calculated) is ignored.
  function moveField(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;
    if (isCalculated(schema[from]) !== isCalculated(schema[to])) return;
    const next = schema.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  // Handle · Name · Type · PK · Alias · Description · remove. Wider than the
  // inspector, so the grid scrolls horizontally inside the bordered box.
  const cols = "16px minmax(110px,1fr) 96px 42px minmax(110px,1fr) minmax(150px,1.4fr) 24px";
  // Calculated rows: Handle · glyph · Name · Type · Formula · Alias · Description · remove (no PK).
  const calcCols = "16px 20px minmax(110px,1fr) 96px minmax(130px,1.2fr) minmax(90px,0.8fr) minmax(120px,1fr) 24px";
  const inputCls = "w-full text-[12.5px] px-[7px] py-[5px] border border-[#d8dee8] rounded-lg text-slate-900 focus:outline-none focus:border-[#1e88e5] focus:ring-2 focus:ring-[#e6f1fb]";
  const headCls = "grid bg-[#f8fafc] px-[10px] py-[7px] text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.3px] border-b border-[#d8dee8] gap-[6px]";
  const typeCls = "w-full text-[11.5px] px-[6px] py-[5px] border border-[#d8dee8] rounded-lg text-slate-900 focus:outline-none focus:border-[#1e88e5] focus:ring-2 focus:ring-[#e6f1fb]";
  const addCls = "w-full border-none bg-white px-2 py-[8px] text-[12.5px] font-semibold text-[#1e88e5] cursor-pointer hover:bg-[#f8fafc] transition-colors";

  const indexed = schema.map((field, i) => ({ field, i }));
  const regular = indexed.filter(r => !isCalculated(r.field));
  const calculated = indexed.filter(r => isCalculated(r.field));

  function warningsOf(f: SchemaField): string[] {
    const out: string[] = [];
    if (!(f.formula ?? "").trim()) out.push("Formula is empty");
    if (formulaContext) out.push(...formulaWarnings(f.formula ?? "", formulaContext, f.name));
    return out;
  }

  function rowProps(i: number, cls: string) {
    return {
      onDragOver: (e: React.DragEvent) => { if (dragIdx === null) return; e.preventDefault(); if (overIdx !== i) setOverIdx(i); },
      onDrop: (e: React.DragEvent) => { e.preventDefault(); if (dragIdx !== null) moveField(dragIdx, i); setDragIdx(null); setOverIdx(null); },
      className: `grid px-[10px] py-[6px] border-b border-[#eef1f5] last:border-b-0 items-center gap-[6px] transition-colors ${dragIdx === i ? "opacity-40" : ""} ${overIdx === i && dragIdx !== null && dragIdx !== i ? "bg-[#e6f1fb]" : ""} ${cls}`,
    };
  }

  const grip = (i: number) => (
    <span
      draggable
      onDragStart={e => { setDragIdx(i); e.dataTransfer.effectAllowed = "move"; }}
      onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
      title="Drag to reorder"
      className="flex items-center justify-center text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing"
    >
      <GripVertical size={13} />
    </span>
  );

  const typeSelect = (i: number, field: SchemaField) => (
    <select value={field.type} onChange={e => updateField(i, { type: e.target.value })} className={typeCls}>
      {/* An imported field can carry a type the picker hides (e.g. RECORD);
          keep it as an option so opening the inspector can't silently
          rewrite it to the first entry in the list. */}
      {(FIELD_TYPES.includes(field.type) ? FIELD_TYPES : [field.type, ...FIELD_TYPES]).map(t => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  );

  const removeBtn = (i: number) => (
    <button
      onClick={() => removeField(i)}
      title="Remove field"
      className="border-none bg-transparent text-slate-300 cursor-pointer text-[15px] p-0 hover:text-[#ef4444] flex items-center justify-center"
    >
      ×
    </button>
  );

  const glyph = (formula: string) => {
    const metric = formulaLevel(formula) === "metric";
    return (
      <span
        aria-label={metric ? "Metric" : "Calculated column"}
        className="text-[12px] font-semibold text-center leading-none"
        style={{ color: CALC_COLOR }}
      >
        {metric ? "Σ" : "fx"}
      </span>
    );
  };

  const openField = openIdx !== null ? schema[openIdx] : undefined;

  return (
    <div className="border border-[#d8dee8] rounded-[10px] overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[660px]">
          {/* Header */}
          <div className={headCls} style={{ gridTemplateColumns: cols }}>
            <span />
            <span>Name</span>
            <span>Type</span>
            <span className="flex items-center gap-[3px]">PK <InfoTip text="Primary key — uniquely identifies a row. Marks the field as a key when pushed to OWOX; used to anchor relationships." /></span>
            <span className="flex items-center gap-[3px]">Alias <InfoTip text="Business-friendly label for the field (e.g. “Net Revenue” for net_revenue). Optional; shown to business users." /></span>
            <span className="flex items-center gap-[3px]">Description <InfoTip text="What the field means and, for metrics, how it's calculated. Flows to OKF export and the AI question suggestions." /></span>
            <span />
          </div>

          {/* Regular rows — drag the grip handle to reorder */}
          {regular.map(({ field, i }) => (
            <div key={i} {...rowProps(i, "")} style={{ gridTemplateColumns: cols }}>
              {grip(i)}
              <input
                type="text"
                value={field.name}
                onChange={e => updateField(i, { name: e.target.value })}
                placeholder="field name"
                className={inputCls}
              />
              {typeSelect(i, field)}
              <input
                type="checkbox"
                checked={field.pk}
                onChange={e => updateField(i, { pk: e.target.checked })}
                title="Primary key"
                className="w-4 h-4 mx-auto block cursor-pointer accent-[#1e88e5]"
              />
              <input
                type="text"
                value={field.alias ?? ""}
                onChange={e => updateField(i, { alias: e.target.value || undefined })}
                placeholder="alias"
                className={inputCls}
              />
              <input
                type="text"
                value={field.description ?? ""}
                onChange={e => updateField(i, { description: e.target.value || undefined })}
                placeholder="description"
                className={inputCls}
              />
              {removeBtn(i)}
            </div>
          ))}

          <div className="border-t border-[#eef1f5]">
            <button onClick={addField} className={addCls}>+ Add field</button>
          </div>

          {/* Calculated fields */}
          <div className={`${headCls} border-t items-center`} style={{ gridTemplateColumns: "1fr" }}>
            <span className="flex items-center gap-[3px]">
              Calculated fields
              <InfoTip text="Formulas OWOX computes at query time — Σ metric (aggregates) or fx column (row-level). Not warehouse columns; never PK or join keys." />
            </span>
          </div>
          {calculated.length > 0 && (
            <div className={headCls} style={{ gridTemplateColumns: calcCols }}>
              <span /><span /><span>Name</span><span>Type</span><span>Formula</span><span>Alias</span><span>Description</span><span />
            </div>
          )}
          {calculated.map(({ field, i }) => {
            const warnings = warningsOf(field);
            return (
              <div key={i} {...rowProps(i, "")} style={{ gridTemplateColumns: calcCols }}>
                {grip(i)}
                {glyph(field.formula ?? "")}
                <input
                  type="text"
                  value={field.name}
                  onChange={e => updateField(i, { name: e.target.value })}
                  placeholder="field name"
                  className={inputCls}
                />
                {typeSelect(i, field)}
                <div className="relative">
                  <input
                    type="text"
                    ref={el => { inputRefs.current[i] = el; }}
                    value={(field.formula ?? "").replace(/\s+/g, " ").trim()}
                    readOnly
                    placeholder="formula"
                    onFocus={() => { if (!skipFocusOpen.current) openPopover(i); }}
                    onClick={() => { if (openIdx !== i) openPopover(i); }}
                    className={`${inputCls} font-mono cursor-pointer ${warnings.length ? "pr-[20px]" : ""}`}
                  />
                  {warnings.length > 0 && (
                    <span
                      data-testid="formula-warning"
                      title={warnings.join("\n")}
                      className="absolute right-[7px] top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-amber-500"
                    />
                  )}
                </div>
                <input
                  type="text"
                  value={field.alias ?? ""}
                  onChange={e => updateField(i, { alias: e.target.value || undefined })}
                  placeholder="alias"
                  className={inputCls}
                />
                <input
                  type="text"
                  value={field.description ?? ""}
                  onChange={e => updateField(i, { description: e.target.value || undefined })}
                  placeholder="description"
                  className={inputCls}
                />
                {removeBtn(i)}
              </div>
            );
          })}
          <div className="border-t border-[#eef1f5]">
            <button onClick={addCalculatedField} className={addCls}>+ Add calculated field</button>
          </div>
        </div>
      </div>

      {openIdx !== null && openField && anchor && createPortal(
        <div
          ref={popRef}
          role="dialog"
          aria-label="Formula editor"
          tabIndex={-1}
          onBlur={e => {
            const next = e.relatedTarget as Node | null;
            if (next && (popRef.current?.contains(next) || inputRefs.current[openIdx]?.contains(next))) return;
            if (!next && document.activeElement && popRef.current?.contains(document.activeElement)) return;
            setOpenIdx(null);
          }}
          onKeyDown={e => { if (e.key === "Escape") { e.stopPropagation(); closePopover(true); } }}
          className="bg-white border border-[#d8dee8] rounded-[10px] shadow-xl p-[10px] outline-none"
          style={{ position: "fixed", left: anchor.left, top: anchor.top, width: anchor.width, zIndex: 1000 }}
        >
          <div className="flex items-center gap-[6px] mb-[6px]">
            {glyph(openField.formula ?? "")}
            <span className="text-[10.5px] font-semibold rounded-md px-[6px] py-[1px] bg-[#f4f1ff] text-[#6d4aff]">
              {formulaLevel(openField.formula ?? "") === "metric" ? "Metric" : "Column"}
            </span>
            <span className="text-[12px] font-semibold text-slate-700 truncate">{openField.name || "unnamed field"}</span>
          </div>
          <textarea
            autoFocus
            ref={caretToEnd}
            value={openField.formula ?? ""}
            onChange={e => updateField(openIdx, { formula: e.target.value })}
            placeholder="SUM(clicks) / NULLIF(SUM(impressions), 0)"
            rows={Math.min(10, Math.max(4, (openField.formula ?? "").split("\n").length))}
            spellCheck={false}
            className={`${inputCls} font-mono resize-y`}
          />
          {formulaContext && (
            <p className="mt-[6px] text-[11px] text-slate-500">
              Fields: {formulaContext.own.filter(n => n && n !== openField.name).join(", ") || "—"}
              {formulaContext.joined.length > 0 && <> · Joined: {formulaContext.joined.map(j => `${j.alias}.*`).join(", ")}</>}
            </p>
          )}
          {warningsOf(openField).map(w => (
            <p key={w} className="mt-[2px] text-[11px] text-amber-700">{w}</p>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}
