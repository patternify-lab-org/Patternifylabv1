import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { validateContentRecords } from "../src/lib/content/validation";
import type { PatternContent, ProblemContent } from "../src/lib/content/types";

const root = process.cwd();

function readContentDirectories(directoryName: "patterns" | "problems", fileName: string): unknown[] {
  const directory = resolve(root, "content", directoryName);
  if (!existsSync(directory)) {
    return [];
  }

  const records: unknown[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const filePath = resolve(directory, entry.name, fileName);
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      records.push(JSON.parse(readFileSync(filePath, "utf8")) as unknown);
    }
  }
  return records;
}

function referencedFiles(patterns: PatternContent[], problems: ProblemContent[]): string[] {
  return [
    ...patterns.map((pattern) => pattern.overviewFile),
    ...problems.flatMap((problem) => [
      problem.explanationFile,
      ...(problem.analogyFile ? [problem.analogyFile] : []),
      ...(problem.solutionReferences ?? []).map((reference) => reference.file)
    ])
  ];
}

function main(): void {
  const result = validateContentRecords(
    readContentDirectories("patterns", "pattern.json"),
    readContentDirectories("problems", "problem.json")
  );
  const errors = [...result.errors];

  for (const file of referencedFiles(result.patterns, result.problems)) {
    const absolutePath = resolve(root, file);
    const relativePath = relative(resolve(root, "content"), absolutePath);
    if (
      relativePath.startsWith(".." + sep) ||
      relativePath === ".." ||
      relativePath.startsWith(sep)
    ) {
      errors.push("Content file must stay inside content/: " + file);
    } else if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
      errors.push("Missing content file: " + file);
    }
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error("✗ " + error);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    "Validated " +
      result.patterns.length +
      " pattern(s) and " +
      result.problems.length +
      " problem(s)."
  );
}

main();
