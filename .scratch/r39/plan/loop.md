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

| #   | Page                                                    | Canvas                                                                                             | State                        |
| --- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------- |
| 1   | Songs library (`/songs`, My songs · Explore)            | [The ideal Piano Trainer](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH) (was The ideal Songs) | drawn, waiting for the owner |
| 2   | Song's page (`/songs/$pieceId`)                         | [The ideal Songs](https://claude.ai/artifact/Ana84hFnmzQCBFuvNZRmXB), row 2                        | drawn, waiting for the owner |
| 3   | Score editor (`/edit/$pieceId`)                         | [The ideal Songs](https://claude.ai/artifact/Ana84hFnmzQCBFuvNZRmXB), row 3                        | drawn, waiting for the owner |
| 4   | Practice overview (`/practice`)                         | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH)                            | drawn, waiting for the owner |
| 5   | Chords (`/practice/chords`)                             | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), row 2                     | drawn, waiting for the owner |
| 6   | Scales and keys                                         | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), row 3                     | drawn, waiting for the owner |
| 7   | Intervals                                               | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), row 4                     | drawn, waiting for the owner |
| 8   | Progressions (and a progression's page)                 | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), rows 5 and 6              | drawn, waiting for the owner |
| 9   | Accompaniment                                           | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), row 7                     | drawn, waiting for the owner |
| 10  | Chord player                                            | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), row 8                     | drawn, waiting for the owner |
| 11  | Exercises and Quiz                                      | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), rows 9 and 10             | drawn, waiting for the owner |
| 12  | Tools: Metronome, Tuner, Chord finder, Circle of fifths | [The ideal Practice](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), rows 11 to 14             | drawn, waiting for the owner |

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
**R42 v49 (2026-11-08):** Chords: a pointer under the chosen letter, "Tap again for C♯".
**R42 v50 (2026-11-08):** Chords: the tap-again pointer is a one-time tip.
**R42 v51 (2026-11-08):** Chords: no ⌄ beside the big chord.
**R42 v52 (2026-11-08):** Chords: ‹ 1st inversion › stepper; one Play split button, ⌄ Block chord · Arpeggio.
**R42 v53 (2026-11-08):** Chords: Keyboard a round button beside the bar, not in it.
**R42 v54 (2026-11-08):** Chords: bar as three glass groups (keyboard · chord · tinted Play), per Apple.
**R42 v56 (2026-11-09):** Chords: heading as a lead sheet; inversion pull-down; notes as text with roles.
**R42 v57 (2026-11-09):** Chords: inversions one tap each (position over slash chord); notes as columns over roles.
**R42 v58 (2026-11-09):** Chords: v57 tab switch rejected; inversion as a ring of the notes, tap one into the bass.
**R42 v59 (2026-11-09):** Chords: ring unreadable; the notes stacked as they sound, "Bass up an octave" lifts the lowest.
**R42 v60 (2026-11-09):** Chords: stack moved too much; a still Bass row of the chord's notes, tap one.
**R42 v61 (2026-11-09):** Chords: v60 "better"; each bass note shows its inversion on a small staff; slash in the bass note's colour.
**R42 v62 (2026-11-09):** Chords: staffs and Bass note label gone; Hand, Fingering in the Chord sheet; keyboard in the header, no gear.
**R42 v63 (2026-11-09):** Chords: Play alone, centred, plain glass; chord chosen from its name.
**R42 v64 (2026-11-09):** Chords: Play's honey tint restored, still centred.
**R42 v65 (2026-11-09):** Chords: chord button back, left of the centred Play; Arpeggiate.
**R42 v66 (2026-11-09):** Chords: bar names never cut (chord type steps with length; Play 176).
**R42 v67 (2026-11-09):** Chords: several chords on the staff; Right/Left/Both voiced from the owner's transcripts.
**R42 v68 (2026-11-09):** Chords: 4 voicings, Rootless on a dominant fixed, Arpeggio up and down. Scales: 15 keys, key signatures.
**R42 v69 (2026-11-09):** Chords: R.H./L.H. on the staff, Left plays the chord, one fingering toggle, Next chord, staff card fixed.
**R42 v70 (2026-11-09):** Chords: Left hand | Right hand cards with notes and fingers; fingering always shown.
**R42 v71 (2026-11-09):** Chords: hands toolbar + Split (Gorshkov), full chords per hand, checklist, Play all.
**R42 v72 (2026-11-09):** Chords: drawn hands with lit fingers, Bass only; dock centred as one group.
**R42 v73 (2026-11-09):** Chords: hands name their chord, left hand Chord | Root, Transpose (half step, 12 keys).
**R42 v74 (2026-11-09):** Chords: voice leading drawn on the staff; Practise rows from transcripts and Chordify.
**R42 v75 (2026-11-09):** Chords: proper 2D hand outlines (traced from the app's hand models), badges on fingertips.
**R42 v76 (2026-11-09):** Chords: finger numbers upright in fingertip circles, per the teaching sources.
**R42 v77 (2026-11-09):** Chords: hands at the keyboard, fingers reaching their keys; toggles only under the staff.
**R42 v78 (2026-11-09):** Chords: the app's 3D hands live in the board (pthands bundle); Left · Both · Right; Off · 3D · 2D.
**R42 v79 (2026-11-09):** Chords: 3D hands parse inline models (no fetch); Hands menu button by Play; Root and chord a voicing.
**R42 v80 (2026-11-09):** Chords: designs A (name is the control) and B (chord shelf) side by side; piano settings; per-tone 3D keys.
**R42 v81 (2026-11-09):** Chords: design A chosen (B removed); the bar button reads Voicing; hand skin variants in progress.
**R42 v82 (2026-11-09):** Chords: symmetric bar inside its margins, fade under it; layout check + a look before each publish.
**R42 canvas 84 (2026-11-09):** Chords: view with or without hands; labels in 3D and 2D (Degrees); name as pill buttons.
**R42 canvas 85 (2026-11-09):** Chords: Piano switch, view cards with Hands inside 3D, full-width Range and Labels; label-padding check.
**R42 canvas 86 (2026-11-09):** Chords: Root, Chord type, In the bass as drawers; hand S3 medium-light default, not built yet.
**R42 canvas 87 (2026-11-09):** Chords: staff on the first screen (staves in use, larger, note labels); facts folded into the staff card.
**R42 canvas 88 (2026-11-09):** Hands model: a resting finger hangs between its neighbours (app fix, ADR 0117); bundle rebuilt.
**R42 canvas 89 (2026-11-09):** Chords: Labels gains Intervals (keys and staff); several chords carry their key signature; key labels no longer collide.
**R42 canvas 90 (2026-11-10):** Chords: review findings applied (wording, 44px targets, sheet focus, type scale, two hands fit); arpeggio written on the staff; a note sounds when tapped.
**R42 canvas 91 (2026-11-10):** Chords: spacing on 4/8 steps, cards 16 round, switch knob and weights on the page tokens (Chords boards only).
**R42 canvas 94 (2026-11-10):** Chords: missing states drawn (hands loading, failed, unsupported; MIDI; offline piano; eight chords) with a States tool on each board.
**R42 canvas 96 (2026-11-10):** Chords: Night boards, larger text, a keyboard unplugged; the seven questions (chord symbols out of capitals, motion added).
**R42 canvas 98 (2026-11-10):** Chords: values on Sound and MIDI rows (grey at default), hover, pressed and focus states; scan-first skill.
**R42 canvas 99 (2026-11-10):** Chords: tooltips on icon-only controls; scan-first 7-8 (data drives form, hidden UI); seven-questions opens with premium and one decision; laptop frames no longer gain blank lines per rebuild.
**Canvas 100 (2026-11-10):** the canvas regrouped: a page per area (Songs, The Player, Practice), a row per screen, laptops left and phones right, Night beside Chords.
**Canvas 101 (2026-11-10):** each page in four rows: phones, phones by Night, laptops, laptops by Night, in the flow's order.

**Canvas 102 (2026-11-10):** Chords: the line "C major seventh · Close voicing" under the name removed; the full name is the type picker's tooltip.

**Canvas 103 (2026-11-10):** Chords: one hand inside a ninth, both hands split (Cm11 C3 G3 | E♭4 F4 B♭4 D5), voicings in three groups by source, the Voicing button names the voicing, Add and Transpose on the staff.

**Canvas 104 (2026-11-10):** Chords: left hand on roots and fifths C2–B2, the right hand without the root and moving least between chords (pianochord.org).

**Canvas 105 (2026-11-10):** Chords: ties gone, staff in C with Settings › Key signature, Transpose moves every chord, Next chord stays open with Triads | Sevenths; new Random chords page started in the Player.

**Canvas 106 (2026-11-10):** Chords: staff at one size, scrolling; the octave root picker (C♯ over D♭) for Root, Transpose and Random chords; Transpose reads as steps from the original with Back to.

**Canvas 107 (2026-11-10):** Chords: Root is seven letters plus ♭ ♮ ♯; Transpose and Random chords keep the keyboard with one name per black key and "Written as"; Key signature is a ♭/♯ stepper with the signature drawn.
**Canvas 108 (2026-11-10):** Chords: lead-sheet bars (the whole bar the target), Remove and Transpose in the card's foot, no layout shifts (Written as reserved, Back to and No key signature gone, Next chord one height), range on white keys; the layout check catches text past its edge.
**Canvas 109 (2026-11-10):** Chords: Next chord is Diatonic | Chromatic, six suggestions of the chord's own kind; the floating bar on solid page; the key signature's clef whole; the layout check fails clipped drawings and cut text.
**Canvas 110 (2026-11-10):** Chords: Remove in the chosen bar, Transpose all in the foot; key signature − / + on the circle of fifths, no Written as; Transpose names the key, chords on one lead-sheet line; Next chord drops chords already on the staff; Text Accidentals embedded.
**Canvas 111 (2026-11-10):** Chords: one bar shape for one chord and many, the name opens "Change Cmaj7" (Remove inside), the bar plays; Transpose and Key signature merged into one Key drawer with half-step − / + and the Root picker's letters and ♭ ♮ ♯; no scroll on a tap; the staff fills the card.

**Canvas 112 (2026-11-10):** Chords: the chosen chord coloured in the ring like the app's score (no honey bar); no key name over the clef; the key its own state with its signature always drawn; Key drawer − signature + · Major | Minor · letters renamed by ♭ ♮ ♯ · Chords to transpose; one picker for Root, Key and Random chords.

**Canvas 113 (2026-11-10):** Chords: name centred over its notes; all chords painted, the chosen ringed; no text selection or tap box on iOS; the + no longer shows through sheets; the chosen chord scrolled whole into view; Next chord empty state with "Chromatic chords"; Key drawer shorter (♭ ♮ ♯ beside Major | Minor, "Transpose with the key", "Stays"); laptop Key popover left of the staff.

**Canvas 114 (2026-11-10):** Chords: finger numbers on every chord, not only the chosen one.

**Canvas 115 (2026-11-10):** Chords: ♭ ♮ ♯ changes only the chosen letter (others plain, an impossible one dimmed); − / + spelled by direction (C → C♯, D → D♭, never D♯ major); transposed chords spelled from the new key's scale, no double accidentals or E♯/B♯/F♭/C♭ roots; chromatic suggestions spelled by direction.

**Canvas 116 (2026-11-10):** The Player in the Chords page's language: light glass bar, the transport as three glass groups with values under the symbols, Transpose as the Chords Key page (spelled by direction, Back to G major); new board PlayerKey (`player/r43_player.py`).

**Canvas 117 (2026-11-10):** Every Player sheet in the Chords kit: centred titles with Done, green switches, plain white groups, sentence-case captions, Wait · Play as radio cards, Keyboard rebuilt as the Chords page's (Show the piano, 3D piano with Angle, 2D keys, Keys, Note names, Sound, MIDI keyboard).

**Canvas 118 (2026-11-10):** Play mode wears one icon, a metronome, in the toolbar and the Practice sheet: one `MODE_ICON` map for both; the speedometer and Follow's waves gone.

**Canvas 119 (2026-11-10):** Hands renamed Parts after the research (Yamaha, Synthesia, Flat, flowkey). Each part is a kit card with its hand's picture, a switch, volume and Dim; the last part on is locked on. Sheet › Show became switch rows. New boards: Parts and Sheet settings (both sizes), Diagrams, Grid and Lyrics settings (phone).

**Canvas 120 (2026-11-10):** The measurements ran on all 18 Player boards. Spacing is on the 4 scale (rows 8/16, the tempo card, captions, toolbar, Transpose, Played through), corners are concentric, every sheet and toolbar control is 44, and the transport sits on the centre line. Arrangement · Accompaniment are drawn as Wait · Play.

**Canvas 121 (2026-11-11):** One Piano sheet for the Chords page and the Player (`piano_sheet.py`): Show the piano; 3D piano with Angle Seat · Above and Hands on the keys, or 2D keys; Range as the 88-key strip; Labels; Sound and MIDI keyboard. Above works on the Chords page's live 3D. Measured on four boards.

**Canvas 122 (2026-11-11):** The Player's Piano sheet keeps its rows and stops below the bar. The Chord player has a piano under the chart (2D, or 3D with the hands) and the one Piano sheet in Settings › Piano. Chords' chord names 44 high. Played through's four-bar buttons. The Player by Night (phone, laptop, Piano, Played through), one Night map with the Chords page. Measured on every touched board.

- Canvas 123 (2026-11-11): the editor as the Player in Edit — glass bar with Play · Edit, selection strip, seven categories with drawn icons, keys; laptop palette docked. Drawings v123-*.
- Canvas 124 (2026-11-11): the one library shape — incipit pictures on song rows, page stacks on folders, no repeated counts or Open all, quiet laptop Places with Folders, 44 targets. Drawings v124-*.
- Canvas 125 (2026-11-11): the song page's progress as a bar map; no explanation line under Chords; Learned 44. Drawings v125-*.
