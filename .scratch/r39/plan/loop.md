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
**R42 v26 (2026-11-08):** Chords restructured: the chord chosen on its name, inversion segmented under it, the bar Play chord and Arpeggio, display settings behind the gear.
**R42 v28 (2026-11-08):** the builder undone; Chords back to v26's layout.
**R42 v29 (2026-11-08):** Chords: ‹ › and the Inversions view back; the chord chosen from the name and the bar.
**R42 v30 (2026-11-08):** Chords: the Inversions view goes; views Staff · Fingering · Tensions.
**R42 v31 (2026-11-08):** Chords: Add a note in the Chord sheet; clefs on the staff; Practise on the page; one prominent Play.
**R42 v32 (2026-11-08):** Chords: gear gone; Keyboard button; Bass in the left hand in Voicing; fingering on the staff.
**R42 v33 (2026-11-08):** Chords: clef choice and Bass in the left hand gone; fingering stacked as engraved.
**R42 v34 (2026-11-08):** Chords: fingering, flats and Show the keyboard fixed in the canvas runtime; Circle of fifths names too.
**R42 v35 (2026-11-08):** Chords: Fingering settings (Show, Hand, On the keys); numbers beside the notes; by inversion (Vita Piano).
**R42 v36 (2026-11-08):** Chords: Keyboard panel as the Player's on the bar; gear keeps Fingering; finger numbers on the keys as Vita Piano.
**R42 v37 (2026-11-08):** Chords: finger numbers on the keys 14px over a 12px name.
**R42 v38 (2026-11-08):** Chords: Labels Names · Fingers · None on the keys; gear: Hand, Staff › Finger numbers.
**R42 v39 (2026-11-08):** Chords: Add a note gone; the Chord list gains maj7♯11 and an Altered group.
**R42 v40 (2026-11-08):** Root picker as two rows of six (GarageBand), on every Practice page.
**R42 v41 (2026-11-08):** Chords: root as letter + ♭ · ♮ · ♯, every spelling (D♭ and C♯, G♭, A♯).
**R42 v42 (2026-11-08):** Chords: root as 17 notes in three tracks, naturals · sharps · flats.
**R42 v43 (2026-11-08):** Chords: root as one row C to B; tap the chosen letter again for ♯, then ♭.
**R42 v44 (2026-11-08):** Chords: the chosen root letter shows ♮ ♯ ♭ under it, the one in use dotted.
**R42 v45 (2026-11-08):** Chords: every root from middle C (F♯ to B no longer an octave down).
**R42 v46 (2026-11-08):** Chords: the chosen root letter opens into its spellings, D♭ D D♯.
**R42 v47 (2026-11-08):** v46 rejected; tap again, the chosen letter shows ↻ and the next spelling.
**R42 v48 (2026-11-08):** Chords: the chip reads "or C♯"; the turn arrow read as reset.
