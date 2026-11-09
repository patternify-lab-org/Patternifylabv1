import type { ComponentType } from "react";
import type { ProblemLesson } from "@/lib/content/types";

export type VisualizerConfiguration = {
  mode: string;
  settings?: Record<string, unknown>;
};

export type VisualizerProps = {
  configuration: VisualizerConfiguration;
  lesson?: ProblemLesson;
};

export type VisualizerModule = {
  default: ComponentType<VisualizerProps>;
};

export type VisualizerRegistration = {
  id: string;
  title: string;
  status: "planned" | "available";
  description: string;
  supports?: (configuration: VisualizerConfiguration) => boolean;
  load?: () => Promise<VisualizerModule>;
};
