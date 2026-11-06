# Visual DSA

Visual DSA is a free, open-source learning platform for understanding data structures and
algorithms, recognizing reusable problem-solving patterns, and practising independently.

The learning journey is:

**Understand → Visualise → Recognise → Practise → Solve independently.**

This repository is in Phase 1: a Next.js foundation, a contributor-managed content pipeline, and
one small Sliding Window sample. The interactive visualizer and full learning curriculum are
planned for a later phase.

## Requirements

- Node.js 20.19 or later
- npm

The current workspace uses Node 24 and npm 11.

## Run locally

Install the locked dependencies, then start the development server:

    npm ci
    npm run dev

Open http://localhost:3000.

## Project map

- src/app/ contains the App Router routes and shared layout.
- src/components/ contains reusable interface pieces.
- src/lib/content/ contains content types, validation, and the server-side content loader.
- src/visualizers/ contains the visualizer contract and registry.
- content/patterns/ and content/problems/ contain contributor-managed learning material.
- content/schemas/ defines the JSON content formats.
- docs/templates/ and CONTRIBUTING.md guide content contributions.
- .github/workflows/validate.yml runs validation, tests, lint, type checks, and a production build
  for pull requests to main.

See [the architecture notes](docs/architecture.md) and
[the contribution guide](CONTRIBUTING.md) for the details.

## Common commands

    npm run dev
    npm run validate:content
    npm test
    npm run lint
    npm run typecheck
    npm run build

The production build includes content validation. The complete npm run check command runs
content validation, tests, lint, and TypeScript checks.

## Add learning content

Create a folder under content/problems/, copy
[docs/templates/problem.template.json](docs/templates/problem.template.json), and add an original
Markdown explanation. Link the problem ID from the appropriate pattern metadata file. An ordinary
problem contribution does not require application component changes. Guided problems also need
walkthrough steps and solution references, as required by the schema.

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Do not copy LeetCode statements or editorials; link
to the source problem and write original learning material.

## Scope and licensing

The initial app has no database, account system, paid API, or code execution service. LeetCode
remains the destination for problem submissions. A project license should be selected before
public release.
