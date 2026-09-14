// The OWOX API key the user pasted. Kept in one place because two modules need
// it: AuthProvider (connect / sign out) and api() (silent re-connect when the
// 15-minute OWOX access token behind our session expires).
export const API_KEY_STORAGE_KEY = "owox_api_key";

export function getApiKey(): string | null {
  try { return localStorage.getItem(API_KEY_STORAGE_KEY); } catch { return null; } // private mode
}
export function setApiKey(key: string) {
  try { localStorage.setItem(API_KEY_STORAGE_KEY, key); } catch { /* private mode */ }
}
export function clearApiKey() {
  try { localStorage.removeItem(API_KEY_STORAGE_KEY); } catch { /* private mode */ }
}

/** Fired when the session is gone and re-connecting could not bring it back —
 *  AuthProvider listens and drops back to the disconnected state. */
export const AUTH_EXPIRED_EVENT = "mc:auth-expired";
