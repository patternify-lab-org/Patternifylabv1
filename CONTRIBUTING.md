# Contributing learning content

Visual DSA accepts focused contributions to explanations, examples, and learning resources. A
problem should teach an idea clearly and independently; popularity or difficulty alone is not a
reason to include it.

## Add a problem

1. Choose an existing pattern folder under content/patterns/.
2. Create a folder under content/problems/ using a lowercase, hyphen-separated ID.
3. Copy docs/templates/problem.template.json to that folder as problem.json.
4. Replace every placeholder. Keep the id and slug unique, set patternId, and use an exact
   LeetCode problem URL only when the problem has been checked.
5. Write an original explanation in explanation.md. Add an analogy file when it helps, and use
   examples you have checked against the source problem.
6. Add the problem ID to the pattern's problemIds list. Keep the learning progression open; it
   is a recommendation, not an access restriction.
7. Use the pattern's registered visualizer ID and add only declarative configuration in the
   problem file. Do not add CSS or executable code to content files.
8. For learningTrack: "guided", include progressive walkthrough steps and solutionReferences.
   A new walkthrough can contain a different number of steps from any other problem. Language
   references can use Python, Java, or C++.
9. Add video recommendations only after checking the title, creator, link, relevance, and
   accessibility.
10. Run the checks below and submit a pull request.

## Check a contribution

    npm run validate:content
    npm test
    npm run lint
    npm run typecheck
    npm run build

The content validator checks each record against JSON Schema, duplicate IDs and slugs, pattern to
problem references, registered visualizer IDs, and the existence of referenced local files. Link
syntax and the LeetCode host/path are checked. Live external availability is not checked in pull
requests because external services can block automated requests or change independently.

The pull request workflow repeats these checks. Keep one problem or one isolated visualizer in a
contribution where practical so review stays focused.

When the repository is published, protect main by requiring pull requests and the
Content and application checks status. The workflow grants read-only repository permissions and
does not attempt to change repository branch-protection settings.

## Add a new visualizer

Adding a problem with an existing visualizer is content-only. A genuinely new visualizer is an
application-code change:

1. Create a module under src/visualizers/modules/<visualizer-id>/.
2. Implement the shared props in src/visualizers/contract.ts.
3. Keep styles in a colocated CSS Module.
4. Register the module in src/visualizers/registry.ts.
5. Add focused tests and update documentation.

The component contract receives a mode and plain settings object. Visualizer-specific behavior
should stay inside the module instead of growing into a shared all-pattern component.

## Content boundaries

- Do not copy complete LeetCode statements, examples, or editorial explanations wholesale.
- Do not add unverified difficulty, constraints, accepted approaches, or external resources.
- Do not add arbitrary HTML, CSS, JavaScript, or executable code to content files.
- Do not add a full answer to a practice entry by default.
- Keep explanations focused on algorithmic reasoning; Visual DSA is not a programming-language
  course or an online judge.

Content schemas are in content/schemas/. The JSON files are the source of truth for metadata;
Markdown files hold longer original explanations and analogies.
