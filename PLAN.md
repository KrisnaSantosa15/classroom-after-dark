# Classroom After Dark — product plan

## Product promise

**Practice tomorrow’s lesson before a real learner loses confidence.** Classroom After Dark is a teacher-directed planning environment where educators rehearse a lesson with a fictional, transparent classroom simulation. It reveals likely misconception pathways and participation dynamics, lets teachers try alternative moves, and exports a more accessible lesson plan.

It is a rehearsal tool, not a learner-profiling or student-assessment system.

## Intended users and jobs

| User | Job to be done |
| --- | --- |
| Classroom teacher | Stress-test a lesson before teaching it and prepare a response to common misconceptions. |
| Learning support / curriculum coach | Help a teacher develop accessible alternatives and discussion prompts. |
| Teacher trainee | Practise instructional decisions and reflect on consequences in a safe environment. |

## Complete product workflow

1. An educator creates a lesson workspace by pasting a plan or uploading an approved lesson document.
2. They provide grade/subject, duration, learning objectives, and optional curriculum standards. The system extracts a structured lesson outline for teacher review.
3. The teacher chooses or creates a **fictional rehearsal class** from transparent pedagogical profiles. Each profile is editable and contains only teaching-relevant traits, such as a common misconception, preferred evidence form, participation tendency, and required accessibility support.
4. The educator runs the lesson in timed phases: opening, model, guided practice, independent practice, and exit check.
5. At each phase, the simulator presents evidence-rich learner reactions and decision options. The teacher may speak/type their own move, choose a suggested move, or alter the activity.
6. The structured class state changes: conceptual understanding, confidence, participation balance, time, and accessibility coverage. The app clearly explains which fictional profile and lesson evidence informed the change.
7. The teacher compares branches, selects improvements, and exports a revised lesson plan, anticipated misconceptions, accessible alternatives, discussion prompts, and formative checks.
8. Reflection notes and the final plan are persisted in the teacher’s private workspace.

## Functional scope

### Lesson workspace

- Paste, rich-text compose, or upload DOCX/PDF/TXT lesson material.
- Structured extraction of objectives, vocabulary, activities, materials, assessment checkpoints, and timing—always editable by the teacher.
- Curriculum standards library with user-entered standards and source links; no invented standards citations.
- Version history and side-by-side comparison of lesson revisions.

### Fictional classroom simulation

- Built-in profiles focus on common pedagogy-relevant patterns: prior-knowledge gap, vocabulary barrier, visual-support need, overconfident misconception, reluctant participation, and advanced learner needing extension.
- Teachers can create profiles. The interface labels every profile fictional and prohibits student names, identifiers, diagnostic labels, or predictive claims.
- Shared state is deterministic and visible: concept progress, confidence, participation equity, time, and accessibility coverage.
- GPT-5.6 creates concise in-character responses and generates proposed teaching moves from the lesson context. It returns structured data constrained by the known profile and world state.
- A rule engine applies the effects of teaching choices. Model text cannot silently decide scores or learner outcomes.
- Branching enables a teacher to compare two responses to the same misconception.

### Teacher outputs

- Revised lesson plan with timing and materials.
- Misconception anticipation sheet: evidence, likely signal, teacher move, and a check for understanding.
- Accessibility plan: plain-language alternatives, visual supports, participation options, and non-punitive formative checks.
- Printable/exportable facilitation cards and editable Markdown/HTML output.
- Teacher reflection journal and branch comparison summary.

## Product boundaries and safety

- Classroom After Dark does **not** ingest identifiable student records, infer diagnoses, rank learners, or predict a real child’s behaviour or performance.
- Every learner is fictional, editable, and visibly described as a rehearsal profile.
- It does not replace professional judgment, IEP processes, learning support specialists, or curriculum review.
- The app avoids deficit framing. Profiles describe supports and observable learning conditions, not fixed ability labels.
- Uploaded lesson content remains private. Any content sent to a model is selected, minimized, and disclosed to the educator.

## Architecture

```text
Teacher browser
  ├─ Lesson composer / upload review
  ├─ Fictional class cast editor
  ├─ Rehearsal stage + time / evidence / equity views
  ├─ Branch comparison
  └─ Plan exports and reflection notes
          │
Next.js application server
  ├─ Document extraction and teacher-review workflow
  ├─ Lesson model + profile management
  ├─ Deterministic pedagogical simulation engine
  ├─ GPT-5.6 structured dialogue and teaching-move adapter
  └─ Export generator
          │
Persistence
  ├─ SQLite for local development
  └─ Postgres-compatible schema for hosted deployment
```

### Technology choices

- Next.js, React, TypeScript, Tailwind CSS, and accessible component primitives.
- Drizzle ORM with SQLite locally and Postgres for deployment.
- Native browser file input plus server-side document extraction; DOCX and PDF imports are parsed into reviewable text, never treated as unquestionable instructions.
- OpenAI Responses API through environment variables, with the challenge model selected explicitly.
- A deterministic state reducer with scenario rules stored as typed TypeScript data.
- Vitest for domain logic and Playwright for the full teacher journey.

## Data model

| Entity | Key data |
| --- | --- |
| TeacherWorkspace | title, privacy settings, timestamps |
| LessonVersion | source text, reviewed structure, objectives, timing, standards links |
| RehearsalProfile | fictional support/misconception traits, editable description, accessibility needs |
| RehearsalRun | class cast snapshot, initial state, lesson version |
| TeachingMove | teacher input, option category, evidence basis, phase |
| SimulationEvent | profile response, state deltas, rule explanation, timestamp |
| Branch | parent event, alternate decisions, comparison metrics |
| PlanArtifact | lesson plan, intervention cards, export settings |

## Privacy and accessibility

- No names, school identifiers, individual student data, or sensitive education records are required or accepted in the rehearsal profiles.
- The upload screen warns users to remove personal information from lesson documents before import.
- Teacher content is not used for model training by the application.
- The product supports keyboard navigation, readable motion settings, high-contrast colour tokens, screen-reader labels, and non-colour-only state indicators.
- Every model response shows its supporting lesson/profile context and can be edited by the teacher.

## Quality bar and verification

The release is complete only when all of these are true:

- A teacher can create a lesson, review the extracted structure, choose a fictional class, and run a full rehearsal without database or code intervention.
- At least three curriculum-neutral fixture lessons cover different interaction types: conceptual explanation, discussion, and procedural practice.
- A teaching decision visibly changes state through a documented rule and can be branched/compared.
- The exported lesson includes actual revisions selected by the teacher, not generic template text.
- Imports show error, loading, privacy, and review states.
- Unit tests cover document-to-lesson validation, profile validation, state reducer rules, branching, and export generation.
- Playwright verifies lesson creation → profile selection → rehearsal move → branch comparison → export.
- An educator review checks that language is non-diagnostic, strengths-based, and clear about the fictional nature of the simulation.

## Build sequence

1. Application foundation, persistence, privacy-first lesson composer, and seeded fictional profiles.
2. Reviewed lesson model, lesson phases, deterministic state reducer, and rehearsal-stage interaction.
3. GPT-5.6 structured dialogue/move support with visible evidence and teacher editing.
4. Branch comparison, plan revision, accessibility cards, exports, and reflection journal.
5. Document imports, comprehensive fixtures, accessibility audit, test suite, README, and deployment instructions.

## Demo narrative

A teacher prepares a Grade 5 fractions lesson. In rehearsal, a fictional learner treats a larger denominator as a larger quantity while another learner cannot access the word problem’s vocabulary. The teacher first tries an explanation-only response and sees uneven participation. They branch, introduce a visual representation plus paired response options, observe a stronger state change, and export a revised lesson plan with a targeted check for understanding.
