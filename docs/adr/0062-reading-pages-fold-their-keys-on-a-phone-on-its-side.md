# ADR 0062 — A reading page folds its keys on a phone on its side

- **Status:** accepted · **Date:** 2026-10-20 · **Amends:** ADR 0055 (docked keys that fold)

## Context

On a phone on its side the screen is about 375px tall. A lesson, an explorer, a song's page or a pattern's page docks
its keys at the foot (ADR 0055), and the keys with their rail take most of what is left: the page being read shows a
line or two at a time. The learner reads these pages more than they play on them. The screens played on (the Player,
the score editor, the Chord finder, a Quiz round, the Check) need their keys in sight at every size.

## Decision

- **A reading page opens with its keys folded on a phone on its side** (`landscape-phone`: landscape, at most 500px
  tall and narrower than 1024px). The Keys button floats where they were, and one tap unfolds them.
- **That fold is remembered apart from the upright one:** `pt-settings`' keyboard settings gain `foldedLandscape`
  (true by default) beside `folded`. Folding or unfolding on a phone on its side writes `foldedLandscape`; held upright,
  on a tablet or a laptop, `folded` as before. Turning the phone never changes the other.
- **A screen played on says so:** `PinnedKeyboard`'s `screen="playing"` (and `useFoldKeys('playing')`) reads and writes
  `folded` alone, so its keys stay out on a phone on its side. The Chord finder is the one such page with a
  `PinnedKeyboard`; the Player, the editor, Quiz rounds and the Check draw their own keys and never fold them.
- Settings' keyboard fields show both folds: Hide a page's keys, and Hide them on a phone on its side.
- `pt-settings` is version 3 (ADR 0038): a version 2 save is read as none.

## Consequences

`LANDSCAPE_PHONE` in `shared/lib` is the variant's media query for code (`useMediaQuery`), shared with the Player's
transport. A new page that is played on passes `screen="playing"`; any other gets the reading default.
