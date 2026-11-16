# Dorico data model: projects, players, flows, layouts, events

Recovered from Dorico 6.2 by decoding `.dorico` project files (format below) and the bundled scripting API.
Everything here was observed directly in decoded files; the source element is named in each section.
Dorico's internal engine is called **steam**.

---

## 1. The big idea: content is separate from presentation

Dorico separates **what the music is** from **how it's printed**:

```
Project (kScore)
├── Players ──── hold Instruments (one player can double several instruments)
├── Flows ────── independent pieces of music (movements, songs, exercises)
│     └── per flow: event streams (notes, rests, slurs, dynamics…) for every player/instrument/stave/voice
├── Layouts ──── printed views (full score, each part, custom score) choosing WHICH players × WHICH flows
│     └── each layout has its own Layout Options (page size, staff size, spacing, casting off…)
│           and its own page formatting (master pages + frames)
└── Library ──── shared definitions: master pages, paragraph styles, clefs, noteheads, playing techniques,
                 instruments, score orders, line styles, chord-symbol appearances…
```

A **part** is just a layout that includes one player across all flows. A **full score** includes all players across all flows.
Nothing is copied: editing a note in the score edits it in the part, because both read the same flow event stream.

**Option scopes.** This is the key rule for an editor:

| Scope | Options | Stored in | Per |
|---|---|---|---|
| Engraving Options | appearance of every notation item (1,414 settings) | `scoreOptions/engravingOptions` | project |
| Notation Options | musical interpretation: beaming, rest grouping, accidental rules, condensing… | `flow/notationOptions` (`defaultNotationOptionsForFlow` = template) | **flow** |
| Layout Options | page/staff size, margins, vertical spacing, casting off, bar numbers, multi-rests | `layout/layoutOptions` (`defaultLayoutOptionsMap` = template per layout type) | **layout** |
| Note Input / View / Playback | editor behaviour | `scoreOptions/*` | project |
| Properties | one-off overrides on a single item | `event/propertyTable` | item (+ optional layout/frame scope) |

The option references are in `../options/`.

---

## 2. Project root (`kScore`)

| Element | Meaning |
|---|---|
| `fileVersion` | data-format version (Dorico 4.0.0 = 1.1059 … 4.0.5 = 1.1096) |
| `instrumentScoreOrderEntityID` | score order used to sort players, e.g. `instrumentscoreorder.orchestral` |
| `layoutSortOrder` | `kByScoreOrder` |
| `idGenerators` | next free id per object kind: instrument, player, playerGroups, layout, flow, event, eventStream, blockInstance, block, stave, frameChain, page, textFlow, eventGroup… (ids are per-kind integers) |
| `info` | project info: title, subtitle, dedication, composer, arranger, lyricist, artist, copyist, publisher, editor, copyright, workNumber, composerDates, compositionYear, otherInfo, created/saved dates & versions. These feed the `{@projectTitle@}`-style tokens on master pages. |
| `scoreOptions` | engraving / note input / playback / printing / default notation / default layout / view options |
| `library` | project-local copy of all definitions (see §7) |
| `scorePlayers`, `scorePlayerGroups` | players and groups (sections) |
| `flows` | the music |
| `textFlows` | rich text that flows through text frames |
| `layouts` | printed views |
| `playModeData` | playback/mixer state |

---

## 3. Players and instruments (`scorePlayers`)

```
scorePlayer
  playerID, soloPlayer (true = solo player, false = section player e.g. "Violin I" section)
  baseName / displayName / baseShortName / displayShortName      e.g. "Trumpet (B Flat)" / "Tpt (B Flat)"
  isSoloist                     → placed by score order's insertSoloistsBefore
  chordSymbol… visibility       → whether chord symbols show for this player
  instruments[]                 → a player can hold several (doubling, e.g. Flute + Piccolo)
    instrument
      entityID                  instrument.brass.trumpet.bflat  (library definition)
      instrumentID              per-project id
      numStaves                 1 (2 for piano/harp, 3 for organ)
      transpositionVisibility   kFollowOptions
      instrumentColour          #39a8ec  (UI colour)
      suffixType                kArabic  → "Trumpet 1, 2" numbering
      standardRange / advancedRange   F3-A5 / E3-F6  (used to colour out-of-range notes)
      nameData, transposition, staveDefinition, clefs[]
```
- **Player groups** (`scorePlayerGroup`: name, shortName, groupID, playerIDs) bracket players together, e.g. divisi sections or "Strings".
- A **section player** can divide (divisi). A **solo player** can hold several instruments, and Dorico inserts "instrument change" labels when the player switches.

---

## 4. Flows (`flows/array/flow`), the music itself

A flow is "a complete section of music for a number of instruments" (Steinberg's API doc).
Each flow has its own time signatures, key signatures, tempo, bar numbering and notation options.

| Element | Meaning |
|---|---|
| `flowID`, `flowName` | id and name ("Flow 1", "Allegro", "Exercise 3") |
| `flowInfo` | per-flow title, composer, … (feeds `{@flowTitle@}` tokens in flow headings) |
| `playerAcquisitionPolicy` | `1,1` = new players are automatically added to this flow |
| `minimumNotatedLength` | `{length, behaviour: kNotateUpToLength}`: the flow is padded to at least this length |
| `flowPlayers[]` | which players take part, and their stream wiring (below) |
| `elementTables` | shared "elements" referenced by events: BarDivision (time signatures), TonalityDivision (key signatures), Slur, DynamicGroup… |
| `notationOptions` | the flow's Notation Options (beaming, rests, accidentals, condensing…) |
| `blocks`, `blockInstances`, `eventStreams` | the events (below) |
| `condensedStreams` | results of condensing (several players on one stave in the score) |
| `automationStreamTable` | playback automation |
| `editingLocks`, `flowVideoData` | locks; video sync |

### 4.1 Stream wiring per player (`flowPlayer`)
```
flowPlayer
  playerID, eventStreamID          → the player stream (player-level items)
  flowPlayerInstruments[]
    instrumentID
    staveStreamInfos[]             → one per stave: staveStreamID, nthStaveInInstrument, staveID,
                                      ossia (kNone/above/below), divisiIndex, extraStaveIndex{position,index}
    voiceStreamInfos[]             → one per voice: voiceStreamID, defaultLogicalStaveID,
                                      voiceDirection (kPreferStemsUp/…Down), slashType (kWithoutSlashes / slash voices)
  staveSizeOverrides[]
```

### 4.2 Event streams: four levels (`eventStreamType`)
| Stream type | Holds |
|---|---|
| `kGlobalTimebaseStream` | system-wide items: time signatures (BarDivision), key signatures (TonalityDivision), tempo, rehearsal marks, repeats |
| `kPlayerStream` | player-level items |
| `kInstrumentStaveStream` | per-stave items: clefs, ottava lines, stave-attached text |
| `kVoiceStream` | notes, rests, tuplets, slurs, dynamics… for one voice |

API mirrors this: `Flow.timebaseStreams / playerStreams / staveStreams / voiceStreams / allStreams`.

### 4.3 Blocks: how events are stored
Events don't live directly in a stream. They live in **blocks**, and a stream places **block instances** on its timeline:
```
block          { blockID, parentEventStreamType, events[] }
blockInstance  { blockInstanceID, blockID, streamID, position }
eventStream    { streamID, eventStreamType, blockInstanceIDs }
```
This indirection lets the same block be placed several times. Event positions are relative to the block.

### 4.4 Events (`…EventDefinition`)
Common fields on every event:
| Field | Meaning |
|---|---|
| `eventID` | unique within the flow |
| `position`, `duration` | **musical time in crotchets (quarter notes) as exact fractions**: `1/2` = quaver, `3/2` = dotted crotchet (both observed). Tuplets weren't present in the sample files; the API has a separate `TupletEvent`/`TupletDefinition`. |
| `secondaryPosition`, `secondaryEndOffset` | sub-ordering at the same position: grace notes, items before/after a note |
| `propertyTable.entries[]` | per-item overrides (see 4.5) |
| `logicalStaveIDOverride` | cross-staff notes |

Specific events seen: `NoteEventDefinition` (+ `pitch` = MIDI number, concert pitch), `SlurEventDefinition`,
`BarDivisionEventDefinition` (→ `barDivisionElementID` = time signature element), `TonalityDivisionEventDefinition` (key signature),
`ImmediateTempoChangeEventDefinition`. The API adds Rest, BarRest, Tuplet, Clef, OttavaLine, Text, DynamicGroup, ImmediateChangeDynamic.

**Durations are logical, not notated.** A note stores only its sounding length (`3/2`).
How it's *written* (dotted crotchet, or crotchet tied to quaver across a beat) is decided at render time by the flow's
Notation Options (`noteGroupingOptions`, `syncopationDetectorOptions`, `dotNotationOptions`) and the time signature's beat grouping.
Named lengths in the files: `kBreve, kSemibreve, kMinim, kCrotchet, kQuaver, kSemiQuaver, kDemiSemiQuaver, kHemiDemiSemiQuaver, k128Note, k256Note, k512Note`.

**Pitch + spelling.** `pitch` is the MIDI note number at concert pitch. Spelling is a property:
`kNoteSpelling = "C"` (letter + accidental), so 61 can be C# or Db. Transposing layouts derive written pitch from the instrument's
`transposition {chromatic, diatonic, concertOctave}`, e.g. B♭ trumpet = +2 semitones / +1 letter (major 2nd up).

### 4.5 Properties (`propertyTable.entry`)
```
entry
  propertyType   kNoteSpelling | kBeamStart | kBeamEnd | … (hundreds of kinds)
  value          "string: \"C\"" (typed variant: string:, int:, bool:, list:)
  context
    layoutIDWithFrameChainID   list {layoutID, frameChainID, bool}: -1,-1 = applies everywhere,
                               otherwise scoped to one layout (e.g. move a slur only in the part)
    blockInstanceID            -1 = all instances
    propertyOffset             "0:0:1:0" (sub-item addressing)
```
So any property can be **global or layout-specific**. This is how Dorico lets you nudge something in the part without changing the score.

### 4.6 Time signatures (`BarDivisionElementDefinition/barDivisionData`)
```
timeSignature
  timeSignaturesAndDivisions[]
    behaviour        kNewBar
    timeSignature    numerator 4, denominator 4
      beatGroupingAndOptions/beatGrouping
        beatUnit             kCrotchet
        beatLengthsInUnits   [1,1,1,1]     ← 7/8 as 2+2+3 would be beatUnit kQuaver, [2,2,3]
suppressInitialBarline, timeSignatureCommon (C symbol), interchangeableTimeSignatures, aggregate time signatures
```
Beat grouping drives beaming and how notes are split across beats.

---

## 5. Layouts (`layouts/array/layout`)

| Element | Meaning |
|---|---|
| `layoutID`, `layoutType` | `kFullScoreLayout`, `kPartLayout`, `kCustomScoreLayout` |
| `layoutName`, `layoutNumber` | "Full score", part names |
| `flowIDs` | **which flows** this layout shows |
| player list (via options / custom order) | **which players** it shows (a part normally has one) |
| `layoutOptions` | full Layout Options for this layout (`../options/LAYOUT_OPTIONS.md`), including: |
| ↳ `transpositionType` | `kScoreInC` (concert) or `kTransposingScore` (parts default to transposing) |
| ↳ `defaultSpaceSize` | staff-space size in **points** (4.96 pt = 1.75 mm) |
| ↳ `pagePairSetEntityID` | which master page set: `pageset.fullscore` / `pageset.part` |
| ↳ `pageSizeAndMarginOptions` | page size & margins in **points** (594 × 841 = A4) |
| ↳ `verticalStaveGapOptions` | ideal gaps in spaces: stave→stave 6, groups 8, inter-system 10, minimums 4/8 |
| ↳ `verticalJustificationOptions` | justify when frame is ≥ 60% full (systems) / ≥ 80% (staves) |
| ↳ `noteSpacingOptions` | crotchet = 4 spaces, floor 8/5, grace 70%, cue 70% |
| ↳ `castingOffOptions` | fixed bars per system / systems per page |
| ↳ `flowBreakBehaviour` | `kStartNewPageForFlows` (or continue on same page) |
| ↳ `flowHeadingBehaviour`, `firstPageBehaviour` | flow titles; first-page master only for first flow |
| ↳ `hideEmptyStavesPolicy` | `kNever` / hide empty staves after first system |
| ↳ `showMultiRests`, `barConsolidationBehaviour` | multi-bar rests (parts usually on) |
| frame chains, pages | layout-specific page overrides of the master pages |

### 5.1 Page layout: master pages, frames, frame chains
(`library/pagePairDefinitionSets`; full dump in `../library-data/MASTER_PAGES_AND_TEXT_STYLES.md`)
- A **page set** (e.g. "Default Full Score") has a **first page**, a **normal page** (each with **left** and **right** variants for facing pages), a **flow heading** definition, and optional extra pages.
- Each page holds **frames**: rectangles positioned by constraints (distance from left/right/top/bottom margin; width/height). Units are points.
- A **music frame** shows systems. A **text frame** shows paragraphs with `{@token@}` fields.
- Frames belong to a **frame chain** (`frameChainDefinitionID`). Music flows from one frame to the next frame in the same chain, page after page. This is how systems pour across pages.
- Default full-score **first page**:
  - title frame: top, full width, 36 pt high, `{@projectTitle@}`
  - lyricist (left) and composer (right) frames: each 255 pt wide, at 36 pt from the top
  - music frame: from 60 pt below the top margin to 20 pt above the bottom margin
  - copyright frame: bottom, 15 pt high
- **Normal pages**:
  - page number `{@page@}` in a 20 × 15 pt frame at the outer top corner (left on left-hand pages, right on right-hand pages)
  - running header across the top, 15 pt high: `{@flowTitle@}` in the full score, `{@layoutName@}` (the part name) in parts
  - music frame from 20 pt below the top margin down to the bottom margin

---

## 6. File format (`.dorico`)

- `.dorico` is a **ZIP**: `META-INF/container.xml`, `score.dtn` (project), `scorelibrary.dtn` (library snapshot), `supplementary_data/` (playback engine state, workspace, video).
- `.dtn` = binary tree, decoded by `../tools/dtn_decoder.py` / `dtn-decoder.ts`:
  ```
  u32 version(4) | u32 1
  u32 nKeys  + nKeys NUL-terminated key names      (element names, deduplicated)
  u32 nVals  + nVals NUL-terminated values         (all scalars stored as strings)
  u32 nNodes + nodes (node 0 = root), varints = unsigned LEB128
    0 value        : key, valueIndex
    1 empty array  : key, 0
    2 object       : key, flag(u8), count, childNodeIndex×count
    3 array        : key, flag(u8), count, childNodeIndex×count
  ```
  All 8 bundled projects decode completely (every byte consumed), with 48k–64k nodes each.
- Scalar encodings: fractions `"7/10"`, enums `"kSomething"`, typed variants `string: "C"`, lists `steamVariantList:list: {int: 1}, …`.

---

## 7. Library (`library`, also `Resources/*.xml` in the app)

Every definition uses the same entity pattern: `{name, entityID, parentEntityID, inheritanceMask, …}`.
Children inherit from `parentEntityID` and override fields; `../library-data/instruments.json` is resolved this way.

| Library | Count (Dorico 6.2 resources) | Export |
|---|---|---|
| Instruments | 624 (428 pitched) | `instruments.json`: names, staves, clefs, ranges, transposition, techniques |
| Score orders | 3 (Band, Jazz, Orchestral) | `score-orders.json` |
| Ensembles | 32 | `ensembles.json` |
| Playing techniques | 298 (techniques, ornaments, dynamics, lengths) | `playing-techniques.json` |
| Project templates | 41 | `templates.json` (with option overrides like `defaultSpaceSize=4.61`, A3 page) |
| Master page sets | 2 (full score, part) | `master-pages.json` |
| Paragraph styles | 21 | `paragraph-styles.json` |
| Also present (not exported) | clefs, ottavas, notehead sets, rest sets, flags, glyphs, composites, tempo presets, rhythmic feels, pen/font/brush styles, line styles, chord-symbol appearances, chord diagrams, drum maps, expression maps | decode `scorelibrary.dtn` |

---

## 8. Using this in a TypeScript editor

- Mirror the separation: `Project { players, flows, layouts, library, options }`. Renderers take (layout, flow) → pages.
- Store **logical** durations as exact fractions of a crotchet (use a rational type), and derive notation at render time.
- Store **concert pitch + spelling**, and transpose per layout.
- Keep **three option scopes** (project engraving, flow notation, layout) plus per-item properties with optional layout scope.
- Use a page → frames → frame-chain model for pagination. Verovio (see `../../piano-theory-export/open-source/LIBRARIES.md`) can do the system/page breaking inside a single music frame.
