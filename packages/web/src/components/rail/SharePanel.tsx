import { Share2 } from "lucide-react";
import { FormatTip, IMAGE_FORMATS, type ImageFormat } from "../ui/imageFormats";

export function SharePanel({
  shareUrl,
  onCopy,
  onExportImage,
}: {
  shareUrl: string;
  onCopy(): void;
  onExportImage(format: ImageFormat): void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Perk description header */}
      <div className="flex items-center gap-3 rounded-lg border border-[#d8dee8] px-3 py-2.5">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#e6f1fb] text-[#1e88e5]">
          <Share2 size={16} />
        </div>
        <div>
          <div className="text-[13px] font-medium text-slate-900">Named sharing</div>
          <div className="text-[12px] text-slate-500">Share a model by name with a link</div>
        </div>
      </div>

      {/* Share URL row: read-only input + Copy button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={shareUrl}
          readOnly
          aria-label="Share URL"
          className="flex-1 min-w-0 rounded-lg border border-[#d8dee8] px-3 py-2.5 text-[13px] text-slate-700 bg-[#f7f8fa] outline-none select-all cursor-text"
        />
        <button
          onClick={onCopy}
          className="rounded-lg bg-[#1e88e5] px-4 py-2.5 text-[13px] font-[550] text-white hover:bg-[#1976d2] cursor-pointer flex-shrink-0"
        >
          Copy
        </button>
      </div>

      {/* Export as image — one row per format, each with its own caveat */}
      <div className="flex flex-col gap-2">
        <div className="text-[12px] font-[550] text-slate-500">Export as image</div>
        {IMAGE_FORMATS.map(({ id, icon: Icon, label, tip }) => (
          <div
            key={id}
            className="group/row flex items-center rounded-lg border border-[#d8dee8] bg-white hover:bg-[#f1f3f7]"
          >
            <button
              onClick={() => onExportImage(id)}
              className="flex flex-1 items-center gap-2 px-3 py-2.5 text-left text-[13.5px] font-[550] text-slate-900 cursor-pointer"
            >
              <Icon size={16} className="flex-shrink-0 text-slate-400" />
              {label}
            </button>
            <FormatTip label={label}>{tip}</FormatTip>
          </div>
        ))}
      </div>
    </div>
  );
}
