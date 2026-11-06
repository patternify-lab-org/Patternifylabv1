import type { ComponentType } from "react";

export type VisualizerConfiguration = {
  mode: string;
  settings?: Record<string, unknown>;
};

export type VisualizerProps = {
  configuration: VisualizerConfiguration;
};

export type VisualizerModule = {
  default: ComponentType<VisualizerProps>;
};

export type VisualizerRegistration = {
  id: string;
  title: string;
  status: "planned" | "available";
  description: string;
  load?: () => Promise<VisualizerModule>;
};
