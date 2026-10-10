import { memo, useEffect, useRef, useState } from "react";
import { Handle, Position, useUpdateNodeInternals, type NodeProps } from "@xyflow/react";
import {
  ArrowLeft,
  ArrowLeftRight,
  CircleAlert,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Code,
  Columns3,
  Grip,
  Info,
  KeyRound,
  LoaderCircle,
  PencilLine,
  Plug,
  Table,
  type LucideIcon,
} from "lucide-react";
import { formulaLevel, isCalculated, type InputSource, type ModelNode, type SchemaField } from "@mc/okf";
import type { ViewMode } from "../../state/viewMode";
import { NOTHING_HIDDEN, type ObjHidden } from "../../state/objLabels";
import { DataMartIcon, JoinIcon } from "../../lib/icons";
import { UI_FONT } from "../../share/svgText";
import {
  cardBadges,
  collapsedRowCount,
  fieldDescriptionLine,
  fieldRowLabel,
  hasDistinctAlias,
  nodeWidth,
  orderFields,
  packBadges,
  type CardBadge,
} from "./layoutSize";
import { CALC_GLYPH } from "./calcGlyph";
import { CALC_COLOR, CALC_DIVIDER, EDGE_NEUTRAL, statusBadge } from "./nodeStyle";
import type { CardRelationship } from "./relationships";

export type MartNodeData = ModelNode & {
  _viewMode?: ViewMode;
  _keyFields?: string[];
  _objHidden?: ObjHidden;
  /** The relationships the card's relationships badge counts and lists. */
  _relationships?: CardRelationship[];
  /** Sides a card-level edge attaches to — their sockets stay visible. */
  _sides?: { left: boolean; right: boolean };
  /** Tells the canvas whether a list on this card runs past it, so it can lift the card. */
  _onRaisedChange?: (key: string, raised: boolean) => void;
};

// Input source glyphs, as the product's Data Mart definition types draw them.
export const SOURCE_ICONS: Record<InputSource, LucideIcon> = {
  SQL: Code,
  TABLE: Table,
  VIEW: Grip,
  CONNECTOR: Plug,
};

const STATUS_ICONS: Record<string, LucideIcon> = {
  pending: PencilLine,
  creating: LoaderCircle,
  error: CircleAlert,
};

const BADGE_ICONS: Record<Exclude<CardBadge["kind"], "source">, LucideIcon> = {
  fields: Columns3,
  // The join icon used across the app and by the product, so relationships read the same everywhere.
  relationships: JoinIcon,
};

/**
 * Soft-filled pill with a leading icon, as on the product's Data Mart cards. The
 * layout estimate relies on these classes: keep `px-1.5`, `gap-1` and the 12px
 * icon in sync with `CARD_BADGE_CHROME`, and `text-[11px]` with `CARD_BADGE_FONT`.
 */
function CardPill({
  icon: Icon,
  kind,
  children,
  toggle,
  tone,
  title,
}: {
  icon: LucideIcon;
  kind?: string;
  children: React.ReactNode;
  /** Makes the pill a button that opens and closes a section of the card. */
  toggle?: { expanded: boolean; label: string; onToggle: () => void };
  tone?: { bg: string; fg: string };
  title?: string;
}) {
  const className =
    "inline-flex h-5 flex-shrink-0 items-center gap-1 rounded-lg px-1.5 text-[11px] leading-none whitespace-nowrap";
  const content = (
    <>
      <Icon size={12} className="flex-shrink-0" aria-hidden />
      {children}
    </>
  );
  if (!toggle) {
    return (
      <span
        data-badge={kind}
        title={title}
        className={`${className} ${tone ? "" : "bg-[#f5f5f5] text-[#65676f]"}`}
        style={tone ? { background: tone.bg, color: tone.fg } : undefined}
      >
        {content}
      </span>
    );
  }
  return (
    <button
      type="button"
      data-badge={kind}
      data-expanded={toggle.expanded ? "1" : ""}
      className={`nodrag cursor-pointer transition-colors ${className} ${
        toggle.expanded
          ? "bg-[#35363d]/10 text-[#35363d]"
          : "bg-[#f5f5f5] text-[#65676f] hover:bg-[#35363d]/10 hover:text-[#35363d]"
      }`}
      aria-expanded={toggle.expanded}
      aria-label={toggle.label}
      title={toggle.label}
      onPointerDown={e => e.stopPropagation()}
      onClick={e => {
        // A click on the card itself selects it — keep the two apart.
        e.stopPropagation();
        toggle.onToggle();
      }}
    >
      {content}
    </button>
  );
}

// Node-level connectable ports (the only way to draw a new relationship). They
// double as the product's edge sockets: a side a card-level edge attaches to
// keeps its gray dot on screen, the others show on hover as connect targets.
function NodePorts({ top, sides }: { top: number | string; sides: { left: boolean; right: boolean } }) {
  const common = {
    width: 10, height: 10, minWidth: 0, minHeight: 0, borderRadius: "50%",
    background: EDGE_NEUTRAL, border: "2px solid #fff", top,
  } as const;
  return (
    <>
      <Handle
        type="source" position={Position.Left} id="left"
        style={common}
        className={`mart-handle${sides.left ? " mart-handle--used" : ""}`}
      />
      <Handle
        type="source" position={Position.Right} id="right"
        style={common}
        className={`mart-handle${sides.right ? " mart-handle--used" : ""}`}
      />
    </>
  );
}

// Display-only anchor handles on a field row. isConnectable={false} keeps them
// from starting new connections — they only give existing edges a place to land.
function FieldAnchors({ name }: { name: string }) {
  const base = { width: 1, height: 1, minWidth: 0, minHeight: 0, background: "transparent", border: "none", top: 13 } as const;
  return (
    <>
      <Handle type="source" position={Position.Left} id={`fl:${name}`} isConnectable={false} style={{ ...base, left: 0 }} />
      <Handle type="source" position={Position.Right} id={`fr:${name}`} isConnectable={false} style={{ ...base, right: 0 }} />
    </>
  );
}

function FieldRow({ f, hidden, anchors, beforeCalculated }: { f: SchemaField; hidden: ObjHidden; anchors: boolean; beforeCalculated: boolean }) {
  const label = fieldRowLabel(f, hidden);
  const description = fieldDescriptionLine(f, hidden);
  // The tooltip repeats the row text (it may be truncated) and adds what the row
  // does not show: the technical name behind an alias, or the alias behind a name.
  const other = hasDistinctAlias(f) ? (label === f.name ? f.alias : f.name) : null;
  const level = isCalculated(f) ? formulaLevel(f.formula ?? "") : null;
  const tip = [label, other, level ? `${level === "metric" ? "Metric" : "Column"}: ${f.formula}` : null].filter(Boolean).join(" · ");
  return (
    <div
      data-field={f.name}
      data-calculated={level ?? undefined}
      // The row above the first calculated one draws a dashed bottom border instead of the solid
      // hairline, so exactly one rule separates them and the row height is unchanged.
      data-calc-divider={beforeCalculated ? "" : undefined}
      className={`relative border-b px-3.5 py-1.5 text-[11.5px] leading-[14px] last:border-b-0 ${beforeCalculated ? "border-dashed" : "border-[#e5e5e5]/50"}`}
      style={beforeCalculated ? { borderBottomColor: CALC_DIVIDER } : undefined}
      title={tip}
    >
      {anchors && !level && <FieldAnchors name={f.name} />}
      <div className="flex items-center gap-2">
        {level
          ? <span className="w-3 flex-shrink-0 text-center text-[10px] font-bold leading-none" style={{ color: CALC_COLOR }} aria-label={CALC_GLYPH[level].label} title={CALC_GLYPH[level].tip}>{CALC_GLYPH[level].symbol}</span>
          : f.pk
          ? <KeyRound size={12} className="flex-shrink-0 text-[#F5C344]" aria-label="Primary key" />
          : <span className="w-3 flex-shrink-0" />}
        <span className="flex-1 truncate text-[#35363d]">{label}</span>
        <span className="flex-shrink-0 font-mono text-[10px] tracking-tight text-[#65676f]">{f.type}</span>
      </div>
      {/* Single-line (truncated) so the row height stays predictable for the layout. */}
      {description && (
        <div data-field-description="" className="truncate pl-5 text-[10.5px] italic text-[#65676f]" title={description}>
          {description}
        </div>
      )}
    </div>
  );
}

// A field list shows at most ERD_COLLAPSED_ROWS rows by default so dense marts
// stay readable; the rest hide behind a "+N more" toggle. PK and relationship-key
// fields are always kept in the visible set so their edge handles exist even
// while collapsed (ERD edges anchor to those field rows).
function FieldsSection({
  node, hidden, anchors, expanded, onToggleExpanded, section,
}: {
  node: MartNodeData;
  hidden: ObjHidden;
  anchors: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  section: "erd" | "fields";
}) {
  const keyFields = node._keyFields ?? [];
  const ordered = orderFields(node.schema, keyFields);
  const collapsed = collapsedRowCount(node.schema, keyFields);
  const visible = expanded ? ordered : ordered.slice(0, collapsed);
  const hiddenCount = ordered.length - collapsed;

  return (
    <div data-section={section} className="border-t border-[#e5e5e5]">
      {visible.map((f, i) => <FieldRow key={f.name} f={f} hidden={hidden} anchors={anchors} beforeCalculated={!isCalculated(f) && i + 1 < visible.length && isCalculated(visible[i + 1])} />)}
      {hiddenCount > 0 && (
        <button
          type="button"
          data-more-row=""
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onToggleExpanded(); }}
          className="nodrag flex w-full items-center justify-center gap-1 rounded-b-[13px] border-t border-[#e5e5e5] py-1.5 text-[11px] font-medium leading-[14px] text-[#65676f] transition-colors hover:bg-[#f5f5f5] hover:text-[#35363d]"
        >
          {expanded
            ? <><ChevronDown size={12} /> Show less</>
            : <><ChevronRight size={12} /> +{hiddenCount} more field{hiddenCount !== 1 ? "s" : ""}</>}
        </button>
      )}
    </div>
  );
}

const DIRECTION: Record<CardRelationship["direction"], { icon: LucideIcon; label: string }> = {
  outgoing: { icon: ArrowRight, label: "Joins" },
  incoming: { icon: ArrowLeft, label: "Joined by" },
  both: { icon: ArrowLeftRight, label: "Joins both ways with" },
};

/**
 * The card's relationships list, opened from its relationships badge: every
 * object this one joins, in which direction, and on which fields. Like an
 * expanded field list, it grows the card past its layout height.
 */
function RelationshipsSection({ title, relationships }: { title: string; relationships: CardRelationship[] }) {
  return (
    <ul data-section="relationships" className="border-t border-[#e5e5e5]" aria-label={`Relationships of ${title}`}>
      {relationships.map(rel => {
        const { icon: Arrow, label } = DIRECTION[rel.direction];
        return (
          <li
            key={`${rel.id}:${rel.direction}`}
            data-rel-row={rel.direction}
            title={rel.description}
            className="border-b border-[#e5e5e5]/50 px-3.5 py-1.5 text-[11.5px] leading-[14px] last:border-b-0"
          >
            <div className="flex items-center gap-2" title={`${label} ${rel.otherTitle}`}>
              <Arrow size={12} className="flex-shrink-0 text-[#65676f]" aria-label={label} />
              <span data-rel-title="" className="flex-1 truncate text-[#35363d]">{rel.otherTitle}</span>
            </div>
            {rel.joinFields.length > 0 ? (
              rel.joinFields.map(({ field, otherField }, i) => (
                <div
                  key={`${i}:${field}=${otherField}`}
                  data-rel-join=""
                  className="truncate pl-5 font-mono text-[10px] leading-[14px] text-[#65676f]"
                  title={`${field} = ${otherField}`}
                >
                  {field} = {otherField}
                </div>
              ))
            ) : (
              <div data-rel-join="" data-rel-unset="" className="pl-5 text-[10.5px] italic leading-[14px] text-[#65676f]">
                Join fields not set
              </div>
            )}
            {rel.description && (
              <div data-rel-description="" className="truncate pl-5 text-[10.5px] leading-[14px] text-[#65676f]">
                {rel.description}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function MartNodeInner({ id, data }: NodeProps) {
  const node = data as unknown as MartNodeData;
  const viewMode = node._viewMode ?? "compact";
  const isErd = viewMode === "erd";
  const hidden = node._objHidden ?? NOTHING_HIDDEN;
  const relationships = node._relationships ?? [];
  const schema = node.schema ?? [];

  // Owned here (not in the section) so expansion survives Compact↔ERD round-trips.
  const [expanded, setExpanded] = useState(false);
  // The section a clicked badge opened: the field list (Compact view) or the relationships.
  const [openSection, setOpenSection] = useState<"fields" | "relationships" | null>(null);

  const badges = cardBadges(node, { hidden, relationshipCount: relationships.length });
  const badgeLines = packBadges(badges, viewMode);
  const shown = new Set(badges.map(b => b.kind));
  // The ERD view already lists the fields, so there the field count stays a plain
  // badge. A list shows only while its badge does: unticking the badge hides both.
  const canOpenFields = !isErd && schema.length > 0 && shown.has("fields");
  const canOpenRelationships = relationships.length > 0 && shown.has("relationships");
  const showFields = openSection === "fields" && canOpenFields;
  const showRelationships = openSection === "relationships" && canOpenRelationships;
  const showBody = isErd && schema.length > 0;
  const status = hidden.status ? null : statusBadge(node.status);

  // A shown list runs past the card's layout height, over the card below — the
  // canvas lifts this card above its neighbours while one is on screen.
  const raised = showFields || showRelationships || (showBody && expanded);
  const onRaisedRef = useRef(node._onRaisedChange);
  onRaisedRef.current = node._onRaisedChange;
  useEffect(() => { onRaisedRef.current?.(id, raised); }, [id, raised]);
  useEffect(() => () => onRaisedRef.current?.(id, false), [id]);

  // Opening a list grows the card and moves its sockets — re-measure so edges
  // stay attached to the handle dots.
  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => { updateNodeInternals(id); }, [expanded, openSection, viewMode, id, updateNodeInternals]);

  const toggleSection = (section: "fields" | "relationships") =>
    setOpenSection(current => (current === section ? null : section));

  function renderBadge(badge: CardBadge) {
    if (badge.kind === "source") {
      return (
        <CardPill key={badge.kind} kind={badge.kind} icon={SOURCE_ICONS[node.inputSource] ?? Code}>
          {badge.label}
        </CardPill>
      );
    }
    const toggle =
      badge.kind === "fields" && canOpenFields
        ? { expanded: showFields, label: `${showFields ? "Hide" : "Show"} fields of ${node.title}`, onToggle: () => toggleSection("fields") }
        : badge.kind === "relationships" && canOpenRelationships
          ? { expanded: showRelationships, label: `${showRelationships ? "Hide" : "Show"} relationships of ${node.title}`, onToggle: () => toggleSection("relationships") }
          : undefined;
    return (
      <CardPill key={badge.kind} kind={badge.kind} icon={BADGE_ICONS[badge.kind]} toggle={toggle}>
        {badge.label}
      </CardPill>
    );
  }

  return (
    <div
      className="group/card relative flex cursor-grab select-none flex-col rounded-[14px] border border-[#e5e5e5] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] active:cursor-grabbing"
      style={{ width: nodeWidth(viewMode), fontFamily: UI_FONT }}
    >
      {/* Title row: icon tile + name + status pill + description */}
      <div className="flex items-center gap-2 px-3 pt-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#f5f5f5] text-[#35363d]" aria-hidden>
          <DataMartIcon size={16} />
        </span>
        <span data-node-title="" className="min-w-0 flex-1 truncate text-sm font-semibold text-[#35363d]" title={node.title}>
          {node.title}
        </span>
        {status && (
          <span data-status={node.status} className="flex-shrink-0">
            <CardPill icon={STATUS_ICONS[node.status] ?? PencilLine} tone={status} title={status.tip}>
              {status.label}
            </CardPill>
          </span>
        )}
        {/* Shown on card hover only — the card stays quiet until the user asks. */}
        {node.description && (
          <span
            data-description=""
            className="nodrag inline-flex flex-shrink-0 cursor-default rounded p-0.5 text-[#65676f] opacity-0 transition-[opacity,color] hover:text-[#35363d] group-hover/card:opacity-100"
            title={node.description}
            aria-label={`Description for ${node.title}`}
          >
            <Info size={14} aria-hidden />
          </span>
        )}
      </div>

      {/* Badge lines: source, fields, relationships — packed by width */}
      {badgeLines.map((line, i) => (
        <div
          key={line.map(b => b.kind).join("+")}
          data-badge-line=""
          className={`flex items-center gap-1 overflow-hidden px-3 ${i === 0 ? "pt-2" : "pt-1"}`}
        >
          {line.map(renderBadge)}
        </div>
      ))}

      {/* The card closes with its bottom padding. */}
      <div className="h-3" aria-hidden />

      {/* Sections opened from the badges */}
      {showRelationships && <RelationshipsSection title={node.title} relationships={relationships} />}
      {showFields && (
        <FieldsSection node={node} hidden={hidden} anchors={false} expanded={expanded} onToggleExpanded={() => setExpanded(v => !v)} section="fields" />
      )}

      {/* ERD body: field rows (only in ERD view) */}
      {showBody && (
        <FieldsSection node={node} hidden={hidden} anchors expanded={expanded} onToggleExpanded={() => setExpanded(v => !v)} section="erd" />
      )}

      {/* Sockets sit mid-card, as in the product; in ERD they stay on the title row
          so an edge without a join field doesn't land in the middle of the rows. */}
      <NodePorts top={isErd ? 26 : "50%"} sides={node._sides ?? { left: false, right: false }} />
    </div>
  );
}

export const MartNode = memo(MartNodeInner);
