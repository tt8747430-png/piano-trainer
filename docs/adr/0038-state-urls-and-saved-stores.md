# ADR 0038 — State: what is looked at in the URL, what is remembered in saved stores

- **Status:** accepted · **Date:** 2026-09-24 · consolidated 2026-10-27

## Context

The old app kept everything in one `localStorage` object: the chord on screen, the tempo, the quiz score, the last
tab. Stale view state survived reloads and nothing could be linked to. Then the opposite problem: once the screen
lived in the URL, a piece practised in G major in the 1st inversion opened again in C, root position. The app is in
preview and has no users, so every reader of an old save's shape was cost with no one to serve.

## Decision

- **What you look at is in the URL**: typed search params, validated by each route's validator. An invalid value
  falls back to the default. Links are exact and Back works.
- **What must be remembered is in a saved store**, each a `createSavedStore` (zustand `persist` over
  `localStorage`): its key, its version, its initial state and one sanitiser. Stored JSON is untrusted and read field
  by field, so a field added later reads as its default. A store follows another tab's saves of its own version. A
  store whose save is large writes it compactly through its `write`. Settings' Backup writes every saved store as one
  file and puts it back whole.
- **One version until release.** A store reads a save of its own version only. Any other starts from the initial
  state, which is saved over it. A shape change bumps the version, with no migration and no reader of the old shape.
  Built-in content is code and never resets. On release this is revisited: from the first user on, a shape change
  needs a reader of the old shape again.
- **A screen opened plainly comes back as it was left.** `pt-views` keeps each remembered screen's last params (at
  most 200 screens, the oldest dropped). A route says it is remembered in `staticData.remembered`, and its
  `beforeLoad` (`routes/remember.ts`) builds the view by two rules:
  1. opened plainly (a link marked `OPEN_PLAINLY`: a row in a list, Continue, a piece's Practise), it comes back as
     left;
  2. opened by a link that names what to show (a lesson's link, a progression's Practise), it shows that, and each of
     the screen's kept params the link leaves out takes the remembered value.

  The redirect replaces the history entry and happens at most once. A remembered value is read like a URL's: one the
  reader rejects opens the default. Plainness is the link's mark, not a bare URL, because the router leaves a route's
  defaults out of its URL.

- **Not remembered:** lists and their filters (a stale filter hides what the learner looks for), Practice's list,
  Settings, a quiz's list, the loop, and a visit's own params: `bar` (ADR 0115), `click` and `keys` (ADR 0111).
- **Everything else** is component state.

## Consequences

- Shipping a shape change resets that store for anyone who has used the preview. The store's version is in its
  `store.ts`, never in a doc.
- A new link that opens a remembered screen plainly carries `OPEN_PLAINLY`; one that names what to show does not.

## History

- 0003 — View state in the URL, saved state in versioned stores with migrations (2026-09-24). Its migrations went
  with 0038.
- 0022 — A screen opened plainly comes back as it was left (2026-10-01).
- 0038 — Saved stores read one version until release (2026-10-10).
