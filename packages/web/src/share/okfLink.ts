import { isAllowedGithubHost } from "../okf/github";

// Deep-link: `model.owox.com/?okf=<url-encoded github bundle url>` opens the
// canvas with the Import dialog pre-filled and previewed for that bundle. It's
// the marketing CTA target for individual public models (saas, ecommerce,
// finance, …) hosted in the OWOX/models repo. An unknown/invalid URL is ignored
// (the dialog just doesn't open), so the link degrades to a normal visit.

const PARAM = "okf";

/** Read `?okf=<url>` from the address bar. Returns the URL only if it points to
 *  an allowed public GitHub host; otherwise null (missing param or bad host). */
export function readOkfImportUrl(): string | null {
  const raw = new URLSearchParams(location.search).get(PARAM);
  if (!raw) return null;
  return isAllowedGithubHost(raw) ? raw : null;
}

/** Strip the `okf` param after opening the dialog, so a refresh doesn't re-open
 *  it. UTM params and the hash (a possible share link) are preserved — mirrors
 *  clearTemplateFromUrl. No-ops when the param isn't present. */
export function clearOkfFromUrl(): void {
  const params = new URLSearchParams(location.search);
  if (!params.has(PARAM)) return;
  params.delete(PARAM);
  const qs = params.toString();
  history.replaceState(null, "", location.pathname + (qs ? `?${qs}` : "") + location.hash);
}

/** Build a shareable deeplink for a public GitHub bundle URL (for marketing /
 *  internal use; no UI button ships this iteration). */
export function buildOkfDeeplink(bundleUrl: string): string {
  return `${location.origin}/?${PARAM}=${encodeURIComponent(bundleUrl)}`;
}
