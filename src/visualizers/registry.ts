import type { VisualizerRegistration } from "./contract";

const registrations: Record<string, VisualizerRegistration> = {
  "sliding-window": {
    id: "sliding-window",
    title: "Sliding Window",
    status: "planned",
    description:
      "The module contract is ready for a fixed-size and variable-size visualizer with editable inputs and step controls."
  }
};

export function getVisualizerRegistration(id: string): VisualizerRegistration | undefined {
  return registrations[id];
}

export function listVisualizerRegistrations(): VisualizerRegistration[] {
  return Object.values(registrations);
}
