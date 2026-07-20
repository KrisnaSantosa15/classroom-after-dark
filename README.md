# Classroom After Dark

> **Practice tomorrow’s lesson before a real learner loses confidence.**

Classroom After Dark is a private lesson-rehearsal studio for teachers. An educator selects fictional learning signals, tries an instructional move at a pivotal lesson moment, branches from the same moment to test another move, and carries the chosen supports into an editable **Teach Tomorrow** pack.

It is a teacher planning tool—not a learner profile, assessment system, prediction engine, or AI tutor.

## Why it exists

A lesson can look sound on paper and still meet a misconception, language barrier, or participation bottleneck in the first few minutes. Classroom After Dark gives the teacher a private place to rehearse that moment before class.

The hero lesson is a Grade 5 fractions discussion: one fictional signal treats a larger denominator as a larger amount; another needs the vocabulary and response route made visible. The teacher first tries a quick explanation, branches from the exact same moment, then tries fraction strips, pair talk, and a contrastive proof prompt. The difference is concrete, explained, and usable tomorrow morning.

## What works today

- Edit a lesson objective, grade band, and timing before rehearsal.
- Choose 3–5 editable **fictional learning signals**; add a custom, teaching-relevant signal with privacy safeguards.
- Run a deterministic rehearsal with suggested or teacher-authored instructional moves.
- See every state change through named, inspectable rules—never an opaque learner score.
- Persist the full lesson, signal deck, routes, comparison, reflection, and optional coach draft privately in the browser.
- Branch from the same teaching moment, compare Route A and Route B, then commit the preferred supports.
- Generate, preview, copy, and download an editable Markdown Teach Tomorrow pack.
- Optionally ask a GPT-5.6 Narrative Coach for short, teacher-editable language drafts. The core app is complete without an API key.

## Quick start

Prerequisites: Node.js 20 or newer.

```powershell
cd classroom-after-dark
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then choose **Rehearse the fractions lesson**.

### Golden path for a judge

1. Open the fractions fixture and review the objective.
2. Keep the four selected fictional signals, then start rehearsal.
3. Choose **Explain it again**.
4. Select **Branch from this moment**.
5. Choose **Show, pair, then prove**.
6. Compare both routes, commit Route B, and download the Teach Tomorrow pack.

The path requires no account, database, model key, or external classroom data.

## Optional GPT-5.6 Narrative Coach

Copy `.env.example` to `.env.local`, then add a standard OpenAI Platform key:

```dotenv
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6-terra
```

The integration uses the Responses API and strict JSON schema output. `gpt-5.6-terra` is the default because this is a concise, latency-sensitive wording task; set `OPENAI_MODEL=gpt-5.6` to use the flagship alias if desired. [Current model guidance](https://developers.openai.com/api/docs/guides/latest-model) recommends the GPT-5.6 family and the Responses API for these workflows.

The coach may draft one fictional evidence line, a teacher-move title, teacher wording, and a trade-off. It cannot:

- receive personal learner data, contact information, support plans, or diagnoses;
- calculate rehearsal metrics, time, state changes, or branch comparisons;
- predict, rank, diagnose, or label a real learner;
- make the teacher’s decision or silently alter the plan.

The server validates both the submitted rehearsal brief and returned model draft. If the key is absent or the request fails, the deterministic rehearsal keeps working unchanged.

## How the rehearsal stays explainable

The application separates language from consequences:

```text
Teacher move + declared supports
        ↓
Pure typed rule engine
        ↓
Objective evidence · participation access · representation access · language access · time
        ↓
Named rule trace + Teach Tomorrow pack
```

For example, **Show, pair, then prove** selects a representation, a low-pressure response route, a language support, and a reasoning check. The reducer applies `visual-contrast-for-part-whole-confusion` and `response-route-before-whole-class-share`; it does not infer a score from model prose.

## Privacy and product boundaries

- The first release is deliberately local-first: rehearsal data is stored in this browser’s local storage, and can be cleared with **Fresh room**.
- The app calls no external service unless the teacher explicitly configures the optional Narrative Coach.
- Signal cards are fictional, editable teaching conditions. The custom-signal form rejects common contact-information and diagnostic / support-plan terms.
- Classroom After Dark does not ingest student records, infer a diagnosis, make a behavioral prediction, or replace professional educator judgment.
- The simulation is a planning rehearsal, not a claim about what a real class will do.

## Architecture

```text
Next.js + React client studio
  ├─ local-first persisted workspace
  ├─ typed lesson / signal / move domain
  ├─ deterministic branchable rehearsal reducer
  ├─ Markdown Teach Tomorrow artifact generator
  └─ optional server-side GPT-5.6 Narrative Coach
       └─ minimized JSON brief → strict structured draft → teacher review
```

The local-first persistence keeps this hackathon release private, zero-setup, and testable on a clean machine. Its domain and storage boundary are intentionally small enough to add a hosted workspace adapter later without changing the simulation rules.

## Verification

```powershell
npm run typecheck
npm test
npm run build
npm run test:e2e
```

The test suite covers the deterministic move rules, teacher-authored support mapping, export content, and the complete browser journey from fixture to Teach Tomorrow pack.

## Built with Codex and GPT-5.6

Codex with GPT-5.6 was used to develop the product architecture, typed rehearsal engine, state tests, high-fidelity teaching-studio interface, safety boundary, model adapter, build verification, browser automation, and submission material.

Within the product, GPT-5.6 is intentionally constrained to the task where generative language is valuable: drafting brief, editable fictional evidence and teacher wording from a minimized lesson context. The teacher and deterministic rule engine remain in control of every instructional consequence.

## Demo narrative

“A teacher is preparing a Grade 5 fractions lesson. The plan is fine on paper, but a common misconception—larger denominator, larger amount—will appear in the first guided-practice turn. Classroom After Dark lets the teacher rehearse privately with fictional learning signals. A quick verbal explanation names the misconception but leaves evidence and participation narrow. From the exact same moment, the teacher branches, uses fraction strips plus paired pointing and proof, then sees the precise trade-off: two more minutes for a visible concept and a broader response route. The outcome is an editable plan to teach tomorrow—not a prediction about a child.”

## License

MIT
