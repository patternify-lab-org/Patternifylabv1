import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildRecountFrames,
  buildSlidingFrames,
  buildUnderstandFrames,
  countWhiteBlocks,
  findMinimumRecolors,
  getFrameIndexForStart,
  validateBlockInput
} from "./algorithm";
import { initialPlaybackState, transitionPlayback } from "./playback-state";

describe("minimum recolors algorithm", () => {
  it("returns 3 for the original example", () => {
    assert.equal(findMinimumRecolors("WBBWWBBWBW", 7), 3);
  });

  it("returns zero when a fully black group already exists", () => {
    assert.equal(findMinimumRecolors("WBWBBBW", 2), 0);
  });

  it("handles all-white and all-black rows", () => {
    assert.equal(findMinimumRecolors("WWWW", 3), 3);
    assert.equal(findMinimumRecolors("BBBB", 3), 0);
  });

  it("handles K=1, K equal to the full input, and a one-block input", () => {
    assert.equal(findMinimumRecolors("WBW", 1), 0);
    assert.equal(findMinimumRecolors("WBB", 3), 1);
    assert.equal(findMinimumRecolors("W", 1), 1);
  });

  it("supports a custom student input", () => {
    assert.equal(findMinimumRecolors("WBBWBWBB", 3), 1);
  });

  it("counts only within inclusive valid boundaries", () => {
    assert.equal(countWhiteBlocks("BWWBB", 1, 3), 2);
    assert.equal(countWhiteBlocks("BWWBB", 2, 4), 1);
  });
});

describe("window frame history", () => {
  it("includes the first and last valid groups in recount mode", () => {
    const frames = buildRecountFrames("WBBWWBBWBW", 7);
    assert.equal(frames.length, 4);
    assert.deepEqual(frames.map((frame) => [frame.start, frame.end]), [
      [0, 6], [1, 7], [2, 8], [3, 9]
    ]);
    assert.equal(frames[0].whiteCount, 3);
    assert.equal(frames.at(-1)?.end, 9);
  });

  it("shows outgoing removal and incoming addition as separate updates", () => {
    const frames = buildSlidingFrames("WWBBW", 3);
    assert.deepEqual(frames.map((frame) => frame.kind), ["initial", "remove", "add", "remove", "add"]);
    assert.deepEqual(frames.slice(0, 3).map((frame) => frame.whiteCount), [2, 1, 1]);
    assert.equal(frames[1].outgoingIndex, 0);
    assert.equal(frames[1].incomingIndex, 3);
    assert.equal(frames[1].previousWhiteCount, 2);
    assert.equal(frames[2].whiteCount, 1);
    assert.equal(frames[2].afterRemovalWhiteCount, 1);
    assert.equal(frames[3].outgoingIndex, 1);
    assert.equal(frames[3].whiteCount, 0);
    assert.equal(frames[4].incomingIndex, 4);
    assert.equal(frames[4].whiteCount, 1);
  });

  it("maps manual movement to deterministic group snapshots", () => {
    const recount = buildRecountFrames("WBBWW", 2);
    const sliding = buildSlidingFrames("WBBWW", 2);
    assert.equal(getFrameIndexForStart(recount, 0), 0);
    assert.equal(getFrameIndexForStart(recount, 3), 3);
    assert.equal(getFrameIndexForStart(sliding, 0), 0);
    assert.equal(sliding[getFrameIndexForStart(sliding, 3)].kind, "add");
    assert.equal(sliding[getFrameIndexForStart(sliding, 3)].start, 3);
    assert.equal(buildUnderstandFrames("WBW", 2).length, 2);
  });
});

describe("editable input validation", () => {
  it("accepts lowercase and surrounding whitespace", () => {
    assert.deepEqual(validateBlockInput(" wbw ", "2"), { valid: true, blocks: "WBW", windowSize: 2 });
  });

  it("rejects empty, invalid-character, oversized, non-integer, and out-of-range input", () => {
    assert.equal(validateBlockInput("", "1").valid, false);
    assert.equal(validateBlockInput("BWX", "2").valid, false);
    assert.equal(validateBlockInput("B".repeat(101), "1").valid, false);
    assert.equal(validateBlockInput("BWW", "1.5").valid, false);
    assert.equal(validateBlockInput("BW", "3").valid, false);
  });
});

describe("deterministic playback state", () => {
  it("supports previous, next, play, pause, reset, speed, and bounded seeking", () => {
    let state = transitionPlayback(initialPlaybackState, { type: "next" }, 4);
    assert.equal(state.cursor, 1);
    state = transitionPlayback(state, { type: "previous" }, 4);
    assert.equal(state.cursor, 0);
    state = transitionPlayback(state, { type: "seek", cursor: 99 }, 4);
    assert.equal(state.cursor, 3);
    state = transitionPlayback(state, { type: "play" }, 4);
    assert.equal(state.playing, true);
    state = transitionPlayback(state, { type: "pause" }, 4);
    assert.equal(state.playing, false);
    state = transitionPlayback(state, { type: "speed", speed: "fast" }, 4);
    assert.equal(state.speed, "fast");
    state = transitionPlayback(state, { type: "reset" }, 4);
    assert.deepEqual(state, { cursor: 0, playing: false, speed: "fast" });
  });

  it("stops playback at the final frame and restarts from the beginning", () => {
    const playing = transitionPlayback(initialPlaybackState, { type: "play" }, 2);
    const advanced = transitionPlayback(playing, { type: "tick" }, 2);
    const finished = transitionPlayback(advanced, { type: "tick" }, 2);
    assert.deepEqual(finished, { cursor: 1, playing: false, speed: "steady" });
    assert.deepEqual(transitionPlayback(finished, { type: "play" }, 2), {
      cursor: 0,
      playing: true,
      speed: "steady"
    });
  });
});
