import type { Metadata } from "next";
import Link from "next/link";
import { MarkdownContent } from "@/components/markdown-content";
import { ProblemCard } from "@/components/problem-card";
import { Eyebrow } from "@/components/section-heading";
import { VisualizerFrame } from "@/components/visualizer-frame";
import {
  getPatternBySlug,
  getPatterns,
  getProblems,
  readContentMarkdown
} from "@/lib/content/loader";

type PatternPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPatterns().map((pattern) => ({ slug: pattern.slug }));
}

export async function generateMetadata({ params }: PatternPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  return {
    title: pattern.title,
    description: pattern.summary
  };
}

export default async function PatternPage({ params }: PatternPageProps) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  const overview = readContentMarkdown(pattern.overviewFile);
  const problems = getProblems().filter((problem) => problem.patternId === pattern.id);

  return (
    <div className="pageWrap">
      <section className="pageIntro">
        <Link className="backLink" href="/patterns">
          <span aria-hidden="true">←</span> All patterns
        </Link>
        <Eyebrow>Pattern learning path · {pattern.status.replace("-", " ")}</Eyebrow>
        <h1 className="pageTitle">{pattern.title}</h1>
        <p>{pattern.summary}</p>
        <div className="tagRow">
          {pattern.topics.map((topic) => (
            <span className="topicPill" key={topic}>
              {topic}
            </span>
          ))}
        </div>
      </section>

      <div className="patternLayout">
        <div className="patternMain">
          <section className="contentCard">
            <h2>Understand the pattern</h2>
            <MarkdownContent>{overview}</MarkdownContent>
          </section>

          <section className="contentCard">
            <h2>Try a sample problem</h2>
            {problems.length > 0 ? (
              <div className="problemList">
                {problems.map((problem) => (
                  <ProblemCard key={problem.id} problem={problem} />
                ))}
              </div>
            ) : (
              <div className="emptyState">
                <strong>Problem content is being prepared.</strong>
                Add problem metadata under content/problems and reference it from this pattern.
              </div>
            )}
          </section>
        </div>

        <aside className="patternAside">
          <VisualizerFrame visualizerId={pattern.visualizer.id} />
          <section className="contentCard">
            <h2>Recognition clues</h2>
            <ul className="markdownContent">
              {pattern.recognitionCues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          </section>
          <div className="noticePanel">
            <strong>Learning path is open</strong>
            <p>Suggested order helps you build skill; it never locks away later practice.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
