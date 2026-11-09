import type { WindowFrame } from "./algorithm";
import styles from "./sliding-window.module.css";

export function WindowBoard({ blocks, frame }: { blocks: string; frame: WindowFrame }) {
  const cellWidth = 52;
  const gap = 9;
  const left = 24;
  const cellY = 42;
  const cellHeight = 54;
  const stride = cellWidth + gap;
  const width = left * 2 + blocks.length * stride - gap;
  const boundaryX = left + frame.start * stride - 5;
  const boundaryWidth = frame.windowSize * stride - gap + 10;
  const leftCenter = left + frame.start * stride + cellWidth / 2;
  const rightCenter = left + frame.end * stride + cellWidth / 2;
  const outgoingCenter = frame.outgoingIndex === undefined
    ? undefined
    : left + frame.outgoingIndex * stride + cellWidth / 2;
  const incomingCenter = frame.incomingIndex === undefined
    ? undefined
    : left + frame.incomingIndex * stride + cellWidth / 2;

  return (
    <div className={styles.boardScroll}>
      <svg
        className={styles.board}
        style={{ width: `${Math.max(440, blocks.length * stride + left * 2 - gap)}px` }}
        viewBox={`0 0 ${width} 164`}
        role="img"
        aria-label={`Blocks ${blocks.split("").join(" ")}. Left pointer at index ${frame.start}; right pointer at index ${frame.end}. Selected group has ${frame.windowSize} blocks.${frame.outgoingIndex === undefined ? "" : ` Outgoing block at index ${frame.outgoingIndex}.`}${frame.incomingIndex === undefined ? "" : ` Incoming block at index ${frame.incomingIndex}.`}`}
      >
        <rect
          className={styles.rangeBoundary}
          x={boundaryX}
          y={cellY - 5}
          width={boundaryWidth}
          height={cellHeight + 10}
          rx="12"
        />
        <text className={styles.pointerLabel} x={leftCenter} y="19" textAnchor="middle">
          L · {frame.start}
        </text>
        <text className={styles.pointerLabel} x={rightCenter} y="19" textAnchor="middle">
          R · {frame.end}
        </text>
        {blocks.split("").map((block, index) => {
          const x = left + index * stride;
          const isOutgoing = index === frame.outgoingIndex;
          const isIncoming = index === frame.incomingIndex;
          return (
            <g key={`${index}-${block}`}>
              <rect
                className={styles.blockCell}
                x={x}
                y={cellY}
                width={cellWidth}
                height={cellHeight}
                rx="9"
                fill={block === "B" ? "#263b35" : "#f4f2e9"}
                stroke={isOutgoing ? "#b47b28" : block === "B" ? "#263b35" : "#c8c8bd"}
                strokeWidth={isOutgoing ? "3" : "1.5"}
              />
              <text
                className={block === "B" ? styles.blackBlockText : styles.whiteBlockText}
                x={x + cellWidth / 2}
                y={cellY + 34}
                textAnchor="middle"
              >
                {block}
              </text>
              <text className={styles.indexLabel} x={x + cellWidth / 2} y="119" textAnchor="middle">
                {index}
              </text>
              {isOutgoing ? (
                <text className={styles.outgoingLabel} x={x + cellWidth / 2} y="145" textAnchor="middle">
                  OUT
                </text>
              ) : null}
              {isIncoming ? (
                <text className={styles.incomingLabel} x={x + cellWidth / 2} y="145" textAnchor="middle">
                  IN
                </text>
              ) : null}
            </g>
          );
        })}
        {outgoingCenter !== undefined && frame.outgoingIndex !== undefined ? (
          <path
            className={styles.outgoingArrow}
            d={`M ${outgoingCenter} 128 v 8 m -4 -4 l 4 4 l 4 -4`}
          />
        ) : null}
        {incomingCenter !== undefined && frame.kind === "add" ? (
          <path
            className={styles.incomingArrow}
            d={`M ${incomingCenter} 137 v -8 m -4 4 l 4 -4 l 4 4`}
          />
        ) : null}
      </svg>
    </div>
  );
}
