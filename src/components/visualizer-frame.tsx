import { getVisualizerRegistration } from "@/visualizers/registry";

export function VisualizerFrame({
  visualizerId,
  mode
}: {
  visualizerId: string;
  mode?: string;
}) {
  const registration = getVisualizerRegistration(visualizerId);
  const available = registration?.status === "available";

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
          <h3>{available ? "Visualizer module registered" : "A visualizer is planned for this pattern"}</h3>
          <p>
            {registration?.description ??
              "This content points to an unregistered visualizer. Add an isolated module and registry entry to make it available."}
          </p>
        </div>
      </div>
      <div className="visualizerFrameFooter">
        Module key: {visualizerId}
        {mode ? " · Configuration: " + mode : ""}
      </div>
    </section>
  );
}
