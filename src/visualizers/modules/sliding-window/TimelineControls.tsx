import type { PlaybackAction, PlaybackState } from "./playback-state";
import styles from "./sliding-window.module.css";

type Props = {
  playback: PlaybackState;
  stepCount: number;
  windowCount: number;
  currentStart: number;
  showWindowRange: boolean;
  onAction: (action: PlaybackAction) => void;
  onWindowStart: (start: number) => void;
  groupLabel: string;
};

export function TimelineControls({
  playback,
  stepCount,
  windowCount,
  currentStart,
  showWindowRange,
  onAction,
  onWindowStart,
  groupLabel
}: Props) {
  return (
    <div className={styles.controls}>
      {showWindowRange ? (
        <div className={styles.rangeControl}>
          <div className={styles.rangeHeading}>
            <label htmlFor="window-start">{groupLabel}</label>
            <output htmlFor="window-start">{currentStart} / {windowCount - 1}</output>
          </div>
          <input
            id="window-start"
            type="range"
            min="0"
            max={windowCount - 1}
            step="1"
            value={currentStart}
            aria-label={`${groupLabel}, index ${currentStart}`}
            onChange={(event) => onWindowStart(Number(event.currentTarget.value))}
          />
        </div>
      ) : null}
      <div className={styles.controlRow}>
        <div className={styles.stepButtons} aria-label="History controls">
          <button type="button" onClick={() => onAction({ type: "previous" })} disabled={playback.cursor === 0}>
            Previous
          </button>
          <button type="button" onClick={() => onAction({ type: "next" })} disabled={playback.cursor >= stepCount - 1}>
            Next
          </button>
          {!playback.playing ? (
            <button type="button" className={styles.playButton} onClick={() => onAction({ type: "play" })}>
              Play
            </button>
          ) : (
            <button type="button" className={styles.playButton} onClick={() => onAction({ type: "pause" })}>
              Pause
            </button>
          )}
          <button type="button" onClick={() => onAction({ type: "reset" })}>Reset</button>
        </div>
        <label className={styles.speedControl}>
          Speed
          <select
            value={playback.speed}
            onChange={(event) => onAction({ type: "speed", speed: event.currentTarget.value as PlaybackState["speed"] })}
          >
            <option value="slow">Slow</option>
            <option value="steady">Steady</option>
            <option value="fast">Fast</option>
          </select>
        </label>
      </div>
    </div>
  );
}
