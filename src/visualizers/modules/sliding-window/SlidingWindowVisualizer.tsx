"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import type { ProblemLessonStage } from "@/lib/content/types";
import type { VisualizerProps } from "@/visualizers/contract";
import {
  buildUnderstandFrames,
  buildRecountFrames,
  buildSlidingFrames,
  findMinimumRecolors,
  getFrameIndexForStart,
  validateBlockInput,
} from "./algorithm";
import { ChallengePanel } from "./ChallengePanel";
import { TimelineControls } from "./TimelineControls";
import { WindowBoard } from "./WindowBoard";
import { WindowStatePanel } from "./WindowStatePanel";
import { initialPlaybackState, transitionPlayback, type PlaybackAction } from "./playback-state";
import { getStepExplanation } from "./narration";
import styles from "./sliding-window.module.css";

type StageId = ProblemLessonStage["id"];

function readSetting(settings: Record<string, unknown> | undefined, key: string, fallback: string): string {
  const value = settings?.[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function stageName(stageId: StageId): string {
  if (stageId === "understand") return "Explore the row";
  if (stageId === "recount") return "Count each group";
  return "Reuse the edge changes";
}

export default function SlidingWindowVisualizer({ configuration, lesson }: VisualizerProps) {
  const settings = configuration.settings;
  const initialInput = readSetting(settings, "initialInput", "WBBWWBBWBW");
  const initialK = readSetting(settings, "windowSize", "7");
  const [stageId, setStageId] = useState<StageId>("understand");
  const [inputValue, setInputValue] = useState(initialInput);
  const [kValue, setKValue] = useState(initialK);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [revealedHints, setRevealedHints] = useState(0);
  const [visitedStarts, setVisitedStarts] = useState<Set<number>>(() => new Set([0]));
  const validation = useMemo(() => validateBlockInput(inputValue, kValue), [inputValue, kValue]);
  const blocks = validation.valid ? validation.blocks : "";
  const windowSize = validation.valid ? validation.windowSize : 0;
  const stage = lesson?.stages.find((item) => item.id === stageId);
  const frames = useMemo(() => {
    if (!validation.valid) return [];
    if (stageId === "understand") return buildUnderstandFrames(blocks, windowSize);
    if (stageId === "recount") return buildRecountFrames(blocks, windowSize);
    return buildSlidingFrames(blocks, windowSize);
  }, [blocks, stageId, validation.valid, windowSize]);
  const [playback, dispatchPlayback] = useReducer(
    (state: typeof initialPlaybackState, action: PlaybackAction) =>
      transitionPlayback(state, action, frames.length),
    initialPlaybackState
  );
  const frame = frames[playback.cursor];
  const isChallenge = stageId === "challenge";
  const maximumStart = validation.valid ? blocks.length - windowSize : 0;
  const windowCount = validation.valid ? maximumStart + 1 : 0;

  useEffect(() => {
    const milliseconds = playback.speed === "slow" ? 1500 : playback.speed === "fast" ? 450 : 850;
    if (!playback.playing || frames.length < 2) return;
    const timer = window.setInterval(() => dispatchPlayback({ type: "tick" }), milliseconds);
    return () => window.clearInterval(timer);
  }, [frames.length, playback.playing, playback.speed]);

  useEffect(() => {
    setVisitedStarts(isChallenge && validation.valid ? new Set([0]) : new Set());
    setAnswer("");
    setFeedback("");
    setRevealedHints(0);
  }, [blocks, isChallenge, stageId, validation.valid, windowSize]);

  useEffect(() => {
    if (isChallenge && frame && (frame.kind === "initial" || frame.kind === "add")) {
      setVisitedStarts((current) => new Set(current).add(frame.start));
    }
  }, [frame, isChallenge]);

  const handlePlayback = (action: PlaybackAction) => {
    if (action.type === "reset") {
      setVisitedStarts(isChallenge && validation.valid ? new Set([0]) : new Set());
      setAnswer("");
      setFeedback("");
      setRevealedHints(0);
    }
    dispatchPlayback(action);
  };

  const changeInput = (value: string) => {
    setInputValue(value);
    dispatchPlayback({ type: "reset" });
    setVisitedStarts(isChallenge && validateBlockInput(value, kValue).valid ? new Set([0]) : new Set());
    setAnswer("");
    setFeedback("");
  };

  const changeK = (value: string) => {
    setKValue(value);
    dispatchPlayback({ type: "reset" });
    setVisitedStarts(isChallenge && validateBlockInput(inputValue, value).valid ? new Set([0]) : new Set());
    setAnswer("");
    setFeedback("");
  };

  const selectStage = (nextStage: ProblemLessonStage) => {
    setStageId(nextStage.id);
    if (nextStage.id === "challenge" && lesson) {
      setInputValue(lesson.challenge.input);
      setKValue(String(lesson.challenge.windowSize));
    } else {
      setInputValue(initialInput);
      setKValue(initialK);
    }
    dispatchPlayback({ type: "reset" });
  };

  const handleWindowStart = (start: number) => {
    const cursor = getFrameIndexForStart(frames, start);
    dispatchPlayback({ type: "seek", cursor });
  };

  const submitAnswer = () => {
    if (!validation.valid) {
      setFeedback(validation.message);
      return;
    }
    if (!/^(0|[1-9]\d*)$/.test(answer)) {
      setFeedback("Enter a whole number of recolours before checking.");
      return;
    }
    if (visitedStarts.size < windowCount) {
      setFeedback("Check every possible group before submitting your final count.");
      return;
    }
    const target = findMinimumRecolors(blocks, windowSize);
    setFeedback(Number(answer) === target
      ? `Correct. The fewest recolours needed is ${target}.`
      : "Not quite. Compare your answer with the smallest count shown for the groups you checked.");
  };

  const lessonStages = lesson?.stages ?? [];
  const currentStage = stage ?? {
    id: stageId,
    title: "Explore the row",
    summary: "Choose neighboring blocks and see how the selected group moves.",
    teachingPoints: ["Use the controls to explore the input row."]
  };

  return (
    <div className={styles.lesson}>
      <header className={styles.lessonHeader}>
        <span className={styles.kicker}>Guided visual lesson · LeetCode 2379</span>
        <h2>{lesson?.title ?? "Explore a fixed-size group"}</h2>
        <p>{lesson?.introduction ?? "Move through a row of black and white blocks and follow the count as it changes."}</p>
      </header>

      {lessonStages.length > 0 ? (
        <nav className={styles.stageNav} role="tablist" aria-label="Lesson stages">
          {lessonStages.map((item, index) => (
            <button
              className={item.id === stageId ? styles.stageActive : styles.stageButton}
              key={item.id}
              type="button"
              role="tab"
              id={`stage-tab-${item.id}`}
              aria-selected={item.id === stageId}
              aria-controls="lesson-stage-panel"
              onClick={() => selectStage(item)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>{item.title}
            </button>
          ))}
        </nav>
      ) : null}

      <section className={styles.stageIntro} id="lesson-stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${stageId}`}>
        <div>
          <span className={styles.kicker}>Stage {Math.max(1, lessonStages.findIndex((item) => item.id === stageId) + 1)} of {lessonStages.length || 1}</span>
          <h3>{currentStage.title}</h3>
          <p>{currentStage.summary}</p>
        </div>
        <ul>
          {currentStage.teachingPoints.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </section>

      <div className={styles.workspace}>
        <section className={styles.visualPanel} aria-label="Interactive block visualizer">
          <div className={styles.visualPanelHeader}>
            <div>
              <span className={styles.kicker}>{stageName(stageId)}</span>
              <h3>{isChallenge ? "Your challenge row" : "Block row"}</h3>
            </div>
            {validation.valid ? <span className={styles.stepBadge}>Group {frame ? frame.start + 1 : 1} of {windowCount}</span> : null}
          </div>

          <div className={styles.inputRow}>
            <label>
              Blocks <span>(B or W)</span>
              <input
                type="text"
                value={inputValue}
                maxLength={100}
                spellCheck={false}
                autoComplete="off"
                onChange={(event) => changeInput(event.currentTarget.value)}
                aria-invalid={!validation.valid}
              />
            </label>
            <label className={styles.kInput}>
              Group size K
              <input
                type="number"
                min="1"
                max={validation.valid ? blocks.length : 100}
                step="1"
                value={kValue}
                onChange={(event) => changeK(event.currentTarget.value)}
                aria-invalid={!validation.valid}
              />
            </label>
          </div>

          {!validation.valid ? (
            <p className={styles.validationMessage} role="alert">{validation.message}</p>
          ) : frame ? (
            <>
              <WindowBoard blocks={blocks} frame={frame} />
              {stageId !== "understand" ? (
                <div className={styles.countStrip} aria-live="polite">
                  <span>{frame.kind === "remove" ? "Retained whites · entry pending" : "White blocks in this group"} <strong key={`current-${frame.kind}-${frame.start}`}>{frame.whiteCount}</strong></span>
                  <span>Fewest seen <strong key={`best-${frame.bestWhiteCount}-${frame.start}`}>{frame.bestWhiteCount}</strong></span>
                </div>
              ) : (
                <p className={styles.groupOnlyNote}>The outline marks the selected {windowSize}-block group. B and W remain labelled in every block.</p>
              )}
              <TimelineControls
                playback={playback}
                stepCount={frames.length}
                windowCount={windowCount}
                currentStart={frame.start}
                showWindowRange={stageId === "understand"}
                onAction={handlePlayback}
                onWindowStart={handleWindowStart}
                groupLabel={stageId === "understand" ? "Choose the first position in the group" : "Move the group start"}
              />
              <WindowStatePanel frame={frame} showCounts={stageId !== "understand"} />
            </>
          ) : null}
        </section>

        <aside className={styles.explanationColumn}>
          <section className={styles.explanationPanel} aria-live="polite">
            <span className={styles.kicker}>{stageId === "understand" ? "What you are seeing" : "Current step"}</span>
            <p>{validation.valid && frame ? getStepExplanation(stageId, frame, blocks) : "Correct the input to continue exploring the row."}</p>
            {stageId === "recount" && lesson ? (
              <p className={styles.complexityNote}>
                Time: {lesson.approachAnalysis.straightforward.time}. Extra space: {lesson.approachAnalysis.straightforward.extraSpace}. {lesson.approachAnalysis.straightforward.context}
              </p>
            ) : null}
            {stageId === "pattern" && lesson ? (
              <p className={styles.complexityNote}>
                Time: {lesson.approachAnalysis.optimized.time}. Extra space: {lesson.approachAnalysis.optimized.extraSpace}. {lesson.approachAnalysis.optimized.context}
              </p>
            ) : null}
          </section>

          {stageId === "challenge" && lesson ? (
            <ChallengePanel
              hints={lesson.challenge.hints}
              revealedHints={revealedHints}
              answer={answer}
              feedback={feedback}
              checkedCount={visitedStarts.size}
              windowCount={windowCount}
              onRevealHint={() => setRevealedHints((count) => Math.min(lesson.challenge.hints.length, count + 1))}
              onAnswerChange={(value) => { setAnswer(value); setFeedback(""); }}
              onSubmit={submitAnswer}
            />
          ) : null}
        </aside>
      </div>

      {stageId === "pattern" ? (
        <section className={styles.nextProblemNote}>
          <strong>{lesson?.approachAnalysis.nextStep.title}</strong>
          <p>{lesson?.approachAnalysis.nextStep.body}</p>
        </section>
      ) : null}
    </div>
  );
}
