export type PatternStatus = "planned" | "in-progress" | "complete";
export type LearningTrack = "guided" | "independent" | "practice";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type SupportedLanguage = "python" | "java" | "cpp";

export type PatternContent = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: PatternStatus;
  topics: string[];
  recognitionCues: string[];
  overviewFile: string;
  visualizer: {
    id: string;
    status: "planned" | "available";
  };
  problemIds: string[];
};

export type ProblemExample = {
  input: string;
  output: string;
  note?: string;
};

export type WalkthroughStep = {
  id: string;
  title: string;
  explanation: string;
  codeByLanguage: Partial<Record<SupportedLanguage, string>>;
  highlightedLines?: number[];
};

export type ProblemContent = {
  id: string;
  slug: string;
  patternId: string;
  title: string;
  difficulty: Difficulty;
  learningTrack: LearningTrack;
  leetcodeUrl: string;
  summary: string;
  explanationFile: string;
  analogyFile?: string;
  examples: ProblemExample[];
  tags: string[];
  recognitionClues: string[];
  visualizer: {
    id: string;
    mode: string;
    settings?: Record<string, unknown>;
  };
  walkthrough?: WalkthroughStep[];
  solutionReferences?: Array<{
    language: SupportedLanguage;
    file: string;
  }>;
  videos?: Array<{
    title: string;
    creator: string;
    url: string;
    whatItTeaches?: string;
    whyRecommended: string;
  }>;
};
