import { AUTH_EXPIRED_EVENT, clearApiKey, getApiKey } from "./apiKey";

// An OWOX access token lives 15 minutes; our server session holds it for up to
// 12 hours and never refreshes it. Modelling for half an hour and then pushing
// therefore failed every single call with 401 "Authentication failed", with no
// way back except a manual sign-out. The server now tags those 401s (and a
// missing session) with code "owox_auth"; here we act on the tag: re-connect
// with the key the user already gave us, then replay the request once.
//
// Single-flight: a push fires ~20 requests, and each one must not start its own
// token exchange (OWOX rate-limits /connect at 10/min, so it would lock the user
// out). The first 401 opens the exchange, the rest wait for that same promise.
let reconnecting: Promise<boolean> | null = null;

async function reconnect(): Promise<boolean> {
  const key = getApiKey();
  if (!key) return false;
  const res = await fetch("/api/auth/connect", {
    method: "POST", credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: key }),
  }).catch(() => null);
  // A key OWOX refuses (revoked, or the project is gone) is dead weight: drop it
  // so the next page load shows "connect" instead of retrying it forever. A
  // network blip (res === null) keeps the key — nothing says it is invalid.
  if (res && !res.ok) clearApiKey();
  return !!res?.ok;
}

function reconnectOnce(): Promise<boolean> {
  reconnecting ??= reconnect().finally(() => { reconnecting = null; });
  return reconnecting;
}

async function send(path: string, opts: RequestInit): Promise<Response> {
  return fetch(path, { credentials: "include", headers: { "Content-Type": "application/json", ...(opts.headers || {}) }, ...opts });
}

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  let res = await send(path, opts);
  if (res.status === 401 && !path.startsWith("/api/auth/")) {
    const body = await res.clone().json().catch(() => ({} as { code?: string }));
    if (body.code === "owox_auth") {
      if (await reconnectOnce()) res = await send(path, opts);
      // Replaying is safe: a request rejected at the auth guard never reached the
      // handler, so nothing was created on the first attempt.
      else window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `HTTP ${res.status}`) as Error & { status?: number };
    err.status = res.status; // callers can branch on this (e.g. 429 → AI limit)
    throw err;
  }
  return res.status === 204 ? (undefined as T) : await res.json();
}
