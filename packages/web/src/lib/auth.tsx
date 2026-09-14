import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import { AUTH_EXPIRED_EVENT, clearApiKey, getApiKey, setApiKey } from "./apiKey";
export interface Me { projectTitle?: string; fullName?: string; }
interface AuthCtx { me: Me | null; ready: boolean; connect: (key: string) => Promise<void>; signOut: () => Promise<void>; }
const Ctx = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);
  async function doConnect(key: string) { const m = await api<Me>("/api/auth/connect", { method: "POST", body: JSON.stringify({ apiKey: key }) }); setApiKey(key); setMe(m); }
  async function bootstrap() {
    try { setMe(await api<Me>("/api/me")); }
    catch { const k = getApiKey(); if (k) { try { await doConnect(k); return; } catch { clearApiKey(); } } setMe(null); }
    finally { setReady(true); }
  }
  useEffect(() => { void bootstrap(); }, []);
  // api() re-connects silently when the 15-minute OWOX token behind our session
  // expires; it only announces the failure it could NOT repair. Showing a
  // connected top bar after that means every action fails with no explanation,
  // so drop to the disconnected state and let the user paste the key again.
  useEffect(() => {
    const onExpired = () => setMe(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);
  const connect = async (key: string) => { await doConnect(key); setReady(true); };
  const signOut = async () => { await api("/api/auth/signout", { method: "POST" }).catch(() => {}); clearApiKey(); setMe(null); };
  return <Ctx.Provider value={{ me, ready, connect, signOut }}>{children}</Ctx.Provider>;
}
