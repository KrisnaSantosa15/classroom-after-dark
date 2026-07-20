import { NextResponse } from "next/server";
import { z } from "zod";
import { createLocalCouncil } from "@/lib/council";

export const runtime = "nodejs";

const lensId = z.enum(["evidence", "access", "momentum"]);

const inputSchema = z.object({
  topic: z.string().trim().min(12).max(1600),
});

const outputSchema = z.object({
  topicTitle: z.string().trim().min(1).max(90),
  roomQuestion: z.string().trim().min(1).max(240),
  lenses: z.array(z.object({
    id: lensId,
    label: z.string().trim().min(1).max(32),
    question: z.string().trim().min(1).max(100),
    perspective: z.string().trim().min(1).max(260),
    move: z.string().trim().min(1).max(180),
    watchout: z.string().trim().min(1).max(150),
  })).length(3).refine((lenses) => new Set(lenses.map((lens) => lens.id)).size === 3),
  debate: z.array(z.object({
    from: lensId,
    to: lensId,
    point: z.string().trim().min(1).max(220),
  })).length(2),
  recommendation: z.object({
    title: z.string().trim().min(1).max(90),
    action: z.string().trim().min(1).max(520),
    teacherWords: z.string().trim().min(1).max(260),
    evidenceToNotice: z.string().trim().min(1).max(260),
    minutes: z.number().int().min(3).max(15),
  }),
});

const unsafePattern = /\b(adhd|autism|autistic|dyslexia|diagnos(?:is|ed|tic)?|iep|504 plan)\b|\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|\b(?:\+?\d[\d\s().-]{7,}\d)\b/i;

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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON teaching topic." }, { status: 400 });
  }

  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Add a little more detail to the teaching topic (12–1,600 characters)." }, { status: 400 });
  if (unsafePattern.test(parsed.data.topic)) {
    return NextResponse.json({ error: "Please remove names, contact details, diagnostic labels, or plan references before convening the council." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ ...createLocalCouncil(parsed.data.topic), source: "local" });

  const system = `You are the Teaching Council for a teacher-planning product. Generate three concise, productive lenses about a teacher-provided topic: Evidence, Access, and Momentum. These are planning roles, not named people and not separate model identities. Work only from the teacher's topic. Do not invent learner facts, diagnoses, scores, or outcomes. Avoid jargon and generic advice. Make one practical 3–15 minute recommendation for tomorrow. Return only valid JSON matching the supplied schema.`;
  const prompt = `Teacher topic:\n${parsed.data.topic}\n\nWrite as a constructive roundtable. The council should create useful tension, then converge. The recommendation must be immediately usable, specific, and safe to adapt. Do not claim it will work; frame it as a move to try.`;

  let upstream: Response;
  try {
    upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6-terra",
        reasoning: { effort: "low" },
        input: [
          { role: "system", content: [{ type: "input_text", text: system }] },
          { role: "user", content: [{ type: "input_text", text: prompt }] },
        ],
        text: {
          verbosity: "low",
          format: {
            type: "json_schema",
            name: "teaching_council",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["topicTitle", "roomQuestion", "lenses", "debate", "recommendation"],
              properties: {
                topicTitle: { type: "string" },
                roomQuestion: { type: "string" },
                lenses: {
                  type: "array",
                  minItems: 3,
                  maxItems: 3,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["id", "label", "question", "perspective", "move", "watchout"],
                    properties: {
                      id: { type: "string", enum: ["evidence", "access", "momentum"] },
                      label: { type: "string" }, question: { type: "string" }, perspective: { type: "string" }, move: { type: "string" }, watchout: { type: "string" },
                    },
                  },
                },
                debate: {
                  type: "array",
                  minItems: 2,
                  maxItems: 2,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["from", "to", "point"],
                    properties: { from: { type: "string", enum: ["evidence", "access", "momentum"] }, to: { type: "string", enum: ["evidence", "access", "momentum"] }, point: { type: "string" } },
                  },
                },
                recommendation: {
                  type: "object",
                  additionalProperties: false,
                  required: ["title", "action", "teacherWords", "evidenceToNotice", "minutes"],
                  properties: { title: { type: "string" }, action: { type: "string" }, teacherWords: { type: "string" }, evidenceToNotice: { type: "string" }, minutes: { type: "integer" } },
                },
              },
            },
          },
        },
      }),
    });
  } catch {
    return NextResponse.json({ error: "The council could not reach the model service." }, { status: 502 });
  }

  if (!upstream.ok) return NextResponse.json({ error: "The council could not create a response right now." }, { status: 502 });

  try {
    const raw = await upstream.json() as Record<string, unknown>;
    const checked = outputSchema.safeParse(JSON.parse(outputTextFromResponse(raw)));
    if (!checked.success || unsafePattern.test(JSON.stringify(checked.data))) throw new Error("Invalid council response");
    return NextResponse.json(checked.data);
  } catch {
    return NextResponse.json({ error: "The council returned an unusable response." }, { status: 502 });
  }
}
