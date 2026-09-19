import { Image as ImageIcon, Shapes, Camera, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { InfoTip } from "./InfoTip";

// The image export formats, defined once and offered in both places that can
// export: the top-bar Export menu and the Share panel. Each carries the caveat
// that decides whether it's the right one — they genuinely fail in different
// browsers and tools, so the choice isn't cosmetic.

export type ImageFormat = "png" | "vector" | "snapshot";

export const IMAGE_FORMATS: { id: ImageFormat; icon: LucideIcon; label: string; tip: ReactNode }[] = [
  {
    id: "png",
    icon: ImageIcon,
    label: "PNG image",
    tip: (
      <>An ordinary picture. Renders everywhere — Slack, Notion, GitHub, Safari.
        Exported at 2× so it stays sharp, but it is a fixed size: zoom in far
        enough and it blurs.</>
    ),
  },
  {
    id: "vector",
    icon: Shapes,
    label: "SVG · vector",
    tip: (
      <>Real shapes and text. Scales to any size without blurring, opens in
        Figma, Illustrator and Inkscape, and the file stays small. Text uses the
        reader's system font, so letter widths can shift slightly on another
        machine.</>
    ),
  },
  {
    id: "snapshot",
    icon: Camera,
    label: "SVG · exact snapshot",
    tip: (
      <>A pixel-exact copy of the canvas, stored as HTML inside the SVG.
        Identical in Chrome, but Safari renders it wrong, design tools open it
        blank, and the file is roughly 10× larger. Use only if the vector export
        misses something.</>
    ),
  },
];

export type ImageBackground = "white" | "transparent";

/**
 * The "?" for one format row. Kept out of sight until that row is hovered or
 * focused, so three rows of help icons don't shout over the labels themselves.
 * The parent row must carry `group/row`.
 *
 * The group is named on purpose: a bare `group-hover` fires from ANY ancestor
 * carrying `group`, and the top bar wraps its Export button in one — hovering
 * anywhere in the open menu would then reveal every row's "?" at once.
 */
export function FormatTip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="pr-3 opacity-0 transition-opacity group-hover/row:opacity-100 group-focus-within/row:opacity-100">
      <InfoTip label={`About ${label}`}>{children}</InfoTip>
    </span>
  );
}
