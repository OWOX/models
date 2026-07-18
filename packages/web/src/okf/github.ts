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
export class OkfFetchError extends Error {}

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
