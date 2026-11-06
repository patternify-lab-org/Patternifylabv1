# Product blueprint analysis

This document records the implementation implications of the original Visual DSA vision and the
Phase 1 request. It keeps the full product direction visible while distinguishing it from the
foundation that is being built now.

## Product definition and learning philosophy

The defining job is helping a learner move from a mental model to independent problem solving.
Visuals must explain state changes, and solutions should support reasoning instead of replacing
it. The product is therefore not a language tutorial, coding-game collection, problem clone, or
static diagram gallery. The home page presents the learning journey; the contribution guide
forbids copied statements and default answer dumps.

## Product sections

The three sections serve different jobs and should share one navigation and design system:

- The DSA Visual Library teaches how structures and algorithms operate.
- Problem-Solving Patterns and Techniques teaches reusable reasoning and is the first complete
  curriculum track.
- Problem Practice connects original learning notes to source problems without recreating their
  submission experience.

Phase 1 gives all requested sections a clear route, but explicitly marks future tracks as
planned. Only Sliding Window appears as sample pattern content.

## Pattern and topic learning model

Each pattern needs explanation, recognition clues, visualization, and links to problems. A pattern
must remain understandable before a problem is opened. The content schema makes topic tags,
recognition cues, an overview file, and a visualizer key part of pattern metadata.

The initial eight patterns are future data additions; they are not hard-coded into the app. Adding
them later should create content records and, where necessary, isolated visualizer modules.

## Problem progression and curation

The intended progression is five guided problems, fifteen independent-learning problems, then
broader practice. It is guidance, not an unlock system. The schema distinguishes guided,
independent, and practice, and guided entries require progressive walkthroughs and solution
references. The first release contains one small practice sample only: this avoids claiming a
researched collection that has not been curated.

Problem selection must judge prerequisite knowledge, clarity of the pattern, visual potential,
learning value, variation, and duplication, not just difficulty or popularity. Curating the
twenty-problem Sliding Window path remains curriculum work for a later phase.

## Guided and independent problem experiences

Guided pages will eventually combine an original explanation, examples, analogy, visual challenge,
progressive code, complexity discussion, and optional source links. Independent entries should
explain the task and recognition clue without showing a full answer by default. The problem schema
has fields for the later experiences, while the Phase 1 UI renders only explanation, analogy,
example, pattern clues, and the source link.

Walkthrough steps are records, not a fixed frontend sequence. Each step can provide code for
Python, Java, and/or C++, its own explanation, and lines to highlight. The schema requires one or
more steps and solution reference files for guided content, but does not prescribe a step count.

## Visualizer and challenge model

The future visualizer must support manual control and guided playback where those controls teach
the concept. A challenge should ask the learner to operate the algorithm or reason about its
state, not play an unrelated game. The common contract, registry, data configuration, and
module-local CSS boundary are now established. There is no working visualizer, arbitrary code
runner, or online judge in this phase.

## Navigation and visual design

The navigation names all six requested destinations. The shell uses a compact responsive menu,
readable type, accessible focus behavior, reduced-motion support, and a restrained palette.
Illustrative artwork is clearly marked as static, so a decorative preview cannot be mistaken for
an interactive lesson.

## Content, backend, and contributor architecture

Repository files are the source of truth. A server-only loader validates and serves structured
content without a database. JSON handles metadata and links; Markdown handles longer prose.
Problem additions remain isolated from application components and global styling. A new
visualizer is intentionally different: it is application code registered through the visualizer
registry.

The contribution process uses templates, a contributor guide, JSON Schema, duplicate and
reference checks, local-file checks, test coverage, and a PR workflow. External URL syntax is
validated, while live reachability is not a reliable pull-request gate. Maintainers remain
responsible for educational review and manual verification of third-party resources.

## Technology, cost, and deployment

The implementation follows the preferred Next.js, React, TypeScript, Tailwind, and custom
visualizer direction. It uses no paid API or database. CI is configured to validate pull requests
against main; production hosting remains a later deployment choice. A public release should
select a license before inviting outside contributions.

## Roadmap and release boundaries

The phases depend on each other: establish content conventions, build one full pattern, validate
it with learners, then expand contributors and curriculum. This implementation stops at the
foundation requested in Phase 1. Phase 2 is the interactive Sliding Window visualizer and the
complete pattern experience, beginning with deliberate problem research rather than a fabricated
list.

## Non-negotiable checks carried forward

- Teach understanding before memorized solutions.
- Make every visualization explain real algorithmic behavior.
- Keep recommended learning order non-restrictive.
- Send submissions to the original coding platform.
- Write original material and respect third-party licensing.
- Let ordinary contributors add content without editing core UI.
- Keep visualizer styling isolated.
- Avoid an unnecessary database, paid service, or insecure code execution.
- Complete one pattern before expanding broadly.

The final product remains a connected learning environment for DSA visualization, problem-solving
patterns, progressive reasoning, and carefully curated practice—not an answer dispenser.
