export interface InsightQuestion {
  question: string;
  unlockedBy: string;
}

export interface FocusMart {
  title: string;
  description?: string;
  fields: { name: string; type: string; pk: boolean; alias?: string; description?: string }[];
  role: "selected" | "neighbour";
}

export interface FocusJoin {
  from: string;
  to: string;
  on: { left: string; right: string }[];
}

export interface QuestionFocus {
  marts: FocusMart[];
  joins: FocusJoin[];
}

export interface GenerateInput {
  niche: string;
  goal: string;
  focus: QuestionFocus;
}

export function buildPrompt(input: GenerateInput): string {
  const { niche, goal, focus } = input;
  const marts = focus.marts
    .map(m => {
      const fields = m.fields
        .map(f => {
          const label = f.alias && f.alias !== f.name ? ` "${f.alias}"` : "";
          const note = f.description ? ` — ${f.description}` : "";
          return `${f.name}:${f.type}${f.pk ? " (PK)" : ""}${label}${note}`;
        })
        .join("\n    ");
      return `- ${m.title}${m.role === "selected" ? " [SELECTED]" : ""}${m.description ? ` — ${m.description}` : ""}\n  fields:\n    ${fields || "(none)"}`;
    })
    .join("\n");
  const joins = focus.joins.length
    ? focus.joins.map(j => `- ${j.from} ⨝ ${j.to} on ${j.on.map(k => `${j.from}.${k.left} = ${j.to}.${k.right}`).join(", ")}`).join("\n")
    : "(none)";

  return [
    `You are a senior analytics consultant helping a data team show business stakeholders the value of data modelling.`,
    `Business niche: ${niche}`,
    `Primary business goal: ${goal}`,
    ``,
    `Data marts in focus (the SELECTED one is the centre of attention; others are joined neighbours):`,
    marts,
    ``,
    `Relationships (joins) between them:`,
    joins,
    ``,
    `Generate EXACTLY 5 NON-TRIVIAL business questions that this modelled data — especially the joins — makes answerable, in service of the goal above. Avoid trivial single-column lookups. Favour questions that only become possible BECAUSE these marts are joined.`,
    `For each question, "unlockedBy" must name the specific field(s) or join that makes it answerable (e.g. "Orders ⨝ Customers join").`,
    `Return ONLY a JSON array of exactly 5 objects: [{"question": string, "unlockedBy": string}].`,
  ].join("\n");
}

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

// Thrown when Gemini returns 429 (free-tier daily quota or the billing spend cap
// is exhausted). The route maps this to a 429 the client shows as a friendly
// "limit reached" message rather than a generic failure.
export class GeminiRateLimitError extends Error {
  readonly rateLimited = true;
  constructor() {
    super("Gemini rate limit or spend cap reached");
    this.name = "GeminiRateLimitError";
  }
}

export async function generateQuestions(input: GenerateInput): Promise<InsightQuestion[]> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

  const res = await fetch(`${ENDPOINT}/${model}:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(input) }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
    }),
  });
  if (res.status === 429) throw new GeminiRateLimitError();
  if (!res.ok) throw new Error(`Gemini request failed: ${res.status}`);

  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no content");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned malformed JSON");
  }
  if (!Array.isArray(parsed)) throw new Error("Gemini response was not an array");

  const questions = parsed
    .filter((q): q is InsightQuestion => !!q && typeof q.question === "string" && typeof q.unlockedBy === "string")
    .slice(0, 5)
    .map(q => ({ question: q.question, unlockedBy: q.unlockedBy }));
  if (questions.length === 0) throw new Error("Gemini response had no valid questions");
  return questions;
}
