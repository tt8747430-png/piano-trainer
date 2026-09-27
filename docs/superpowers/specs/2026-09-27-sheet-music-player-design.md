# Sub-project 3: notation and the sheet-music Player

- **Status:** decided 2026-09-27 by the building session, on the owner's standing instruction ("make the best
  decisions and continue"; "no legacy leftovers, no workarounds, no hacks, no backwards compatibility"). Builds
  sub-project 3 of the roadmap (`2026-09-25-next-features-roadmap-design.md` §2, §3.5, §4.1, §12, §13).
- **Builds on:** the app as built through sub-project 2 (`DESIGN.md`, `CLAUDE.md`, ADRs 0008–0012).
- **Verified first** (roadmap §4.1 asked for it before the plan): VexFlow 5.0.0 was installed in a scratch project
  and run under jsdom 29 (§4.1).

## 1. What this delivers

1. **Sheet music in the Player:** the piece as it is played (the chosen key, pattern, hands' figures, chord size and
   melody), engraved on a grand staff: chord symbols over numbered bars, a cursor on what sounds now, and a loop
   dragged over bars.
2. **The Player in Flowkey's shape** (roadmap §3.5): ✕, the title, a **tempo** popover (Wait mode, 50%, 75%, 100% or
   any tempo, speed training), a **hands** popover, the loop, MIDI and ⚙ in one toolbar; the keyboard under it; the
   sheet; ‹ ▶ › beside each other. Gone: the mode switch, the chord strip, the big chord now and next, the note grid.
3. **The Player can be handed any Performance,** not only a listed piece: everything but the piece's own setup (key,
   pattern, figures, chord size, melody) takes a Performance. Sub-project 4 hands it the key's chords, 7 its
   exercises.
4. **Swing** (⚙ sheet) and **speed training** (tempo popover): straight 8ths played long-short; each pass of the loop
   5% faster, up to the piece's own tempo.
5. **A notation kernel,** `shared/lib/notation`, fenced like the music kernel: timed notes in, a written Score out.

Not here (their sub-projects): sheet music outside the Player (a lesson's staff, 5; the scale as sheet music, 4);
editing and MusicXML (9); recording from MIDI and the live score (planned, roadmap §5).

## 2. Decisions

### 2.1 What the Player plays, and what the sheet shows

The roadmap (§4.1) says of the Score: "the editor edits it, the cursor walks it, the Player plays it, exercises
generate it". Every source the roadmap names first produces **timed notes**: an arrangement (a chart and its
patterns), an exercise generator (a rule in a key), a recording from MIDI. So:

- **The Player is handed a `Performance`** (timed notes with hands, fingers and spellings, bars, chord symbols and
  beat groups), as today, and it **shows the notation of it**: `notate(performance) → Score`, pure, in the notation
  kernel. The Performance stays the one playable truth: the practice machine, the transport and the keyboard read it.
- **The Score** is the written form: measures, two staves, voices, note values, ties, accidentals, chord symbols. The
  editor (9) edits a Score and adds `perform(score)`, its way back to a Performance, when it has a Score to perform.
- **`notate` takes the notation kernel's own input type** (`TimedMusic`); a Performance satisfies it structurally, so
  the notation kernel imports only `music` and the arrangement engine imports nothing new.

### 2.2 The Performance carries what the page needs to write it

Today a rolled chord's notes start one tick apart, so each is its own beat group, and a note's spelling is guessed
afterwards from its chord. A written score needs the written onset and the spelling, so the arrangement engine keeps
them:

- **`PerformanceNote.startTick` and `durationTicks` are the written onset and length.** A rolled chord's notes share
  their onset; **`roll`** (ticks, 0 for a struck note) says how late each sounds. The schedule sounds a note at
  `startTick + roll` for `durationTicks − roll`. A rolled chord is one beat group: Step lands on it once, Wait mode
  waits for all of it.
- **`PerformanceNote.spelled`** is the note's spelling, decided where the chord is voiced: a chord tone as the chord
  spells it, another note (a passing `_b7`, a scale step `s2`) as the key spells it (today's rule in
  `note-names.ts`, moved into `arrange`). **The tune keeps its written spelling:** `MelodyNote.spelled` is read from
  the melody string (`C#5` is C♯, not D♭) and transposed by interval (`transposeNote`), its key moved the short way as
  now.
- **`Performance.meter`** (and `Chart.meter`) replace `beatsPerBar`: the page needs to know 6/8 from 2/4.

### 2.3 Time and meter move into the kernel

`Tick`, `TICKS_PER_BEAT` (arrangement), `Meter`, `METERS`, `beatsPerBar` and `barLength` (entities/piece) are music
theory the notation kernel needs too. They move to `shared/lib/music/time.ts`: `Tick`, `TICKS_PER_BEAT`, `METERS`,
`Meter`, `beatsPerBar(meter)`, `isCompound(meter)`, and `timeSignature(beats, meter) → { count, unit }` with
`timeSignatureText` (`barLength` today: a 2-beat bar in 4/4 is 2/4, 1.5 beats is 3/8, 2 beats in 12/8 is 6/8). Every
importer changes; nothing re-exports the old names.

### 2.4 The notation kernel (`shared/lib/notation`)

Pure TypeScript, imports only `music` and no package (lint, as for `music` and `arrangement`), ≥90% line coverage.

**The Score:**

```ts
type NoteValue = 1 | 2 | 4 | 8 | 16 | 32            // whole … 32nd
interface Duration { value: NoteValue; dots: 0 | 1; triplet: boolean }
interface WrittenNote {
  midi: Midi
  spelled: SpelledNote
  octave: number                                  // written: B♯3 is midi 60
  accidental: Accidental | null                   // printed before it; null when the key or the bar says it
  tie: boolean                                    // tied to the same key's next note
  finger?: Finger
}
type ScoreEvent =
  | { kind: 'notes'; tick: Tick; duration: Duration; notes: readonly WrittenNote[]; rolled: boolean }
  | { kind: 'rest'; tick: Tick; duration: Duration; hidden: boolean }   // hidden: a second voice's gap
interface ScoreVoice { events: readonly ScoreEvent[]; stem: 'auto' | 'up' | 'down' }
type StaffId = 'treble' | 'bass'
interface Measure {
  startTick: Tick; ticks: Tick; time: TimeSignature
  staves: Readonly<Record<StaffId, readonly ScoreVoice[]>>
  chords: readonly { tick: Tick; symbol: string }[]
}
interface Score { key: Key; meter: Meter; measures: readonly Measure[] }
```

**`notate(music: TimedMusic): Score`**, where `TimedMusic` is `{ key, meter, bars: { startTick, beats }[], notes:
TimedNote[], chords: { startTick, symbol }[] }` and a `TimedNote` is `{ midi, spelled, hand: Hand | 'melody',
startTick, durationTicks, roll, finger? }`:

1. **Staves by hand:** the right hand and the tune on the treble staff, the left hand on the bass. A grand staff
   always (§2.9).
2. **Bars:** a note crossing a barline is cut there and tied into the next bar.
3. **Voices,** per bar and staff, at most two. Notes of one hand with the same onset and length are one chord
   (rolled when any sounds late). On the treble staff the tune, when there is one, is voice 1 and the right hand
   voice 2. Otherwise a chord joins the first voice that is free at its onset, or opens the second; when both are
   busy, the voice that frees first is cut short to this onset (in writing only: the sound is the Performance's). With
   two voices the higher (by mean pitch) has stems up, the other down; one voice stems as the notes lie. Gaps are
   rests: voice 1's printed, voice 2's hidden. An empty staff has a whole-bar rest.
4. **Note values.** A beat is 12 ticks; the eighth is 6 ticks in x/4 and 4 in x/8 (compound: a dotted quarter is the
   beat). The values a meter has are those whose ticks are whole: in x/4 the whole (48) to the 16th (3), dotted
   down to the dotted eighth (9), and in a **triplet beat** the triplet quarter, eighth and 16th (8, 4, 2); in x/8 the
   dotted whole (48) to the 32nd (1), with no triplets. A beat is a triplet beat for a voice when every onset or end
   inside it lies on the 2-tick grid and one does not lie on the 3-tick grid; a beat on neither grid is quantised to
   the nearest 3 ticks, in writing only.
5. **Spelling a length** (a note's or a gap's, inside its bar), greedily, longest value first, a value allowed at a
   tick when:
   - **a beat or longer:** it starts on a beat; it ends on a beat, or (x/4 only) half-way through one (♩. ♪); and in a
     four-beat bar it crosses the middle only from the bar's start (a whole, a dotted half);
   - **shorter than a beat:** it lies inside one beat, starting on a multiple of half its undotted length (16th-8th-16th
     is kept; an 8th across a beat is two tied 8ths).
   A note's pieces are tied; a gap's rests are not.
6. **Accidentals,** per bar and staff across its voices in time order: a note shows its accidental when it differs
   from what the key signature (the key's major or natural minor scale, from `spellScale`) or an earlier note of the
   same letter and octave in the bar says; a naturalised note shows ♮. A tied continuation shows none and changes
   nothing.
7. **Chord symbols:** each chord at its onset, in the bar it starts in.


### 2.5 The renderer (`shared/ui/score`)

`ScoreView` engraves a Score with **VexFlow 5** (`vexflow/core`, latest stable, MIT, TypeScript, SVG):

- **One system,** every measure in one line that scrolls sideways (Flowkey's sheet), never broken into lines: a
  cursor that follows the music needs one line, and a phone on its side has room for one grand staff. A measure is as
  wide as its notes need (VexFlow's minimum × 1.4) and as its chord symbols need, never under 80 units. Clef, key
  and time signature at the start; a time signature again where a bar's changes (a 2/4 bar in 4/4) and after it. A
  brace and barlines through both staves.
- **Drawn:** notes, rests (a whole-bar rest centred), stems, beams (by the beat: a quarter in x/4, a dotted quarter
  in x/8), triplet brackets, ties (across barlines too), accidentals, the roll's wavy line, and fingering (above the
  treble, below the bass) when the Player's **Finger numbers** is on.
- **Not drawn by VexFlow:** chord symbols, bar numbers and section names. They are HTML over the staff (the render
  prop below): real text in the app's faces (chord symbols Literata 600, the rest Onest), themed, readable by a screen
  reader.
- **Colour:** every VexFlow colour is `currentColor` (set on its metrics once, before the first engraving); the staff
  lines and barlines take the control line (`--input`), everything else the ink, from `score.css` by VexFlow's
  classes. Dark mode and increased contrast follow the tokens. A staff can be **muted** (soft ink), by a data
  attribute and CSS, without engraving again.
- **Scale:** 1 CSS px per unit; 0.7 on a phone on its side, where height is scarce (§2.8).
- **The music font** is Bravura (SIL OFL), self-hosted from `@vexflow-fonts/bravura` (its `@font-face`, woff2 only,
  `font-display: block`), precached by the service worker with the other woff2. `ScoreView` waits for
  `document.fonts.load('30px Bravura')` (and Onest, VexFlow's text face for fingering) before it engraves, since
  VexFlow measures every glyph with the canvas: **loading** shows the staff's space, quiet; **error** (the font did not
  load) shows one line, and the rest of the Player works.
- **Layout out:** `ScoreView` hands its children (a render prop: the overlays need the engraving's positions) the
  **layout**: its size, the staff's top and bottom, each measure's x and width, and each written onset's x; `xAtTick`
  places any tick between them.
- **Lazy:** VexFlow, the font and `score.css` load with the Player's chunk only. `ScoreView` is imported from
  `@/shared/ui/score`, not the kit's barrel, so no other screen's chunk carries it.

### 2.6 The sheet (`widgets/sheet-music`)

`SheetMusic` shows a Performance: `notate` it (memoised), `ScoreView` it, and lay over it:

- **Labels:** each bar's number (12px, soft ink, tabular) at its start; a section's name (Verse, Chorus: the piece's
  headings) beside its first bar's number; each chord symbol at its tick (Literata 600, 17px).
- **The cursor:** a sky-mist band (the chart's "current bar" colour) behind the notes of the beat group now, moved by
  `transform` (ease-out; at once under reduced motion). The sheet scrolls itself to keep it a quarter in from the left
  whenever it leaves the middle half.
- **Bars as targets:** each bar is a button ("Bar 5, G C"). A pointer's tap jumps to the beat group nearest its x in
  that bar; Enter or Space jumps to the bar's first. A jump sounds where it lands (§2.7).
- **The loop:** a muted band over its bars with a grip at each end, umber (the neutral "chosen"), each a 44px
  `slider` ("Loop start: bar 3"): dragged over bars or moved by the arrow keys, never past the other end.
- **Muted staff:** the hand not heard or practised (hands: right → the bass staff muted).

### 2.7 How the Player goes

- **Two modes, chosen in the tempo popover:** **Listen** (the app plays at a tempo) and **Wait mode** (the app
  waits for your notes). **Step** is no longer a mode: ‹ › step through beat groups in either, sounding each.
- **Play ▶ / Stop ■** in both modes. In Listen it plays passes of the loop, or of the whole piece (as now). In Wait
  mode it starts waiting: the practised hands' notes are marked, a right answer plays the other hands and moves on,
  and a wrong key shows crimson; stopped, keys you play only sound. At the end without a loop: **Finished · Again**;
  with a loop, Wait mode goes round the loop.
- **Moving** (‹ ›, a bar tapped): the cursor moves and the beat group sounds, both audible hands; while Listen plays,
  the pass starts again from there instead.
- **Wait mode's line** says what to play (`Play D F♯ A`), a wrong key (`Not C#`), `Right`, or `Finished` with Again:
  one line beside the transport, `aria-live`.
- **The loop:** the loop button (toolbar) loops the bar the cursor is in, or removes the loop; the grips extend it.
  Step and Wait mode stay inside it; Listen plays its first pass from the cursor (or the loop's start, if the cursor
  is outside it) and every pass after from its start.
- **Speed training** (Listen, below the piece's tempo): each pass is 5% of the piece's tempo faster (at least 1
  BPM), up to the piece's tempo, then stays there. Every Play starts again from the chosen tempo. The tempo button
  shows the pass's tempo while it plays.
- **Swing** (⚙, simple meters only): an off-beat 8th sounds at two thirds of the beat, and everything between moves
  in proportion (a 16th grid swings with it). The sheet stays straight. The metronome's clicks do not move.
- **Tempo:** 20 to 160 BPM (was 40: 50% of the slowest piece, 56 BPM, is 28). The popover's 50%, 75% and 100% are the
  piece's tempo times that, rounded.

### 2.8 The screen

```
upright phone                              phone on its side · tablet · laptop
✕  Title                  ⟲  ◎  ⚙         ✕  Title          [72%▾] [✋▾] ⟲ ◎ ⚙
┌──────────── keyboard ────────────┐      ┌─────────────────── keyboard ──────────────────┐
└──────────────────────────────────┘      └───────────────────────────────────────────────┘
 1 Verse   G        C       Em  G/B         1 Verse  G       C      Em G/B      (on its side:
 𝄞 ──●────●────●──|──●──●──|──               𝄞 ──●───●───●──|──●──●──|──          the transport
 𝄢 ──●───────────|──●─────|──               𝄢 ──●──────────|──●─────|──          sits right of
 Play D F♯ A                                 Play D F♯ A     ‹  ( ▶ )  ›          the sheet)
 [72%▾]    ‹   ( ▶ )   ›    [✋▾]
```

(⟲ the loop, ◎ MIDI, ⚙ the setup sheet.)

- **Upright phone:** the toolbar holds ✕, the title, the loop, MIDI and ⚙; the tempo and hands buttons flank the
  transport at the bottom, in the thumb's reach. The keyboard takes the height left (192 to 320px).
- **A phone on its side** (judged first): one toolbar; the keyboard; the sheet at 0.7, with the Wait line and ‹ ▶ ›
  in a column at its right (the right thumb's place). Toolbar 52 + keyboard ≥ 140 + sheet ≈ 175 fits a 375px-tall
  screen.
- **Tablet and laptop:** as a phone on its side, the transport under the sheet, the sheet at 1, more bars in sight.
- **Play** is the one honey control: 72px, 56px on a phone on its side.
- **The tempo button** shows `Wait`, or the tempo as a percentage of the piece's (`75%`), a gauge icon before it; the
  **hands button** shows one hand, the other or both (Lucide's `Hand`, mirrored for the left).
- **The ⚙ sheet (Setup):** the piece's own choices first (key, pattern, right hand, left hand, chord size, melody),
  then how it plays (swing, finger numbers, metronome, count-in). Tempo and hands leave it for their popovers.
- **Popovers** (tempo, hands) are anchored to their buttons, as the keyboard's settings are: few quick choices whose
  effect shows at once. DESIGN.md's Choosing Rule and CODE_STYLE §1 say so.

### 2.9 The references' undecided items (roadmap §12)

| Item | Decision |
| ---- | -------- |
| Lyrics under the staff | **Planned, not built:** no piece carries its words (the charts come from the songbooks without them, and many of the songs' words are under copyright). When a piece carries its words, its melody's notes carry the syllables. Added to the roadmap's §5. |
| A single staff whose clef follows the range | **Not for this app:** piano music is read on a grand staff, and reading it is what the learner is learning; the sheet mutes the staff not played instead. |
| The metronome's drum grooves and tap tempo | **Not for this app:** an accompanist practises to a click; the percentages and the tempo slider set a tempo. |
| A sustain pedal from a MIDI keyboard (CC 64) | **Not for this app:** a MIDI keyboard sounds itself and its pedal sustains it; the app reads only which keys go down. |

### 2.10 The URL

`/play/$pieceId?mode&tempo&speedTraining&hands&swing&loop&key&pattern&rh&lh&chordSize`:

- **How it goes** (`PracticeView`, owned by `widgets/practice-player`): `mode` `listen` · `wait` (default listen;
  `step` is gone and reads as the default), `tempo` 20–160 (absent: the piece's), `speedTraining` (boolean, default
  off), `hands` `both` · `rh` · `lh`, `swing` (boolean, default off), `loop` `a-b` (bar numbers as printed, 1 ≤ a ≤ b;
  absent: none).
- **The piece's setup** (`SetupParams`, owned by `widgets/player-setup`): `key`, `pattern`, `rh`, `lh`, `chordSize`,
  as now, less tempo and hands.
- The router checks each param's shape and a loop's order; the page drops a loop past the piece's last bar (a URL made
  for another arrangement). A choice equal to the piece's own leaves the URL, as now.

### 2.11 Where the code goes

| Where | What |
| ----- | ---- |
| `shared/lib/music/time.ts` | `Tick`, `TICKS_PER_BEAT`, `METERS`, `Meter`, `beatsPerBar`, `isCompound`, `timeSignature`, `timeSignatureText`; `note.ts` gains `writtenOctave(midi, spelled)` |
| `shared/lib/notation/` | `types.ts`, `values.ts` (a meter's note values), `rhythm.ts` (triplet beats, spelling a length), `voices.ts`, `accidentals.ts`, `notate.ts`, `index.ts` |
| `shared/lib/arrangement/` | `meter`, `spelled`, `roll`; the tune's spelling |
| `shared/lib/schedule/` | `swing.ts`; `schedule` with `toTick`, `swing` and `roll`; the loop over a range with per-pass tempo; `tempoAt` |
| `shared/ui/score/` | `ScoreView`, `engrave.ts` (and its helpers), `music-font.ts`, `layout.ts` (`xAtTick`), `score.css`, `index.ts` |
| `features/practice/` | the machine with two modes, playing in both, the loop's range; `usePractice` with swing, loop and speed training; `speedUp`; marks from spellings. Gone: `bar-columns.ts` |
| `widgets/sheet-music/` | `SheetMusic`, its overlays, `useFollow`, `nearestBeatGroup` |
| `widgets/practice-player/` | `PracticeView` and its URL rules, `usePracticePlayer` (the Player's reusable hook), `PlayerScreen` (the layout's slots), `PlayerToolbar`, `TempoButton`, `HandsButton`, `LoopButton`, `PlayerTransport`, `WaitLine`, `PlayingFields`, `waitFeedback` (moved) |
| `widgets/player-setup/` | the piece's setup sheet: key, pattern and figure pages, chord size, melody, and a slot for `PlayingFields` |
| `widgets/chord-chart/` | the strip layout goes (the Player no longer uses it) |
| `pages/player/` | the piece as a Performance (`usePlayer`: `resolveChoice`, `arrangePiece`, practised), composed from the widgets. Gone: `NoteGrid`, `NowPanel`, `Transport`, `PlayerTopBar` |
| `shared/test/fonts.ts` | `stubFonts()`: `document.fonts` and the canvas's text metrics for jsdom, in every test's setup |

## 3. Data and errors

- **No saved store changes shape.** The practice toggles stay `fingerNumbers`, `melody`, `metronome`, `countIn`;
  swing and speed training are the URL's (per piece, like the tempo).
- **A stale URL** (`mode=step`, `loop=9-3`, `loop=40-44` on a 12-bar piece, `swing=yes`, `tempo=10`): each param
  takes its default; nothing throws.
- **The font fails:** the sheet says so in one line; the keyboard, transport and Wait mode still work.
- **Content:** a catalog test notates every piece in its own key and pattern, and every pattern in 4/4, 3/4 and
  12/8, and holds every measure's voices to the bar's length.

## 4. Testing

- **Pure, test first:** time (`timeSignature`), notation (values, triplet beats, spelling lengths, voices,
  accidentals, `notate` end to end), schedule (roll, range, swing, the loop's passes and tempos), the practice machine
  (two modes, the loop's range, Wait mode round a loop), `speedUp`, the URL's validators and `PracticeView` rules,
  `nearestBeatGroup`, `xAtTick`.
- **Components** through Testing Library, by role and name: `ScoreView` engraves in jsdom (§4.1) and hands its
  layout on; `SheetMusic`'s bars jump, its grips move the loop by the arrow keys; the tempo and hands popovers; the
  Player screen through `renderApp` (Play and Stop, ‹ ›, Wait mode with MIDI, the loop, the setup sheet, a stale URL).
- **jsdom has no fonts and no canvas:** `stubFonts()` in the shared setup gives `document.fonts` a `load` that
  resolves and the canvas a `measureText` proportional to the text, as `stubMatchMedia` gives `matchMedia`. VexFlow
  itself is never mocked.

### 4.1 What the scratch run showed

- `vexflow/core` loads no font; `vexflow` and `vexflow/bravura` embed theirs as base64 in JavaScript (324 KB for
  Bravura). Self-hosting the woff2 (247 KB) through `@font-face` keeps it out of the JavaScript and in the precache.
- VexFlow 5 measures every glyph with a canvas (`measureText`), so the font must be loaded before engraving; under
  jsdom (no canvas) it warns and measures nothing. With a canvas whose `measureText` returns widths, a grand staff
  with a brace, key and time signatures, beams, a triplet and an accidental engraves, and every note's x is read back
  (`getAbsoluteX`).
- A `Tuplet` must be made before its notes join a voice. Default colours are `black` and `#999999` in
  `MetricsDefaults` and the SVG root; `currentColor` in both reaches every element.

## 5. What this changes in the record

- **ADR 0013:** sheet music is our Score, engraved by VexFlow (§2.1, §2.4, §2.5).
- **DESIGN.md:** the Player's layout; the sheet (staff, cursor, loop, labels); popovers for the tempo and hands; the
  Chord Display and Title 1 lose the Player's chord now and next.
- **CODE_STYLE:** §1 (popovers), §8 (time in the kernel, the notation kernel's fence, the Performance's written onset,
  roll and spelling), §9 (`stubFonts`).
- **The glossary:** Score, Sheet, Cursor, Loop, Speed training, Swing, Roll; Listen and Wait mode (Step no longer a
  mode); the Note grid goes; Setup loses tempo and hands.
- **PRODUCT.md:** sheet music leaves "No …"; the Player's line.
- **The master spec:** §5's Player row and §6's player params; **the roadmap:** sub-project 3 built, §12's four items
  decided, lyrics in §5; **CLAUDE.md:** the architecture.
