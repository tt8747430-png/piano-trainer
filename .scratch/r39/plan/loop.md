# R39: the design loop over Songs and Practice

## Source (owner, 2026-11-08, verbatim)

"now continue in a loop and use these best practices and you need to research more and look at the example apps and
websites and my previous instructions and you have to refactor the design of the songs library, songs overview, and
songs editor. and after that refactor each of the practices pages. make such designs for each of the page is this
mockup frames and use best practices and skills and when the session in compacted you need to research more and look
at the example apps and websites again. use the refactor a page skills and all needed skills and read them again also
after compacting"

## How each page runs (read this first after a compaction)

1. Re-read the skills: `redesigning-a-screen` (all of it), `owner-way` and its references `feedback-log` (the area's
   section), `ui-and-mockups`, `craft-details`, `testing`; `redesigning-a-screen/references/lessons-from-videos.md`.
2. Look again at the reference apps (`piano-data/reference-apps/*`: chordify, flat-score-editor, flowkey, new_app_2
   (Noji), new-app, ultimate-piano, sibelius, dorico editor; `piano-data/web-references`) and research on the web
   (manuals and help pages of Flat, forScore, MuseScore, Soundslice, flowkey, Chordify, Mindscape, Noji).
3. Audit the page in the code: every control, its file, label, default.
4. Spec `.scratch/r39/plan/<page>.md`: premium for the area, research cited, rulings as they stand, will build.
5. Canvas: one Design artifact per area, in the Player canvas's frames (phone in its bezel, laptop in its browser
   window), real songs and labels, working taps; the polish pass; Playwright shots at both sizes.
6. Publish, save drawings to `.scratch/r39/drawings/`, feedback-log bullet, commit by path, push.

## Order and state

| # | Page | Canvas | State |
| - | ---- | ------ | ----- |
| 1 | Songs library (`/songs`, My songs · Explore) | [The ideal Piano Trainer](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH) (was The ideal Songs) | drawn, waiting for the owner |
| 2 | Song's page (`/songs/$pieceId`) | [The ideal Songs](https://claude.ai/artifact/Ana84hFnmzQCBFuvNZRmXB), row 2 | drawn, waiting for the owner |
| 3 | Score editor (`/edit/$pieceId`) | [The ideal Songs](https://claude.ai/artifact/Ana84hFnmzQCBFuvNZRmXB), row 3 | drawn, waiting for the owner |
| 4 | Practice overview (`/practice`) | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH) | drawn, waiting for the owner |
| 5 | Chords (`/practice/chords`) | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), row 2 | drawn, waiting for the owner |
| 6 | Scales and keys | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), row 3 | drawn, waiting for the owner |
| 7 | Intervals | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), row 4 | drawn, waiting for the owner |
| 8 | Progressions (and a progression's page) | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), rows 5 and 6 | drawn, waiting for the owner |
| 9 | Accompaniment | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), row 7 | drawn, waiting for the owner |
| 10 | Chord player | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), row 8 | drawn, waiting for the owner |
| 11 | Exercises and Quiz | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), rows 9 and 10 | drawn, waiting for the owner |
| 12 | Tools: Metronome, Tuner, Chord finder, Circle of fifths | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), rows 11 to 14 | drawn, waiting for the owner |

Standing rules: design only, no app code until the owner's "ok"; the owner's rulings in each area's specs and the
feedback log win over any reference.

**One canvas (2026-11-08, the owner: "connect all pages from one artifact"):** Songs and Practice are one canvas,
[The ideal Piano Trainer](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH) (v11): Songs on top, Practice below, a
title over each. In Play every page is linked: the tab bar and sidebar (Songs, Practice), Practice's cards to their
pages, each Back, a song's row to its page, Edit score to the editor and Done back. `canvas/link.py` copies the Songs
boards in and adds the links; run it after any generator. The old Songs canvas stays but is no longer updated.

**R40, calm (2026-11-08):** every Songs and Practice page redrawn in the calm Chords page's language (spec
`.scratch/r40/plan/calm.md`), canvas v13. `canvas/calm.py` and `calm_songs.py` draw the pages, `index.py` lays them out;
`link.py` is retired.

**R41 (2026-11-08):** R40's one layout withdrawn; each page refactored to its reference in the calm language (spec
**R41 v15 (2026-11-08):** the Player merged into the one canvas (spec `.scratch/r41/plan/songs-and-practice.md`, "The Player, merged in").
**R42 (2026-11-08):** Chords in the Player's shape (v16, `.scratch/r42/plan/chords.md`); the kit's SHEET name clash fixed on every page.
`.scratch/r41/plan/songs-and-practice.md`), canvas v14, generator `canvas/r41.py`.
**R42 v19 (2026-11-08):** Chords' corners concentric, views Staff · Inversions · Fingering · Tensions with the chosen one in ink.
**R42 v20 (2026-11-08):** Chords' bar as Apple's toolbar (three capsules, symbols), views an equal-width segmented control under the keys.
**R42 v21 (2026-11-08):** Chords: every control in words, the inversion stepper under the chord's name.
**R42 v22 (2026-11-08):** Chords: the inversion as a slash chord in the name, the bar in three subject groups.
**R42 v24 (2026-11-08):** the app's tab bar: the app's icons over their words, the place in a lens, a fade under it; Chords' v23 undone (the owner meant the app's bar).
**R42 v25 (2026-11-08):** the tab bar to Apple's HIG read in full: filled icons, content peeking through the glass.
