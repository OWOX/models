import { randomUUID } from "node:crypto";
import { OwoxClient } from "../owox/client";
export interface Session { origin: string; token: string; keyId: string; projectTitle?: string; fullName?: string; }
const store = new Map<string, Session>();
export function createSession(s: Session): string { const id = randomUUID(); store.set(id, s); return id; }
export function getSession(id?: string): Session | undefined { return id ? store.get(id) : undefined; }
export function dropSession(id?: string) { if (id) store.delete(id); }
export function clientFor(s: Session) { return new OwoxClient(s.origin, s.token, s.keyId); }
