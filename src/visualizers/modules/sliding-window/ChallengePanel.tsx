import styles from "./sliding-window.module.css";

type Props = {
  hints: string[];
  revealedHints: number;
  answer: string;
  feedback: string;
  checkedCount: number;
  windowCount: number;
  onRevealHint: () => void;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChallengePanel({
  hints,
  revealedHints,
  answer,
  feedback,
  checkedCount,
  windowCount,
  onRevealHint,
  onAnswerChange,
  onSubmit
}: Props) {
  return (
    <section className={styles.challengePanel} aria-labelledby="challenge-heading">
      <div className={styles.challengeHeader}>
        <div>
          <span className={styles.kicker}>Your turn</span>
          <h3 id="challenge-heading">Find the fewest recolours</h3>
        </div>
        <span className={styles.progressText}>{checkedCount} of {windowCount} groups checked</span>
      </div>
      <p>Move through the row, keep track of the best count, then enter your answer.</p>
      <div className={styles.answerRow}>
        <label htmlFor="challenge-answer">Your minimum</label>
        <input
          id="challenge-answer"
          type="number"
          min="0"
          step="1"
          value={answer}
          onChange={(event) => onAnswerChange(event.currentTarget.value)}
        />
        <button type="button" className={styles.submitButton} onClick={onSubmit}>Check answer</button>
      </div>
      {feedback ? <p className={styles.feedback} role="status">{feedback}</p> : null}
      <div className={styles.hints}>
        {revealedHints > 0 ? (
          <ol>
            {hints.slice(0, revealedHints).map((hint, index) => <li key={index}>{hint}</li>)}
          </ol>
        ) : null}
        {revealedHints < hints.length ? (
          <button type="button" className={styles.hintButton} onClick={onRevealHint}>
            Reveal {revealedHints === 0 ? "a hint" : "next hint"}
          </button>
        ) : <span className={styles.allHints}>All hints revealed</span>}
      </div>
    </section>
  );
}
