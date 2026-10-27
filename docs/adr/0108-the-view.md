# ADR 0108 — The View: the music as sheet music, chords over lyrics, diagrams or a grid

- **Status:** accepted · **Date:** 2026-10-24 · consolidated 2026-10-27

## Context

Chordify shows a song as one of several views ("Pick your view": over lyrics, diagrams, a grid), each following a
strip of beats; draws every chord on the same piano keys so a song's chords change by a key or two; keeps the
inversion chosen for a chord in a song; and names the view in a toolbar beside a view's own modes. The owner found our
View misleading (the sheet music's layout read as every view's), the diagrams changing keys and size with every chord,
and the Diagrams view scrolling and jumping under a finger.

## Decision

- **Four views** (`scoreView.music`): **Sheet music**, **Chords over lyrics**, **Diagrams** and **Grid**, chosen as
  tiles at the top of the View. A view the music cannot show is greyed with what it needs, and a saved one falls back.
  "Ask each time a song opens" opens a piece's Player with the View. The editor shows the sheet music alone.
- **One View menu** (`ScoreViewMenu`) in both modes, the first of the tools row, named by the view shown. Under the
  tiles, the view shown's own section: the sheet music's Layout (ADR 0096) and what it shows as chips (each staff by
  its name, Chord symbols, Chord positions, Lyrics, Finger numbers, Note names); Over lyrics' Diagrams pinned and Text
  size; Diagrams' Mode (Animated · Summary) and Lyrics; the Grid's Lyrics. Last, Every view: the Keys. A chip is
  pressed while shown; a greyed one says why (the last staff in sight, music of no words). The editor's View has no
  tiles and none of what only practice has.
- **Beats.** The chord views count a bar in beat cells as its meter counts, follow the cursor and Listen's clock, and
  a tap on any chord (a diagram, a card, a chip, a beat) takes the cursor there, sounding it while nothing plays. No
  chord view opens a chord's sheet; a laptop shows a chip's diagram on hover.
- **The beat strip** names a chord only where it changes and a rest where the music turns to none; it follows the
  clock frame by frame and is dragged, flicked or trackpad-scrolled to scrub, gliding to the beat at its mark.
- **Diagrams on one keyboard.** Every chord diagram is drawn on F3–B4, its tones folded into F3–E4: a slash chord's
  bass lowest, or a ring where it is not a tone; a chord of five notes or more with its root not lowest. A chord of
  three or four notes is drawn in the inversion the learner chose on its sheet, kept for that chord in that song
  (`pt-diagram-inversions`). It changes the picture, not what the Player plays.
- **Diagrams** shows the chord sounding and the next, the same size (Animated), or the song's chords at once with
  the one sounding outlined (Summary), the words sung lit under them. Nothing in the view scrolls; the pair slides
  half a beat before each change and is swiped to the next or previous chord; both run into the gutters and fade.
- **Chords over lyrics**: each line's chords over its words, verses stacked; a line of chords alone played again
  straight after itself shown once with ×N; the diagrams pinned under the strip; the text sized 80–150%; the playing
  line kept in the top third.
- **The Grid** is the chart in beats: every row the same beats (whole bars of the music's commonest length that fit),
  a section's bars running on and each section a new row, a pickup at the end of a full bar's place, the words under
  the beats.
- **Under reduced motion** nothing glides or springs: each beat snaps.
- **In Listen**, the keys at a chord view's foot mark the chord sounding as its diagram draws it.

## Consequences

The View's choices are saved in `pt-settings`' `scoreView`; the inversions in their own store, in the backup. A walk,
a progression and an exercise keep no inversion choice.

## History

- 0098 — A song's page introduces it; its chord chart is the Player's (2026-10-24). The page is ADR 0111's.
- 0099 — Four views: Sheet music, Chords over lyrics, Diagrams, Grid (2026-10-25).
- 0101 — Chord diagrams on one keyboard, an inversion per chord (2026-10-26).
- 0102 — The tools row's View, the menu by view (2026-10-26).
- 0108 — The chord views made even, still and tappable (2026-10-26).
- 0115 — The View's parts as chips, the layouts as tiles (2026-10-27).
