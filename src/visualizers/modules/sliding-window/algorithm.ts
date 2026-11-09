export type WindowFrameKind = "inspect" | "recount" | "initial" | "remove" | "add";

export type WindowFrame = {
  kind: WindowFrameKind;
  start: number;
  end: number;
  windowSize: number;
  whiteCount: number;
  bestWhiteCount: number;
  previousWhiteCount?: number;
  afterRemovalWhiteCount?: number;
  outgoingIndex?: number;
  incomingIndex?: number;
};

export type InputValidation =
  | { valid: true; blocks: string; windowSize: number }
  | { valid: false; message: string };

export function validateBlockInput(input: string, rawWindowSize: string | number): InputValidation {
  const blocks = input.trim().toUpperCase();
  if (!blocks) {
    return { valid: false, message: "Enter a row using B and W characters." };
  }
  if (!/^[BW]+$/.test(blocks)) {
    return { valid: false, message: "Use only B for black blocks and W for white blocks." };
  }
  if (blocks.length > 100) {
    return { valid: false, message: "Use at most 100 blocks for this problem." };
  }

  const windowSize = Number(rawWindowSize);
  if (!Number.isInteger(windowSize)) {
    return { valid: false, message: "K must be a whole number." };
  }
  if (windowSize < 1 || windowSize > blocks.length) {
    return { valid: false, message: "K must be between 1 and the number of blocks." };
  }
  return { valid: true, blocks, windowSize };
}

export function countWhiteBlocks(blocks: string, start: number, end: number): number {
  let whiteCount = 0;
  for (let index = start; index <= end; index += 1) {
    if (blocks[index] === "W") {
      whiteCount += 1;
    }
  }
  return whiteCount;
}

export function findMinimumRecolors(blocks: string, windowSize: number): number {
  let minimum = windowSize;
  for (let start = 0; start <= blocks.length - windowSize; start += 1) {
    minimum = Math.min(minimum, countWhiteBlocks(blocks, start, start + windowSize - 1));
  }
  return minimum;
}

export function buildUnderstandFrames(blocks: string, windowSize: number): WindowFrame[] {
  const frames: WindowFrame[] = [];
  let bestWhiteCount = windowSize;
  for (let start = 0; start <= blocks.length - windowSize; start += 1) {
    const whiteCount = countWhiteBlocks(blocks, start, start + windowSize - 1);
    bestWhiteCount = Math.min(bestWhiteCount, whiteCount);
    frames.push({
      kind: "inspect",
      start,
      end: start + windowSize - 1,
      windowSize,
      whiteCount,
      bestWhiteCount
    });
  }
  return frames;
}

export function buildRecountFrames(blocks: string, windowSize: number): WindowFrame[] {
  const frames: WindowFrame[] = [];
  let bestWhiteCount = windowSize;
  for (let start = 0; start <= blocks.length - windowSize; start += 1) {
    const whiteCount = countWhiteBlocks(blocks, start, start + windowSize - 1);
    bestWhiteCount = Math.min(bestWhiteCount, whiteCount);
    frames.push({
      kind: "recount",
      start,
      end: start + windowSize - 1,
      windowSize,
      whiteCount,
      bestWhiteCount
    });
  }
  return frames;
}

export function buildSlidingFrames(blocks: string, windowSize: number): WindowFrame[] {
  const firstEnd = windowSize - 1;
  let whiteCount = countWhiteBlocks(blocks, 0, firstEnd);
  let bestWhiteCount = whiteCount;
  const frames: WindowFrame[] = [
    {
      kind: "initial",
      start: 0,
      end: firstEnd,
      windowSize,
      whiteCount,
      bestWhiteCount
    }
  ];

  for (let start = 1; start <= blocks.length - windowSize; start += 1) {
    const outgoingIndex = start - 1;
    const incomingIndex = start + windowSize - 1;
    const previousWhiteCount = whiteCount;
    if (blocks[outgoingIndex] === "W") {
      whiteCount -= 1;
    }
    const afterRemovalWhiteCount = whiteCount;
    frames.push({
      kind: "remove",
      start,
      end: incomingIndex,
      windowSize,
      whiteCount,
      bestWhiteCount,
      previousWhiteCount,
      outgoingIndex,
      incomingIndex
    });

    if (blocks[incomingIndex] === "W") {
      whiteCount += 1;
    }
    bestWhiteCount = Math.min(bestWhiteCount, whiteCount);
    frames.push({
      kind: "add",
      start,
      end: incomingIndex,
      windowSize,
      whiteCount,
      bestWhiteCount,
      previousWhiteCount,
      afterRemovalWhiteCount,
      outgoingIndex,
      incomingIndex
    });
  }
  return frames;
}

export function getFrameIndexForStart(frames: WindowFrame[], start: number): number {
  const matchingIndex = frames.findIndex((frame) => {
    if (frame.start !== start) {
      return false;
    }
    return start === 0 ? frame.kind !== "remove" : frame.kind === "add" || frame.kind === "recount" || frame.kind === "inspect";
  });
  return Math.max(0, matchingIndex);
}
