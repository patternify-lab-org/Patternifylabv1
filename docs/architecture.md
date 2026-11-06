# Phase 1 architecture

## Decisions

### Next.js App Router, React, and TypeScript

The App Router provides file-based routes and shared layouts for the six requested navigation
areas. Pattern and problem pages are generated from repository content. Server Components read
the local content without adding a database or sending learning material through an API.

Tailwind CSS is available for utility styling; the foundation uses a small set of global design
tokens and semantic component classes so layout and content remain readable. No animation or
visualization package is included in Phase 1.

### Content is data, not page code

Patterns and problems live in separate folders under content/. JSON files hold metadata and
cross-references. Markdown files hold longer prose. A new problem adds a content folder and a
problem ID to its pattern's manifest; the route, card, and practice list discover it without
application component edits.

The content schemas are JSON Schema Draft 7 so contributors can read the schema and the validator
can use the widely supported Ajv implementation. The guided track condition requires both
progressive walkthrough steps and language-specific solution references. The schema leaves the
step count open per problem.

### The loader is server-only

src/lib/content/loader.ts discovers repository files, validates their shape and relationships,
checks local Markdown references, and returns typed records. It cannot be imported into client
components. This keeps filesystem access out of browser bundles and makes the content source
replaceable later if a real service is justified.

### Visualizers are isolated modules

Problem and pattern content stores a visualizer ID and declarative configuration. The registry
maps an ID to a visualizer definition; the contract accepts a mode and plain settings. A new
problem can reuse an existing ID without touching the registry. A genuinely new visualizer adds
an isolated module and one registration. Its styles belong in a colocated CSS Module.

The Phase 1 registry includes a planned Sliding Window entry with no implementation. The UI makes
that status clear instead of implying controls already work.

### External services stay external

The initial app has no accounts, database, paid API, or arbitrary code execution. The LeetCode
URL is metadata for a link to the original problem. Progress storage, a code editor, and secure
execution require separate product decisions and are deferred.

## Repository map

    content/
      patterns/
        sliding-window/
          pattern.json
          overview.md
      problems/
        maximum-average-subarray-i/
          problem.json
          explanation.md
          analogy.md
      schemas/
        pattern.schema.json
        problem.schema.json
    docs/
      templates/
    src/
      app/
      components/
      lib/content/
      visualizers/
        modules/
    scripts/
    .github/workflows/

## Validation flow

The content validator checks JSON schemas, unique identifiers, bidirectional pattern/problem
references, registered visualizer keys, and referenced Markdown or solution files. URL formats and
the LeetCode problem URL path are checked locally. CI deliberately does not make pull requests
depend on live external sites.

The GitHub Actions workflow runs on pull requests to main and pushes to main, requests only
read access to repository contents, and runs content validation, tests, ESLint, TypeScript, and a
production build. It is compatible with a protected main branch; requiring its status and pull
request reviews is a repository setting for the maintainer. Deployment can later be connected
through the repository's hosting provider.

## Phase boundaries

Phase 1 builds the routes, content model, validation, templates, contributor docs, shell, and
visualizer registration boundary. Phase 2 can implement the Sliding Window visualizer and richer
problem experiences without changing the content-to-route model.
