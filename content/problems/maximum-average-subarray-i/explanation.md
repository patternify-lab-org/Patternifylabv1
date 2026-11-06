You are given a list of numbers and a range length **k**. Among all contiguous ranges of exactly that length, find the one with the highest average.

The average is the range sum divided by **k**. Since every candidate has the same length, the range with the greatest sum also has the greatest average. Keep one running sum: when the window moves one position, subtract the value that leaves and add the value that enters.

This small example is original learning material for Visual DSA. The full problem statement and submission experience remain on LeetCode.
