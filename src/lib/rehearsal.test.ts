import { describe, expect, it } from "vitest";
import { applyMove, buildTeachTomorrowPack, fixtureLesson, fixtureSignals, makeCustomMove, startingMetrics, suggestedMoves } from "@/lib/rehearsal";

describe("lesson rehearsal rules", () => {
  it("makes the visual, pair, prove move produce more visible access than a verbal correction", () => {
    const explain = applyMove(startingMetrics, suggestedMoves[0]);
    const showPairProve = applyMove(startingMetrics, suggestedMoves[2]);

    expect(showPairProve.after.objectiveEvidence).toBeGreaterThan(explain.after.objectiveEvidence);
    expect(showPairProve.after.participationAccess).toBeGreaterThan(explain.after.participationAccess);
    expect(showPairProve.after.representationAccess).toBeGreaterThan(explain.after.representationAccess);
    expect(showPairProve.after.minutesRemaining).toBeLessThan(explain.after.minutesRemaining);
    expect(showPairProve.traces.map((trace) => trace.id)).toContain("visual-contrast-for-part-whole-confusion");
  });

  it("maps teacher-authored supports to visible, deterministic rule effects", () => {
    const move = makeCustomMove("Put fraction strips under a shared whole, then have partners point before sharing.", ["representation", "response-route"]);
    const rehearsal = applyMove(startingMetrics, move);

    expect(rehearsal.after.representationAccess).toBe(3);
    expect(rehearsal.after.participationAccess).toBe(3);
    expect(rehearsal.after.objectiveEvidence).toBe(2);
    expect(rehearsal.traces[0].id).toBe("teacher-authored-support-map");
  });

  it("exports the actual selected move rather than generic lesson text", () => {
    const event = applyMove(startingMetrics, suggestedMoves[2]);
    const pack = buildTeachTomorrowPack({
      lesson: fixtureLesson,
      selectedSignals: fixtureSignals.slice(0, 3),
      preferredEvent: event,
      reflection: "I want a visual proof before taking a fast answer.",
    });

    expect(pack).toContain("Show, pair, then prove");
    expect(pack).toContain("I want a visual proof before taking a fast answer.");
    expect(pack).toContain("fictional learning signals");
  });
});
