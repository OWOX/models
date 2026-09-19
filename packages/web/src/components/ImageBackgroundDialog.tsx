import { useState } from "react";
import { IMAGE_FORMATS, type ImageBackground, type ImageFormat } from "./ui/imageFormats";

// Asked once the format is chosen, because the right answer depends on where
// the file is going: a white plate is safe everywhere, a transparent one drops
// onto a slide but disappears into dark-mode Slack or Notion.

const OPTIONS: { id: ImageBackground; label: string; hint: string }[] = [
  { id: "white", label: "White", hint: "Readable everywhere, including dark mode" },
  { id: "transparent", label: "Transparent", hint: "Drops onto any slide or coloured page" },
];

function Swatch({ background }: { background: ImageBackground }) {
  return background === "white"
    ? <span className="h-8 w-8 flex-shrink-0 rounded-md border border-[#d8dee8] bg-white" />
    : (
      <span
        className="h-8 w-8 flex-shrink-0 rounded-md border border-[#d8dee8]"
        style={{
          backgroundImage:
            "linear-gradient(45deg,#e2e8f0 25%,transparent 25%,transparent 75%,#e2e8f0 75%)," +
            "linear-gradient(45deg,#e2e8f0 25%,transparent 25%,transparent 75%,#e2e8f0 75%)",
          backgroundSize: "10px 10px",
          backgroundPosition: "0 0, 5px 5px",
        }}
      />
    );
}

export function ImageBackgroundDialog({
  format,
  initial = "white",
  onConfirm,
  onClose,
}: {
  format: ImageFormat;
  initial?: ImageBackground;
  onConfirm(background: ImageBackground): void;
  onClose(): void;
}) {
  const [background, setBackground] = useState<ImageBackground>(initial);
  const label = IMAGE_FORMATS.find(f => f.id === format)?.label ?? "image";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-label="Background"
        className="bg-white rounded-xl shadow-xl w-[380px] max-w-[95vw] p-6 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-slate-900">Background</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-700 text-xl leading-none px-1"
          >
            ✕
          </button>
        </div>

        <p className="text-[13px] text-slate-500">Exporting {label}.</p>

        <div className="flex flex-col gap-2">
          {OPTIONS.map(option => (
            <label
              key={option.id}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer ${
                background === option.id
                  ? "border-[#1e88e5] bg-[#f4f9fe]"
                  : "border-[#d8dee8] hover:bg-[#f1f3f7]"
              }`}
            >
              <input
                type="radio"
                name="image-background"
                value={option.id}
                checked={background === option.id}
                onChange={() => setBackground(option.id)}
                className="h-3.5 w-3.5 accent-[#1e88e5] cursor-pointer"
              />
              <Swatch background={option.id} />
              <span className="flex flex-col">
                <span className="text-[13.5px] font-[550] text-slate-900">{option.label}</span>
                <span className="text-[12px] text-slate-500">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-[13px] font-[550] border border-[#d8dee8] bg-white text-slate-900 rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#f1f3f7]"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(background)}
            className="text-[13px] font-[550] bg-[#1e88e5] text-white rounded-lg px-4 py-[7px] cursor-pointer hover:bg-[#1976d2]"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
