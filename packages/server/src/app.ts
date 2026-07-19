import Fastify from "fastify";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { authRoutes } from "./routes/auth";
import { dataMartRoutes } from "./routes/datamarts";
import { metaRoutes } from "./routes/meta";
import { questionsRoutes } from "./routes/questions";

export function buildApp() {
  // trustProxy: Render terminates TLS and forwards via its load balancer, so
  // req.ip must be derived from X-Forwarded-For. Without this every client
  // looks like the proxy IP and the per-IP rate limiter throttles everyone
  // together.
  const app = Fastify({ logger: false, trustProxy: true });
  app.register(cookie);

  // Security headers. script-src stays 'self' plus the PostHog managed proxy
  // (mrph.owox.com) — that proxy serves both the recorder/array bundles
  // (upstream asset_host is null) and the ingestion endpoint, so it must be in
  // script-src and connect-src. 'self' remains the main XSS guard for the OWOX
  // key kept in localStorage; the Vite build itself has no inline scripts.
  // style-src needs 'unsafe-inline' because @xyflow/react positions nodes via
  // inline style attributes; without it the canvas breaks. worker-src allows
  // blob: because PostHog session replay runs its recorder in a web worker.
  const POSTHOG_PROXY = "https://mrph.owox.com";

  // Supabase ("sign up to save"): the browser talks to ONE project's Auth + REST
  // API directly. Pin connect-src to that exact project origin — deliberately NOT
  // a `*.supabase.co` wildcard — so an injected script can't exfiltrate the OWOX
  // key / Supabase session to an attacker-controlled Supabase project. Read from
  // the same env that configures the web build; unset → omitted (feature off, so
  // the CSP stays as tight as possible). wss covers the (currently unused)
  // realtime channel on that same origin.
  const supabaseOrigin = (() => {
    try { return new URL(process.env.VITE_SUPABASE_URL ?? "").origin; } catch { return null; }
  })();
  const supabaseConnect = supabaseOrigin
    ? [supabaseOrigin, supabaseOrigin.replace(/^https:/, "wss:")]
    : [];

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        scriptSrc: ["'self'", POSTHOG_PROXY],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        fontSrc: ["'self'", "data:"],
        // raw.githubusercontent.com: client-side OKF-bundle import fetches the
        // markdown files directly; api.github.com: fallback folder listing when a
        // bundle has no index.md. Both are static/public read endpoints — no SSRF
        // surface (the fetch is client-side to fixed hosts).
        connectSrc: [
          "'self'",
          POSTHOG_PROXY,
          ...supabaseConnect,
          "https://raw.githubusercontent.com",
          "https://api.github.com",
        ],
        workerSrc: ["'self'", "blob:"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
      },
    },
    // We load no cross-origin embedded resources; COEP only risks breakage.
    crossOriginEmbedderPolicy: false,
  });

  // Per-IP rate limiting. The global cap guards against single-source floods on
  // the 0.5-CPU instance; /api/auth/connect (the only endpoint that triggers an
  // outbound OWOX token exchange) is capped much tighter in routes/auth.ts.
  app.register(rateLimit, {
    global: true,
    max: Number(process.env.RATE_LIMIT_MAX) || 1000,
    timeWindow: process.env.RATE_LIMIT_WINDOW || "1 minute",
  });

  app.register(authRoutes);
  app.register(dataMartRoutes);
  app.register(metaRoutes);
  app.register(questionsRoutes);
  // Surface the real upstream error (OwoxClient throws with the OWOX status +
  // body) instead of Fastify's generic "Internal Server Error". Preserve any
  // explicit statusCode (e.g. the rate limiter's 429); default to 502 for
  // upstream OWOX failures, which carry no statusCode.
  app.setErrorHandler((err: Error & { statusCode?: number }, _req, reply) => {
    const code = err.statusCode && err.statusCode >= 400 ? err.statusCode : 502;
    reply.code(code).send({ error: err.message || "Upstream error" });
  });
  return app;
}
