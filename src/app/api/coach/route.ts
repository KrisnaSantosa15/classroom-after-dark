import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const inputSchema = z.object({
  lesson: z.object({
    title: z.string().trim().min(1).max(160),
    objective: z.string().trim().min(1).max(900),
    phase: z.string().trim().min(1).max(140),
  }),
  signals: z.array(z.object({
    id: z.string().trim().min(1).max(100),
    title: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(360),
    cue: z.string().trim().min(1).max(360),
  })).min(1).max(5),
  currentMove: z.string().trim().min(1).max(140),
});

const outputSchema = z.object({
  evidence: z.string().trim().min(1).max(260),
  moveTitle: z.string().trim().min(1).max(80),
  teacherWords: z.string().trim().min(1).max(340),
  tradeoff: z.string().trim().min(1).max(220),
});

const unsafePattern = /\b(adhd|autism|autistic|dyslexia|diagnos(?:is|ed|tic)?|iep|504 plan)\b|\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|\b(?:\+?\d[\d\s().-]{7,}\d)\b/i;

function hasUnsafeContent(value: unknown): boolean {
  return unsafePattern.test(JSON.stringify(value));
}

function outputTextFromResponse(response: Record<string, unknown>) {
  if (typeof response.output_text === "string") return response.output_text;
  const output = Array.isArray(response.output) ? response.output : [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = Array.isArray((item as { content?: unknown }).content) ? (item as { content: unknown[] }).content : [];
    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const candidate = part as { text?: unknown; type?: unknown };
      if ((candidate.type === "output_text" || candidate.type === "text") && typeof candidate.text === "string") return candidate.text;
    }
  }
  return "";
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Narrative Coach is optional and is not configured. Add OPENAI_API_KEY to .env.local; the deterministic rehearsal is already fully available." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON rehearsal brief." }, { status: 400 });
  }

  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "The rehearsal brief is incomplete or too long." }, { status: 400 });
  if (hasUnsafeContent(parsed.data)) {
    return NextResponse.json({ error: "Narrative Coach accepts fictional teaching conditions only. Remove personal, diagnostic, or contact information." }, { status: 400 });
  }

  const system = `You are Narrative Coach in Classroom After Dark, a private lesson rehearsal tool. Draft language only; never score learners, predict real children, diagnose, rank, or make a teaching decision. Every learner condition is fictional. Return concise, strengths-based language that a teacher can edit. Do not use names. Do not claim an outcome as fact. Return ONLY JSON matching the requested schema.`;
  const prompt = `Create one optional narrative draft for this teacher rehearsal.\n\nLesson: ${parsed.data.lesson.title}\nObjective: ${parsed.data.lesson.objective}\nPhase: ${parsed.data.lesson.phase}\nCurrent move: ${parsed.data.currentMove}\nFictional signals: ${parsed.data.signals.map((signal) => `${signal.id}: ${signal.title}. ${signal.description} Cue: ${signal.cue}`).join("\n")}\n\nOutput rules:\n- evidence: one possible fictional classroom signal, 35 words maximum\n- moveTitle: short teacher-facing title, 7 words maximum\n- teacherWords: a warm, concrete teacher prompt, 45 words maximum\n- tradeoff: a grounded caveat about time or evidence, 30 words maximum\n- No student names, diagnoses, numeric scores, predictions, or claims of effectiveness.`;

  const model = process.env.OPENAI_MODEL || "gpt-5.6-terra";
  let upstream: Response;
  try {
    upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        reasoning: { effort: "low" },
        input: [
          { role: "system", content: [{ type: "input_text", text: system }] },
          { role: "user", content: [{ type: "input_text", text: prompt }] },
        ],
        text: {
          verbosity: "low",
          format: {
            type: "json_schema",
            name: "narrative_coach_draft",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["evidence", "moveTitle", "teacherWords", "tradeoff"],
              properties: {
                evidence: { type: "string" },
                moveTitle: { type: "string" },
                teacherWords: { type: "string" },
                tradeoff: { type: "string" },
              },
            },
          },
        },
      }),
    });
  } catch {
    return NextResponse.json({ error: "Narrative Coach could not reach the model service. Your local rehearsal is unchanged." }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json({ error: "Narrative Coach could not create a draft. Your local rehearsal is unchanged." }, { status: 502 });
  }

  let raw: Record<string, unknown>;
  try {
    raw = await upstream.json() as Record<string, unknown>;
    const output = JSON.parse(outputTextFromResponse(raw));
    const checked = outputSchema.safeParse(output);
    if (!checked.success || hasUnsafeContent(checked.data)) throw new Error("Unsafe or invalid coach output");
    return NextResponse.json(checked.data);
  } catch {
    return NextResponse.json({ error: "Narrative Coach returned an unusable draft. Your local rehearsal is unchanged." }, { status: 502 });
  }
}
