import type { ModelGraph } from "@mc/okf";
import { TEMPLATES } from "../templates";

// Deep-link: `model.owox.com/?template=<id>` opens a named built-in template
// straight onto the canvas. It's the CTA target for the blog template gallery,
// launch emails and social posts — one click from "here's a model" to "you're
// editing it". An unknown/missing id falls through to the normal first-run flow.

const PARAM = "template";

/** If the URL carries `?template=<id>` and it matches a known template, return a
 *  deep clone of that template's graph. Positions are still (0,0) — the caller
 *  runs Dagre layout, exactly like any freshly loaded model. Missing or unknown
 *  id → null (so the bootstrap falls back to shared link / localStorage / welcome). */
export function readTemplateModel(): ModelGraph | null {
  const id = new URLSearchParams(location.search).get(PARAM);
  if (!id) return null;
  const t = TEMPLATES.find(tpl => tpl.id === id);
  return t ? structuredClone(t.graph) : null;
}

/** Strip the `template` param from the address bar after loading, so a refresh
 *  doesn't re-clobber the canvas. UTM params and the hash are preserved — the
 *  UTMs are captured by analytics at page load, and the hash may carry a share
 *  link. Safe to call unconditionally: no-ops when the param isn't present. */
export function clearTemplateFromUrl(): void {
  const params = new URLSearchParams(location.search);
  if (!params.has(PARAM)) return;
  params.delete(PARAM);
  const qs = params.toString();
  history.replaceState(null, "", location.pathname + (qs ? `?${qs}` : "") + location.hash);
}
