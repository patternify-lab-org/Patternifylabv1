import Link from "next/link";
import { Eyebrow, SectionHeading } from "@/components/section-heading";
import { getPatterns } from "@/lib/content/loader";

const arrayValues = [4, -2, 5, 7, -1, 3, 2];

export default function HomePage() {
  const featuredPattern = getPatterns().find((pattern) => pattern.id === "sliding-window");

  return (
    <>
      <section className="pageWrap hero">
        <div className="heroCopy">
          <Eyebrow>Understand algorithms, one visual idea at a time</Eyebrow>
          <h1>
            Learn the <em>shape</em> of a solution.
          </h1>
          <p>
            Visual DSA connects clear explanations, interactive learning, and real practice so you
            can recognize a pattern and solve the next problem on your own.
          </p>
          <div className="buttonRow">
            <Link className="button buttonPrimary" href="/patterns">
              Explore problem-solving patterns <span aria-hidden="true">→</span>
            </Link>
            <Link className="button buttonSecondary" href="/library">
              Browse the visual library
            </Link>
          </div>
          <div className="heroMeta" aria-label="Product principles">
            <span>
              <span className="metaCheck" aria-hidden="true">✓</span> Free and open source
            </span>
            <span>
              <span className="metaCheck" aria-hidden="true">✓</span> Learn by doing
            </span>
          </div>
        </div>

        <div className="visualPreview" aria-label="Illustration of a fixed-size sliding window">
          <div className="previewTop">
            <div>
              <div className="previewKicker">A pattern in motion</div>
              <div className="previewTitle">Keep what overlaps</div>
            </div>
            <span className="previewTag">Fixed-size window</span>
          </div>
          <div className="arrayBoard" aria-hidden="true">
            {arrayValues.map((value, index) => (
              <div
                className={
                  "arrayCell" +
                  (index === 2 || index === 3 ? " arrayCellInWindow arrayCellBest" : "")
                }
                key={index}
              >
                {value}
                <span className="cellIndex">{index}</span>
              </div>
            ))}
          </div>
          <div className="pointerRow" aria-hidden="true">
            {arrayValues.map((_, index) => (
              <div className="pointerLabel" key={index}>
                {index === 2 ? "left" : index === 3 ? "right" : ""}
              </div>
            ))}
          </div>
          <div className="previewDivider" />
          <div className="previewEquation">
            <span>Current best</span>
            <strong>5 + 7 = 12</strong>
            <strong className="answer">12 ÷ 2 = 6</strong>
          </div>
          <p className="previewCaption">
            Static preview · moving the frame changes only the values at its edges.
          </p>
        </div>
      </section>

      <section className="pageSection" style={{ background: "#eef1ec" }}>
        <div className="pageWrap">
          <SectionHeading
            eyebrow="The learning journey"
            title="From first principles to independent practice."
            description="Build intuition, notice the clues in a problem, then put the idea to work yourself."
          />
          <div className="stepGrid">
            <article className="stepCard">
              <span className="stepNumber">01</span>
              <h3>Understand</h3>
              <p>Start with a plain-language idea and a small example you can reason through.</p>
            </article>
            <article className="stepCard">
              <span className="stepNumber">02</span>
              <h3>Visualise</h3>
              <p>See how the data changes as an algorithm moves, compares, or updates a range.</p>
            </article>
            <article className="stepCard">
              <span className="stepNumber">03</span>
              <h3>Recognise and practise</h3>
              <p>Connect the pattern to real problems, then solve them independently.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="pageSection">
        <div className="pageWrap">
          <SectionHeading
            eyebrow="Start with one pattern"
            title="Build a strong foundation before branching out."
            description="The first release is being built around a focused Sliding Window learning path."
          />
          {featuredPattern ? (
            <article className="featuredPattern">
              <div>
                <span className="statusPill">Foundation in progress</span>
                <h3>{featuredPattern.title}</h3>
                <p>{featuredPattern.summary}</p>
                <div className="buttonRow">
                  <Link className="textLink" href={"/patterns/" + featuredPattern.slug}>
                    Preview the pattern <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              <div className="featuredAside">
                <span className="featuredAsideLabel">Sample content</span>
                <span className="featuredAsideValue">
                  {featuredPattern.problemIds.length} sample problem
                  {featuredPattern.problemIds.length === 1 ? "" : "s"}, original explanation
                </span>
                <span className="featuredAsideLabel">Visualizer</span>
                <span className="featuredAsideValue">Module boundary established</span>
              </div>
            </article>
          ) : (
            <div className="emptyState">
              <strong>Learning paths are being prepared.</strong>
              Pattern content will appear here as it is added to the repository.
            </div>
          )}
        </div>
      </section>

      <section className="pageSectionTight">
        <div className="pageWrap">
          <SectionHeading
            eyebrow="Built for understanding"
            title="Make the reasoning visible."
          />
          <div className="featureGrid">
            <article className="featureCard">
              <span className="featureIcon" aria-hidden="true">↔</span>
              <h3>See the structure</h3>
              <p>Visual explanations make pointer movement, comparisons, and state changes concrete.</p>
            </article>
            <article className="featureCard">
              <span className="featureIcon" aria-hidden="true">⌕</span>
              <h3>Learn to recognise it</h3>
              <p>Reusable clues connect a new problem to an idea you already understand.</p>
            </article>
            <article className="featureCard">
              <span className="featureIcon" aria-hidden="true">↗</span>
              <h3>Own the solution</h3>
              <p>Guided reasoning supports practice while keeping the original problem experience intact.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
