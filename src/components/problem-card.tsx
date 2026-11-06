import Link from "next/link";
import type { ProblemContent } from "@/lib/content/types";

export function ProblemCard({ problem }: { problem: ProblemContent }) {
  const difficultyClass = {
    Easy: "difficultyEasy",
    Medium: "difficultyMedium",
    Hard: "difficultyHard"
  }[problem.difficulty];
  const trackLabel = {
    guided: "Guided learning",
    independent: "Independent practice",
    practice: "Practice sample"
  }[problem.learningTrack];

  return (
    <article className="problemCard">
      <div>
        <div className="problemMeta">
          <span className={"difficultyPill " + difficultyClass}>
            {problem.difficulty}
          </span>
          <span className="topicPill">{trackLabel}</span>
        </div>
        <h3>
          <Link href={"/problems/" + problem.slug}>{problem.title}</Link>
        </h3>
        <p>{problem.summary}</p>
        <div className="tagRow" aria-label="Problem topics">
          {problem.tags.map((tag) => (
            <span className="topicPill" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="problemCardActions">
        <Link className="textLink" href={"/problems/" + problem.slug}>
          Learning notes <span aria-hidden="true">→</span>
        </Link>
        <a className="textLink" href={problem.leetcodeUrl} target="_blank" rel="noreferrer">
          LeetCode <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
