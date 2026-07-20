# Classroom After Dark

> **One teaching knot. Three perspectives. One clear next move.**

Classroom After Dark is a focused planning room for teachers. Bring the lesson moment that is not landing, convene an **Evidence**, **Access**, and **Momentum** lens, and leave with a concrete 3–15 minute opener to try tomorrow.

It is deliberately not a learner-profile system, prediction engine, or generic chat dashboard. There are no fictional students, no scores, and no maze of settings—just a useful conversation about the teaching decision in front of you.

## Try it

Prerequisite: Node.js 20 or newer.

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Type a real, de-identified teaching topic and select **Convene the council**. The product works immediately with local planning lenses; no account, database, or API key is required.

### Judge path

1. Open the app and enter a lesson moment, such as: `Grade 8 learners can calculate slope but struggle to explain what the sign means on a graph.`
2. Select **Convene the council**.
3. Read the three short perspectives, then open **Hear the debate** to see the useful tension between them.
4. Copy **Tomorrow's first move** and adapt it for class.

## What it does

- Transforms one open-ended teaching dilemma into three complementary perspectives.
- Makes disagreement productive: Evidence, Access, and Momentum challenge the plan before converging.
- Delivers one action card with a time-box, teacher language, and evidence to notice.
- Keeps the interaction one-click and low cognitive-load.
- Saves the last council locally in the browser, so teachers can come back to it.
- Rejects names, contact details, diagnostic labels, and plan references before any model request.

## GPT-5.6: tailored councils with a safe fallback

The local council is a complete, deterministic planning experience. When an OpenAI key is configured, the server replaces it with a tailored GPT-5.6 council using the teacher's de-identified topic.

```dotenv
# .env.local
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6-terra
```

The `/api/council` route uses the Responses API and strict JSON Schema output. It validates the topic before sending it, validates the returned Evidence/Access/Momentum cards, debate, and recommendation before displaying them, and falls back cleanly when a key is absent. The model is asked for a move to try—not a promise, learner judgment, diagnosis, or prediction.

## Built with Codex and GPT-5.6

Codex with GPT-5.6 was used to reshape the project from an overlong fictional rehearsal into a production-focused Teaching Council: the interaction model, typed contract, local fallback, structured model route, accessible interface, automated checks, and narrated product showcase.

Inside the product, GPT-5.6 creates concise, structured perspectives from the teacher's own topic. The application keeps control of privacy checks, response validation, display, and the immediately usable action-card format.

## Stack

Next.js · React · TypeScript · Zod · OpenAI Responses API · GPT-5.6 · Playwright · Remotion

## Verification

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## License

MIT
