# Visual DSA

Visual DSA is a free, open-source learning platform for understanding data structures and
algorithms, recognizing reusable problem-solving patterns, and practising independently.

The learning journey is:

**Understand → Visualise → Recognise → Practise → Solve independently.**

The Phase 1 foundation now supports the first Phase 2 learning experience: a guided, interactive
lesson for LeetCode 2379 that introduces fixed-size Sliding Window reasoning from the problem
story through independent practice. The broader curriculum and other visualizer variants remain
future work.

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
- src/lib/content/ contains content types, schema validation, and the server-side content loader.
- src/visualizers/ contains the visualizer contract, registry, algorithms, state models, and isolated modules.
- content/patterns/ and content/problems/ contain contributor-managed learning material.
- content/schemas/ defines pattern, problem, and guided-lesson JSON formats.
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
problem contribution does not require application component changes. A guided problem can use
walkthroughs with solution references or a schema-validated staged lesson (`lessonFile`).

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Do not copy LeetCode statements or editorials; link
to the source problem and write original learning material.

## Scope and licensing

The initial app has no database, account system, paid API, or code execution service. LeetCode
remains the destination for problem submissions. A project license should be selected before
public release.
