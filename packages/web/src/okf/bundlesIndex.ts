// The verified gallery is auto-discovered: the OWOX/models repo publishes a
// top-level bundles/index.md that links to each bundle's own index.md. We fetch
// that one file on dialog open and parse the rows — so new OWOX bundles appear
// in the gallery with no app code change. Heavy per-bundle content (mart files,
// graph, image) is fetched lazily on row expand (see LibraryDialog).

export const VERIFIED_BUNDLES_INDEX_URL =
  "https://raw.githubusercontent.com/OWOX/models/main/bundles/index.md";

export interface VerifiedBundle {
  title: string;
  folder: string;
  martCount: number | null;
}

/** Parse the top-level bundles/index.md. Each bundle is a markdown list link to
 *  a sub-folder index (`[Title](./folder/index.md) — N concept(s)`). External
 *  (http) links are skipped; the count is optional. */
export function parseBundlesIndex(md: string): VerifiedBundle[] {
  const re = /\[([^\]]+)\]\(\s*\.\/([^/)]+)\/index\.md\s*\)(?:[^\n]*?(\d+)\s*concept)?/gi;
  const out: VerifiedBundle[] = [];
  for (let m = re.exec(md); m; m = re.exec(md)) {
    out.push({ title: m[1].trim(), folder: m[2].trim(), martCount: m[3] ? Number(m[3]) : null });
  }
  return out;
}

/** First `<img src="...">` in a markdown/HTML body (bundle index images are
 *  appended as a raw <img> tag pointing at github.com/user-attachments). */
export function firstImageSrc(md: string): string | null {
  const m = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i.exec(md);
  return m ? m[1] : null;
}

/** GitHub tree URL for a verified bundle folder — the deeplink / import target. */
export function bundleGithubUrl(folder: string): string {
  return `https://github.com/OWOX/models/tree/main/bundles/${folder}`;
}

/** Fetch + parse the verified bundle list. Throws on network / non-OK. */
export async function fetchVerifiedBundleList(
  opts: { signal?: AbortSignal } = {},
): Promise<VerifiedBundle[]> {
  const res = await fetch(VERIFIED_BUNDLES_INDEX_URL, { signal: opts.signal });
  if (!res.ok) throw new Error(`Couldn't load the verified gallery (GitHub returned ${res.status}).`);
  return parseBundlesIndex(await res.text());
}
