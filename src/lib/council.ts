export type LensId = "evidence" | "access" | "momentum";

export type CouncilLens = {
  id: LensId;
  label: string;
  question: string;
  perspective: string;
  move: string;
  watchout: string;
};

export type CouncilExchange = {
  from: LensId;
  to: LensId;
  point: string;
};

export type CouncilRecommendation = {
  title: string;
  action: string;
  teacherWords: string;
  evidenceToNotice: string;
  minutes: number;
};

export type Council = {
  topicTitle: string;
  roomQuestion: string;
  lenses: CouncilLens[];
  debate: CouncilExchange[];
  recommendation: CouncilRecommendation;
};

export const lensMeta: Record<LensId, Pick<CouncilLens, "label" | "question">> = {
  evidence: {
    label: "Evidence",
    question: "What would make progress visible?",
  },
  access: {
    label: "Access",
    question: "Who can enter the thinking right now?",
  },
  momentum: {
    label: "Momentum",
    question: "What makes participation worth the risk?",
  },
};

function topicTitle(topic: string) {
  const clean = topic.replace(/\s+/g, " ").trim();
  return clean.length <= 88 ? clean : `${clean.slice(0, 85).trimEnd()}…`;
}

/**
 * A useful, explicit fallback when no model key is present. It does not pretend
 * to know this class; it structures the teacher's own topic into three lenses.
 */
export function createLocalCouncil(topic: string): Council {
  const title = topicTitle(topic);

  return {
    topicTitle: title,
    roomQuestion: "What needs to happen before the room moves on?",
    lenses: [
      {
        id: "evidence",
        ...lensMeta.evidence,
        perspective: "Decide what a learner will say, make, choose, or revise that would let you hear the idea—not just a fast answer.",
        move: "Name one observable proof point before choosing your opener.",
        watchout: "Do not turn every contribution into a performance or a mark.",
      },
      {
        id: "access",
        ...lensMeta.access,
        perspective: "Keep the intellectual demand, but give everyone a low-exposure first route into the same thinking.",
        move: "Give a private think, sketch, or note before public talk begins.",
        watchout: "An easier route still needs to lead back to the central idea.",
      },
      {
        id: "momentum",
        ...lensMeta.momentum,
        perspective: "Participation grows when the next contribution has a clear job and does not require instant confidence.",
        move: "Ask pairs to build on, question, or revise one idea before whole-group sharing.",
        watchout: "Protect the pause; do not fill it with another explanation too soon.",
      },
    ],
    debate: [
      {
        from: "momentum",
        to: "evidence",
        point: "Energy is not enough. The room can sound lively while the important idea is still invisible.",
      },
      {
        from: "access",
        to: "momentum",
        point: "A quick turn only helps if everyone has had a moment to form a real contribution first.",
      },
    ],
    recommendation: {
      title: "Open with a quiet first answer",
      action: `Put the central question from “${title}” where everyone can see it. Give 90 seconds to write, draw, or choose a first response. Then ask pairs to compare what changed in their thinking before inviting two contrasting ideas into the room.`,
      teacherWords: "Take a private first pass. You do not need a finished answer—just something we can build on together.",
      evidenceToNotice: "Listen for a learner revising, adding a reason, or using a peer idea to sharpen their first response.",
      minutes: 8,
    },
  };
}

export function buildActionCard(council: Council) {
  const { recommendation } = council;
  return `# Tomorrow's first move\n\nTopic: ${council.topicTitle}\n\n## ${recommendation.title} · ${recommendation.minutes} minutes\n${recommendation.action}\n\n**Say:** “${recommendation.teacherWords}”\n\n**Notice:** ${recommendation.evidenceToNotice}`;
}
