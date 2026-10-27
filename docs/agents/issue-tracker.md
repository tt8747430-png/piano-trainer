# Issue tracker: local Markdown

Issues and specs live as Markdown in `.scratch/`, one directory per feature: `.scratch/<feature-slug>/`.

- The spec is `spec.md` in that directory.
- Issues are one file each, `issues/<NN>-<slug>.md`, numbered from `01`.
- Triage state is a `Status:` line near the top ([triage-labels](triage-labels.md)).
- Comments go at the bottom under `## Comments`.
- A finished feature's directory is removed; its decision, if any, lives on as an ADR in `docs/adr/`.

"Publish to the issue tracker" → create the file, and the directory if needed. "Fetch the ticket" → read the file
at the path or number the owner gives.
