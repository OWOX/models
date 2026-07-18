// Fetch a public OKF bundle straight from GitHub. The bundle's index.md lists
// every model file, so we read index.md from raw.githubusercontent.com, extract
// its relative .md links, and fetch them in parallel — no GitHub API, no
// 60/hour rate limit. Everything runs in the browser; the only server change is
// widening the CSP connect-src to allow the two GitHub hosts.

const RAW_HOST = "https://raw.githubusercontent.com";
const ALLOWED_HOSTS = new Set(["github.com", "www.github.com", "raw.githubusercontent.com"]);

export interface GithubBundleRef {
  owner: string;
  repo: string;
  ref: string;
  path: string; // dir path (kind "dir") or file path (kind "file"); no leading/trailing slash
  kind: "dir" | "file";
}

/** All user-facing fetch/parse failures are thrown as this type so the dialog
 *  can render `err.message` verbatim. */
export class OkfFetchError extends Error {
  status?: number;
}

export function isAllowedGithubHost(url: string): boolean {
  try { return ALLOWED_HOSTS.has(new URL(url).host); } catch { return false; }
}

/** Normalize any accepted GitHub URL form to a GithubBundleRef.
 *  Accepts: github.com tree/blob URLs, a bare repo root, and
 *  raw.githubusercontent.com URLs. `.md` targets are `kind: "file"`. */
export function parseGithubBundleUrl(input: string): GithubBundleRef {
  let u: URL;
  try { u = new URL(input.trim()); } catch { throw new OkfFetchError("Enter a valid URL."); }
  if (!ALLOWED_HOSTS.has(u.host)) throw new OkfFetchError("Only public GitHub links are supported.");

  // Keep segments percent-encoded exactly as `pathname` gives them: decoding here
  // (a) could throw on malformed escapes like "%zz" outside our try/catch, and
  // (b) would lose encoding of reserved chars (e.g. "%23" -> "#") before we
  // rejoin them into a raw URL, corrupting the fetch path.
  const segs = u.pathname.split("/").filter(Boolean);
  const kindOf = (path: string): "dir" | "file" => (path.toLowerCase().endsWith(".md") ? "file" : "dir");

  if (u.host === "raw.githubusercontent.com") {
    // /{owner}/{repo}/{ref}/{...path}  (ref may be "refs/heads/{branch}")
    if (segs.length < 3) throw new OkfFetchError("That GitHub link doesn't point to a file or folder.");
    const [owner, repo, ...rest] = segs;
    let ref = rest[0];
    let pathParts = rest.slice(1);
    if (rest[0] === "refs" && rest[1] === "heads") { ref = rest[2]; pathParts = rest.slice(3); }
    const path = pathParts.join("/");
    return { owner, repo, ref, path, kind: kindOf(path) };
  }

  // github.com: /{owner}/{repo}[/(tree|blob)/{ref}/{...path}]
  if (segs.length < 2) throw new OkfFetchError("That GitHub link doesn't point to a repo.");
  const [owner, repo, marker, ref, ...pathParts] = segs;
  if (!marker) return { owner, repo, ref: "HEAD", path: "", kind: "dir" };
  if (marker !== "tree" && marker !== "blob") throw new OkfFetchError("That GitHub link doesn't point to a file or folder.");
  const path = pathParts.join("/");
  return { owner, repo, ref: ref ?? "HEAD", path, kind: kindOf(path) };
}

/** Directory of the bundle, as a raw base URL with a trailing slash. For a file
 *  ref, the filename is dropped so links resolve against the containing folder. */
export function rawDirBase(ref: GithubBundleRef): string {
  const dir = ref.kind === "file" ? ref.path.split("/").slice(0, -1).join("/") : ref.path;
  const segs = [ref.owner, ref.repo, ref.ref, dir].filter(Boolean);
  return `${RAW_HOST}/${segs.join("/")}/`;
}

/** Raw URL of a single file ref (meaningful only when kind === "file"). */
export function rawFileUrl(ref: GithubBundleRef): string {
  const segs = [ref.owner, ref.repo, ref.ref, ref.path].filter(Boolean);
  return `${RAW_HOST}/${segs.join("/")}`;
}

export const MAX_BUNDLE_FILES = 100;

const NOT_FOUND = "Couldn't fetch. Make sure the repo is public and the URL points to an OKF bundle folder.";

/** Extract relative `.md` targets from a markdown body (the bundle index). Skips
 *  external (http/https) links, self-links to index.md, and anchors; strips a
 *  leading `./`; dedupes. */
export function extractMdLinks(indexMd: string): string[] {
  const re = /\]\(\s*([^)\s]+?\.md)(?:#[^)]*)?\s*\)/gi;
  const out = new Set<string>();
  for (let m = re.exec(indexMd); m; m = re.exec(indexMd)) {
    let p = m[1];
    if (/^https?:/i.test(p)) continue;
    p = p.replace(/^\.\//, "");
    if (p === "index.md") continue;
    out.add(p);
  }
  return [...out];
}

async function fetchText(url: string, signal?: AbortSignal): Promise<string> {
  let res: Response;
  try {
    res = await fetch(url, { signal });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new OkfFetchError("Couldn't reach GitHub. Check the link and try again.");
  }
  if (res.status === 404) {
    const err = new OkfFetchError(NOT_FOUND);
    err.status = 404;
    throw err;
  }
  if (!res.ok) throw new OkfFetchError(`GitHub returned ${res.status}. Try again.`);
  return res.text();
}

// Fallback for bundles without an index.md: list the folder via the Contents API
// (CORS-enabled). This path is subject to GitHub's 60 req/hour unauthenticated
// limit, so index.md remains the primary route.
async function listMdFilesViaApi(ref: GithubBundleRef, signal?: AbortSignal): Promise<string[]> {
  const api = `https://api.github.com/repos/${ref.owner}/${ref.repo}/contents/${ref.path}?ref=${encodeURIComponent(ref.ref)}`;
  let res: Response;
  try {
    res = await fetch(api, { signal, headers: { Accept: "application/vnd.github+json" } });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new OkfFetchError("Couldn't reach GitHub. Check the link and try again.");
  }
  if (res.status === 403) throw new OkfFetchError("GitHub rate limit hit — try again shortly, or use a bundle with an index.md.");
  if (!res.ok) throw new OkfFetchError(NOT_FOUND);
  const items = (await res.json()) as Array<{ name: string; type: string }>;
  return items
    .filter(i => i.type === "file" && i.name.toLowerCase().endsWith(".md") && i.name !== "index.md")
    .map(i => i.name);
}

/** Fetch a public OKF bundle from GitHub into a `Record<path, content>` map ready
 *  for `filesToGraph`. Single-file refs fetch just that file; folder refs fetch
 *  index.md, then its linked files in parallel (Contents-API fallback if there is
 *  no index.md). Throws `OkfFetchError` with a user-facing message on any failure. */
export async function fetchOkfBundleFromUrl(
  input: string,
  opts: { signal?: AbortSignal } = {},
): Promise<Record<string, string>> {
  const ref = parseGithubBundleUrl(input);
  const { signal } = opts;

  if (ref.kind === "file") {
    const content = await fetchText(rawFileUrl(ref), signal);
    return { [ref.path.split("/").pop() as string]: content };
  }

  const base = rawDirBase(ref);
  let index: string | null = null;
  try {
    index = await fetchText(base + "index.md", signal);
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    // Only a genuine 404 (no index.md) falls through to the Contents-API
    // fallback. Any other failure (transient 500/429, network error) is a real
    // error and must surface — silently falling back would hit GitHub's
    // 60/hour rate limit on a bundle that actually has an index.md.
    if ((e as OkfFetchError).status === 404) {
      index = null; // fall through to the API listing
    } else {
      throw e;
    }
  }

  const relPaths = index != null ? extractMdLinks(index) : await listMdFilesViaApi(ref, signal);

  if (index == null && relPaths.length === 0) throw new OkfFetchError(NOT_FOUND);
  if (relPaths.length + (index != null ? 1 : 0) > MAX_BUNDLE_FILES) {
    throw new OkfFetchError(`Bundle too large (max ${MAX_BUNDLE_FILES} files).`);
  }

  const files: Record<string, string> = {};
  if (index != null) files["index.md"] = index;
  const contents = await Promise.all(relPaths.map(p => fetchText(base + p, signal)));
  relPaths.forEach((p, i) => { files[p] = contents[i]; });
  return files;
}
