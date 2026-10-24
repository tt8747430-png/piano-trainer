# ADR 0097 — A score's staves are staves: any number, each named by the learner

- **Status:** accepted · **Date:** 2026-10-24 · **Supersedes:** the tune's staff as a separate option (ADR 0064,
  0083, 0091, 0094's Melody) · **Amends:** ADR 0093 (the words on a staff) · Research: Flat's Instruments (add any,
  each named), Dorico's players

## Context

The owner: "this is just a staff, not a separate option melody staff; it is just adding a new staff"; the app's own
ideas (patterns, a Melody) are not an editor's.

## Decision

- **Staves.** A score is staves top to bottom: single staves (treble or bass) and the piano's grand staff, any number
  of single staves over or under it, the piano there or not. Each staff is named by the learner: its printed name is
  edited in place as the title is (empty prints none). A staff's name opens its menu: Add a staff over, Add a staff
  under, Remove (its notes go; Undo brings them back), and, the piano's, Hide the piano (its music kept and played).
- **No Melody.** The word leaves the editor and the View: a staff is called by its name. The Player plays every staff;
  what it calls the tune (its Setup's play-along, a pattern that plays the tune) is the top single staff.
- **Words on a staff.** A song's verses belong to the staff they are written under.
- **Content.** A piece writes its single staves as a list (`staves: [{ name?, notes }]`), the tune first; `melody` goes.

## Consequences

`entities/piece` (the content and `pt-pieces`), `shared/lib/arrangement` and `shared/lib/notation` (any number of
single staves), `features/score-editor` (a layer per staff), `widgets/score-sheet`, `widgets/sheet-music`,
`widgets/score-view-menu` (a switch per staff, by its name), `pages/score-editor` (the staff menu), `pages/songs` (New
song: the piano, a staff, or both), the Player.
