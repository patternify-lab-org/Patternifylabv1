## The idea

A window is a contiguous range inside an array or string. Keep track of the range's useful state, then move its edges while you scan the input.

When two neighboring windows overlap, most of their contents are shared. Update the state with the element entering on the right and, when needed, the element leaving on the left. This avoids rebuilding the answer from scratch for every range.

## When to look for it

- The question asks about a contiguous subarray or substring.
- It asks for a best, shortest, longest, or countable range.
- Moving one boundary changes the range in a way you can update incrementally.

These clues suggest a window; they do not prove one is valid. Check that the problem's constraints let you move the boundaries without skipping a better answer. For example, a variable-size sum window generally relies on non-negative values.

## Two useful shapes

**Fixed size:** the window always contains exactly **k** items. Add the incoming item and remove the outgoing item after the first full window.

**Variable size:** grow one edge as you scan, then move the other edge until the window satisfies the problem's rule. The rule and the order of updates depend on whether the problem asks for a shortest, longest, or number of ranges.

## A simple analogy

Imagine a camera frame moving along a row of seats. The people inside the next frame are almost the same as those in the current frame. Rather than recounting everyone, note who entered and who left.

## First practice step

Start with a fixed-size range and a running sum. Once the boundary update feels natural, explore windows with a changing size or a condition such as a limited number of distinct values.
