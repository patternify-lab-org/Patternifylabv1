import Link from "next/link";
import type { PatternContent } from "@/lib/content/types";

const statusLabels = {
  planned: "Planned",
  "in-progress": "In progress",
  complete: "Available"
} as const;

export function PatternCard({ pattern }: { pattern: PatternContent }) {
  return (
    <Link className="contentCard patternCard" href={"/patterns/" + pattern.slug}>
      <div className="cardTopLine">
        <span className="statusPill">{statusLabels[pattern.status]}</span>
        <span className="cardBottom" style={{ margin: 0, padding: 0 }}>
          {pattern.topics.length} topics
        </span>
      </div>
      <h2>{pattern.title}</h2>
      <p>{pattern.summary}</p>
      <div className="tagRow" aria-label="Related topics">
        {pattern.topics.map((topic) => (
          <span className="topicPill" key={topic}>
            {topic}
          </span>
        ))}
      </div>
      <div className="cardBottom">
        <span>
          {pattern.problemIds.length} sample problem{pattern.problemIds.length === 1 ? "" : "s"}
        </span>
        <span className="textLink" aria-hidden="true">
          Explore <span>→</span>
        </span>
      </div>
    </Link>
  );
}
