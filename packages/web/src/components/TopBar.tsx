import { useEffect, useState } from "react";
import { Download, Upload, ChevronDown, Target, FileText, Image as ImageIcon, RefreshCw, Check, LogOut } from "lucide-react";
import { ProjectIcon, StorageIcon, LibraryIcon } from "../lib/icons";
import { EnableControl } from "./EnableControl";

// First-visit onboarding hint pointing at the Library. Persisted so it only
// ever shows once per browser; dismissed as soon as the user hovers it.
const LIBRARY_HINT_KEY = "mc.libraryHint.v1";

export interface StorageOption { id: string; title: string; type: string; }

export interface TopBarProps {
  pendingCount?: number;
  storages?: StorageOption[];
  storageId?: string | null;
  onStorageChange?: (id: string) => void;
  /** Re-reads the project's storages from OWOX. Resolves with the fresh list;
   *  rejects if the call failed, so the picker can tell "couldn't refresh" from
   *  "this project genuinely has no storages". */
  onRefreshStorages?: () => Promise<StorageOption[]>;
  onImport?: () => void;
  onImportFromOwox?: () => void;
  onExport?: () => void;
  onExportSvg?: () => void;
  exportDisabled?: boolean;
  onShare?: () => void;
  shareDisabled?: boolean;
  onPush?: () => void;
  /** Clears the OWOX API key (and detaches the model from OWOX). The canvas
   *  itself is kept — only the connection to the project goes away. */
  onSignOut?: () => void;
  onLibrary?: () => void;
  signedIn: boolean;
  projectTitle?: string;
  onOpenGoal?: () => void;
  goalSet?: boolean;
  questionsEnabled?: boolean;
  // Model name — passed to EnableControl as subtext when signed in.
  modelName?: string;
  // Supabase account ("Save"). Independent of the OWOX connect/sign-in above.
  supabaseEnabled?: boolean;
  accountEmail?: string | null;
  onSave?: () => void;
  saving?: boolean;
  // Save state caption under the Save button: "saved" | "unsaved" | null (hidden).
  saveState?: "saved" | "unsaved" | null;
  // Opens the Enable (signed-out) or Account (signed-in) Sheet panel.
  onEnable?: () => void;
}

const LOGO = (
  <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
    <path d="M421.311 119.85C435.258 133.807 440.996 157.327 440.996 157.327C440.996 157.327 449.53 204.69 449.53 268.995C449.53 177.972 418.65 162.348 311.314 162.348H212.327C157.38 162.348 161.097 217.57 157.38 243.85L152.865 283.556C150.697 325.33 157.951 351.215 200.811 351.215C111.444 351.215 61.806 365.847 61.8062 239.866C61.8061 182.846 70.4043 157.327 70.4043 157.327C70.4043 157.327 76.1419 133.807 90.1183 119.85C104.095 105.877 124.809 104.475 124.809 104.475C124.809 104.475 167.579 98.0374 252.066 98.0374C336.554 98.0374 384.285 104.475 384.285 104.475C384.285 104.475 407.321 105.877 421.311 119.85Z" fill="url(#topbar-g0)"/>
    <path d="M449.515 271.888C449.52 273.026 449.523 274.174 449.523 275.333C449.523 329.946 441.393 351.201 441.393 351.201C441.393 351.201 435.03 376.952 424.167 388.075C406.929 405.725 388.495 406.71 388.495 406.71C388.495 406.71 348.836 413.061 263.502 413.061C181.632 413.061 127.111 406.749 127.111 406.749C127.111 406.749 104.091 405.337 90.1144 391.377C76.1379 377.394 70.4004 351.201 70.4004 351.201C70.4004 351.201 61.8062 297.401 61.8062 238.506C61.806 352.055 102.131 351.374 175.525 350.133C183.56 349.998 191.992 349.855 200.811 349.855H299.787C343.122 349.855 352.906 318.315 354.792 282.196L359.32 227.093C360.526 204.443 357.608 188.362 350.507 178.012C342.765 166.722 329.575 160.987 311.314 160.987C424.974 160.987 448.73 176.216 449.515 271.888Z" fill="url(#topbar-g1)"/>
    <defs>
      <linearGradient id="topbar-g0" x1="255.15" y1="98" x2="256.871" y2="367" gradientUnits="userSpaceOnUse">
        <stop stopColor="#05D2FF"/>
        <stop offset=".15" stopColor="#21A1F1"/>
        <stop offset=".4" stopColor="#1E88E5"/>
        <stop offset=".72" stopColor="#1E6EE5"/>
        <stop offset="1" stopColor="#182FFF"/>
      </linearGradient>
      <linearGradient id="topbar-g1" x1="85.6" y1="412.6" x2="394" y2="143.8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#24D8FF"/>
        <stop offset=".15" stopColor="#21A1F1"/>
        <stop offset=".4" stopColor="#1E88E5"/>
        <stop offset=".75" stopColor="#1E7AE5"/>
        <stop offset="1" stopColor="#0046F9"/>
      </linearGradient>
    </defs>
  </svg>
);

// Styled hover tooltip shown under a top-bar button. Mirrors the dock's DockTip:
// once the labels collapse to icons (see `compact` below), the name has to come
// back on hover, and the native title tooltip is both slow and unstyled.
function BarTip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-[12px] font-medium px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-[0_6px_18px_rgba(15,23,42,0.28)]">
      {label}
    </span>
  );
}

export function TopBar({
  pendingCount = 0, storages = [], storageId, onStorageChange, onRefreshStorages,
  onImport, onImportFromOwox, onExport, onExportSvg, exportDisabled = false,
  onPush, onSignOut, onLibrary,
  signedIn, projectTitle,
  onOpenGoal, goalSet = false, questionsEnabled = false,
  modelName,
  supabaseEnabled = false, accountEmail,
  onEnable,
}: TopBarProps) {
  // Push split-button menu (holds the signed-in "Import from OWOX project" action).
  const [menuOpen, setMenuOpen] = useState(false);
  // Storage picker: a custom listbox rather than a <select>, so the list can carry
  // a Refresh action — storages created in OWOX after the API key was added would
  // otherwise never appear without a page reload.
  const [storageMenuOpen, setStorageMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // Outcome of the last refresh, shown inside the open list. Needed because a
  // successful refresh that changes nothing is otherwise indistinguishable from
  // a broken one.
  const [refreshNote, setRefreshNote] = useState<{ ok: boolean; text: string } | null>(null);
  // Export dropdown (OKF markdown / PNG / SVG).
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  // Show the Library hint on first ever visit; stays lit until hovered.
  const [showLibraryHint, setShowLibraryHint] = useState(false);
  useEffect(() => {
    try { if (!localStorage.getItem(LIBRARY_HINT_KEY)) setShowLibraryHint(true); } catch { /* private mode */ }
  }, []);
  const dismissLibraryHint = () => {
    setShowLibraryHint(false);
    try { localStorage.setItem(LIBRARY_HINT_KEY, "seen"); } catch { /* private mode */ }
  };

  const closeStorageMenu = () => { setStorageMenuOpen(false); setRefreshNote(null); };

  // The list stays open after a refresh — the whole point is to see what arrived.
  const refreshStorages = async () => {
    if (refreshing || !onRefreshStorages) return;
    setRefreshing(true);
    setRefreshNote(null);
    try {
      const list = await onRefreshStorages();
      setRefreshNote({
        ok: true,
        text: list.length ? `Up to date — ${list.length} storage${list.length === 1 ? "" : "s"}` : "This project has no storages yet",
      });
    } catch {
      setRefreshNote({ ok: false, text: "Couldn't reach OWOX — try again" });
    } finally {
      setRefreshing(false);
    }
  };

  const currentStorage = storages.find(s => s.id === storageId);

  // Signed in, the Project + Storage pickers claim a big slice of the bar and the
  // action buttons used to grow/wrap. In that state every action collapses to its
  // icon and the label returns as a hover tip.
  const compact = signedIn;

  return (
    <div className="flex items-center gap-3 px-4 py-[9px] bg-white border-b border-[#d8dee8] flex-shrink-0 z-30">
      {/* Brand — logo links to owox.com */}
      <div className="flex items-center gap-[9px] font-[650] text-[15px] tracking-[-0.2px]">
        <a
          href="https://owox.com"
          target="_blank"
          rel="noreferrer"
          title="OWOX — owox.com"
          aria-label="OWOX — owox.com"
          className="flex items-center rounded-md transition-opacity hover:opacity-80"
        >
          {LOGO}
        </a>
        <span>Model Canvas</span>
      </div>

      {/* Business Goal — entry point for Insight Questions. Hidden unless the
          server reports GEMINI_API_KEY is set (questionsEnabled), so it's a pure
          env switch: drop the key and the whole AI feature disappears, no
          redeploy of code needed. */}
      {questionsEnabled && (
        <div className="relative group flex items-center">
          <button
            onClick={onOpenGoal}
            aria-label="Business goal — see the questions your model unlocks"
            title={compact ? undefined : "Set a business goal to see the questions your model unlocks"}
            className={`flex items-center gap-[6px] rounded-lg px-[10px] py-[6px] text-[13px] font-[550] cursor-pointer transition-colors ${goalSet ? "text-[#1e88e5] bg-[#e6f1fb]" : "text-slate-500 hover:bg-[#f1f3f7] hover:text-slate-900"}`}
          >
            <Target size={16} /> {!compact && (goalSet ? "Business goal" : "Set business goal")}
          </button>
          {compact && <BarTip label={goalSet ? "Business goal" : "Set business goal"} />}
        </div>
      )}

      {/* Project chip — icon + project name only; the word "Project" is a hover tip
          so a long project title can't push the bar's buttons around. */}
      {signedIn && (
        <div className="relative group flex items-center">
          <button
            aria-label="Project"
            className="flex items-center gap-[7px] max-w-[210px] text-[13px] text-slate-500 border border-[#d8dee8] rounded-lg px-[10px] py-[5px] bg-white cursor-pointer hover:bg-[#f1f3f7]"
          >
            <ProjectIcon size={14} className="flex-shrink-0" />
            <span className="text-slate-900 font-semibold truncate">{projectTitle ?? "—"}</span>
          </button>
          <BarTip label={`Project: ${projectTitle ?? "—"}`} />
        </div>
      )}

      {/* Storage picker — one storage per model (joinable requires same storage).
          Custom listbox instead of a <select> so the list can end with a Refresh
          action: the storage list is fetched once at sign-in, so a storage created
          in OWOX afterwards was previously unreachable without reloading the page. */}
      {signedIn && (
        <div className="relative group" onKeyDown={e => { if (e.key === "Escape") closeStorageMenu(); }}>
          <button
            onClick={() => (storageMenuOpen ? closeStorageMenu() : setStorageMenuOpen(true))}
            aria-haspopup="listbox"
            aria-expanded={storageMenuOpen}
            aria-label="Storage"
            className="flex items-center gap-[7px] max-w-[210px] text-[13px] text-slate-500 border border-[#d8dee8] rounded-lg px-[10px] py-[5px] bg-white cursor-pointer hover:bg-[#f1f3f7]"
          >
            <StorageIcon size={14} className="flex-shrink-0" />
            <span className="text-slate-900 font-semibold truncate">{currentStorage?.title ?? "—"}</span>
            <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
          </button>
          {/* Hidden while the list is open — the tip would sit on top of it. */}
          {!storageMenuOpen && <BarTip label={`Storage: ${currentStorage?.title ?? "—"} — one storage per model`} />}
          {storageMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeStorageMenu} />
              <div role="listbox" aria-label="Storage" className="absolute top-[calc(100%+6px)] left-0 z-50 w-[268px] rounded-lg border border-[#d8dee8] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] py-1">
                {storages.length === 0 && (
                  <div className="px-3 py-2 text-[12.5px] text-slate-500 leading-snug">
                    No storages found in this project. Create one in OWOX, then refresh below.
                  </div>
                )}
                {storages.map(s => (
                  <button
                    key={s.id}
                    role="option"
                    aria-selected={s.id === storageId}
                    onClick={() => { onStorageChange?.(s.id); closeStorageMenu(); }}
                    className={`w-full text-left text-[13px] px-3 py-2 cursor-pointer flex items-center gap-[8px] hover:bg-[#f1f3f7] ${s.id === storageId ? "text-slate-900 font-semibold" : "text-slate-900"}`}
                  >
                    <Check size={14} className={s.id === storageId ? "text-[#1e88e5]" : "text-transparent"} />
                    <span className="flex-1 truncate">{s.title}</span>
                  </button>
                ))}
                {onRefreshStorages && (
                  <>
                    <div className="border-t border-[#eef1f5] my-1" />
                    <button
                      onClick={refreshStorages}
                      disabled={refreshing}
                      className="w-full text-left text-[13px] text-slate-600 px-3 py-2 cursor-pointer flex items-center gap-[8px] hover:bg-[#f1f3f7] disabled:cursor-default"
                    >
                      <RefreshCw size={14} className={`text-slate-500 ${refreshing ? "animate-spin" : ""}`} />
                      {refreshing ? "Refreshing…" : "Refresh the list of storages"}
                    </button>
                    {refreshNote && (
                      <div className={`px-3 pb-2 pt-0.5 text-[12px] leading-snug ${refreshNote.ok ? "text-slate-500" : "text-red-600"}`}>
                        {refreshNote.text}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex-1" />

      {/* Templates */}
      <div className="relative group">
        {/* Pulsing ring highlights the Templates control on first visit */}
        {showLibraryHint && (
          <span className="absolute -inset-[3px] rounded-[10px] ring-2 ring-[#1e88e5]/60 animate-pulse pointer-events-none" />
        )}
        <button
          onClick={() => { dismissLibraryHint(); onLibrary?.(); }}
          aria-label="Templates"
          title={compact ? undefined : "Browse model templates"}
          className="text-[13px] font-[550] text-slate-900 border border-[#d8dee8] bg-white rounded-lg px-3 py-[7px] cursor-pointer flex items-center gap-[6px] hover:bg-[#f1f3f7]"
        >
          <LibraryIcon size={15} /> {!compact && "Templates"}
        </button>
        {/* The first-visit hint owns the hover space while it's up. */}
        {compact && !showLibraryHint && <BarTip label="Templates" />}
        {showLibraryHint && (
          <div
            role="tooltip"
            onMouseEnter={dismissLibraryHint}
            className="absolute top-[calc(100%+11px)] right-0 z-40 w-[232px] rounded-lg bg-slate-900 text-white text-[12.5px] leading-[1.45] px-3 py-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.28)] cursor-default"
          >
            <span className="absolute -top-[5px] right-[18px] w-[10px] h-[10px] bg-slate-900 rotate-45" />
            Roll out a ready-made model from the templates — or build your own from scratch.
          </div>
        )}
      </div>

      {/* Import OKF */}
      <div className="relative group flex items-center">
        <button
          onClick={onImport}
          aria-label="Import"
          className="text-[13px] font-[550] border border-[#d8dee8] bg-white text-slate-900 rounded-lg px-3 py-[7px] cursor-pointer flex items-center gap-[6px] hover:bg-[#f1f3f7]"
        >
          <Download size={15} /> {!compact && "Import"}
        </button>
        {compact && <BarTip label="Import" />}
      </div>

      {/* Export — dropdown: OKF markdown, PNG image, SVG image */}
      <div className="relative group">
        <button
          onClick={() => setExportMenuOpen(o => !o)}
          disabled={exportDisabled}
          aria-haspopup="menu"
          aria-expanded={exportMenuOpen}
          aria-label="Export"
          title={exportDisabled ? "Add a mart first, then export" : compact ? undefined : "Export this model"}
          className="text-[13px] font-[550] border border-[#d8dee8] bg-white text-slate-900 rounded-lg px-3 py-[7px] cursor-pointer flex items-center gap-[6px] hover:bg-[#f1f3f7] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={15} /> {!compact && "Export"} <ChevronDown size={14} className="text-slate-400" />
        </button>
        {compact && !exportMenuOpen && <BarTip label="Export" />}
        {exportMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setExportMenuOpen(false)} />
            <div role="menu" className="absolute top-[calc(100%+6px)] right-0 z-50 w-[232px] rounded-lg border border-[#d8dee8] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] py-1">
              <button role="menuitem" onClick={() => { setExportMenuOpen(false); onExport?.(); }} className="w-full text-left text-[13px] text-slate-900 px-3 py-2 cursor-pointer flex items-center gap-[8px] hover:bg-[#f1f3f7]">
                <FileText size={15} className="text-slate-500" /> OKF (Markdown)
              </button>
              <button role="menuitem" onClick={() => { setExportMenuOpen(false); onExportSvg?.(); }} className="w-full text-left text-[13px] text-slate-900 px-3 py-2 cursor-pointer flex items-center gap-[8px] hover:bg-[#f1f3f7]">
                <ImageIcon size={15} className="text-slate-500" /> Image (SVG)
              </button>
            </div>
          </>
        )}
      </div>

      {/* Share and Save both live in the right rail now — no top-bar buttons. */}

      {/* Push to OWOX — split button: primary push + caret menu (signed-in only)
          holding the less-common "Import from OWOX project" action. */}
      <div className="relative flex items-center">
        <button
          onClick={onPush}
          className={`text-[13px] font-[550] bg-[#1e88e5] text-white border border-[#1e88e5] px-3 py-[7px] cursor-pointer flex items-center gap-[6px] hover:bg-[#1976d2] ${signedIn ? "rounded-l-lg border-r-0" : "rounded-lg"}`}
        >
          <span className="whitespace-nowrap">Push to OWOX</span>
          {pendingCount > 0 && <span className="opacity-80">({pendingCount})</span>}
        </button>
        {signedIn && (
          <>
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="More OWOX actions"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="text-white bg-[#1e88e5] border border-[#1e88e5] border-l border-l-[#4d97e8] rounded-r-lg px-[7px] py-[9px] cursor-pointer hover:bg-[#1976d2] flex items-center"
            >
              <ChevronDown size={15} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div role="menu" className="absolute top-[calc(100%+6px)] right-0 z-50 w-[248px] rounded-lg border border-[#d8dee8] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] py-1">
                  <button
                    role="menuitem"
                    onClick={() => { setMenuOpen(false); onImportFromOwox?.(); }}
                    className="w-full text-left text-[13px] text-slate-900 px-3 py-2 cursor-pointer flex items-center gap-[8px] hover:bg-[#f1f3f7]"
                  >
                    <Download size={15} /> Import from OWOX project
                  </button>
                  {/* The only way out of the connected state — without it the API key
                      was stuck until localStorage was cleared by hand. The canvas is
                      kept; the marts just become unpushed drafts again. */}
                  {onSignOut && (
                    <>
                      <div className="border-t border-[#eef1f5] my-1" />
                      <button
                        role="menuitem"
                        onClick={() => { setMenuOpen(false); onSignOut(); }}
                        className="w-full text-left text-[13px] text-slate-900 px-3 py-2 cursor-pointer flex items-start gap-[8px] hover:bg-[#f1f3f7]"
                      >
                        <LogOut size={15} className="mt-[2px] flex-shrink-0 text-slate-500" />
                        <span>
                          Sign out (clear token)
                          <span className="block text-[11.5px] text-slate-500 leading-snug">Keeps this canvas — disconnects the project</span>
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Enable control — opens the Enable (signed-out) or Account (signed-in)
          Sheet panel. Replaces the old OWOX sign-in button and account chip.
          Shown only when Supabase is configured. */}
      {supabaseEnabled && (
        <EnableControl
          signedIn={!!accountEmail}
          modelName={modelName}
          onClick={onEnable ?? (() => {})}
        />
      )}
    </div>
  );
}
