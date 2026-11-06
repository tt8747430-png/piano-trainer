# UI improvements: what to build, with the code

Sources: every reference note in this folder; the code behind them in `pianoforte-code.md` and
`components-and-libraries.md`; our screens in `../ui-now/` (iPhone 17 Pro and MacBook, light, English, 2026-11-06),
read against our code. Each item names the files it touches, the code it ports and the rule in DESIGN.md it serves.

## Already built (checked in the code, so left out)

| Idea | Where it already is |
| --- | --- |
| Keys with depth, a lip, a felt strip, a sinking key | `shared/ui/piano-keyboard/Key.tsx` (R33) |
| Every C named, middle C alone on a phone's narrow keys | `key-look.ts` `nameOf`, `Key.tsx` `SLIM` |
| Computer-key letters on the keys | `KeyLook.letter` |
| Glissando from key to key | `use-key-pointers.ts` (`keyAt` on pointer move) |
| Early and late verdicts | `widgets/sheet-music/ui/NoteVerdicts.tsx` (colour only, see 1) |
| Output latency read from the browser | `shared/api/audio/web-audio.ts` (`outputLatency`, `getOutputTimestamp`) |
| Automatic fingering | `shared/lib/music/passage-fingering.ts` (Parncutt's table) |

## Defects found

| # | Screen | Defect | Fix |
| --- | --- | --- | --- |
| D1 | Editor, phone | Clef, key and time signature targets are 7–24 px wide (the harness's SMALL lines) | item 9 |
| D2 | Editor, phone | The tempo mark and the section name ("Verse") are 22×14 targets | pad each to 44 px with a transparent hit area: `PrintedSigns` and the tempo popover's trigger |
| D3 | Scales, laptop | On the staff the W and H letters collide with stems and heads, and fingers 2 and 4 overlap at bar 2 | item 12 |
| D4 | Scales | The capture never settled (busy), so the page keeps rendering | find the loop with the React profiler before item 12 |
| D5 | Song page, laptop | "Change cover" overlaps "Add to favourites" | item 6 |

The floating buttons over Songs' last folder and the song page's Details on a phone sit over content that still
scrolls; the page pads for them (`--floating-block`), so they are not defects.

## Round 1: the Second Cue Rule and the song page

### 1. A shape for each verdict on the score

Today `NoteVerdicts` colours heads, and early and late share honey with no other cue. The fix ports Piano Forte's
Word And Shape Rule: right ●, early ◂, late ▸, missed ○, wrong ×, drawn beside the head and read by screen readers in
the take's summary.

- `widgets/sheet-music/ui/VerdictShapes.tsx`, new: a layer of absolutely placed glyphs beside each judged head. The
  places come from the engraving's note ids, the way `NoteVerdicts` finds them, with boxes from `getBBox()` of each
  `[id]`.
- `shared/ui/verdict-shape.ts`, new: one table that `VerdictShapes`, the take summary's legend and the keyboard's wrong
  mark (today `WRONG_MARK = '✕'` in `key-look.ts`) all read.

```ts
// shared/ui/verdict-shape.ts
export type Verdict = 'right' | 'wrong' | 'missed' | 'early' | 'late'
/** Each verdict's shape: colour is never its only cue (DESIGN.md, Second Cue Rule; Piano Forte's Word And Shape Rule). */
export const VERDICT_SHAPE: Readonly<Record<Verdict, string>> = {
  right: '●',
  early: '◂',
  late: '▸',
  missed: '○',
  wrong: '×',
}
```

```tsx
// widgets/sheet-music/ui/VerdictShapes.tsx
export function VerdictShapes({ score, verdicts, sheet }: {
  score: Score
  verdicts: ReadonlyMap<string, Verdict>
  sheet: RefObject<HTMLElement | null>
}) {
  const ids = useMemo(() => noteIds(score), [score])
  const placed = useHeadBoxes(sheet, ids, verdicts) // [{ verdict, x, y }] in the sheet's px, re-read on layout
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {placed.map(({ verdict, x, y }, at) => (
        <span key={at} className={cn('absolute -translate-y-1/2 text-xs font-bold', VERDICT_INK[verdict])}
          style={{ left: x + 2, top: y }}>{VERDICT_SHAPE[verdict]}</span>
      ))}
    </div>
  )
}
```

### 2. Hands that differ by fill as well as colour

Following Piano Forte's hand fills: right hand solid brick, left hand a lilac wash with a 2 px lilac edge, on the keys
and in the chord views. Only `REST`/`DOWN` in `Key.tsx` change, for `lh`:

```ts
lh: cn('bg-hand-lh-wash ring-2 ring-inset ring-hand-lh', LABEL_INK),
```

DESIGN.md's Palette Law then gains one line: the left hand is outlined, the right is filled.

### 3. A colour-blind test of the palette

Install `culori` as a dev dependency. Add `src/styles/palette-cvd.test.ts`, which reads the role, hand and verdict
tokens from `tokens.css` and checks every pair under protanopia, deuteranopia and tritanopia: CIEDE2000 above 10, and
WCAG contrast of at least 3 against the card. A pair that fails must already differ in shape (items 1 and 2), and the
test lists those pairs explicitly.

### 4. A cover engraved from the first bars

The cover becomes the song's first two bars, engraved small, on the cover's wash (Piano Forte's covers, sized by their
`cropOf`). With no score yet, it shows a blank staff with the key and the metre.

- `shared/ui/score/incipit.ts`, new: `incipitSvg(score, { bars: 2, width, height })` renders through the same Verovio
  toolkit with `pageWidth` set to the cover's width, `scale` 25–40, and `adjustPageHeight`, cropped by the head extent.
- `entities/piece/ui/PieceCover.tsx`, new, replacing `pages/piece/ui/SongCover.tsx`'s letter. The library's rows and
  Songs' cards use it too (one implementation). Covers are cached in memory by `pieceKey` and the piece's version, and
  drawn one at a time in an idle callback, so a list of 50 doesn't stall.
- A picture the learner chose still wins over the incipit.

### 5. Practice on the song page

The laptop's empty right column gets the last run, the best run, and per-section accuracy as a strip of cells (Piano
Forte's meter: ink, never a verdict colour). Below them sits one honey action, the next step (Piano Forte's `pace.ts`):
loop the weakest bars at 70 %, climb the tempo 50 → 75 → 100 %, or play hands together.

```ts
// features/practice/next-step.ts (pure, tested)
export type NextStep =
  | { kind: 'loop'; bars: readonly [number, number]; speed: number }
  | { kind: 'tempo'; speed: 0.5 | 0.75 | 1 }
  | { kind: 'hands'; hands: 'both' }
export function nextStep(takes: readonly TakeSummary[]): NextStep {
  const last = takes.at(-1)
  if (!last) return { kind: 'tempo', speed: 0.5 }
  const weakest = worstBars(last, 2)            // the two weakest bars by accuracy
  if (weakest.accuracy < 0.8) return { kind: 'loop', bars: weakest.bars, speed: 0.7 }
  if (last.speed < 1) return { kind: 'tempo', speed: last.speed < 0.75 ? 0.75 : 1 }
  return { kind: 'hands', hands: 'both' }
}
```

```tsx
// shared/ui/Meter.tsx: Piano Forte's meter, in our tokens
export function Meter({ value, label, solid }: { value: number; label: string; solid: boolean }) {
  return (
    <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}
      className="h-2.5 w-full overflow-hidden rounded-full bg-border">
      <i className={cn('block h-full min-w-1 rounded-full', solid ? 'bg-foreground' : 'bg-muted-foreground')}
        style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  )
}
```

### 6. The song page's head, laid out once

On a phone: cover and title, Play (the screen's one honey control), then the meters, with Details folded below. On a
laptop: two columns, with "Change cover" inside the cover's menu so it never meets the favourite (D5).

## Round 2: playing in time

### 7. Timing windows in the practice machine

This is a feature, but every verdict shape (item 1) depends on it. It ports `judge.ts`'s windows as a pure function in
`features/practice/timing.ts`. Our Wait mode stays beat-group based; the windows judge Listen-along and the scored
at-tempo mode.

```ts
// features/practice/timing.ts (after Piano Forte's judge.ts, MIT © 2026 Matt Kelly)
export const WINDOW_MS = { right: 80, near: 125 } as const
/** Past the near window, a right key up to a beat late (at most 500 ms) is still the note, late. */
export const LATE_GRACE_MS = 500
export type Timing = 'right' | 'early' | 'late'
export function timingOf(offsetMs: number, beatMs: number, ease: number): Timing | 'outside' {
  const near = WINDOW_MS.near * ease
  if (Math.abs(offsetMs) <= WINDOW_MS.right * ease) return 'right'
  if (offsetMs < 0) return offsetMs >= -near ? 'early' : 'outside'
  return offsetMs <= near + Math.min(beatMs, LATE_GRACE_MS) ? 'late' : 'outside'
}
```

### 8. Latency calibration by tapping

A row in the piano's settings, "Calibrate timing", opens 16 clicks of middle C at 80 BPM. The learner plays along,
judged at ±375 ms. It needs at least 8 hits. The result is the median offset rounded to 5 ms, saved per device as a new
setting (`SETTINGS_VERSION` bumps). Every key time is then corrected by it.

```ts
// shared/lib/latency.ts
export function calibratedOffset(offsetsMs: readonly number[]): number | null {
  if (offsetsMs.length < 8) return null
  const sorted = [...offsetsMs].sort((a, b) => a - b)
  const mid = sorted.length / 2
  const median = sorted.length % 2 ? sorted[Math.floor(mid)]! : (sorted[mid - 1]! + sorted[mid]!) / 2
  return Math.round(median / 5) * 5
}
```

## Round 3: the editor and Scales

### 9. One target for a line's start on a phone (D1)

When the clef, key and time signature at the start of a line are each under 44 px, they become one target
("Clef, key and time, bar 1") that opens a short menu: Clef · Key signature · Time signature. Each item opens the
popover it opens today. On a laptop, where there is room, the targets stay separate.

- `widgets/score-sheet/model/printed.ts`: `signTargets` returns a `group` target for a line's start signs whose
  narrowest box is under 44 px, with a box spanning them and at least 44 px wide. Tested beside the existing cases.
- `PrintedSigns.tsx`: a group renders `ActionMenu` with the three, each calling `edit(printed)`.

### 10. The input sheet docked on a phone

Today the input sheet and the view pill float over the score. The sheet docks above the keys (`Docked`, as the
keyboard is) and the score pads for it. The view switch (Page, Rows, Horizontal) moves into the editor's gear.

### 11. Staff names

A score with one instrument prints no names. A single staff added over the piano is named by its role ("Melody")
rather than "Staff 1". The name is still editable in place (ADR 0097).

### 12. Scales: music first, one layer of labels (D3)

- The eight controls fold into the bar: tonic and scale as the two pickers in the heading (already there), and Hands,
  Octaves, Direction, Rhythm, Tempo, Fingering, Start on and Compare with in the gear.
- The staff shows one label layer at a time, chosen in place: Fingers · Degrees · Steps. With Steps chosen, W and H go
  between the heads (as lyrics on the gaps), not on them, so they never meet a stem.

## Round 4: Practice and Songs

### 13. Progressions as role-coloured chord tiles

Each row's picture is its chords as small tiles, tinted by role (home grass, away sand, tension lilac), replacing the
identical list icon and the plain "I–V–vi–IV". Hookpad tints by scale degree, which would break our Palette Law.
Roles come from the progression's function analysis, which our progression page already colours.

```tsx
// entities/practice-library/ui/ProgressionTiles.tsx
export function ProgressionTiles({ chords, size = 'row' }: { chords: readonly PlacedNumeral[]; size?: 'row' | 'page' }) {
  return (
    <ol className="flex flex-wrap gap-1" aria-label={chords.map((c) => c.numeral).join(', ')}>
      {chords.map((chord, at) => (
        <li key={at} className={cn('grid place-items-center rounded-control font-semibold tabular-nums',
          ROLE_WASH_BY_FUNCTION[chord.role], size === 'row' ? 'h-7 min-w-8 px-1.5 text-sm' : 'h-14 min-w-16 px-3 text-xl')}>
          <Glyph text={chord.numeral} />
        </li>
      ))}
    </ol>
  )
}
```

### 14. A Trash in Songs

Delete moves a song to Trash, and it is only gone once Trash is emptied (StemDeck). A new `trash` list sits in the
library store, with `features/manage-library/{trash-song,restore-song,empty-trash}.ts`. The Archive button becomes a
menu: Archive · Trash. This is the owner's decision (below).

### 15. Rows with one affordance

A folder row opens on a tap anywhere and keeps "…" for its menu. The chevron goes from `widgets/song-library` folder
rows and from the Practice and Progressions rows, so every row is cover, name, one fact line, "…".

## Round 5: the recording

### 16. A recording that follows Transpose and slows cleanly

`shared/api/audio/recording-player.ts` swaps `<audio>` `playbackRate` for a `signalsmith-stretch` node: rate and
semitones from the transport, the loop from the bar loop, and the playhead from `setUpdateInterval`. Transpose then
keeps the recording instead of silencing it. The node is loaded lazily, only on a song with a recording, and uses the
`cheaper` preset on phones. The fake in `shared/api` gains the same interface for tests.

### 17. A beat grid for a recording

`web-audio-beat-detector` `guess()` runs in a worker once per recording, and the result is saved with the song: BPM
and offset. The learner can nudge it, which is StemDeck's fixable grid in its simplest form. The click and the score's
cursor follow it.

## Later (features, listed so nothing is lost)

- Ghost of the last run and Compare with last time (`pianoforte-code.md` §4).
- Hints that fade with mastery (§3).
- The Today plan on Learn (§6).
- Guide mode (StemDeck).
- Synced lyrics (LRCLIB, the owner's decision).
- From memory (ZaneH).
- Call and response (AI Duet).
- Keyboard size set by pressing your keys (two `noteon`s).

## Owner decisions

1. **The Trash in Songs** (14): keep it beside the Archive, or replace the Archive?
2. **Computer-key letters on the keys:** shown only once a computer key is pressed, or hidden by default?
3. **Synced lyrics from LRCLIB:** the lyrics are third-party copyright, so fetch and show them only (never store or
   publish), or leave them out?
4. **webmscore:** accept GPL for MuseScore import loaded on demand, or read `.mscx` ourselves?
