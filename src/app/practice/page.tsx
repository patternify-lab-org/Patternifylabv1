import type { Metadata } from "next";
import { ProblemCard } from "@/components/problem-card";
import { Eyebrow } from "@/components/section-heading";
import { getProblems } from "@/lib/content/loader";

export const metadata: Metadata = {
  title: "Problem Practice",
  description: "Browse curated problems and continue to the original coding platform."
};

export default function PracticePage() {
  const problems = getProblems();

  return (
    <div className="pageWrap">
      <section className="pageIntro">
        <Eyebrow>Apply the idea</Eyebrow>
        <h1 className="pageTitle">Problem Practice</h1>
        <p>
          Read original learning notes, inspect examples, and follow the link to solve the full
          problem on its source platform. Suggested learning order stays optional.
        </p>
      </section>
      <section className="pageSectionTight">
        {problems.length > 0 ? (
          <div className="problemList">
            {problems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        ) : (
          <div className="emptyState">
            <strong>No problems have been added yet.</strong>
            New entries are discovered from content folders after validation.
          </div>
        )}
      </section>
    </div>
  );
}
