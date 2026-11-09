import { getVisualizerRegistration } from "@/visualizers/registry";
import type { ProblemLesson } from "@/lib/content/types";
import type { VisualizerConfiguration } from "@/visualizers/contract";
import Link from "next/link";

export async function VisualizerFrame({
  visualizerId,
  mode,
  configuration,
  lesson,
  problemHref
}: {
  visualizerId: string;
  mode?: string;
  configuration?: VisualizerConfiguration;
  lesson?: ProblemLesson;
  problemHref?: string;
}) {
  const registration = getVisualizerRegistration(visualizerId);
  const available = registration?.status === "available";
  const supported = configuration ? registration?.supports?.(configuration) ?? true : false;

  if (available && supported && configuration && registration?.load) {
    const visualizerModule = await registration.load();
    const InteractiveVisualizer = visualizerModule.default;
    return <InteractiveVisualizer configuration={configuration} lesson={lesson} />;
  }

  return (
    <section className="visualizerFrame" aria-label="Interactive visualizer">
      <div className="visualizerFrameHeader">
        <strong>{registration?.title ?? "Interactive visualizer"}</strong>
        <span className="statusPill">{available ? "Available" : "Planned"}</span>
      </div>
      <div className="visualizerFrameBody">
        <div className="visualizerEmpty">
          <span className="visualizerGlyph" aria-hidden="true">
            {mode === "fixed-size" ? "↔" : "⌁"}
          </span>
          <h3>
            {!available
              ? "A visualizer is planned for this pattern"
              : configuration && !supported
                ? "This input needs a visualizer extension"
                : problemHref
                  ? "Interactive lesson available"
                  : "Visualizer module registered"}
          </h3>
          <p>
            {configuration && !supported
              ? "The current module teaches black-and-white block counts. A matching interactive lesson for this input type has not been added yet."
              : registration?.description ??
              "This content points to an unregistered visualizer. Add an isolated module and registry entry to make it available."}
          </p>
          {problemHref ? <Link className="textLink" href={problemHref}>Open the first lesson <span aria-hidden="true">→</span></Link> : null}
        </div>
      </div>
      <div className="visualizerFrameFooter">
        Module key: {visualizerId}
        {mode ? " · Configuration: " + mode : ""}
      </div>
    </section>
  );
}
