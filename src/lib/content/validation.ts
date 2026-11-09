import Ajv, { type AnySchema, type ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import patternSchema from "../../../content/schemas/pattern.schema.json";
import problemSchema from "../../../content/schemas/problem.schema.json";
import problemLessonSchema from "../../../content/schemas/problem-lesson.schema.json";
import { listVisualizerRegistrations } from "../../visualizers/registry";
import type { PatternContent, ProblemContent } from "./types";
import type { ProblemLesson } from "./types";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validatePattern = ajv.compile<PatternContent>(patternSchema as AnySchema);
const validateProblem = ajv.compile<ProblemContent>(problemSchema as AnySchema);
const validateProblemLessonRecord = ajv.compile<ProblemLesson>(problemLessonSchema as AnySchema);

const lessonStageOrder: ProblemLessonStageId[] = [
  "understand",
  "recount",
  "discover",
  "pattern",
  "challenge"
];

type ProblemLessonStageId = ProblemLesson["stages"][number]["id"];

export type ContentValidationResult = {
  valid: boolean;
  errors: string[];
  patterns: PatternContent[];
  problems: ProblemContent[];
};

export function validateProblemLesson(value: unknown): { lesson?: ProblemLesson; errors: string[] } {
  if (!validateProblemLessonRecord(value)) {
    return {
      errors: (validateProblemLessonRecord.errors ?? []).map((issue) => {
        return "Invalid problem lesson at " + (issue.instancePath || "/") + ": " + issue.message;
      })
    };
  }

  const lesson = value as ProblemLesson;
  const errors: string[] = [];
  if (lesson.stages.some((stage, index) => stage.id !== lessonStageOrder[index])) {
    errors.push("Problem lesson stages must be ordered: " + lessonStageOrder.join(", "));
  }
  if (lesson.challenge.windowSize > lesson.challenge.input.length) {
    errors.push("Problem lesson challenge windowSize cannot exceed the input length");
  }
  return errors.length ? { errors } : { lesson, errors };
}

function formatSchemaErrors(
  kind: "pattern" | "problem",
  index: number,
  issues: ErrorObject[] | null | undefined
): string[] {
  return (issues ?? []).map((issue) => {
    const location = issue.instancePath || "/";
    return "Invalid " + kind + " #" + (index + 1) + " at " + location + ": " + issue.message;
  });
}

function reportDuplicates<T extends { id: string; slug: string }>(
  records: T[],
  kind: "pattern" | "problem",
  errors: string[]
): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const record of records) {
    if (ids.has(record.id)) {
      errors.push("Duplicate " + kind + " id: " + record.id);
    }
    if (slugs.has(record.slug)) {
      errors.push("Duplicate " + kind + " slug: " + record.slug);
    }
    ids.add(record.id);
    slugs.add(record.slug);
  }
}

export function validateContentRecords(
  patternRecords: unknown[],
  problemRecords: unknown[]
): ContentValidationResult {
  const errors: string[] = [];
  const patterns: PatternContent[] = [];
  const problems: ProblemContent[] = [];

  patternRecords.forEach((record, index) => {
    if (validatePattern(record)) {
      patterns.push(record as PatternContent);
    } else {
      errors.push(...formatSchemaErrors("pattern", index, validatePattern.errors));
    }
  });

  problemRecords.forEach((record, index) => {
    if (validateProblem(record)) {
      problems.push(record as ProblemContent);
    } else {
      errors.push(...formatSchemaErrors("problem", index, validateProblem.errors));
    }
  });

  reportDuplicates(patterns, "pattern", errors);
  reportDuplicates(problems, "problem", errors);

  const visualizerIds = new Set(
    listVisualizerRegistrations().map((registration) => registration.id)
  );
  for (const pattern of patterns) {
    if (!visualizerIds.has(pattern.visualizer.id)) {
      errors.push(
        "Pattern " + pattern.id + " references unregistered visualizer " + pattern.visualizer.id
      );
    }
  }
  for (const problem of problems) {
    if (!visualizerIds.has(problem.visualizer.id)) {
      errors.push(
        "Problem " + problem.id + " references unregistered visualizer " + problem.visualizer.id
      );
    }
  }

  const patternById = new Map(patterns.map((pattern) => [pattern.id, pattern]));
  const problemIds = new Set(problems.map((problem) => problem.id));

  for (const pattern of patterns) {
    for (const problemId of pattern.problemIds) {
      if (!problemIds.has(problemId)) {
        errors.push("Pattern " + pattern.id + " references missing problem " + problemId);
      }
    }
  }

  for (const problem of problems) {
    const pattern = patternById.get(problem.patternId);
    if (!pattern) {
      errors.push("Problem " + problem.id + " references missing pattern " + problem.patternId);
    } else if (!pattern.problemIds.includes(problem.id)) {
      errors.push("Pattern " + pattern.id + " does not list problem " + problem.id);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    patterns,
    problems
  };
}
