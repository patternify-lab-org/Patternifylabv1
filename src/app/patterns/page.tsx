import type { Metadata } from "next";
import { PatternCard } from "@/components/pattern-card";
import { Eyebrow } from "@/components/section-heading";
import { getPatterns } from "@/lib/content/loader";

export const metadata: Metadata = {
  title: "Problem-Solving Patterns",
  description: "Explore reusable techniques for solving data structure and algorithm problems."
};

export default function PatternsPage() {
  const patterns = getPatterns();

  return (
    <div className="pageWrap">
      <section className="pageIntro">
        <Eyebrow>Reusable ways to think</Eyebrow>
        <h1 className="pageTitle">Problem-Solving Patterns and Techniques</h1>
        <p>
          Learn when a technique fits, explore how it behaves, and practise carrying the idea into a
          new problem. Every pattern remains open while the collection grows.
        </p>
      </section>
      {patterns.length > 0 ? (
        <section className="pageSectionTight" aria-label="Available patterns">
          <div className="patternGrid">
            {patterns.map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))}
          </div>
        </section>
      ) : (
        <div className="emptyState">
          <strong>No patterns have been added yet.</strong>
          Add a validated pattern folder under content/patterns to publish it here.
        </div>
      )}
    </div>
  );
}
