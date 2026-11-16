# Piano Trainer vs Dorico 6: rule collisions, MIDI and staff gaps, palette mapping, missing flows

**Compared:**
- **Piano Trainer** at `~/projectsGIT/School/piano-trainer`, `main` @ `a984ded78`, as written in its own rules (`CLAUDE.md`, `DESIGN.md`, `PRODUCT.md`, ADRs 0034 / 0114) and as built (`src/`).
- **Dorico 6.2.31**, as decoded in this folder.

**Evidence tags:**
- **[code]** read in the repo.
- **[rule]** quoted from the repo's docs.
- **[D]** Dorico data, see the linked file.
- **absent** means nothing matching was found. The search is named each time: route list, editor action types (`features/score-editor/model/state.ts`), or a source grep. It's a strong signal, not a proof.

Your app's rules name **Flat** as the editor's model and Dorico as a secondary reference (ADR 0114: "Flat and Dorico… were the model"; the palette is "as Flat's"). Where your app follows Flat and Dorico differs, that's listed as a difference, not an error.

---

## 1. Your rules versus real-world practice

| # | Your rule (source) | What Dorico does [D] | Finding |
|---|---|---|---|
| R1 | "A key that cannot act on what is chosen is **not drawn, never greyed**" [rule ADR 0114 l.31, l.98] | Panels keep every item in place; commands that can't run are **disabled** in menus (`UX_PATTERNS.md` P15). MuseScore and Flat grey them too. | **Collides with Dorico, and with three of your own rules:** (a) DESIGN.md *Still Screen Rule* "Nothing jumps. Controls hold their place", since hiding tools reflows the palette grid on every selection change; (b) ADR 0114 l.41 "Paste… is **greyed** where the clip cannot go"; (c) ADR 0034 l.53 "every control is **greyed, never hidden**". Pick one rule. Dorico's (keep the slot, disable it, say why in the tooltip) also satisfies the Still Screen Rule. |
| R2 | "**A letter alone is the piano's**" [rule CLAUDE.md, Keys]; so S, T, P and J take Shift [rule ADR 0114] | Shortcuts depend on **context**: A–G are pitches only while the note-input caret is active; otherwise single letters are commands (S slur, T tie, L lock, O force, Q chords, P play from selection, W score↔part, J jump bar) [D `SHORTCUTS_BY_MODE.md`] | **Collides with Dorico (and Flat's unshifted keys).** Users of Dorico, Flat or MuseScore will press S for a slur. A context model (piano letters while the caret is active or a piano is shown; commands otherwise) keeps your rule where it matters. |
| R3 | "**Edited where it is printed**… the gear holds nothing the score prints" [rule ADR 0114] | On-score editing (popovers, properties) **plus** a separate house-rules layer: Engraving Options (1,617), Notation Options per flow (136), Layout Options per layout [D `options/`] | **Partly collides.** Things that aren't printed but govern everything printed (beam grouping per meter, rest grouping, accidental duration rules, slur and tie shapes, spacing) have no home in your app. Dorico keeps them in rule dialogs, not on the score. |
| R4 | ADR 0114 "Left out… page size and margins in Settings (we print A4), bar-number policies" [rule] | — | **Your ADR contradicts your code:** `entities/piece/model/piece-layout.ts` has `pageSize` (A4 / A3 / Letter), `orientation`, `margins` (cm), `measureNumbers` (every / system / none), `hideEmpty`, `font`, shown in `pages/score-editor/ui/LayoutPanel.tsx` [code]. CLAUDE.md: "Contradicting an ADR: say so, then amend it." |
| R5 | One home per setting; per-screen gears [rule CLAUDE.md] | The same split: Preferences per machine (MIDI, auditioning) vs per-project options vs per-item properties [D P3] | **Matches.** Your MIDI devices are app-wide (`/settings/connect-piano`), as Dorico's are. |
| R6 | Calm screens: explanations behind ⓘ, never paragraphs [rule PRODUCT.md] | Long help text lives in tooltips and help links; Preferences pages do show description lines under some options [D `PANELS_AND_BUTTONS.md`] | **Compatible.** |
| R7 | Bars are glass with no background (HIG) [rule DESIGN.md] | Solid toolbars (Dorico, Flat, MuseScore) | **A difference, not a conflict.** Watch contrast where glass floats over black notation. |
| R8 | Selection is coloured, never boxed [rule DESIGN.md] | Selection `#ff8000`, caret `#ff8000`, linked items `#006cbf` [D] | **Matches** in principle. |
| R9 | Staff size 7 mm [code `STAFF_MM.standard`] | Space size 4.96 pt = 1.75 mm, so a staff of 4 spaces = **7.0 mm** [D] | **Matches exactly.** |
| R10 | Screen view `spacingStaff: 12`, `spacingSystem: 4` [code `shared/ui/score/verovio/toolkit.ts` l.117–118]; Verovio's unit is ½ space | Staff-to-staff gap **6** spaces (minimum 4); system-to-system gap **10** (minimum 8) [D Layout Options] | Staves **match** (12 units = 6 spaces). Systems are **5× tighter** than Dorico's (4 units = 2 spaces vs 10). |
| R11 | Chord-from-keys window `STRUCK_TOGETHER_MS = 80` [code `features/score-editor/model/keys-played.ts:10`] | `stepTimeChordDeadTimeMs 100`, a preference [D] | Close (80 vs 100 ms), but **not adjustable** in your app. Slow players spread chords. |
| R12 | "MIDI input plays sound" default **off** [code] | `enableMIDIThru` default **true** [D] | A **default differs**. For a keyboard without its own speaker (common for controller keyboards), off means silence until the setting is found. |

---

## 2. MIDI: Dorico's settings vs yours
Dorico's settings are listed in full in `../midi-and-staff/MIDI_SETTINGS.md`.

| Dorico setting [D] | Default | Piano Trainer [code] | Status |
|---|---|---|---|
| Enable MIDI input | on | MIDI input, on | ✅ |
| Per-device enable list | all on | one chosen device or "Any keyboard" | ⚠️ different: one device instead of a list |
| MIDI thru | on | "MIDI input plays sound", off | ⚠️ default differs (R12) |
| Suspend input when app in background | off | — | ❌ absent |
| Filter out MIDI controllers | off | — (pedals always read) | ❌ absent |
| Latency compensation (ms) | 0 | **Calibrate timing**: tap test, 0–300 ms in 5 ms steps | ✅ **better than Dorico** (measured, not typed) |
| Bluetooth MIDI devices | button (macOS) | Bluetooth help page | ✅ |
| Reset controllers / all notes off on stop | on | "a Stop lets the pedal up", plus CC120/123 handled | ✅ |
| Chord window, step input (ms) | 100 | 80, fixed | ⚠️ not adjustable (R11) |
| Chord-symbol input from MIDI | on, `kNextBeat` | keys in the chord row name the chord | ✅ (advance behaviour not checked) |
| MIDI Learn (keys or CCs → commands) | available | — | ❌ absent (grep `midiLearn` = 0) |
| Audition notes while editing | on | "Play notes while editing", on | ✅ |
| Audition whole chord when one note selected | off | — | ❌ absent |
| Audition at fixed velocity | off (100) | — | ❌ absent |
| Middle-C name (C3 / C4 / C5) | C4 | no setting (`middle C` appears only in descriptions, e.g. `KeyboardSettingsFields.tsx`) | ❌ absent; Yamaha users see C3 |
| Octave shift | (n/a) | −2…+2 | ✅ (yours) |
| Touch (velocity curve) | (n/a) | light / normal / heavy | ✅ (yours) |
| Pedal polarity | (n/a) | normal / reversed | ✅ (yours) |
| MIDI log | (n/a) | 200 messages | ✅ (yours) |
| **Recording and quantize** | | | |
| Quantization unit | 16th | 1/4, 1/8, 1/16 (simple meter); dotted values (compound) | ✅ |
| Tuplet detection, own unit | on, 16th | 1/4t, 1/8t in the same list | ⚠️ no separate tuplet unit |
| Detect grace notes | on | — | ❌ absent |
| Fill gaps | on | — | ❌ absent |
| Preserve note positions (played timing) | on | the take keeps the raw performance | ✅ |
| Preserve velocities | off (import) | kept in the take | ✅ |
| CC64 → pedal lines (+ snap to beat, merge) | on | take keeps pedals; quantize writes them? not found in `quantise.ts` (grep `pedal` = 0) | ⚠️ unverified: pedals may not become notation |
| Detect slurs / trills / tremolos / staccato | on | — | ❌ absent |
| Retrospective record | yes | — (grep `retrospective` = 0) | ❌ absent |
| Click / count-in | click off, count-in 1 bar; pitches 83 / 79 / 71, velocities 64 / 56 / 48 | count-in 0 / 1 / 2 bars, click on | ✅ |
| **MIDI file import dialog** | 30 options (track names, GM, drums ch 10, split point, infer key, detect…) | automatic: piano-track detection, split at middle C, key detection | ⚠️ no options (by design?) |
| Channel filter | n/a in Dorico prefs | ignores channel; output on ch 1 | — |

---

## 3. Staff and score: Dorico vs yours
Dorico's settings are listed in full in `../midi-and-staff/STAFF_SETTINGS.md`.

| Area | Dorico [D] | Piano Trainer [code] | Status |
|---|---|---|---|
| Piano = 2 staves, brace, treble + bass, range A0–C8 | instrument definition | always a braced pair | ✅ (no options, as Dorico's piano has none either) |
| Staff size | per layout, 4.96 pt default (score 4.535 on A3) | per song, 5–9 mm, 7 default | ✅ |
| Page size | 19 presets | A4 / A3 / Letter | ⚠️ fewer |
| Margins | per layout, pt | cm, 0–5 | ✅ |
| Staff / system spacing | 6 / 10 spaces, minimum 4 / 8, vertical justification at 60% and 80% fullness | page: 6 / 6 spaces, 2–16; screen: 6 / **2** | ⚠️ screen systems tight (R10); no justification setting |
| Note spacing | crotchet = 4 spaces, floor 8/5, grace 70% | 0–100 slider → `spacingLinear` | ✅ (different model) |
| Bars per system | casting off: fixed bars / systems | Auto or 1–8 | ✅ |
| Bar numbers | frequency, interval, position, enclosure, paragraph style… (26 options) | every / system / none | ⚠️ fewer |
| Hide empty staves | never / after first system / always | never / after first / always | ✅ same |
| Staff labels (full on first system, short after) | `kFull` / `kAbbreviated` / `kNone` per layout | names printed at a first line's head (`shared/ui/score/verovio/svg-labels.ts`, ADR 0114); no setting for full / short / none | ⚠️ present, no options |
| First-system indent | 0 score, 6 part | none found | ❌ absent |
| Clef / key repeated in each system's preamble | Notation Options, on | Verovio default | ✅ implicit |
| Music font | Bravura (+ 4 others) | Bravura / Petaluma / Leland (page only; screen fixed to Bravura) | ✅ |
| Score vs parts (layouts) | full score, parts, custom | one layout per song | ❌ absent (matters for groups and choirs, PRODUCT.md) |
| Transposing instruments | concert / transposed per layout | none | ❌ absent (fine for piano; not for band or choir) |
| Out-of-range notes coloured | dark red / red | none | ❌ absent |
| Engraving defaults (line thickness etc.) | Dorico's values, exact | Verovio defaults | ⚠️ see §6 to adopt Dorico's |

---

## 4. Palette: your categories mapped to Dorico
Dorico's full list is in `../palettes/PALETTES.md`.

| Your category (ADR 0114, Flat's order) | Dorico's home | Dorico items you can take names and order from [D] |
|---|---|---|
| Note (Replace / Insert / Chord; values; dot; tie; tuplets; rest; ♮ ♯ ♭; respell) | Notes toolbox and Notes panel | durations 1024th…breve (keys 1–9); Insert scopes: voice / player / global / bar; Lock and Force duration; Grace; Scissors |
| Pitch | Write › Respell, Transform | Respell above / below; **Transform: invert, retrograde, rotate, map pitches, map scale** (absent in yours) |
| Articulations | Notes panel | accent, marcato, stress, unstress, staccato, tenuto, staccatissimo, staccato-tenuto |
| Ornaments | Ornaments panel (⇧O) | **45 ornaments** (mordent, turn, inverted turn, shake, Schleifer, slide, Haydn ornament…), arpeggio, glissando, jazz |
| Dynamics | Dynamics panel (⇧D) | dynamics in the default technique list: ppp, pp, p, mp, mf, f, ff, fff, fp, ffp, sf, sfp, sfz (`playingTechniqueDefinitions.xml`, group kDynamics = 25); plus hairpins, messa di voce, niente and combined dynamics (panel labels) |
| Measures (bars, breaks, sections, rests, repeats, tempo, swing) | Bars and Barlines (⇧B), Tempo (⇧T), Repeat Structures | **78 tempo words**, **11 rhythmic feels** (light / medium / heavy swing 8ths and 16ths, 2:1, 3:1), rehearsal marks |
| Clef | Clefs panel (⇧C) | **26 clefs**, **7 octave lines** |
| Key signature | Key Signatures panel (⇧K) | 15 keys + custom, accidental systems, tonality systems |
| Time signature | Time Signatures panel (⇧M) | common signatures, pick-up bar, interchangeable and aggregate |
| Barlines and repeats | Bars and Barlines, Repeat Structures | barline types (single, double, final, repeats, dashed, tick, short), D.C., D.S., Coda, Fine, repeat endings, bar repeats |
| Text (lyrics, chords, Roman numerals, text, techniques) | Text (⇧X), Lyrics (⇧L), Chord symbols (Q), Playing techniques (⇧P) | **298 playing techniques** (224 techniques, 35 ornaments, 25 dynamics, 14 lengths), 37 text styles |
| — (none in yours) | **Holds and Pauses** (⇧H) | 9 fermatas, 4 breath marks, 5 caesuras (you have fermata and breath under other categories, grep: 11 / 17 files) |
| — | **Popovers** (type-to-create) | absent (no type-to-create entry; `popover` matches are UI popovers) |
| — | **Properties panel** (per-item: stem direction, placement above or below, slur direction, hide, scale) | absent as a panel (grep `stemDirection` = 1 file) |

---

## 5. Missing flows (present in Dorico, not found in Piano Trainer)
Ranked for a piano learner's app. "Found" means a route in `app/router.tsx`, an action type in the editor reducer, or a source file.

| # | Flow | Dorico entry point [D] | Why it matters here | Evidence it's missing |
|---|---|---|---|---|
| M1 | **Cross-staff notes** (a right-hand note on the bass staff and vice versa) | `CrossStaff` commands (⌘⇧↑ / ↓) | Piano music needs it constantly; Chopin's Fantaisie-Impromptu, for instance | grep `cross.?staff` = 0 |
| M2 | **Second voice on a staff** (create voice, next voice, voice 2 stems down) | ⇧V Create Voice, V Next Voice | Bass lines with a sustained note under moving notes; hymns | no voice action among the editor's 52 action types (`layer` = which row, not a voice) |
| M3 | **Retrospective record** (keep what was just played without arming record) | `Play.RetrospectiveRecord` | Learners play first and decide afterwards | grep = 0 |
| M4 | **Pedal and articulation from the recording into notation** (CC64 → pedal lines; slurs, staccato, trills detected) | Quantize preferences | Takes keep pedals, but `quantise.ts` has no pedal | grep `pedal` in `quantise.ts` = 0 |
| M5 | **Out-of-range and proofreading warnings** | red notes; Proofing panel | Songs imported from MIDI or MusicXML for a 61-key keyboard | grep = 0 |
| M6 | **Fast entry: type-to-create popovers and a command palette** (Jump bar) | ⇧-letter popovers; J | Laptop speed; your search palette is for content, not commands | grep `jumpBar` / `commandPalette` = 0 |
| M7 | **Per-item properties** (flip stem, slur or tie direction, above or below, hide an item, reset) | Properties panel; `Edit.Flip`… | Fixes engraving collisions without rules dialogs | `stemDirection` 1 file; no properties panel |
| M8 | **House rules** (beam grouping per meter, rest grouping, accidental duration, cautionaries) | Notation Options ⌘⇧N | Method-book styles vary (e.g. 6/8 beaming) | no options page for these (R3) |
| M9 | **Parts and custom layouts** (print one singer's or one hand's part; same music) | Setup › Layouts; W | Groups, choirs and bands (PRODUCT.md: "a class, a choir, a band") | one layout per piece (`piece-layout.ts`) |
| M10 | **Several movements (flows) in one song** | Setup › Add Flow ⇧F | Method books: one page, several exercises | no flow concept in the editor (the `flow` matches are UI flow) |
| M11 | **Selection by filter** (select only dynamics, only voice 2, select more) | Edit › Filter (96 commands), ⌘⇧A | Bulk edits | `Filter` area absent |
| M12 | **Transformations** (transpose a selection diatonically, invert, retrograde, rotate, repeat pitches) | Write › Transform | Exercise writing (Practice › Exercises) | grep `retrograde` = 0 |
| M13 | **Go to bar in the editor** | ⌘G | Long songs | the Player has it (`pages/player/ui/PlayerPage.tsx` `goToBar`); not found in the editor |
| M14 | **Graphic adjustment and reset** (drag items, staff spacing, note spacing, Reset) | Engrave mode | Printed sheets | none beyond breaks and bars per system |
| M15 | **Page furniture** (page numbers, header with title on later pages, first-page template) | master pages, `{@page@}` | Printed songbooks | grep `pageNumber` = 0 in the score code |
| M16 | **Print and export options** (choose layout or range, booklet or 2-up, PNG / SVG graphics, file names from tokens) | Print mode | Teachers making handouts | print = the browser's print of the Player view (`widgets/song-print`) |
| M17 | **MIDI Learn** (a pedal or pad → Next bar, Play, Undo) | Preferences › Key Commands | Page-turn and play pedals at the piano | grep = 0 |
| M18 | **MIDI import options** (split point, track choice, quantize) | Import MIDI dialog | Imported files that the automatic guess gets wrong | none (automatic only) |
| M19 | **Middle-C convention** | Preferences › General | Yamaha (C3) vs scientific (C4) naming | absent |
| M20 | **Staff-label options and first-system indent** | Layout Options | Scores with voice and piano | labels print at the first line; no full / short / none choice; indent not found |

**Already present and comparable or better:** latency calibration, MIDI log, pedal polarity, touch curve, takes with a roll, Wait / Interpret practice (no Dorico equivalent), chord views, a 3D hands view, MusicXML and MIDI in and out, hide empty staves, staff size, page, vertical-scroll and panorama views, Roman numerals, lyrics, fingering, chord input from MIDI.

---

## 6. Ready-to-use: Dorico 6 engraving defaults → Verovio
Verovio's `engravingDefaults` option takes **staff spaces**, the same unit as Dorico's options. These are the Dorico 6.2.31 values [D `midi-and-staff/d6-engraving.json`]. Map them into `verovioOptions()` / `pageOptions()` to make the engraving look like Dorico's:

```ts
// Dorico 6.2.31 Engraving Options → Verovio `engravingDefaults` (all in staff spaces)
const DORICO_ENGRAVING_DEFAULTS = {
  staffLineThickness: 1 / 8,      // staveOptions.staveLineThickness
  stemThickness: 3 / 25,          // stemOptions.stemThickness
  legerLineThickness: 1 / 6,      // ledgerLineOptions.ledgerLineThickness
  legerLineExtension: 2 / 5,      // ledgerLineOptions.ledgerLineProtrusionForNotes
  slurEndpointThickness: 1 / 12,  // slurOptions.slurEndThickness
  slurMidpointThickness: 1 / 5,   // slurOptions.slurMiddleThickness
  tieEndpointThickness: 1 / 8,    // tieOptions.tieEndThickness
  tieMidpointThickness: 1 / 4,    // tieOptions.tieThickness
  thinBarlineThickness: 1 / 5,    // barlineOptions.thinBarlineThickness
  thickBarlineThickness: 1 / 2,   // barlineOptions.thickBarlineThickness
  barlineSeparation: 1 / 2,       // barlineOptions.doubleBarlineGap
  repeatBarlineDotSeparation: 1 / 2, // barlineOptions.gapBetweenOutermostLineAndRepeatDots
  dashedBarlineDashLength: 2 / 3, // barlineOptions.dashedBarlineDashLength
  dashedBarlineGapLength: 2 / 3,  // barlineOptions.dashedBarlineGapLength
  bracketThickness: 1 / 2,        // bracketingOptions.bracketWidth
  hairpinThickness: 1 / 6,        // dynamicsOptions.hairpinPenWidth
  octaveLineThickness: 1 / 12,    // ottavaLineOptions.ottavaLineExtensionLineThickness
  pedalLineThickness: 1 / 8,      // pedalLineOptions.continuationLineWidth
  repeatEndingLineThickness: 1 / 5, // repeatEndingLineEngravingOptions.lineThickness
  lyricLineThickness: 1 / 16,     // lyricOptions.extenderLineThickness
  tupletBracketThickness: 1 / 8,  // tupletOptions.tupletBracketLineWidth
} as const
// Verovio `engravingDefaults` also requires subBracketThickness, textEnclosureThickness and hBarThickness;
// Dorico has no direct equivalents in this set, so keep Verovio's values for those.
// Spacing in Verovio units (½ space): spacingStaff 12 (= Dorico 6), spacingSystem 20 (= Dorico 10, minimum 16 = 8)
// graceFactor 0.6 (= noteOptions.graceNoteVisualScale 3/5)
```

The comments name each Dorico option, so every value can be traced. Verovio's `EngravingDefaults` interface marks every field as required; check it against the installed package's types before use.

---

## 7. What to read next in this folder
| Need | File |
|---|---|
| Every Dorico MIDI preference, with key, label and default | `../midi-and-staff/MIDI_SETTINGS.md`, `dorico-preferences-all.json` (371 prefs) |
| Every staff-related setting across 5 scopes (Dorico 6) | `../midi-and-staff/STAFF_SETTINGS.md` |
| Dorico 6 option defaults (engraving 1,617 / notation 136 / note input 150 / playback 155) | `../midi-and-staff/d6-*.json` |
| Every palette and item name | `../palettes/PALETTES.md`, `palette-inventory.json` |
| App structure, navigation and every button | `../ui-flow/APP_FLOW.md`, `PANELS_AND_BUTTONS.md`, `COMMANDS.md` |
| UX patterns | `../ui-flow/UX_PATTERNS.md` |
