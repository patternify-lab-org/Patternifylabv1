import type { VisualizerRegistration } from "./contract";

const registrations: Record<string, VisualizerRegistration> = {
  "sliding-window": {
    id: "sliding-window",
    title: "Sliding Window",
    status: "available",
    description:
      "Explore fixed-size groups of black and white blocks, compare independent recounting with an incremental update, and practise the change on a fresh input.",
    supports: (configuration) => configuration.settings?.inputType === "black-white-string",
    load: () => import("./modules/sliding-window/SlidingWindowVisualizer")
  }
};

export function getVisualizerRegistration(id: string): VisualizerRegistration | undefined {
  return registrations[id];
}

export function listVisualizerRegistrations(): VisualizerRegistration[] {
  return Object.values(registrations);
}
