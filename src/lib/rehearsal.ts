export type Support =
  | "representation"
  | "language"
  | "response-route"
  | "reasoning-check"
  | "extension";

export type MetricKey =
  | "objectiveEvidence"
  | "participationAccess"
  | "representationAccess"
  | "languageAccess";

export type Metrics = Record<MetricKey, number> & { minutesRemaining: number };

export type Signal = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  cue: string;
  accent: "amber" | "blue" | "pink" | "lime" | "violet";
};

export type TeachingMove = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  teacherWords: string;
  supports: Support[];
  timeCost: number;
  evidence: string;
  ruleIds: string[];
  tone: "spark" | "quiet" | "light";
  custom?: boolean;
};

export type RuleTrace = {
  id: string;
  title: string;
  explanation: string;
};

export type RehearsalEvent = {
  id: string;
  move: TeachingMove;
  before: Metrics;
  after: Metrics;
  traces: RuleTrace[];
  evidence: string;
  createdAt: string;
};

export type Lesson = {
  title: string;
  grade: string;
  duration: number;
  objective: string;
  vocabulary: string[];
  phase: string;
  materials: string[];
};

export type CoachDraft = {
  evidence: string;
  moveTitle: string;
  teacherWords: string;
  tradeoff: string;
};

export const fixtureLesson: Lesson = {
  title: "When a bigger number makes a smaller piece",
  grade: "Grade 5 · Mathematics",
  duration: 35,
  objective: "Compare unit fractions with a visual model and explain why a larger denominator makes smaller equal parts.",
  vocabulary: ["unit fraction", "denominator", "equal parts"],
  phase: "Guided practice · 10 minutes",
  materials: ["fraction strips", "mini whiteboards", "pair prompt"],
};

export const fixtureSignals: Signal[] = [
  {
    id: "denominator-trap",
    title: "The denominator trap",
    kicker: "concept signal",
    description: "May compare the digits instead of the represented parts.",
    cue: "“One eighth, because 8 is bigger than 3.”",
    accent: "amber",
  },
  {
    id: "vocabulary-fog",
    title: "Vocabulary fog",
    kicker: "language signal",
    description: "Needs the task language made visible before reasoning can show.",
    cue: "Pauses at “equal parts,” even with a correct drawing nearby.",
    accent: "blue",
  },
  {
    id: "quiet-evidence",
    title: "Quiet evidence",
    kicker: "participation signal",
    description: "Needs a low-pressure way to show a first idea before speaking.",
    cue: "Has a thought, but whole-class talk moves on first.",
    accent: "pink",
  },
  {
    id: "fast-fragile",
    title: "Fast, but fragile",
    kicker: "reasoning signal",
    description: "Benefits from proving an answer in another form.",
    cue: "Answers quickly without a model or explanation.",
    accent: "lime",
  },
  {
    id: "extension-ready",
    title: "Ready to stretch",
    kicker: "extension signal",
    description: "Needs a connected “why” question once the core idea is secure.",
    cue: "Can compare fractions; is ready to generalize the pattern.",
    accent: "violet",
  },
];

export const startingMetrics: Metrics = {
  objectiveEvidence: 1,
  participationAccess: 1,
  representationAccess: 1,
  languageAccess: 1,
  minutesRemaining: 10,
};

export const suggestedMoves: TeachingMove[] = [
  {
    id: "explain-again",
    title: "Explain it again",
    shortTitle: "Explain again",
    description: "Give a quick verbal correction and continue the worked example.",
    teacherWords: "A larger denominator means the whole was cut into more equal parts, so each part is smaller.",
    supports: ["language"],
    timeCost: 2,
    evidence: "The misconception is named, but the room has not yet shown its thinking.",
    ruleIds: ["verbal-correction-without-check"],
    tone: "quiet",
  },
  {
    id: "reason-first",
    title: "Ask for reasoning first",
    shortTitle: "Reason first",
    description: "Invite competing claims, then ask for a reason before correcting.",
    teacherWords: "Turn to a partner: which fraction is larger, and what makes you think so? Be ready to point to evidence.",
    supports: ["response-route", "reasoning-check"],
    timeCost: 3,
    evidence: "More thinking becomes visible, but the part-whole misconception still needs a representation.",
    ruleIds: ["response-route-before-whole-class-share"],
    tone: "spark",
  },
  {
    id: "show-pair-prove",
    title: "Show, pair, then prove",
    shortTitle: "Show · pair · prove",
    description: "Use fraction strips, private pair talk, then a contrastive proof prompt.",
    teacherWords: "Place one third and one eighth under the same whole. Point to the larger piece with a partner, then tell us what the strips prove.",
    supports: ["representation", "response-route", "reasoning-check", "language"],
    timeCost: 4,
    evidence: "The misconception meets a visual contrast, and more than the fastest voices can supply evidence.",
    ruleIds: ["visual-contrast-for-part-whole-confusion", "response-route-before-whole-class-share"],
    tone: "light",
  },
];

const metricBounds: Record<MetricKey, [number, number]> = {
  objectiveEvidence: [0, 4],
  participationAccess: [0, 4],
  representationAccess: [0, 4],
  languageAccess: [0, 4],
};

function clampMetric(key: MetricKey, value: number) {
  const [min, max] = metricBounds[key];
  return Math.max(min, Math.min(max, value));
}

function addMetric(metrics: Metrics, key: MetricKey, delta: number): Metrics {
  return { ...metrics, [key]: clampMetric(key, metrics[key] + delta) };
}

function makeTrace(id: string): RuleTrace {
  const traces: Record<string, RuleTrace> = {
    "verbal-correction-without-check": {
      id,
      title: "Correction is not evidence",
      explanation: "A verbal clarification can make language clearer, but it cannot establish whether learners can compare the parts without a response route or check.",
    },
    "response-route-before-whole-class-share": {
      id,
      title: "Private thinking before public talk",
      explanation: "A pair, point, write, or hold-up route gives quieter thinking a way into the lesson before the quickest voices set the pace.",
    },
    "visual-contrast-for-part-whole-confusion": {
      id,
      title: "Make the part-whole relationship visible",
      explanation: "A shared whole plus contrasting fraction strips lets the denominator signal be tested with evidence rather than corrected by assertion.",
    },
    "language-scaffold-before-contextual-task": {
      id,
      title: "Name the language before the demand",
      explanation: "Making a term visible and usable lowers language friction before learners are asked to reason with it.",
    },
    "teacher-authored-support-map": {
      id,
      title: "Teacher-authored support map",
      explanation: "Your selected supports are mapped to the same transparent rehearsal rules as suggested moves. Your wording stays yours.",
    },
  };
  return traces[id] ?? traces["teacher-authored-support-map"];
}

export function applyMove(before: Metrics, move: TeachingMove): RehearsalEvent {
  let after = { ...before, minutesRemaining: Math.max(0, before.minutesRemaining - move.timeCost) };
  const traces = move.ruleIds.map(makeTrace);

  if (move.id === "explain-again") {
    after = addMetric(after, "languageAccess", 1);
    after = addMetric(after, "objectiveEvidence", 1);
  } else if (move.id === "reason-first") {
    after = addMetric(after, "participationAccess", 2);
    after = addMetric(after, "objectiveEvidence", 1);
  } else if (move.id === "show-pair-prove") {
    after = addMetric(after, "objectiveEvidence", 2);
    after = addMetric(after, "participationAccess", 2);
    after = addMetric(after, "representationAccess", 3);
    after = addMetric(after, "languageAccess", 1);
  } else {
    const supportEffects: Record<Support, [MetricKey, number][]> = {
      representation: [["representationAccess", 2], ["objectiveEvidence", 1]],
      language: [["languageAccess", 1]],
      "response-route": [["participationAccess", 2]],
      "reasoning-check": [["objectiveEvidence", 1]],
      extension: [["objectiveEvidence", 1]],
    };
    for (const support of move.supports) {
      for (const [key, delta] of supportEffects[support]) after = addMetric(after, key, delta);
    }
  }

  return {
    id: `${move.id}-${Date.now()}`,
    move,
    before,
    after,
    traces,
    evidence: move.evidence,
    createdAt: new Date().toISOString(),
  };
}

export function makeCustomMove(text: string, supports: Support[]): TeachingMove {
  const safeText = text.trim() || "Invite learners to make their thinking visible.";
  return {
    id: `teacher-move-${Date.now()}`,
    title: "Your teaching move",
    shortTitle: "Your move",
    description: "A teacher-authored move mapped to visible support choices.",
    teacherWords: safeText,
    supports,
    timeCost: Math.max(2, Math.min(5, supports.length + 1)),
    evidence: "Your move creates a rehearsal pathway from the supports you selected; edit it until it sounds like you.",
    ruleIds: ["teacher-authored-support-map"],
    tone: "spark",
    custom: true,
  };
}

export function metricLabel(value: number) {
  return ["not yet", "fragile", "forming", "strong", "ready"][Math.max(0, Math.min(4, value))];
}

export function metricDelta(before: Metrics, after: Metrics, key: MetricKey) {
  return after[key] - before[key];
}

export function buildTeachTomorrowPack(args: {
  lesson: Lesson;
  selectedSignals: Signal[];
  preferredEvent: RehearsalEvent;
  reflection: string;
}) {
  const { lesson, selectedSignals, preferredEvent, reflection } = args;
  const signalRows = selectedSignals
    .filter((signal) => signal.id !== "extension-ready")
    .slice(0, 3)
    .map((signal) => `- **${signal.title}:** Notice ${signal.cue} Try: ${preferredEvent.move.teacherWords}`)
    .join("\n");

  return `# Teach Tomorrow Pack\n\n## ${lesson.title}\n\n**${lesson.grade} · ${lesson.duration} minutes**  \n**Learning objective:** ${lesson.objective}\n\n## The rehearsal choice to keep\n\n**${preferredEvent.move.title}** (${preferredEvent.move.timeCost} minutes)  \n${preferredEvent.move.teacherWords}\n\n**Why this choice:** ${preferredEvent.evidence}\n\n## Anticipate and respond\n\n${signalRows}\n\n## Participation route\n\nLet every learner point, write, or talk with a partner before whole-class sharing. Ask for one visual proof before taking a fast answer.\n\n## Materials to set out\n\n${lesson.materials.map((item) => `- ${item}`).join("\n")}\n\n## Exit check\n\n“Which is larger: one third or one eighth? Draw or point to a model that proves it, then finish: *When the denominator gets larger, each equal part…*”\n\n## Teacher reflection\n\n${reflection.trim() || "I chose a visible representation and a low-pressure response route so evidence is not limited to the fastest voices."}\n\n---\n*This is a private rehearsal with fictional learning signals. It is not a learner profile or prediction.*`;
}
