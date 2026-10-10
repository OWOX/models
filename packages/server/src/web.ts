import type { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import { join } from "node:path";

export function registerWebApp(app: FastifyInstance, root: string) {
  // Everything at the root (index.html, robots.txt, sitemap.xml, the .md guides)
  // keeps the default max-age=0 so a deploy shows up on the next load.
  app.register(fastifyStatic, { root });
  // Vite emits content-hashed files under /assets, so a changed file always gets
  // a new URL and the old one can be cached for a year.
  app.register(fastifyStatic, {
    root: join(root, "assets"),
    prefix: "/assets/",
    decorateReply: false,
    maxAge: "1y",
    immutable: true,
  });

  // The app lives at / only (state travels in ?template=, ?okf=, ?ossie= and the
  // #share hash), so any other path is a real 404. Answering 200 with the shell
  // made every typo a soft 404 for search engines. Humans still get the app.
  app.setNotFoundHandler((req, reply) => {
    if (req.url.startsWith("/api/")) return reply.code(404).send({ error: "not_found" });
    return reply.code(404).sendFile("index.html");
  });
}
