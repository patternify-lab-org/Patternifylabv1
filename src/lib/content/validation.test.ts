import assert from "node:assert/strict";
import { describe, it } from "node:test";
import samplePattern from "../../../content/patterns/sliding-window/pattern.json";
import sampleProblem from "../../../content/problems/maximum-average-subarray-i/problem.json";
import recolorProblem from "../../../content/problems/minimum-recolors-to-get-k-consecutive-black-blocks/problem.json";
import recolorLesson from "../../../content/problems/minimum-recolors-to-get-k-consecutive-black-blocks/lesson.json";
import { validateContentRecords, validateProblemLesson } from "./validation";

describe("learning content validation", () => {
  it("accepts the repository's sample pattern and problem", () => {
    const result = validateContentRecords([samplePattern], [sampleProblem, recolorProblem]);

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
  });

  it("accepts the guided lesson content and its pattern links", () => {
    const result = validateContentRecords([samplePattern], [sampleProblem, recolorProblem]);
    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
    assert.deepEqual(validateProblemLesson(recolorLesson).errors, []);
  });

  it("rejects a lesson whose stages are out of order", () => {
    const invalidLesson = {
      ...recolorLesson,
      stages: [recolorLesson.stages[1], recolorLesson.stages[0], ...recolorLesson.stages.slice(2)]
    };
    assert.ok(validateProblemLesson(invalidLesson).errors.some((error) => error.includes("ordered")));
  });

  it("rejects a challenge group larger than its input", () => {
    const invalidLesson = {
      ...recolorLesson,
      challenge: { ...recolorLesson.challenge, windowSize: recolorLesson.challenge.input.length + 1 }
    };
    assert.ok(validateProblemLesson(invalidLesson).errors.some((error) => error.includes("exceed")));
  });

  it("rejects a problem with an unsupported difficulty", () => {
    const invalidProblem = { ...sampleProblem, difficulty: "Beginner" };
    const result = validateContentRecords([samplePattern], [invalidProblem]);

    assert.equal(result.valid, false);
    assert.equal(result.errors.some((error) => error.includes("/difficulty")), true);
  });

  it("reports duplicate problem identifiers", () => {
    const duplicate = { ...sampleProblem };
    const result = validateContentRecords([samplePattern], [sampleProblem, duplicate]);

    assert.ok(result.errors.includes("Duplicate problem id: maximum-average-subarray-i"));
    assert.ok(result.errors.includes("Duplicate problem slug: maximum-average-subarray-i"));
  });

  it("reports a problem whose pattern is missing", () => {
    const unlinkedProblem = { ...sampleProblem, patternId: "unknown-pattern" };
    const result = validateContentRecords([samplePattern], [unlinkedProblem]);

    assert.ok(result.errors.includes(
      "Problem maximum-average-subarray-i references missing pattern unknown-pattern"
    ));
  });

  it("reports a problem whose visualizer is not registered", () => {
    const unknownVisualizer = {
      ...sampleProblem,
      visualizer: { ...sampleProblem.visualizer, id: "unknown-visualizer" }
    };
    const result = validateContentRecords([samplePattern], [unknownVisualizer]);

    assert.ok(result.errors.includes(
      "Problem maximum-average-subarray-i references unregistered visualizer unknown-visualizer"
    ));
  });

  it("requires walkthrough material for guided problems", () => {
    const guidedProblem = { ...sampleProblem, learningTrack: "guided" };
    const result = validateContentRecords([samplePattern], [guidedProblem]);

    assert.equal(result.errors.some((error) => error.includes("walkthrough")), true);
    assert.equal(result.errors.some((error) => error.includes("solutionReferences")), true);
  });
});
