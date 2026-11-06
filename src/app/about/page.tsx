import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "About and Contribute",
  description: "Learn how Visual DSA is structured and how to propose learning content."
};

export default function AboutPage() {
  return (
    <div className="pageWrap">
      <section className="pageIntro">
        <Eyebrow>Open learning, built together</Eyebrow>
        <h1 className="pageTitle">About Visual DSA</h1>
        <p>
          Visual DSA is a free, open-source learning platform for algorithmic thinking. It connects
          clear concepts, visual explanations, pattern recognition, and independent practice.
        </p>
      </section>
      <section className="patternLayout">
        <article className="contentCard">
          <h2>Contribute learning content</h2>
          <p>
            Ordinary problem contributions belong in content files, not application components.
            Each problem has its own folder, metadata file, and original explanation. The content
            checks catch schema errors, duplicate IDs, broken pattern references, and missing files.
          </p>
          <ol className="stepsList">
            <li><span>1</span><span>Choose an existing pattern and copy the problem template.</span></li>
            <li><span>2</span><span>Write a concise, original explanation and add checked examples.</span></li>
            <li><span>3</span><span>Point to a registered visualizer and add walkthrough steps for guided content.</span></li>
            <li><span>4</span><span>Run the content checks and submit a pull request for review.</span></li>
          </ol>
          <div className="buttonRow">
            <Link className="button buttonPrimary" href="/patterns">
              Browse sample content <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
        <aside className="patternAside">
          <div className="noticePanel">
            <strong>One content change at a time</strong>
            <p>
              Problem folders are isolated. Contributors do not write arbitrary CSS or change global
              application styles when adding ordinary learning material.
            </p>
          </div>
          <div className="contentCard">
            <h2>Learning principles</h2>
            <ul className="markdownContent">
              <li>Teach the reasoning before showing a solution.</li>
              <li>Use a visual only when it clarifies algorithmic behavior.</li>
              <li>Keep the source platform as the destination for submissions.</li>
              <li>Prefer small, reviewed additions over unverified collections.</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
