import "server-only";

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { notFound } from "next/navigation";
import type { PatternContent, ProblemContent } from "./types";
import { validateContentRecords } from "./validation";

const CONTENT_ROOT = resolve(process.cwd(), "content");
const CONTENT_PREFIX = "content/";

function resolveContentFile(file: string): string {
  if (!file.startsWith(CONTENT_PREFIX)) {
    throw new Error("Content file must stay inside content/: " + file);
  }

  const contentRelativePath = file.slice(CONTENT_PREFIX.length);
  const absolutePath = resolve(CONTENT_ROOT, contentRelativePath);
  const relativePath = relative(CONTENT_ROOT, absolutePath);
  if (relativePath.startsWith(".." + sep) || relativePath === ".." || isAbsolute(relativePath)) {
    throw new Error("Content file must stay inside content/: " + file);
  }
  return absolutePath;
}

function readJsonFile(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
}

function readRecords(directory: string, fileName: string): unknown[] {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => resolve(directory, entry.name, fileName))
    .filter((filePath) => existsSync(filePath) && statSync(filePath).isFile())
    .map(readJsonFile);
}

export function loadContent(): { patterns: PatternContent[]; problems: ProblemContent[] } {
  const result = validateContentRecords(
    readRecords(resolve(CONTENT_ROOT, "patterns"), "pattern.json"),
    readRecords(resolve(CONTENT_ROOT, "problems"), "problem.json")
  );

  const referencedFiles = [
    ...result.patterns.map((pattern) => pattern.overviewFile),
    ...result.problems.flatMap((problem) => [
      problem.explanationFile,
      ...(problem.analogyFile ? [problem.analogyFile] : []),
      ...(problem.solutionReferences ?? []).map((reference) => reference.file)
    ])
  ];

  for (const file of referencedFiles) {
    try {
      const absolutePath = resolveContentFile(file);
      if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
        result.errors.push("Missing content file: " + file);
      }
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : "Invalid content file: " + file);
    }
  }

  if (result.errors.length > 0) {
    throw new Error("Invalid Visual DSA content:\n- " + result.errors.join("\n- "));
  }

  return { patterns: result.patterns, problems: result.problems };
}

export function getPatterns(): PatternContent[] {
  return loadContent().patterns.sort((left, right) => left.title.localeCompare(right.title));
}

export function getPatternBySlug(slug: string): PatternContent {
  const pattern = loadContent().patterns.find((item) => item.slug === slug);
  if (!pattern) {
    notFound();
  }
  return pattern;
}

export function getProblems(): ProblemContent[] {
  return loadContent().problems.sort((left, right) => left.title.localeCompare(right.title));
}

export function getProblemById(id: string): ProblemContent {
  const problem = loadContent().problems.find((item) => item.id === id);
  if (!problem) {
    notFound();
  }
  return problem;
}

export function getProblemBySlug(slug: string): ProblemContent {
  const problem = loadContent().problems.find((item) => item.slug === slug);
  if (!problem) {
    notFound();
  }
  return problem;
}

export function readContentMarkdown(file: string): string {
  const absolutePath = resolveContentFile(file);
  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    throw new Error("Missing content file: " + file);
  }
  return readFileSync(absolutePath, "utf8");
}
