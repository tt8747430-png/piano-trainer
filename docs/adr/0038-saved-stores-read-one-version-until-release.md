# ADR 0038 — Saved stores read one version until release

- **Status:** accepted · **Date:** 2026-10-10 · **Amends:** ADR 0003 (saved state in stores), ADR 0022 (`pt-views`),
  ADR 0028 (`pt-takes`)

## Context

Every saved store read any version's save: `pt-settings` had reached version 11 and its sanitiser, its tests and
its comments carried each older shape; `pt-views` moved paths that had gone or become tabs; `pt-takes` read a
version-1 take's sustain-only presses; `pt-progress` dropped a version-1 quiz count. The app is in preview and has
no users: none of those saves exists anywhere that matters, and each shape change cost a reader of the old one.

## Decision

- **A store reads a save of its own version only.** `createSavedStore` hands `merge` nothing of another version's
  save, and the store starts from its initial state, which it saves over the old one.
- **Within a version the sanitiser still reads field by field.** Stored JSON stays untrusted, and a field added
  later reads as its default, so an additive change needs no new version.
- **A shape change bumps the version**, with no migration and no reader of the old shape.
- **Another tab is followed only in the same version** (`followOtherTabs`): two tabs of different versions leave
  each other's saves alone.
- **Every store starts again at version 1.** The old shapes' readers, their tests and the history in their comments
  go.

## Consequences

- Shipping a shape change resets that store for anyone who has used the preview: their settings, progress, own
  songs, takes, patterns or remembered views, as the store may be. The built-in content is code and never resets.
- On release this is revisited: from the first user on, a shape change again needs a reader of the old shape.
