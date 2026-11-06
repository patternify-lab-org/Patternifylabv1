import type { Metadata } from "next";
import { Eyebrow } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "DSA Visual Library",
  description: "A growing collection of interactive data structure and algorithm visual explanations."
};

const topics = [
  {
    title: "Linear structures",
    description: "Arrays, linked lists, stacks, and queues, explored through the operations they support."
  },
  {
    title: "Trees and graphs",
    description: "See how relationships, traversals, and changing frontiers shape non-linear data."
  },
  {
    title: "Search and sorting",
    description: "Follow comparisons and rearrangements one deliberate step at a time."
  },
  {
    title: "Recursion and dynamic programming",
    description: "Make the flow of smaller subproblems and reused results easier to follow."
  }
];

export default function LibraryPage() {
  return (
    <div className="pageWrap">
      <section className="pageIntro">
        <Eyebrow>Data structures and algorithms</Eyebrow>
        <h1 className="pageTitle">DSA Visual Library</h1>
        <p>
          Learn how a structure behaves by observing its operations. This library is an upcoming
          learning track; the Phase 1 foundation is starting with problem-solving patterns.
        </p>
      </section>
      <section className="pageSectionTight">
        <div className="futureGrid">
          {topics.map((topic) => (
            <article className="futureCard" key={topic.title}>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <span className="futureCardStatus">Planned learning track</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
