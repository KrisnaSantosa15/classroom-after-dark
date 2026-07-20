import { describe, expect, it } from "vitest";
import { buildActionCard, createLocalCouncil } from "@/lib/council";

describe("teaching council fallback", () => {
  const topic = "My Grade 8 discussion stalls after the first confident answer.";

  it("turns any teacher topic into three complementary planning lenses", () => {
    const council = createLocalCouncil(topic);

    expect(council.topicTitle).toContain("Grade 8 discussion");
    expect(council.lenses.map((lens) => lens.id)).toEqual(["evidence", "access", "momentum"]);
    expect(council.debate).toHaveLength(2);
    expect(council.roomQuestion).toBe("What needs to happen before the room moves on?");
  });

  it("exports the specific recommendation, not a generic lesson plan", () => {
    const card = buildActionCard(createLocalCouncil(topic));

    expect(card).toContain("Open with a quiet first answer");
    expect(card).toContain("90 seconds");
    expect(card).toContain(topic);
  });
});
