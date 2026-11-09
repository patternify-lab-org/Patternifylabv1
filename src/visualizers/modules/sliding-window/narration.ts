import type { ProblemLessonStage } from "@/lib/content/types";
import type { WindowFrame } from "./algorithm";

export function getStepExplanation(
  stageId: ProblemLessonStage["id"],
  frame: WindowFrame,
  blocks: string
): string {
  if (stageId === "understand") {
    return `This group starts at index ${frame.start} and contains ${frame.windowSize} neighboring blocks.`;
  }
  if (frame.kind === "recount") {
    return `Count this group from the beginning: ${frame.whiteCount} ${frame.whiteCount === 1 ? "white block" : "white blocks"}. The fewest count among groups checked so far is ${frame.bestWhiteCount}.`;
  }
  if (frame.kind === "initial") {
    return `Count the first group once. It contains ${frame.whiteCount} ${frame.whiteCount === 1 ? "white block" : "white blocks"}, so that is the best count so far.`;
  }
  if (frame.kind === "remove") {
    const outgoing = blocks[frame.outgoingIndex ?? 0];
    const previousCount = frame.previousWhiteCount ?? frame.whiteCount;
    return outgoing === "W"
      ? `The previous group had ${previousCount} white ${previousCount === 1 ? "block" : "blocks"}. Index ${frame.outgoingIndex} leaves; it was white, so subtract 1. The tracked count is now ${frame.whiteCount}; the new rightmost block has not been counted yet.`
      : `The previous group had ${previousCount} white ${previousCount === 1 ? "block" : "blocks"}. Index ${frame.outgoingIndex} leaves; it was black, so subtract 0. The tracked count stays ${frame.whiteCount}; the new rightmost block has not been counted yet.`;
  }
  const incoming = blocks[frame.incomingIndex ?? 0];
  const afterRemovalCount = frame.afterRemovalWhiteCount ?? frame.whiteCount;
  const improved = frame.whiteCount === frame.bestWhiteCount;
  return incoming === "W"
    ? `After removing the outgoing block, the tracked count was ${afterRemovalCount}. Index ${frame.incomingIndex} joins; add 1 for this white block. The count is now ${frame.whiteCount}. ${improved ? "This matches or improves the fewest count so far." : `The fewest count remains ${frame.bestWhiteCount}.`}`
    : `After removing the outgoing block, the tracked count was ${afterRemovalCount}. Index ${frame.incomingIndex} joins; add 0 for this black block. The count stays ${frame.whiteCount}. ${improved ? "This matches or improves the fewest count so far." : `The fewest count remains ${frame.bestWhiteCount}.`}`;
}
