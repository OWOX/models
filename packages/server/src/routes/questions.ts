import type { FastifyInstance } from "fastify";
import { generateQuestions, GeminiRateLimitError, type FocusJoin, type FocusMart, type GenerateInput } from "../llm/gemini";

type FocusField = FocusMart["fields"][number];

// The route is anonymous and every call is a paid Gemini prompt, so the input is
// bounded here. Oversized text is truncated and extra items are dropped rather
// than refused: a big model still gets its questions, Gemini just sees less of it.
export const QUESTIONS_LIMITS = {
  text: 300,            // niche, goal
  title: 200,
  martDescription: 1000,
  name: 100,            // field name, alias, join ends and keys
  type: 40,
  fieldDescription: 300,
  formula: 500,
  marts: 25,
  fieldsPerMart: 150,
  joins: 50,
  keysPerJoin: 10,
  promptBudget: 60_000, // characters of mart and field text across the whole prompt
};
const L = QUESTIONS_LIMITS;

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const cut = (v: unknown, max: number): string | undefined => (typeof v === "string" ? v.slice(0, max) : undefined);

function cleanField(f: unknown): FocusField | null {
  if (!isObj(f) || typeof f.name !== "string") return null;
  const out: FocusField = { name: f.name.slice(0, L.name), type: cut(f.type, L.type) ?? "STRING", pk: f.pk === true };
  const alias = cut(f.alias, L.name), description = cut(f.description, L.fieldDescription), formula = cut(f.formula, L.formula);
  if (alias) out.alias = alias;
  if (description) out.description = description;
  if (formula) out.formula = formula;
  return out;
}
// Text plus the prompt's per-field punctuation (":", " (PK)", " [calculated: ]", …).
const fieldSize = (f: FocusField) => 30 + f.name.length + f.type.length + (f.alias?.length ?? 0) + (f.description?.length ?? 0) + (f.formula?.length ?? 0);

export function sanitizeQuestionsInput(body: unknown): GenerateInput | null {
  if (!isObj(body) || !isObj(body.focus)) return null;
  const niche = cut(body.niche, L.text)?.trim(), goal = cut(body.goal, L.text)?.trim();
  if (!niche || !goal) return null;
  const { marts: rawMarts, joins: rawJoins } = body.focus;
  if (!Array.isArray(rawMarts) || !Array.isArray(rawJoins)) return null;
  // The selected mart first, so caps and the budget drop neighbours before it.
  const valid = rawMarts.filter((m): m is Record<string, unknown> => isObj(m) && typeof m.title === "string");
  const ordered = [...valid.filter(m => m.role === "selected"), ...valid.filter(m => m.role !== "selected")].slice(0, L.marts);
  if (!ordered.length) return null;
  let budget = L.promptBudget;
  const marts: FocusMart[] = ordered.map(m => {
    const mart: FocusMart = { title: (m.title as string).slice(0, L.title), role: m.role === "selected" ? "selected" : "neighbour", fields: [] };
    const description = cut(m.description, L.martDescription);
    // Past the budget a mart keeps only its title.
    if (description && budget > description.length) { mart.description = description; budget -= description.length; }
    budget -= mart.title.length;
    for (const raw of Array.isArray(m.fields) ? m.fields : []) {
      if (mart.fields.length >= L.fieldsPerMart || budget <= 0) break;
      const f = cleanField(raw);
      if (!f) continue;
      budget -= fieldSize(f);
      mart.fields.push(f);
    }
    return mart;
  });
  const joins: FocusJoin[] = [];
  for (const j of rawJoins) {
    if (joins.length >= L.joins) break;
    if (!isObj(j) || typeof j.from !== "string" || typeof j.to !== "string") continue;
    const on = (Array.isArray(j.on) ? j.on : [])
      .filter((k): k is Record<string, unknown> => isObj(k) && typeof k.left === "string" && typeof k.right === "string")
      .slice(0, L.keysPerJoin)
      .map(k => ({ left: (k.left as string).slice(0, L.name), right: (k.right as string).slice(0, L.name) }));
    joins.push({ from: j.from.slice(0, L.name), to: j.to.slice(0, L.name), on });
  }
  return { niche, goal, focus: { marts, joins } };
}

export async function questionsRoutes(app: FastifyInstance) {
  app.post(
    "/api/questions",
    {
      // Tighter than the global cap to protect the shared Gemini quota.
      config: {
        rateLimit: {
          max: Number(process.env.QUESTIONS_RATE_LIMIT_MAX) || 30,
          timeWindow: process.env.QUESTIONS_RATE_LIMIT_WINDOW || "1 minute",
        },
      },
    },
    async (req, reply) => {
      const input = sanitizeQuestionsInput(req.body);
      if (!input) return reply.code(400).send({ error: "niche, goal and a non-empty focus.marts are required" });
      try {
        const questions = await generateQuestions(input);
        return { questions };
      } catch (err) {
        // Quota / spend-cap exhaustion → 429 "ai_limit" so the client can show a
        // friendly "limit reached" message; everything else stays a 502 failure.
        if (err instanceof GeminiRateLimitError) return reply.code(429).send({ error: "ai_limit" });
        throw err;
      }
    },
  );
}
