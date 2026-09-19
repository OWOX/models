// Download the whole model (not just the visible viewport) as an image, with a
// small OWOX watermark in the bottom-right corner. Three formats, because they
// fail in different places:
//
//  • PNG — our own vector SVG rasterised in the browser. Renders everywhere.
//  • vector SVG — real <rect>/<text>/<path>. Opens in design tools, scales.
//  • snapshot SVG — html-to-image's copy of the live DOM inside a
//    <foreignObject>. Pixel-exact in Chromium, but WebKit ignores the viewBox
//    scale, design tools show it blank, and it can't be rasterised: drawing a
//    foreignObject SVG onto a canvas taints it, so toDataURL throws. Kept as an
//    escape hatch for anything the vector renderer doesn't reproduce.

import { toSvg } from "html-to-image";
import { getNodesBounds, type Node } from "@xyflow/react";
import { readCanvasScene } from "./canvasScene";
import { buildVectorSvg, PADDING } from "./vectorSvg";
import { watermarkAt } from "./watermark";

const PNG_SCALE = 2; // export at 2× so the raster stays sharp when scaled up
const WHITE = "#ffffff";

export type ImageExportOptions = { transparent?: boolean };

function backgroundOf({ transparent = false }: ImageExportOptions): string | null {
  return transparent ? null : WHITE;
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadSvg(svg: string, filename: string): void {
  download(new Blob([svg], { type: "image/svg+xml" }), `${filename}.svg`);
}

function renderVector(rfNodes: Node[], background: string | null) {
  const scene = readCanvasScene(rfNodes);
  return scene ? buildVectorSvg(scene, { background }) : null;
}

/** Real vector SVG: shapes and text, no foreignObject. */
export async function exportCanvasVectorSvg(
  rfNodes: Node[],
  filename = "model",
  opts: ImageExportOptions = {},
): Promise<void> {
  const rendered = renderVector(rfNodes, backgroundOf(opts));
  if (rendered) downloadSvg(rendered.svg, filename);
}

/**
 * PNG at 2×. Rasterising our own SVG is safe precisely because it has no
 * foreignObject and no external references — the canvas stays untainted.
 */
export async function exportCanvasPng(
  rfNodes: Node[],
  filename = "model",
  opts: ImageExportOptions = {},
): Promise<void> {
  const rendered = renderVector(rfNodes, backgroundOf(opts));
  if (!rendered) return;
  const { svg, width, height } = rendered;

  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.decoding = "sync";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("the diagram could not be rasterised"));
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * PNG_SCALE);
    canvas.height = Math.round(height * PNG_SCALE);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2D canvas context");
    ctx.scale(PNG_SCALE, PNG_SCALE);
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("the PNG could not be encoded");
    download(blob, `${filename}.png`);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Pixel-exact DOM snapshot. Capturing the React Flow viewport with an overridden
 * transform renders every node at 1:1 regardless of the user's current pan/zoom.
 */
export async function exportCanvasSvg(
  rfNodes: Node[],
  filename = "model",
  opts: ImageExportOptions = {},
): Promise<void> {
  const el = document.querySelector<HTMLElement>(".react-flow__viewport");
  if (!el || rfNodes.length === 0) return;

  const bounds = getNodesBounds(rfNodes);
  const width = Math.ceil(bounds.width) + PADDING * 2;
  const height = Math.ceil(bounds.height) + PADDING * 2;
  // Translate so the model's top-left lands at (PADDING, PADDING); no scaling.
  const transform = `translate(${PADDING - bounds.x}px, ${PADDING - bounds.y}px) scale(1)`;

  // Don't pass html-to-image's `backgroundColor`: it paints the fill on the
  // translated viewport <div>, which offsets it. The background goes in below,
  // as a plain rect behind the foreignObject.
  const dataUrl = await toSvg(el, {
    width, height, skipFonts: true,
    style: { width: `${width}px`, height: `${height}px`, transform },
  });
  // toSvg returns a data: URI — decode, then edit the markup directly.
  const raw = decodeURIComponent(dataUrl.replace(/^data:image\/svg\+xml;charset=utf-8,/, ""));
  const background = backgroundOf(opts);
  const withBackground = background
    ? raw.replace(/^(<svg[^>]*>)/, `$1<rect width="${width}" height="${height}" fill="${background}"/>`)
    : raw;
  downloadSvg(withBackground.replace(/<\/svg>\s*$/, `${watermarkAt(width, height)}</svg>`), filename);
}
