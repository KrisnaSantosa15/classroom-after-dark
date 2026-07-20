# Classroom After Dark — winning build blueprint

> **Education track.** Build one beautiful, useful answer to a teacher's urgent question: *"What could go wrong in tomorrow's lesson—and what can I change before it happens?"*

## 1. Decision: what we are building

### Product in one sentence

**Classroom After Dark is a teacher-owned lesson flight simulator that lets an educator rehearse one high-stakes teaching moment with a fictional, transparent class, compare two teaching moves, and leave with a ready-to-teach plan for tomorrow.**

### The emotional hook

Teachers often discover a misconception, access barrier, or silence problem in front of a real class, when there is little time to recover. This product moves that moment into a private evening rehearsal: the teacher can pause, try a different move, see the trade-off, and walk into class prepared.

The product is deliberately **not** a learner predictor, an assessment system, or an AI tutor. It rehearses a lesson against editable *fictional learning signals* and makes its assumptions visible.

### The winning wedge

Do not build an LMS, generic lesson-plan generator, analytics dashboard, or free-form chatbot. Those are common, hard to judge, and easy to dismiss as a demo.

Build this complete loop exceptionally well:

```text
Paste lesson → review its structure → select a fictional signal deck
→ rehearse one pivotal moment → branch at the decision
→ compare evidence and trade-offs → create a "Teach Tomorrow" pack
```

The result should feel like a flight simulator for teaching—not a chat interface wearing a classroom costume.

## 2. Why this is the stronger submission

### Branchline lesson

Branchline demonstrates serious engineering: real inputs, transparent deterministic rules, persistence, branching, exports, test fixtures, and a strong governance posture. Its weakness is not quality; it is judge immediacy. A technical release rehearsal asks a judge to understand a niche workflow before the emotional payoff appears.

Classroom After Dark should retain Branchline's best pattern while improving the human story:

| Keep from Branchline | Transform for Classroom After Dark |
| --- | --- |
| Real user-created state | A teacher's lesson, revisions, choices, and notes genuinely persist. |
| Deterministic engine | A visible pedagogical rule engine changes rehearsal state; no hidden AI scoring. |
| Branch and compare | Replay the exact classroom moment with a different instructional move. |
| Evidence rail | Every change says which lesson objective, fictional signal, and rule informed it. |
| Exportable artifact | Produce a useful, editable lesson revision—not a generic AI summary. |
| Fixture-backed demo | A polished fractions lesson works on a clean install with no account or model key. |

### Why it can win the Education track

- **Technological implementation:** it is a real stateful product, not a single prompt. It has a typed simulation engine, persisted branches, server validation, exports, tests, and a bounded model adapter.
- **Design:** the core experience is cinematic and legible in seconds: a teacher sees a lesson moment, a small set of learning signals, a decision, an explained consequence, then a stronger alternative.
- **Impact:** it targets a daily, specific teacher job—anticipating a barrier before teaching—without making inflated claims about children or school data.
- **Originality:** planning tools generate a lesson; classroom-management products react after the fact. This rehearses a teaching decision before class and turns it into a practical facilitation pack.

## 3. Product principles

1. **Teacher agency first.** Teachers edit every lesson fact, signal, choice, and exported recommendation.
2. **Fiction, not profiling.** The system never requests a real student name, record, diagnosis, demographic attribute, or predicted behaviour.
3. **Evidence over theatre.** Every state change has a human-readable rule trace. A compelling visual must never hide an unexplained score.
4. **One lesson, one moment, one improvement.** A clean end-to-end outcome beats a broad but incomplete platform.
5. **Use AI where language helps; use code where consequences matter.** GPT-5.6 may draft concise, lesson-specific evidence and move language. Typed rules alone calculate the rehearsal state.
6. **Graceful without a key.** The whole core workflow works with deterministic fixture content. An optional OpenAI key enriches language, not correctness.
7. **Useful tomorrow morning.** The final artifact must contain exact teacher-selected changes: wording, representations, participation options, timing, and a check for understanding.

## 4. The audience and the demo promise

### Primary audience

A time-constrained K–12 teacher preparing a new or difficult lesson. The first release is curriculum-neutral, works best for upper elementary / middle-school conceptual lessons, and makes no claim to replace curriculum, learning support, or professional judgment.

### Hero fixture: Grade 5 fractions

The default guided demo is intentionally concrete and universally understandable.

**Lesson objective:** Compare unit fractions using visual representations and explain why a larger denominator can mean a smaller part.

**The pivotal moment:** During guided practice, one fictional signal interprets a larger denominator as a larger quantity, while another cannot access the word-problem vocabulary. A verbal explanation may appear efficient, but it leaves participation narrow and evidence weak.

**The better branch:** The teacher introduces fraction strips, invites silent point / pair talk before whole-class talk, and asks a contrastive check: “Which is larger: one third or one eighth? Show the strip that proves it.”

**The payoff:** The final export is an altered lesson—not a score screen—with the visual, prompt, response route, timing adjustment, anticipated signal, and exit check.

This is the complete three-minute story. Other fixtures can demonstrate discussion and procedural practice, but must not dilute the main demo.

## 5. Complete teacher journey

### Screen 1 — The Studio / home

The landing experience should look like a calm after-hours teaching studio, not a SaaS dashboard.

- Primary action: **Rehearse tomorrow's lesson**.
- Secondary action: **Open the fractions guided tour**.
- Show recent workspaces with a small “last rehearsal” state and access to its Teach Tomorrow pack.
- A concise promise and a visible boundary: “Fictional learning signals. No student data.”

### Screen 2 — Lesson desk

The teacher pastes lesson text or starts with the provided fixture. For the critical path, a paste-and-review flow is mandatory; file upload is an enhancement only if it is solid.

Required fields:

- title, subject / grade band, duration;
- one or more learning objectives;
- lesson phases with time allocations;
- teacher's pivotal moment (default: guided practice);
- materials / representations already available.

The app produces a structured lesson draft, but it remains visibly editable. A lesson cannot proceed until the time total and at least one objective are valid.

### Screen 3 — Signal deck

The teacher selects 3–5 **fictional learning signals**. These are conditions that a lesson may need to accommodate, never descriptions of real children.

Built-in signals for the launch fixture:

| Signal | What it rehearses | Product-safe wording |
| --- | --- | --- |
| Denominator trap | Treating a larger denominator as a larger amount | “May compare the digits rather than the represented parts.” |
| Vocabulary fog | A contextual word obscures the math | “Needs the task language made visible before reasoning can show.” |
| Quiet evidence | Understanding may be missed in whole-class talk | “Needs a low-pressure way to show a first idea.” |
| Fast-but-fragile answer | A quick answer lacks a representation or justification | “Benefits from being asked to prove an answer in another form.” |
| Ready for extension | The main task is secure quickly | “Needs a connected ‘why’ or generalization question.” |

The screen must state: “These are editable rehearsal conditions, not students.” An explicit privacy gate rejects names, email addresses, phone numbers, IDs, and diagnostic labels in custom cards.

### Screen 4 — Rehearsal stage

This is the product's signature experience.

**Layout**

- Header: lesson title, current phase, compact clock, “Fictional rehearsal” badge.
- Center stage: the immediate teacher prompt, a simple representation area (for the fixture, fraction strips), and the current learning evidence.
- Left rail: three or four signal cards that have surfaced; their language changes only through the known state.
- Right rail: three concise suggested moves plus **Write my move**. A move is expressed as an instructional intention, not a magic intervention.
- Bottom rail: four readable state indicators and a causal event timeline.

**State indicators**

- Objective evidence — is there enough evidence that learners can use the objective?
- Participation access — do more than the quickest voices have a response route?
- Representation access — can the concept be seen, heard, or manipulated in more than one way?
- Time / next action — how much lesson time remains and what needs protecting?

The interface must use labels and patterns in addition to colour. It must respect reduced motion.

**Move choices for the fixture**

1. **Explain it again** — a brief verbal correction; fast, but limited evidence and narrow participation.
2. **Ask for reasoning first** — opens thinking, but without a representation it can leave the core misconception unresolved.
3. **Show, pair, then prove** — use fraction strips, pair response, then a contrastive proof prompt; costs time, but improves access and evidence.

The teacher can author a move by choosing its supports (representation, language scaffold, response route, check) and writing the wording. The engine maps those visible supports to rules; typed free text never causes mysterious state changes.

### Screen 5 — Pause and branch

After the first move, the interface shows a short “what the rehearsal surfaced” card and offers **Branch from this moment**.

The branch stores an exact snapshot: lesson revision, signal deck, phase, prior events, and current state. The teacher tries another move from the same point. This must be a genuine persisted branch, not a visual toggle.

### Screen 6 — Compare and commit

Use a side-by-side “then / instead” view with three findings, not a dense dashboard:

- Which learning signal gained a response route;
- What evidence the teacher would now collect;
- What trade-off changed (usually time, materials, or extension pacing).

The teacher selects the preferred branch and explicitly chooses which changes to commit to the lesson. A comparison must never declare a universal “winner”; it says “stronger for the goals you selected.”

### Screen 7 — Teach Tomorrow pack

The export screen is the proof that this is usable software.

It includes editable sections populated from selected state, not canned filler:

1. Revised phase plan with minutes and materials;
2. Anticipated learning signals: likely evidence, teacher prompt, representation, and check;
3. Participation plan: response routes and wait / pair structure;
4. Accessibility / language supports selected by the teacher;
5. Exit check and a “what to notice” line;
6. Teacher's own reflection and branch rationale.

Support copy-to-clipboard, browser print, and deterministic Markdown download. HTML print styling is enough for the deadline; a PDF generator is optional only if visually verified.

## 6. The deterministic rehearsal engine

### State contract

Use a small, inspectable state model. Avoid a single fake “student score.”

```ts
type RehearsalState = {
  phaseId: string;
  elapsedMinutes: number;
  objectiveEvidence: Record<string, 0 | 1 | 2 | 3 | 4>;
  participationAccess: 0 | 1 | 2 | 3 | 4;
  representationAccess: 0 | 1 | 2 | 3 | 4;
  languageAccess: 0 | 1 | 2 | 3 | 4;
  surfacedSignalIds: string[];
  evidenceLedger: EvidenceItem[];
};

type TeachingMove = {
  id: string;
  text: string;
  supports: Array<"representation" | "language" | "response-route" | "reasoning-check" | "extension">;
  targetSignalIds: string[];
  timeCostMinutes: number;
  teacherSelected: boolean;
};
```

### Rule design

Rules are typed data and pure reducer functions. Every reducer result appends an explanation with a stable rule ID.

Example rules:

- `visual-contrast-for-part-whole-confusion`: a representation plus contrastive reasoning check increases the target objective-evidence level and representation access.
- `response-route-before-whole-class-share`: a pair, point, write, or hold-up route increases participation access and adds evidence from quiet thinking.
- `verbal-correction-without-check`: may clarify language but cannot increase objective evidence beyond a modest level because no learner evidence is collected.
- `language-scaffold-before-contextual-task`: improves language access when a lesson vocabulary term is explicitly made visible or paraphrased.
- `extension-after-core-evidence`: applies extension only after core objective evidence has reached an agreed threshold.

The rule inspector shows: **“Why this changed: You selected a visual representation and a contrastive check; rule `visual-contrast-for-part-whole-confusion` applies to the denominator signal in this phase.”**

### Rehearsal evidence

Each event contains a concise fictional evidence utterance, such as “I chose one eighth because 8 is bigger than 3,” plus a tag indicating its source:

- fixture (deterministic);
- teacher-authored;
- GPT-5.6 language draft, reviewed by the teacher.

The engine changes state from the move's declared supports and the known lesson / signal conditions—not from the prose.

### Branch invariant

Given the same lesson revision, signal deck snapshot, state snapshot, and move, the engine must produce the same next state and rule trace. Tests should enforce this invariant.

## 7. GPT-5.6 integration that is meaningful and safe

### What the model does

When a teacher enables the optional **Narrative Coach**, GPT-5.6 receives a minimized, structured rehearsal brief and may draft:

- up to three concise fictional evidence statements for the active signal cards;
- up to three teacher-move wordings that honour the selected objective and supports;
- a plain-language explanation of the trade-off the rules already calculated;
- alternative phrasing for the Teach Tomorrow pack.

The model's work is visible, editable, and clearly marked as a draft. The teacher can decline it.

### What the model never does

- receives real student data or predicts a real learner;
- assigns scores, metrics, time changes, or rule effects;
- creates a diagnosis, ability label, ranking, or behavioural claim;
- silently writes a lesson revision;
- decides which branch is best.

### Contract and fallback

`POST /api/coach/variations` accepts a validated `RehearsalBrief`, strips prohibited content, and returns a schema-validated `NarrativeCoachResult`. The response is rejected if it references a real person, diagnostic label, unsupported claim, or an unknown signal ID.

The project must run without `OPENAI_API_KEY`: fixture narrative cards and deterministic suggested moves provide the same complete teacher workflow. With `OPENAI_API_KEY` and `OPENAI_MODEL` configured, the app calls the model adapter. Confirm the exact model identifier and API response shape from current official documentation during implementation; do not hard-code unverified API assumptions.

### Hackathon proof

In the README and demo, explain two distinct uses:

1. **Codex + GPT-5.6 built the project:** product architecture, state contracts, tests, visual iteration, accessibility audit, and demo preparation were developed in the primary Codex thread.
2. **GPT-5.6 supports the product:** it drafts bounded rehearsal language where teacher-specific wording helps, while the deterministic engine owns outcomes.

This is thoughtful use, not decorative “AI added here” copy.

## 8. Architecture that is fast to build and real to run

### Application shape

```text
Next.js / React application
  ├─ Responsive teacher studio (server-rendered shell + client rehearsal UI)
  ├─ API routes with Zod validation
  ├─ SQLite-backed workspace repository
  ├─ Pure deterministic simulation domain
  ├─ Optional GPT-5.6 narrative-coach adapter
  ├─ Markdown / print artifact generator
  └─ Fixture seeding and test helpers
```

### Recommended stack

- Next.js + React + TypeScript;
- Tailwind CSS plus a small component set; avoid an unedited template look;
- Zod for all client, route, persistence, and model-output boundaries;
- SQLite for a no-account local run, with a repository interface that can later gain a hosted Postgres / LibSQL adapter;
- `better-sqlite3` for the first local release if it gives the fastest reliable workflow;
- Vitest for the domain and API boundaries; Playwright for the critical journey;
- optional OpenAI SDK only behind the coach adapter.

### Shipping implementation note

For the hackathon release, the live workspace uses **browser-local persistence** rather than a database. This keeps the complete fixture path private, zero-setup, and genuinely usable without a hosted credential or a model key. The typed lesson / rehearsal boundary is preserved so a SQLite, LibSQL, or Postgres repository can be added later without changing the deterministic engine or exports.

Reuse only general engineering patterns from Branchline: test configuration, fixture reset scripts, typed domain modules, API error handling, export testing, and Playwright conventions. Do not copy its product UI or domain language.

### Storage model

| Record | Required fields |
| --- | --- |
| Workspace | ID, title, created / updated timestamps, privacy acknowledgement |
| LessonRevision | workspace ID, source text, reviewed structure, objectives, phases, materials, version |
| SignalDeck | lesson revision ID, ordered fictional signals, custom / built-in provenance |
| RehearsalRun | lesson and deck snapshots, initial state, active branch ID |
| RehearsalEvent | run / branch IDs, move, before / after state, rule traces, evidence items |
| RehearsalBranch | parent event ID, state snapshot, label, created timestamp |
| TeachTomorrowPack | chosen branch, teacher-selected changes, reflection, generated Markdown |

Persist a JSON snapshot with the event as well as normalized references. This makes comparison reproducible and makes exports stable even after a lesson later changes.

### Route map

```text
GET/POST  /api/workspaces
GET/PATCH /api/workspaces/:workspaceId/lesson
GET/PUT   /api/workspaces/:workspaceId/signals
POST      /api/workspaces/:workspaceId/rehearsals
POST      /api/rehearsals/:runId/moves
POST      /api/rehearsals/:runId/branches
GET       /api/rehearsals/:runId/compare/:branchId
POST      /api/rehearsals/:runId/pack
GET       /api/packs/:packId/markdown
POST      /api/coach/variations        (optional model path)
```

All write routes return the persisted record, not merely `{ ok: true }`. The UI must render loading, empty, validation, and retry states.

## 9. Visual direction: memorable but adult

### Creative direction

“After dark” is a metaphor for quiet preparation, not a spooky school theme. The visual system should feel like a teacher's well-used night studio: deep ink background, warm desk-lamp amber, chalk-white type, paper cards, and restrained indigo accents.

- Use strong editorial typography and a clear hierarchy.
- Treat the rehearsal stage like a theatre set: the current learning moment is illuminated; context sits in the wings.
- Use a simple fraction-strip visual for the hero fixture rather than generic avatars or stock classroom photos.
- Make the branch comparison look like two annotated rehearsal tapes.
- Use motion only to orient a state change; reduced-motion mode makes every transition immediate.

### Accessibility non-negotiables

- keyboard completion of every workflow;
- focus states and visible skip paths;
- semantic buttons, headings, timelines, and live-region announcements for a state change;
- high-contrast tokens, non-colour state symbols, and readable text at 200% zoom;
- no drag-only or hover-only controls;
- privacy / fiction labels retained in print and export.

## 10. Scope discipline

### Must ship (P0)

- A polished guided fractions fixture with a complete, reusable lesson creation path;
- reviewed lesson structure and phase timing validation;
- five built-in fictional learning signals plus safely validated custom signals;
- deterministic rehearsal state, explanation rail, custom moves, and real branching;
- side-by-side comparison and commit-to-lesson action;
- editable, persisted Teach Tomorrow pack with Markdown and print export;
- SQLite persistence and “reopen a rehearsal” behaviour;
- model-free success path plus a bounded optional GPT-5.6 coach integration;
- tests, a clean README, fixture reset, a no-key setup path, and a browser-tested journey.

### Strong if time remains (P1)

- Two more fixture lessons: Socratic discussion and procedural science / math practice;
- DOCX / PDF extraction with a mandatory teacher review screen;
- teacher-controlled high-contrast theme and a stronger print layout;
- deployable hosted data adapter and a public demo URL;
- lightweight authored prompt library and an “export facilitation cards” view.

### Explicitly defer (P2)

- accounts, teams, invitations, shared coaching workflows;
- real student records, SIS / LMS integrations, analytics, grades, or longitudinal tracking;
- live voice, synthetic child avatars, or unbounded “AI students”;
- automatic curriculum-standard lookup or invented citations;
- claim of educational efficacy or learner prediction;
- arbitrary file types, wide curriculum coverage, or a full document editor.

The rule is simple: do not begin P1 while the P0 demo path is not genuinely complete.

## 11. Verification plan

### Domain tests

- lesson structure rejects no objective, invalid phase time, and unsafe source fields;
- custom signal validation rejects names, identifiers, and prohibited diagnostic framing;
- each built-in move applies the expected rule trace and exact state delta;
- a custom move's selected supports map deterministically to the same rule family;
- branch replay begins with an equal state snapshot and later diverges only after a different move;
- model output parser accepts valid bounded language and rejects unknown IDs / prohibited content;
- export contains actual committed teacher decisions and excludes unselected alternatives.

### API and persistence tests

- workspace → lesson → deck → run → move → branch → compare → pack survives a repository reload;
- malformed route input returns useful 4xx errors;
- a model failure returns fixture / deterministic suggestions without blocking rehearsal;
- Markdown is stable for the same selected branch.

### Playwright acceptance path

```text
Open fixture → review objective and timing → select fictional signals
→ start guided-practice rehearsal → choose “Explain it again”
→ branch → choose “Show, pair, then prove” → compare
→ commit the stronger supports → edit a reflection → download / print pack
→ reopen workspace and verify persisted branch and pack.
```

Capture the critical screenshots as an artifact. They become README images and the demo video shot list.

### Human QA checklist

- no button merely pretends to work;
- every surface explains that signals are fictional;
- every score has a named explanation;
- the demo works after `npm install`, fixture seed, and `npm run dev` with no API key;
- keyboard-only journey and reduced-motion journey completed;
- first-time user can reach the payoff in under five minutes.

## 12. Build order and decision gates

The deadline is **July 21, 2026 at 5:00 PM PDT / July 22 at 07:00 ICT**. Treat this as a one-day delivery sprint. Every stage ends in a runnable state.

| Gate | Deliverable | Completion test |
| --- | --- | --- |
| 1. Foundation | Next app, design tokens, fixture, local database, shell navigation | `npm run dev` opens the Studio and fixture path works. |
| 2. Golden path | Lesson review, signal deck, rehearsal stage, pure reducer | A user completes the first move and sees an explained state change. |
| 3. The differentiator | Persisted branch, comparison, commit action | Two paths from the same event show distinct, traceable outcomes. |
| 4. Practical output | Pack editor, Markdown / print export, reopen state | The final plan reflects selections, not template filler. |
| 5. Model boundary | Optional coach adapter, schema validation, deterministic fallback | The app remains fully usable with a missing / failed API key. |
| 6. Ship quality | Tests, accessibility pass, README, video capture, deployment / testing path | Clean-install demo works and a judge can follow it without help. |

### Sequencing rules

- First build the exact fractions path with hard-coded fixture content, then generalize into editable data.
- Implement branching before visual polish beyond the rehearsal screen; it is the product's proof of depth.
- Build exports from persisted data early; do not leave “generate report” until the final hour.
- Treat document upload, authentication, and multi-user features as traps until the core loop is demonstrated and tested.
- If API integration is blocked, ship the deterministic version and document the optional coach route honestly. Never replace a real feature with a fake loading state.

## 13. Submission strategy

### Track

Enter **Education**. The audience, problem, safety boundary, and output belong there; changing tracks would weaken the story.

### Three-minute video arc

| Time | Visual | Voiceover point |
| --- | --- | --- |
| 0:00–0:20 | Lesson desk and the fictional-signal boundary | “Tomorrow's fractions lesson is ready on paper—but a common misconception and a language barrier are hidden until class begins.” |
| 0:20–0:45 | Signal deck and reviewed lesson phase | “Classroom After Dark rehearses with editable fictional learning signals, never real student data.” |
| 0:45–1:20 | First choice: verbal correction; rule trace | “A fast explanation feels efficient, but the rehearsal shows why it does not create enough evidence or a response route.” |
| 1:20–1:55 | Branch and choose Show, pair, then prove | “From the same moment, I try a visual, paired response, and contrastive check. The deterministic rules show the trade-off: a few minutes, but stronger access and evidence.” |
| 1:55–2:20 | Comparison and commit | “This is not an opaque prediction. Every change points to a lesson objective, fictional signal, and named rule. The teacher decides what to keep.” |
| 2:20–2:40 | Teach Tomorrow pack / print | “The outcome is a revised plan I can teach tomorrow: exact prompt, visual, response route, and exit check.” |
| 2:40–3:00 | Brief Codex / GPT-5.6 proof, optional coach draft | “I used Codex with GPT-5.6 to build and test the full system. In the product, GPT-5.6 drafts only bounded, editable rehearsal language; the deterministic engine owns outcomes.” |

Record the working app first. Add narration after visual proof is captured. Keep the video public, in English, under three minutes, and with voiceover.

### README requirements

- one-line promise and a GIF / screenshot of branch comparison;
- fast start, no-key fixture path, optional model configuration, and exact commands;
- transparent architecture and safety statement;
- “How it works” section distinguishing deterministic rules, GPT-5.6 language, and teacher decisions;
- test commands plus the Playwright journey;
- known limitations and local-data note;
- a candid “Built with Codex” section explaining concrete product, engineering, design, and QA decisions;
- project license, screenshots, and a judge testing path.

### Hackathon compliance checklist

- [ ] Working project and repository link available for judges;
- [ ] clear setup instructions and supplied fixture data;
- [ ] public YouTube demo under three minutes, with English voiceover;
- [ ] video explicitly explains what the project does, how Codex was used, and how GPT-5.6 is used;
- [ ] README documents those contributions and a judge test path;
- [ ] `/feedback` Session ID comes from the primary build thread;
- [ ] no undisclosed proprietary data, copyrighted classroom content, student PII, or fake integrations;
- [ ] selected Education track and submission description use the same crisp product promise.

## 14. Definition of done

Classroom After Dark is ready to submit only if a judge can start from the README and, without a model key or account, complete this story:

1. Open a realistic lesson fixture.
2. See, edit, and confirm its objective and timing.
3. Select clearly fictional, editable learning signals.
4. Make a teaching move and inspect a real state change with an explanation.
5. Branch from that exact moment and make a different move.
6. Compare the branches and commit the better supports.
7. Export a practical, editable Teach Tomorrow pack.
8. Reopen the workspace and find the saved rehearsal and chosen plan.

If any one of these is incomplete, continue tightening the golden path before adding more features. A small system that truthfully helps a teacher prepare tomorrow's lesson is more compelling than a broad education demo with a dozen unfinished promises.

## 15. Immediate next implementation action

Scaffold the application in `classroom-after-dark`, then build the fractions fixture and deterministic rehearsal reducer before adding imports, authentication, or any model call. The first browser-visible milestone is the moment a teacher chooses “Explain it again” and sees a named, reproducible consequence—followed by a branch that proves a better alternative.
