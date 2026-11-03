# Round 29 compliance: Part A items 20–43

Checked on `claude/keen-gates-q9bnit` against `prompt.md` lines 698–1714. Read-only, from the code: I grepped and
read the source for each claim. Where a bullet isn't listed it wasn't checked in detail.

Summary: **DONE 3** (A33, A35, A36) · **PARTIAL 15** · **NOT DONE 6** (A26, A28, A30, A34, A37, A40).
**CONTRADICTS** findings are listed per bullet below and gathered at the end.

## Explorers (A20–A25)

| Item | Requirement (short) | Status | Evidence / what is missing |
|---|---|---|---|
| A20 | Root and Quality as pickers that show the whole choice | DONE | `ChordBuilder.tsx`: `NotePicker` + `MenuPicker` in one `PickerRow` (7875ffe7, aa176aa9) |
| A20 | Voicing a combobox **with a picture of each voicing** (R21) | PARTIAL | `VoicingField.tsx` is a `MenuPicker` with text labels and an ⓘ; no pictures |
| A20 | Added tones on every chord (C5(add9), C°(add9), C+(add2/add4), Csus2(add4), Csus4(add2), 7th add♯11) | NOT DONE | `addedOf`/`TRIAD_ADDS` in `music/chord-parts.ts` unchanged since round 28: `dim: []`, `power: []`, `aug: ['add9']`, `sus2: ['add6']`, `sus4: ['add6','add9']`. `chord-parts.test.ts:207-219` asserts these gaps (`addedOf(dim) → []`). The A33 panel can only toggle what `CHORD_PARTS` builds, so the same chords still can't take these tones |
| A20 | A tone that would rename the chord switches to that chord | DONE (via A33) | `withColour` looks the chord up by its notes (`colour-notes.ts`) |
| A20 | Row always shown in one place; nothing jumps | CONTRADICTS | A33 replaced the Added tones row (OK, later item). But 7875ffe7 states "A row or option the chord cannot take is not drawn … the rows after it closing up": Seventh, Suspension and the inversion/hands rows are conditional in `ChordBuilder.tsx` (`choosesSeventh ? … : null`, `suspensions.length > 0 ? …`). A20 and A31 ask for rows that stay with the options hidden inside |
| A20 | Tests: triad × size × 7th table against the sources; page test that the row stays | PARTIAL | A table test exists, but it locks in the gaps above. No page test that rows stay; `ChordsPage.test.tsx` was changed to expect them to vanish |
| A20 | One family per control, in `shared/ui`, pages pass data | PARTIAL | Pickers, Segmented and floating capsule are shared. The Harmony tab still mixes Segmented, InversionChoice and TempoSlider in one fields grid |
| A20 | Done: before/after of every explorer, contact sheet of the families | PARTIAL | After-shots exist (`shots/after/practice-*`); there is no contact sheet |
| A21 | Tabs named Notes · Harmony · Key | DONE | `en/practice.ts:137` `show: { scale: 'Notes', chords: 'Harmony', key: 'Key' }` |
| A21 | Strips with arrows become pickers (Root, Scale, Start on, Melody note) | DONE | 0bce757a, aa176aa9 (`ScaleChoice` = NotePicker + MenuPicker) |
| A21 | One header for all three tabs, kept above the tabs (name, signature, notes on a staff and as chips, Play, key picker); a tab never changes the header | NOT DONE | Each view draws its own `ScaleLayout` header (`RunView`, `ChordsView`, `KeyView`). The Key tab's has no facts and no Play. No header staff or note chips |
| A21 | One spine of seven degrees lining up across all three tabs | PARTIAL | Harmony has the 7-degree cards (`KeyChords.tsx`), but Notes and Key don't line up on them |
| A21 | One colour per function on the circle, degrees, Progressions strip and Chords page, with a legend | PARTIAL | Role colours and a legend only on `ChordRow`/`RoleChips` (Progressions, passing cards, lessons). `ROLE_PAINT` is used nowhere else: not on the circle, the Harmony degrees or Chords |
| A21 | Controls group: one settings-style group or one compact row | NOT DONE | Harmony still lays out Chord size, Inversion, Keys play, Played as and the Tempo slider as fields above the chords (`ChordsView.tsx:92-140`) |
| A21 | Two titles (app bar and a huge page title) | NOT DONE | `ScaleLayout` `<h2 className="text-5xl">` under the "Scales and keys" bar title |
| A21 | Duplicates: chord cards plus "Open in Chords" chips | DONE | One card with a corner link (`KeyChords.tsx`) |
| A21 | Practise in the Player: "Walk the chords" a lone row | NOT DONE | Still one `RowLink` in its own `RowGroup` (`features/practice/ui/PractiseChords.tsx`) |
| A21 | Key tab on a phone: sections fold, "Show all n" | NOT DONE | No fold or Show all in `PiecesInKey.tsx` or `KeyHarmonise.tsx` |
| A21 | Score fills the column; fingering never collides | NOT DONE (unverified) | No commit touches `ScaleSheet` or fingering placement |
| A22 | Root: one compact picker | DONE | `IntervalExplorer.tsx` `PitchPicker` |
| A22 | Harmonic · Melodic rising · falling, pictured, in the floating capsule with Play all and Stop | DONE | `WayPicture.tsx`, `IntervalExplorer.tsx:75` (df4ad453) |
| A22 | Its default on Intervals' Settings, with the names style and compound intervals | NOT DONE | `ExplorerSettingsPages.tsx` `IntervalsSettingsPage` has only link rows. No `intervals.*` key in `SETTING_HOMES` |
| A22 | One row style, one keyboard size; a play mark; "3 semitones" | DONE | `IntervalRow.tsx` |
| A22 | ⓘ on every row repeats the name | PARTIAL | The ⓘ now holds songs (`IntervalSongsTip`), shown only where songs exist |
| A22 | Missing: Play all · Quiz link · **the interval on the staff** | PARTIAL | Play all and the Quiz link are done (31080752). There is no staff on Intervals |
| A22 | Odd counts leave holes | unverified | — |
| A23 | Three tabs Progression · Library · Passing chords | DONE | `ProgressionsTabs.tsx`, 1ea3aeac |
| A23 | Roles and moves drawn on the chords (D14), kernel-generated and tested, with a legend and a "Test yourself" link | DONE | `RoleChips.tsx`, `chordRole` in `music/harmony.ts`, `ProgressionExplorer.tsx:123-141` |
| A23 | The same role row wherever a progression is shown (Library rows, Scales' Harmony, a song's progressions) | PARTIAL | Library rows are bar cells (`ProgressionLibrary.tsx`); Scales' "Progressions in this key" are plain `RowLink`s; the song page was not changed |
| A23 | Library a list with style chips; musicca check (12-bar blues, songs with four chords) | PARTIAL | List and chips done. Content additions 0ff50e0b. No "Songs with four chords" list |
| A23 | On the page only Chord size and Approach chords; Written as, Voicing, Inversion and **Mode** on Settings | CONTRADICTS | Written as, voicing and inversion are on Settings (`registry.ts:96-98`). **Mode stays on the page** (`ProgressionReading.tsx`, for a typed line). A23/A24 place it on Settings |
| A23 | Walk names: "Practise in all 12 keys", sequences named; "Walk the chords" → "Through the key's chords, in scale order"; "Chromatic walk" → "A chord in all 12 keys…"; **the same names in the Player's title** and More | CONTRADICTS | `keyWalk.*` renamed (en/ru). But the Player title still reads `walking.*` "up by semitones / down the circle of fifths" (`ProgressionPlayerPage.tsx:27`, `en/player.ts:98-108`). `walk.title: 'Walk the chords in {{scale}}'` and `chromatic.title: 'Chromatic walk: …'` are not renamed |
| A23 | Passing chords: name and line | DONE | `progressions.between.title/line` |
| A23 | Groups rebuilt by how they lead (dominant approach, diminished, chromatic, subdominant, bass-line) from the books | NOT DONE | Still `category: dominant/functional/chromatic/diminished/diatonic/cadence` (`en/practice.ts` `passingChords.category`) |
| A23 | Each card: tags only where meaningful (Diatonic · Borrowed · Chromatic; style), staff drawn at once, **Insert** | NOT DONE | No Insert in `SuggestionCard.tsx` or `ProgressionBetween.tsx`; no style tags. progress.md agrees ("Left") |
| A23 | Used where chords meet (Grid "+", the editor's chord row) | NOT DONE | — |
| A23 | "C → G" a combobox of pairs | DONE | `ProgressionBetween.tsx` `Dropdown` of changes |
| A23 | "In the key only" not a bordered toggle | PARTIAL | Still the `Toggle` primitive (now in the chosen style, A8) |
| A23 | Empty "Songs with this progression" hides | DONE | `ProgressionSongs.tsx:46` |
| A23 | Folded headings ⌄/⌃ with a one-line summary | PARTIAL | `FoldSection` uses a chevron; no summary line seen |
| A24 | A gear and a Settings page for each Practice page, from the registry | PARTIAL | Pages at **`/settings/<page>`** (`router.tsx:246-282`), not `/practice/<page>/settings` as asked. A deviation, not logged as one |
| A24 | Chords: voicing, hands, symbol style, how it plays, fingering, clefs | NOT DONE | `ChordsSettingsPage` has link rows only |
| A24 | Scales: octaves, rhythm, tempo, hands, fingering, families | NOT DONE | Link rows only; these choices stay on the page |
| A24 | Intervals: play way, names, compound | NOT DONE | Link rows only |
| A24 | Progressions: written as, voicing, inversion, mode | PARTIAL | Mode is missing (see A23) |
| A24 | Accompaniment: tempo, key, hands, loop, count-in, sources | PARTIAL | Only `accompaniment.hidden` |
| A24 | Chord finder: remember, over the bass, keys it is in, scale, symbol style; the toggle-tile sheet goes | DONE (symbol style missing) | `ChordFinderSettingsPage.tsx`, 4 switches; the gear replaces "⚙ C" |
| A24 | Metronome Settings page | NOT DONE | The Metronome keeps only an ⓘ (`MetronomePage.tsx:71`). Its keys' home is the Metronome page itself |
| A24 | Exercises and Quiz: questions, timer, answer mode, hints, sounds, keys | PARTIAL | `TrainersSettingsPage` has one switch (`trainer.autoNext`) |
| A25 | Accompaniment: names in one script | DONE | 52ae1faf (`books.ts`) |
| A25 | Accompaniment: six source tabs → a picker or chips | NOT DONE | `AccompanimentTabs.tsx` still `NavTabs` |
| A25 | Accompaniment: pattern naming rule, rhythm pictures, uncut descriptions, one row style with icons | NOT DONE | progress.md: "Left" |
| A25 | Chord finder: the gear opens Settings | DONE | `SettingsGear page="chord-finder"` |
| A25 | Chord finder: piano status in words in the empty state, not a MIDI icon in the bar | NOT DONE | `<MidiButton />` still in the bar (`ChordFinderPage.tsx:55`) |
| A25 | Chord finder: empty state fills the space; staff one size, empty or not | NOT DONE | No commit touches `ChordName`/`ChordTrail` |
| A25 | Metronome: one stepper (− 120 +, hold to repeat, tap to type), one menu style | NOT DONE | `TempoSteps.tsx` still has four round −10 −1 +1 +10 buttons and a pill Tap tempo; no hold-to-repeat, no typing |
| A25 | Metronome: tempo word in the page's style, a tap lists the words | PARTIAL | `TempoWordTip` (an ⓘ-style tip) |
| A25 | Metronome: big Play the same as every Play | NOT DONE | `MetronomePage.tsx:104` `size-24` round Button |
| A25 | Exercises: no third of the grid empty; descriptions | unverified / no commit | — |
| A25 | Quiz: My gaps an icon button; no lone card | DONE | `GapsLink.tsx`, 52ae1faf |

## On-screen piano, Player sound, song page, files, fingering (A26–A30)

| Item | Requirement (short) | Status | Evidence / what is missing |
|---|---|---|---|
| A26 | Rail: an icon and a name for each control, the chosen style, the same order everywhere | NOT DONE | `ChordNamesToggle` still shows `Glyph "Cm7"`; `PedalToggle` the text `PEDAL_MARK`. Since 7bc59c57 only A8/A13/A14 sweeps touched `live-keyboard` |
| A26 | Labels on keys: only what the page needs | NOT DONE | — |
| A26 | Pedal: one look whatever put it down, no fight between Space, toggle and foot, released on leaving, restrike, sostenuto/soft shown | PARTIAL | Restrike is done in audio (16190d53, A27). The Player has a pedal lamp (d205cf49). Nothing on the live keyboard's pedal sources or their release |
| A26 | Feel at 320, the same height on every page | NOT DONE | — |
| A27 | Pedal marks as events (stop+start = change, offset, after last note) | DONE | 44aa68f7, 4 fixtures in `musicxml/fixtures/` |
| A27 | Scheduled notes decay; the pedal's release damps | DONE | 16190d53 (`string-decay.ts`, `web-audio.ts`) |
| A27 | One voice per key | DONE | 16190d53 |
| A27 | **Sampled grand (D15: Salamander, smplr spike, 4 layers, offline, memory budget)** | NOT DONE | No smplr, no `public/samples/piano`, no Salamander anywhere in `src` |
| A27 | Pedal sent to a connected piano as CC64 | DONE | `midi-sound-output.ts` (16190d53) |
| A27 | Show it: Ped. marks lit, a lamp, keys held only by the pedal | DONE | d205cf49 (`PedalLamp.tsx`, `PedalMarks.tsx`, `marks.ts`) |
| A27 | Pedal: As written · Off · Automatic on the Player's settings | DONE | `auto-pedal.ts`, wired in `use-practice-player.ts:146`, `playback.pedal` home `player` |
| A27 | Done: Fantaisie-Impromptu, a hymn and a song without pedalling recorded before/after; a test on Fantaisie's pedalling | NOT DONE | No recordings; Fantaisie is not in the fixtures |
| A28 | Learned on every song | NOT DONE | `PieceView.tsx:101` still `{own ? null : <LearnedButton …>}` |
| A28 | Minor key without `<mode>` inferred from the music | NOT DONE | `read.ts:712` still `signatureKey(fifths, textAt(element,'mode')==='minor')` (MIDI has Krumhansl `keyOfNotes`; MusicXML doesn't) |
| A28 | "No chords to learn" ×4; cut-time beat; one chip style; laptop layout; score-style head; About as text; Key chip links to Scales | NOT DONE | No commit to `pages/piece` beyond sweeps; `noLessons: 'No chords to learn'` remains |
| A28 | Metadata editor (credits by role, Add credit, subtitle, level, genre, language, tags, MusicXML creator/rights) | NOT DONE | A6 renamed only the existing two roles (Composer, Lyricist). `facts.editMusic: 'Edit the music'` is still used in `SongEdit.tsx:84`; A28 asks for "Edit score" |
| A29 | MusicXML: pedal stop+start, stop after the last note, offsets | DONE | 44aa68f7 |
| A29 | MusicXML: minor without mode | NOT DONE | As A28 |
| A29 | MusicXML: dynamics and words keep their offset | NOT DONE (unverified) | 44aa68f7 covers the pedal only |
| A29 | MusicXML: beams kept | NOT DONE | progress.md "Left" |
| A29 | MIDI: velocity kept as loudness or dynamics | NOT DONE | `song-of-midi.ts:221-226` `spelled` still drops `velocity` |
| A29 | MIDI: hand split by shape, not middle C | NOT DONE | `song-of-midi.ts:28` `SPLIT = 60` |
| A29 | MIDI: meter, tempo and key changes kept | PARTIAL | Tempo and meter changes kept (c6500150). The key is still the first only (`file.keys[0]`) |
| A29 | MIDI: pickup found; sections from markers | PARTIAL | A meter change starts a section (c6500150). No pickup detection, no markers |
| A29 | Import sheet says what was lost and where; several files; Replace / Keep both | NOT DONE | — |
| A29 | Export .mxl, PDF, audio, a take as MIDI or audio | NOT DONE | .mxl **import** exists (`read-song-file.ts`); no .mxl export |
| A29 | Round-trip tests for every library song; MuseScore/Flat/Dorico/Finale/Sibelius fixtures; Flat/MuseScore comparison rows in the audit | NOT DONE | Fixtures are the four pedal files only; no comparison rows in `audit.md` |
| A30 | One fingering service in `music/fingering` | NOT DONE | No `fingering/` folder. `fingering.ts` and `chord-fingering.ts` stay. The spec (`fingering-service/spec.md`) is unimplemented |
| A30 | Suggest fingering for a passage | PARTIAL | `passage-fingering.ts` (10b93dcb) exists, tested, but **nothing outside the kernel calls it** |
| A30 | One drawing rule (piano, crossing mark, score placement, DESIGN.md) | NOT DONE | `FingerRow.tsx` remains; no DESIGN.md fingering rule commit |
| A30 | Fingering on Harmony, Key, Progressions, Intervals, Accompaniment, Chord finder, Player | NOT DONE | — |
| A30 | One "Fingering" switch | NOT DONE | — |
| A30 | Real hand drawings | NOT DONE | `HandDiagram.tsx` untouched |
| A30 | One chord rule | DONE (checked) | audit.md: `placedFingering`/`blockFingering` already use `handFingers` |

## Cross-cutting (A31–A33, A35, A36, A38)

| Item | Requirement (short) | Status | Evidence / what is missing |
|---|---|---|---|
| A31 | Buttons animate colour only, no press offset | DONE | 0a9069b4 |
| A31 | Rows that come and go stay, options hidden inside | CONTRADICTS | 0a9069b4 made them stay (audit: "every row stays, greyed"). 7875ffe7 (A20, later) removed them again: rows are not drawn and the ones after close up |
| A31 | Re-engraved score keeps the old drawing | DONE (checked) | audit.md (`ScoreView`) |
| A31 | Bar hides only on tall pages, never while a field or menu is open | DONE | 0a9069b4 |
| A31 | Playwright recordings before and after at 402 and 1280 | NOT DONE | Only CLS figures and static after-shots |
| A32 | Relative key once; Intervals links the Quiz; Harmony's chords open Chords | DONE | 31080752, 9c6e182f |
| A32 | Chord finder "keys it is in" opens the Key tab | DONE | `ChordKeys.tsx:44-47` |
| A32 | "Progressions in this key" at most 4 rows + Show all n | PARTIAL | `PractiseChords.tsx` lists `commonProgressions()` with no cap or Show all |
| A32 | Walks: one exercise kind named as A23's sequences, from each page | PARTIAL | See A23 (the Player title and "Walk the chords" / "Chromatic walk" names) |
| A32 | **"Notation and names" app-wide settings** (note names, chord symbols, numerals, sharps/flats, function colours, degrees on keys) | NOT DONE | No such keys in `SETTING_HOMES` (`registry.ts`) |
| A32 | Each page's own defaults on its Settings page | NOT DONE | See A24 |
| A33 | One Colour notes panel (chord tones, tensions, avoid), each chip heard and added; symbol rewritten; groups follow the degree in a key | DONE | `ColourNotes.tsx`, `colour-notes.ts` (8355d0ed, b417ebf7) |
| A33 | Tests: Dm7 as ii of C vs vi of F; a colour note in keys, symbol and sound | DONE | `colour-notes.test.ts` |
| A33 | Every voicing name in Progressions is one of Chords' | n/a | Progressions' voicing is block / voice-led, not a chord voicing list |
| A35 | Staves Play/Show, accompaniment for charts only, Melody gone, other hand, controls by kind, click from the engine | DONE | 49809bdd, 093e86b9; `controlsFor` table in audit.md. Daisy fields judged a chart (audit, with the code as evidence) |
| A35 | Player settings Display: clef | PARTIAL | Clef not built ("no engine", progress.md) |
| A36 | One 3px focus outline, Tab order, Esc | DONE | a2569823, `focus.test.ts`, `tab-order.test.tsx` |
| A38 | Song page: the pencil edits in place; Edit score its own button | DONE | 9d683ceb |
| A38 | Edit in every chord view (Grid, Chords over lyrics, Diagrams); the view picker in the editor's bar | NOT DONE | No commits to `widgets/chord-views` beyond sweeps |
| A38 | Tests per screen as learner and editor | PARTIAL | Song page only |

## Score editor, chord views, Metronome, drills, Key tab (A34, A37, A39–A43)

| Item | Requirement (short) | Status | Evidence / what is missing |
|---|---|---|---|
| A34 | Palette glyphs, key-signature grid, time control, Flat's tempo popover, New song's named steps, Flat/Dorico gap list, clef check, transport padding, gutters, tooltips, engraving skeleton | NOT DONE | No commit to `pages/score-editor`/`widgets/score-sheet` but sweeps and the pedal tool (aba6d200). `NewSongSheet.tsx:53` still has a fixed `TIMES` |
| A37 | Scroll browses, tap chooses; one autoscroll rule; Back to the playhead; the Chordify gap list; summary split into "Chords in this song" and "in order" | NOT DONE | `BeatStrip.tsx` still `useStripMotion` (scrub moves the cursor). Only the strip edge fade went (0bce757a) |
| A39 | Any meter, tempo in the meter's beat, odd meters grouped | PARTIAL | The kernel counts any meter (d2a88d9c, 58d6e269). The page offers a fixed 12-meter menu (`METRONOME_METERS`), not the shared time control (A34, not built) |
| A39 | Beat squares cycle accent · normal · silent | DONE | `BeatSquares.tsx`, `levels` |
| A39 | Subdivisions 8ths · triplets · 16ths · swing, softer | DONE | `SUBDIVISIONS`, `Subdivision` menu |
| A39 | Sounds per D16: woodblock, clave, rimshot, cowbell, click, kit (kick, snare, closed and open hat, ride), accent and normal strokes, under 300 KB, in `public/samples/metronome/` with `SOURCES.md` | CONTRADICTS | 118a0f4f adds 4 WAVs in **`public/sounds/`** (woodblock, kick, snare, hihat; VCSL, CC0). No `SOURCES.md` and no licence file anywhere. The accent is the same block pitched a fifth up, not an accented stroke. No clave, rimshot, cowbell, open hat or ride. Sounds offered: `click · beep · drum` only |
| A39 | Drum pattern per meter | DONE | a61dde1c, 6d7613df |
| A39 | Its own volume, a full-screen flash | NOT DONE | `MetronomeSettings` has no volume. No flash anywhere |
| A39 | Speed trainer; tempo list (saved tempos, a song's tempo) | PARTIAL | Speed trainer done (`SpeedTrainerField`). No tempo list |
| A39 | Look: one stepper, one menu style | NOT DONE | See A25 |
| A39 | One engine for page, Player click and count-in | DONE | 093e86b9 |
| A39 | Tests: flash and sound on one clock; a recording of each sound | NOT DONE | — |
| A40 | Flat's panels: recording flow, Instruments S/eye/⋯, the Layout panel with live preview, Notation groups' order, the bar's grouping | NOT DONE | No commits to `widgets/instrument-list`, `features/record-take` or the editor's panels |
| A41 | Drills named Flashcards · Name it · Play it · By ear; Start a labelled button | DONE | 41a450d5 |
| A41 | Level Custom with the Keys sheet; Rounds, Time limit, Auto-advance | DONE | `TrainerSetup.tsx` (d52e781f; rounds and limit existed before) |
| A41 | Setup column not half the laptop's width | unverified | — |
| A41 | No time signature on a question staff | DONE | 41a450d5 (`timeHidden`) |
| A41 | A round fits one screen; Check/Next in the capsule; "Build C" large; note names hidden in reading drills; right/wrong so far, run, time | NOT DONE | No commit to `trainer-board` in round 29 except the staff |
| A41 | After an answer: "Why" line | NOT DONE | No `why` key in `en/quiz.ts` |
| A41 | Results: review the missed ones, counted on the Profile and in My gaps | PARTIAL | `RunResults.tsx` predates round 29 (accuracy, time, streak, missed rows, Again). No "Review the missed ones"; missed rows don't open Chords or Intervals |
| A41 | Exercise page before the Player; no "C"/"Piano" on an exercise score; Next key; tempo kept; routine ticked | NOT DONE | progress.md "Left" |
| A42 | Scales: the Key tab's picker offers keys only; modes as links; choosing a kind never changes the tab | NOT DONE | `KeyView` gets the same `ScaleChoice` (`ScaleExplorer.tsx:50`) offering every family; `showsOf` still drops the Key tab for a mode |
| A42 | Scales: Harmony's run controls (Tempo, Played as) move into the walk's row | NOT DONE | Still above the chords in `ChordsView.tsx` fields |
| A42 | Chords: options that don't apply hidden | DONE | 7875ffe7 (but see the A20/A31 contradiction) |
| A42 | Progressions: Mode only for a typed line; walks hidden for one chord; chord size only where a chord grows | DONE | `ProgressionReading` (typed only), `ProgressionPractice.tsx:37`, `ProgressionExplorer.tsx:157` |
| A42 | Intervals, Quiz, Exercises checks; a test per page that every control changes what's shown | PARTIAL | No per-page "every control changes something" tests found |
| A43 | Cards' overlaps and widths; strip → picker; nothing floats over content | PARTIAL | Strip → picker (0bce757a). Cards unverified |
| A43 | Degrees on the spine with headings and function names | DONE | `KeyChords.tsx` (9c6e182f) |
| A43 | Minor: harmonic V and vii° first, natural v and VII as alternatives; follows the scale kind | DONE | 46d12b58, `placeMinorKeyChords` in `ChordsView.tsx` |
| A43 | Borrowed: Picardy I, Neapolitan spelled C♭ with "sounds as B"; IV and V not borrowed | PARTIAL | `scale-chord.ts:167-213` (C♭ kept, IV/V removed, names). No "sounds as B" text |
| A43 | Harmonise a melody note: spell as the chord does, or "Include enharmonic" | NOT DONE | `KeyHarmonise.tsx` not changed in round 29 |
| A43 | Facts column trimmed | NOT DONE (unverified) | — |
| A43 | **Theory written on the music** (annotation layers on every explorer's staff) | NOT DONE | No annotation layer in `notation`/`ui/score` |
| A43 | Additions: modes' characteristic note and drone, Compare with, chord family heard in key, hear in context, interval songs from **our library by the kernel**, play in a song's key, Reharmonise, "Test yourself" on every page | NOT DONE (mostly) | "Test yourself" on Progressions only. Interval songs remain a hand-copied list (`interval-songs.ts` `SONGS`), which the prompt rules out ("not a copied list") |

## Contradictions

1. **A20/A31 rows**: A20 says the row is always shown, and A31 says rows stay with options hidden inside. 7875ffe7 makes Seventh, Suspension and the inversion/hands rows vanish, with the rest closing up (`ChordBuilder.tsx`). It also reverses A31's own fix (0a9069b4, "every row stays").
2. **A20 added tones**: the bug the owner reported is untouched. `addedOf` still gives dim/power none, aug only add9, sus2 only add6, and `chord-parts.test.ts` now asserts those gaps.
3. **D16 / A39 metronome sounds**: the prompt fixed the path (`public/samples/metronome/`), a `SOURCES.md` with each file's source and licence, the sound set, and accented strokes. The code has 4 WAVs in `public/sounds/`, no sources file, a pitched-up accent, and only Click · Beep · Drums.
4. **A23 walk names**: the prompt says "the same names in the Player's title". The page uses the new `keyWalk.*` names. The Player's title still uses `walking.*` ("up by semitones", "down the circle of fifths"), plus "Walk the chords" and "Chromatic walk".
5. **A23/A24 Mode**: the prompt puts it on Progressions' Settings. It stays on the page, narrowed to typed lines.
6. **A24 route**: `/practice/<page>/settings` was asked; `/settings/<page>` was built. progress.md doesn't log this as a decision.
7. **A42 Key tab picker**: "On the Key tab the picker offers keys only". The Key tab still offers every scale family, and choosing a mode drops the tab.
8. **A43 interval songs**: "found by the kernel … not a copied list". It is a copied list in `interval-songs.ts`.

## Claimed done but not (progress.md vs code)

- **A22 "done"**: there is no interval on a staff, and the play-way default, names style and compound intervals are not on Intervals' Settings.
- **A24 "done"**: Chords, Scales and Intervals' pages hold only link rows. There is no Metronome settings page, and Accompaniment and Exercises/Quiz have one setting each. Most of A24's "at least" lists are missing.
- **A32 "done"**: the app-wide "Notation and names" settings and the per-page defaults don't exist, and "Progressions in this key" has no 4-row cap or Show all.
- **A31 "done"** (audit.md: "every row stays, greyed where nothing applies"): A20's later commit removed those rows.
- **A30 "checked, one rule already"** (audit.md) is right for the chord rule only. The rest of A30 is open, and the one new function (`passage-fingering.ts`) has no caller.
- **Owner's to-dos are stale**: "Freesound answers 403 … Until then the synthesised voices play" predates 118a0f4f, which ships VCSL samples. The Fantaisie-Impromptu is said not to be in the repo, yet c6500150 says "both of the owner's Fantaisie-Impromptu files now import". It is still absent from `musicxml/fixtures/`.
- **A35 "done"**: Clef in Display is not built (noted in progress.md, so disclosed).
