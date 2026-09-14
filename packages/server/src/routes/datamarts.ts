import type { FastifyInstance } from "fastify";
import { getSession, clientFor } from "../auth/session";
import { buildImportPayload } from "../owox/import";
// owox_auth: the same tag the error handler puts on an expired OWOX token, so
// the browser has one condition to react to — re-connect with the stored key and
// retry — whether it was our session or the OWOX token that went away.
function need(req: any, reply: any) { const s = getSession(req.cookies.mc_sid); if (!s) { reply.code(401).send({ error: "Not connected", code: "owox_auth" }); return null; } return s; }
export async function dataMartRoutes(app: FastifyInstance) {
  app.get("/api/data-marts", async (req, reply) => { const s = need(req, reply); if (!s) return; return clientFor(s).listDataMarts(); });
  app.post("/api/data-marts", async (req, reply) => { const s = need(req, reply); if (!s) return; return clientFor(s).createDataMart(req.body as any); });
  app.put<{ Params: { id: string; field: string } }>("/api/data-marts/:id/:field", async (req, reply) => {
    const s = need(req, reply); if (!s) return; const c = clientFor(s); const { id, field } = req.params; const b = req.body as any;
    if (field === "title") return c.updateTitle(id, b.title);
    if (field === "description") return c.updateDescription(id, b.description);
    if (field === "schema") return c.updateSchema(id, b);
    if (field === "definition") return c.updateDefinition(id, b);
    return reply.code(404).send({ error: "unknown field" });
  });
  app.post<{ Params: { id: string } }>("/api/data-marts/:id/relationships", async (req, reply) => { const s = need(req, reply); if (!s) return; return clientFor(s).createRelationship(req.params.id, req.body as any); });
  app.delete<{ Params: { id: string } }>("/api/data-marts/:id", async (req, reply) => { const s = need(req, reply); if (!s) return; return clientFor(s).deleteDataMart(req.params.id); });
  app.get<{ Querystring: { storageId?: string } }>("/api/owox-import", async (req, reply) => {
    const s = need(req, reply); if (!s) return;
    const storageId = req.query.storageId;
    if (!storageId) return reply.code(400).send({ error: "storageId is required" });
    try {
      return await buildImportPayload(clientFor(s), storageId);
    } catch (e) {
      // Unknown storage id (or an OWOX read failure) → 404 with the message.
      return reply.code(404).send({ error: (e as Error).message });
    }
  });
}
