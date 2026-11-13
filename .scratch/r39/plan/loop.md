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
6. Publish, feedback-log bullet, commit by path, push.

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
- Canvas 126 (2026-11-11): Practice overview — laptop five across with Search; subtitles whole on a phone; Tools 44. Drawings v126-*.
- Canvas 127 (2026-11-11): one 44 segmented control and stepper across Practice; seg rows stacked under their labels; Hear it 44. Drawing v127-*.
- Canvas 128 (2026-11-11): Learn, Profile and Settings drawn — a level's lessons as a line of tiles; the week as bars; Appearance as three screens; the sidebar's foot is the learner. Drawings v128-*.
- Canvas 129 (2026-11-11): Administration (ten sections), roles, Edit mode in place on a lesson and on Learn's level, Publish, Preview as learner. Drawings v129-*.
- Canvas 130 (2026-11-11): Courses edited in place on Learn (About, rows Remove and grip, New course); the Course page read and edited (properties, lessons, Settings, Publish, Undo); the lesson's Settings and Publish pages. Drawings v130-*.
- Canvas 131 (2026-11-11): every Settings page working (Account with Editorial access, Sync, Sign out, Delete account typed DELETE; Edit profile, Change password, Privacy; Storage and backup; On-screen piano with its picture; MIDI devices, log, Calibrate timing; Selection toolbar; Swipe actions; User guide; Report a problem; About), Profile's Streak, Badges, a badge, Achievements, a milestone, Notifications; Sign in and the account pages; Legal. Drawings v131-*.
- Canvas 132 (2026-11-11): across the app — the search palette (Recent searches, Suggestions, results by group, Nothing found), the MIDI popover's states, Shortcuts, Welcome, the update banner, Storage full, the account-deletion gate, Loading, Something went wrong, offline, Page not found. Drawings v132-*.
- Canvas 133 (2026-11-11): Songs' remaining pages — Explore (search, categories, shelves with See all, its loading, offline, failed, empty and no-match states), a public song (rating, Add to my library, Report), a shared song link and a broken one; Groups (a group with its invite link, shared folders, Share a folder with permissions, members, Remove, Delete group), Join, a shared folder with Stop sharing; a folder with its Archived, Folder settings, Card style (presets, layout, contents, Apply to…); Archive (Restore, Restore all, Delete with Undo) and Trash (Delete permanently, Empty Trash); a song's Settings and Publish (Why publish, category, description, rights, published state, Unpublish); a section's page. Linked from My songs (Explore, the Archive icon, folders, Shared with me) and from a song (··· Settings, Sections). Drawings v133-*.
- Canvas 134 (2026-11-11): Practice's remaining pages — a trainer's setup (Drill, Shown, Level, Custom qualities, Timing), its run with keys to play, Check and Results; a progression's editor with draft, Settings, Publish and Discard, Edit a copy for built-ins; a pattern's page, its editor and New pattern, Publish, Delete with Undo; a take's page; a setup sheet over the Player for a walk, chromatic, a progression and an exercise; full settings sheets for Scales, Progression, Chord finder and the Chord player. Drawings v134-*.
- Canvas 135 (2026-11-11): the editor's draft of a built-in song — the Publishing pill and save state, Publish… with its question, Versions with Restore, Discard changes, and the opening, offline, failed and not-an-editor states; reached from a song's ··· Edit the original. Drawings v135-*.
- Canvas 136 (2026-11-11): Profile's guest and loading states (Exploring as a guest, Sign in; a skeleton); the quiz's grand staff engraved properly (clefs on their lines, a brace, whole notes, F major in root position said truly); a progression's keys in its function's colour, the moves named truly (V to vi a 2nd up) and a dock that fits a phone. `/search` is a link that opens the palette, drawn on AppLayers. Drawings v136-*.
- Canvas 137 (2026-11-11): Random chords rebuilt in the Chords page's shape — three pickers (key, chords, inversions) opening drawers, In the draw as a card of chord buttons with Try one, Session as rows, the bar Voicings · Start · Hands. Drawings v137-*.
- Canvas 138 (2026-11-11): Random chords as a drill's setup — a flashcard card (See a chord, play it · Show another), rows Which chords / How you play them / How long, voicings described, Start full width; In the draw becomes Which of them in the Chords drawer; its own icon on Practice. Drawings v138-*.
- Canvas 139 (2026-11-11): Random chords' Chords drawer holds every chord with filter chips (All, Chosen, In a key, Major…Altered), Choose all per type; Chords from removed; Inversions shown by the bottom note. Drawings v139-*.
- Canvas 140 (2026-11-11): Random chords' Chords drawer as a checklist (checkboxes, Select all per type, n selected); In a key and Show another removed. Drawings v140-*.
- Canvas 141 (2026-11-11): Random chords: Chord types as a checklist by group with sticky chips; Roots on a one-octave keyboard (All 12, White keys, Black keys); default Major and Minor on all 12. Drawing v141-*.
- Canvas 142 (2026-11-11): Random chords' bar loses the piano button (no keys on the page).
- Canvas 143 (2026-11-11): Random chords' Roots: Start from (Easy roots, White keys, All 12 roots) and a checkbox per root in circle-of-fifths order; the keyboard picker removed. Drawing v143-*.
- Canvas 144 (2026-11-11): Random chords' Roots: twelve checkboxes in keyboard order and Select all; the named sets removed. Drawing v144-*.
- Canvas 145 (2026-11-11): Random chords: one option row in every drawer (checkbox or radio, name, meaning, example), Select all per group; the top card shows your deck (count and chords). Drawing v145-*.
- Canvas 146 (2026-11-11): Random chords' Roots on the circle of fifths: tap notes round the circle, the centre counts and selects or clears all, the chords they make below. Drawing v146-*.
- Canvas 147 (2026-11-11): Random chords' Roots on the page as two rows of six toggles with Select all; the circle and the Roots drawer removed. Drawing v147-*.
- Canvas 148 (2026-11-11): chord lists read symbol first, then the full name, then the mark (Chords' Chord type and Random chords' Chord types); Chords' Chord type sheet gets the group chips and a fixed height; tooltips stay hidden under an open sheet. Drawing v148-*.
- Canvas 149 (2026-11-11): the chord list checked against Chord Theory for Piano and Piano Chords Practice; Cmaj7♯11 to Altered; Cadd4, Cm6/9, C9sus4, C7♭5, C7♯5, C13♭9 added; the app reads Cadd4 as add11. Drawing v149-*.
- Canvas 150 (2026-11-11): Chords' Practise list gets Chromatically, Round the circle of fifths and Diatonically (in the chord's home key), each naming its chords; replaces the single "In all 12 keys" row. Drawing v150-*.
- Canvas 151 (2026-11-11): Fingers added to the piano's Labels on Chords (two rows of choices); the Key sheet's chords are "Chords to transpose" with n of m and Select all / Clear all. Drawing v151-*.
- Canvas 153 (2026-11-11): chords chosen to transpose wear the ink fill with a tick (owner 2026-11-13), the others white; "Stays" removed.
- 2026-11-11: Songscription's score page documented as a Player reference (player-reference-songscription.md); five proposals for the Player canvas, not drawn yet.
- 2026-11-11: Musicca's chord player page documented against the Chord player canvas (practice-chord-player.md, Reference); six proposals, not drawn yet.
- v154: Random chords becomes the Chord trainer: 24 drills (Start here, Find more by kind), one setup with Shown as, Style, Order, Pace added; phone and laptop shot in the runtime.
- v156: the Chord trainer becomes 25 exercises from the owner's books, engraved, in Tools; Practice is Theory · Playing · Tools with no Up next; the sheets' groups no longer shrink; phone, laptop and the overview shot in the runtime.
- v157: "the progressions page is broken": the phone lists of Progressions, Accompaniment and Exercises were empty because the editor's and admin's generators reused the library's SECTIONS helper name; renamed to ED_SECTIONS and ADM_SECTIONS, only the three boards changed, all three shot in the runtime.
- v158: "fix all the bad names": musicians' terms everywhere on Chords, the Chord trainer and the Practice overview (Chromatically, Circle of fifths, Diatonically, Wait mode, Alberti bass …); no explanation lines under options; the rules that invited paraphrase rewritten. Phone, laptop, drawers shot in the runtime.
- v159: the Chord trainer becomes one page over the chords you choose (Chord types, Roots; Exercise, Order, Hands, Tempo); cadences and blues moved to Progressions, the 6/8 and 4/4 concepts and Alberti bass to Accompaniment; reading and ear left to the Quiz. Phone and laptop shot in the runtime.
- v160: the grilling built: no Chord trainer, Quiz or Trainer; Chords practises its chords (Over the root, Chord changes, Shuffle); a run ends in results (PlayChord); Profile › Practice history (PracticeResult); overview Theory · Exercises · Tools
- Loop round 1, Practice (2026-11-13): the overview ported to canvas 160 (Theory · Exercises by book · Tools; no Up next, no Quiz row); Chords practises a chord Chromatically and round the Circle of fifths, each row showing its music; Metronome and Tuner cards padded once; Tuner's microphone error has Try again; Intervals' Play as full width on a phone; the Player's tip no longer says "song". Open: whether the Quiz trainers go entirely (75 lesson links use them) — recommended: keep them only as each lesson's practice, no Quiz page.
- Loop round 1, Player and score editor (2026-11-13): menus and gears leave out what cannot be done (MenuAction `hidden`, an empty menu shows no button); the Player loses Song information, its takes (My recordings, How did I play, the Rhythm game), Voice commands and the Tuner, as ruled on 2026-11-07, its More now Sections · Annotate · Print · Share link · Export…; the foot's Hands wears the hands' swatches; the recording's Tuning moves to the song page's fact line; the editor gear's Takes only once there is one; the palette's folded keys and a staff name's target reach 44. The harness measures a stretched link's reach from its chip. Decided, not asked: the palette stays docked on the left by default (a setting; MuseScore and Dorico dock theirs there). Build clean.
