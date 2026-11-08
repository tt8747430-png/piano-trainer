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
| 1 | Songs library (`/songs`, My songs · Explore) | [The ideal Songs](https://claude.ai/artifact/Ana84hFnmzQCBFuvNZRmXB) | drawn, waiting for the owner |
| 2 | Song's page (`/songs/$pieceId`) | [The ideal Songs](https://claude.ai/artifact/Ana84hFnmzQCBFuvNZRmXB), row 2 | drawn, waiting for the owner |
| 3 | Score editor (`/edit/$pieceId`) | [The ideal Songs](https://claude.ai/artifact/Ana84hFnmzQCBFuvNZRmXB), row 3 | drawn, waiting for the owner |
| 4 | Practice overview (`/practice`) | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH) | drawn, waiting for the owner |
| 5 | Chords | | |
| 6 | Scales and keys | | |
| 7 | Intervals | | |
| 8 | Progressions (and a progression's page) | | |
| 9 | Accompaniment | | |
| 10 | Chord player | | |
| 11 | Exercises and Quiz | | |
| 12 | Tools: Metronome, Tuner, Chord finder, Circle of fifths | | |

Standing rules: design only, no app code until the owner's "ok"; the owner's rulings in each area's specs and the
feedback log win over any reference.
