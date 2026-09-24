# Issue tracker: local Markdown

Issues and specs for this repo live as Markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`.
- The spec is `.scratch/<feature-slug>/spec.md`. (Design specs from brainstorming live in
  `docs/superpowers/specs/`; implementation plans in `docs/superpowers/plans/`.)
- Implementation issues are one file per ticket, `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from
  `01`; never one combined tickets file.
- Triage state is a `Status:` line near the top of each issue (role strings in `triage-labels.md`).
- Comments and history append at the bottom under a `## Comments` heading.

## When a skill says "publish to the issue tracker"

Create a file under `.scratch/<feature-slug>/`, creating the directory if needed.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The owner normally passes the path or the issue number.
