import { InfoTip } from "../inspector/InfoTip";

const LABEL = "flex items-center gap-[5px] text-[11px] font-semibold text-slate-500 uppercase tracking-[0.3px] mb-[6px]";
const FIELD = "w-full rounded-lg border border-[#d8dee8] px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-[#1e88e5]";

export function ModelPanel({ name, description, martCount, relCount, onNameChange, onDescriptionChange }: {
  name: string; description: string; martCount: number; relCount: number;
  onNameChange(v: string): void; onDescriptionChange(v: string): void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="model-name" className={LABEL}>Name</label>
        <input id="model-name" type="text" value={name} onChange={e => onNameChange(e.target.value)} className={FIELD} />
      </div>
      <div>
        <label htmlFor="model-description" className={LABEL}>
          Description <InfoTip text="What this model is for. Included in exports (OKF index / Ossie model) and shared with AI tools." />
        </label>
        <textarea id="model-description" aria-label="Description" rows={6} value={description} onChange={e => onDescriptionChange(e.target.value)}
          placeholder="What is this model for?" className={`${FIELD} resize-y`} />
      </div>
      <div className="text-[12px] text-slate-500">{martCount} marts · {relCount} relationships</div>
    </div>
  );
}
