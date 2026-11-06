import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/markdown-content";
import { Eyebrow } from "@/components/section-heading";
import { VisualizerFrame } from "@/components/visualizer-frame";
import {
  getPatterns,
  getProblemBySlug,
  getProblems,
  readContentMarkdown
} from "@/lib/content/loader";

type ProblemPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProblems().map((problem) => ({ slug: problem.slug }));
}

export async function generateMetadata({ params }: ProblemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);
  return {
    title: problem.title,
    description: problem.summary
  };
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);
  const pattern = getPatterns().find((item) => item.id === problem.patternId);
  const difficultyClass = {
    Easy: "difficultyEasy",
    Medium: "difficultyMedium",
    Hard: "difficultyHard"
  }[problem.difficulty];
  if (!pattern) {
    notFound();
  }

  return (
    <div className="pageWrap">
      <section className="pageIntro">
        <Link className="backLink" href={"/patterns/" + pattern.slug}>
          <span aria-hidden="true">←</span> {pattern.title}
        </Link>
        <Eyebrow>Practice sample · original learning notes</Eyebrow>
        <div className="problemHeader">
          <h1>{problem.title}</h1>
          <span className={"difficultyPill " + difficultyClass}>{problem.difficulty}</span>
        </div>
        <p>{problem.summary}</p>
        <div className="tagRow">
          {problem.tags.map((tag) => (
            <span className="topicPill" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="patternLayout">
        <div className="patternMain">
          <article className="contentCard">
            <h2>What is the task?</h2>
            <MarkdownContent>{readContentMarkdown(problem.explanationFile)}</MarkdownContent>
          </article>
          {problem.analogyFile ? (
            <article className="contentCard">
              <h2>A way to picture it</h2>
              <MarkdownContent>{readContentMarkdown(problem.analogyFile)}</MarkdownContent>
            </article>
          ) : null}
          <article className="contentCard">
            <h2>Example</h2>
            {problem.examples.map((example, index) => (
              <div key={example.input}>
                <p>
                  <strong>Input:</strong> {example.input}
                  <br />
                  <strong>Output:</strong> {example.output}
                </p>
                {example.note ? <p>{example.note}</p> : null}
                {index < problem.examples.length - 1 ? <hr /> : null}
              </div>
            ))}
          </article>
        </div>
        <aside className="patternAside">
          <VisualizerFrame visualizerId={problem.visualizer.id} mode={problem.visualizer.mode} />
          <section className="contentCard">
            <h2>Pattern clues</h2>
            <ul className="markdownContent">
              {problem.recognitionClues.map((clue) => (
                <li key={clue}>{clue}</li>
              ))}
            </ul>
          </section>
          <a className="button buttonPrimary" href={problem.leetcodeUrl} target="_blank" rel="noreferrer">
            Open the original problem <span aria-hidden="true">↗</span>
          </a>
          <div className="noticePanel">
            <strong>Start by reasoning it out</strong>
            <p>Visual DSA keeps the prompt short and links to LeetCode for the full problem and submission.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
