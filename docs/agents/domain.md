# Domain docs

How the engineering skills should read this repo's domain documentation.

**Layout: single context.** The glossary is [`docs/UBIQUITOUS_LANGUAGE.md`](../UBIQUITOUS_LANGUAGE.md) (treat it as
`CONTEXT.md`); decisions are in [`docs/adr/`](../adr).

## Before exploring, read

- `docs/UBIQUITOUS_LANGUAGE.md`.
- The ADRs in `docs/adr/` that touch the area you are about to work in.
- The design spec in `docs/superpowers/specs/` for the feature.

## Use the glossary's words

When output names a domain concept (an issue title, a refactor proposal, a test name), use the glossary's term, not
a synonym it lists under "Avoid". A concept missing from the glossary is a signal: either the language is invented
(reconsider) or there is a real gap (add it through `/domain-modeling`).

## Flag ADR conflicts

If output contradicts an ADR, say so explicitly instead of silently overriding it:

> _Contradicts ADR 0005 (levels live on the Path), but worth reopening because…_
