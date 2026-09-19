import { useCallback, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// A "?" affordance with a hover/focus explanation.
//
// The bubble is portalled to <body> and positioned with fixed coordinates
// because the panels it lives in scroll (`overflow-y-auto`), and a scroll
// container clips on both axes — an absolutely positioned tooltip would be cut
// off at the panel edge.

const FLIP_ABOVE_BELOW_PX = 160; // too close to the top to open upwards

export function InfoTip({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);

  const show = useCallback(() => setAnchor(ref.current?.getBoundingClientRect() ?? null), []);
  const hide = useCallback(() => setAnchor(null), []);

  const below = anchor !== null && anchor.top < FLIP_ABOVE_BELOW_PX;
  const style = anchor
    ? { left: anchor.right, top: below ? anchor.bottom + 8 : anchor.top - 8 }
    : undefined;

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-label={label}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="flex h-[17px] w-[17px] flex-shrink-0 items-center justify-center rounded-full border border-[#d8dee8] text-[10px] font-semibold text-slate-400 hover:border-[#1e88e5] hover:text-[#1e88e5] cursor-help"
      >
        ?
      </button>
      {anchor !== null && createPortal(
        <div
          role="tooltip"
          style={style}
          className={`fixed z-50 w-60 -translate-x-full rounded-lg bg-slate-900 px-3 py-2 text-[12px] leading-snug text-white shadow-lg ${below ? "" : "-translate-y-full"}`}
        >
          {children}
        </div>,
        document.body,
      )}
    </>
  );
}
