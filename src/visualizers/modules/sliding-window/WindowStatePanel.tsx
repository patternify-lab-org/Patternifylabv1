import type { WindowFrame } from "./algorithm";
import styles from "./sliding-window.module.css";

export function WindowStatePanel({ frame, showCounts }: { frame: WindowFrame; showCounts: boolean }) {
  const stateRows = [
    ["Left boundary", String(frame.start)],
    ["Right boundary", String(frame.end)],
    ["Group size", String(frame.windowSize)],
    ...(showCounts
      ? [
          [frame.kind === "remove" ? "Retained white count" : "White blocks now", String(frame.whiteCount)],
          ["Fewest seen", String(frame.bestWhiteCount)]
        ]
      : [])
  ];

  return (
    <dl className={styles.stateGrid} aria-label="Current algorithm state">
      {stateRows.map(([label, value]) => (
        <div className={styles.stateItem} key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
      {showCounts ? (
        <div className={styles.operationRow}>
          <dt>Current operation</dt>
          <dd>
            {frame.kind === "inspect" && "Choose a group"}
            {frame.kind === "recount" && "Count this group again"}
            {frame.kind === "initial" && "Count the first group"}
            {frame.kind === "remove" && "After removing outgoing block"}
            {frame.kind === "add" && "Add the incoming block and compare"}
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
