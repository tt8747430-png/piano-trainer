import { chordLabels, chordLabelWidth } from '@/shared/lib'
import { printedSymbol, type Tick } from '@/shared/lib/music'
import type { StaffId, TimedMusic } from '@/shared/lib/notation'
import {
  leftAt,
  spaceOf,
  VERSE,
  xAtTick,
  type Lyric,
  type ScoreLayout,
  type SheetPoint,
} from '@/shared/ui/score'
import { nearestPlace } from './nearest'

/**
 * A field the editor types in where it is printed (ADR 0096): a chord symbol over the staff, a
 * verse's syllable under its note.
 */
export type SheetField =
  { readonly kind: 'chord' } | { readonly kind: 'lyrics'; readonly verse: number }

/** Where a field stands on a line, in its layout's px from the engraving's top left. */
export interface FieldBox {
  readonly left: number
  readonly top: number
  readonly width: number
  readonly height: number
}

/** A chord symbol printed over a line: its chord's tick, as it is printed, where and how large. */
export interface PrintedChord {
  readonly tick: Tick
  readonly symbol: string
  readonly x: number
  readonly size: number
  readonly width: number
}

type Laid = Pick<ScoreLayout, 'measures' | 'onsets' | 'width'>

/**
 * The chord symbols printed over a line at `size` (ADR 0072): each at its chord's onset, printed as a
 * lead sheet prints it (♯ ♭), drawn smaller or moved on where it would run into the next
 * (`chordLabels`), with the width it takes.
 */
export function printedChords(
  layout: Laid,
  chords: TimedMusic['chords'],
  size: number,
): PrintedChord[] {
  const placed = chords.map((chord) => ({
    tick: chord.startTick,
    symbol: printedSymbol(chord.symbol),
    x: xAtTick(layout, chord.startTick),
  }))
  const last = layout.measures.at(-1)
  const labels = chordLabels(placed, last ? last.x + last.width : layout.width, size)
  return placed.map((chord, index) => {
    const label = labels[index] ?? { x: chord.x, size }
    return { ...chord, ...label, width: chordLabelWidth(chord.symbol, label.size) }
  })
}

/** The least a field over the chord row is wide where no symbol is printed: a short symbol's room. */
const EMPTY_PLACE = 24

/**
 * The chord-symbol field's place on a line (ADR 0096), the chord row `row` high over the staff: on
 * the symbol printed at `tick`, as wide as it; else at the beat.
 */
export function chordFieldBox(
  layout: Laid,
  printed: readonly PrintedChord[],
  tick: Tick,
  row: number,
): FieldBox {
  const there = printed.find((chord) => chord.tick === tick)
  return {
    left: there ? there.x : xAtTick(layout, tick),
    top: -row,
    width: there ? there.width : EMPTY_PLACE,
    height: row,
  }
}

/**
 * Where a click at `x` in the chord row lands (ADR 0096): on a symbol printed there, its chord's
 * tick; else the nearest of `places`, where a chord may start.
 */
export function chordRowTick(
  printed: readonly PrintedChord[],
  places: readonly Tick[],
  x: number,
  xOf: (tick: Tick) => number,
): Tick | undefined {
  const on = printed.find((chord) => x >= chord.x && x <= chord.x + chord.width)
  return on ? on.tick : nearestPlace(places, x, xOf)
}

/**
 * Where a verse's first line stands under a staff that prints no word on the line, in staff spaces:
 * its letters' top under the staff's bottom line, as Verovio sets them clear of what hangs below.
 */
const FIRST_VERSE = 1.1

type Sung = Pick<ScoreLayout, 'measures' | 'onsets' | 'staves' | 'heads' | 'rests' | 'syllables'>

/**
 * The Lyrics field's place on a line (ADR 0096): on the syllable printed under the note at `tick` on
 * `staff` in `verse`; where it sings nothing yet, under the note on that verse's line (where another
 * of the staff's syllables stands, a verse a line under the one before; else under the staff).
 */
export function lyricsFieldBox(layout: Sung, staff: StaffId, tick: Tick, verse: number): FieldBox {
  const sung = (layout.syllables ?? []).filter((each) => each.staff === staff)
  const there = sung.find((each) => each.tick === tick && each.verse === verse)
  if (there)
    return {
      left: there.left,
      top: there.top,
      width: there.right - there.left,
      height: there.bottom - there.top,
    }
  const space = spaceOf(layout)
  const step = (VERSE * space) / 10
  // The verse's line from a syllable of the nearest verse on the line, else from the staff's foot.
  const near = sung.toSorted((a, b) => Math.abs(a.verse - verse) - Math.abs(b.verse - verse))[0]
  const top = near
    ? near.top + (verse - near.verse) * step
    : (layout.staves[staff]?.bottom ?? 0) + FIRST_VERSE * space + verse * step
  return {
    left: leftAt(layout, tick, [staff]),
    top,
    width: EMPTY_PLACE,
    height: near ? near.bottom - near.top : step,
  }
}

/** How far round a syllable a tap still lands on it, in staff spaces. */
const SYLLABLE_GRAB = 0.3

/** The syllable printed where a tap lands on a line (ADR 0096); none off them. */
export function lyricAt(layout: Sung, { x, y }: SheetPoint): Lyric | null {
  const grab = SYLLABLE_GRAB * spaceOf(layout)
  return (
    (layout.syllables ?? []).find(
      (each) =>
        x >= each.left - grab &&
        x <= each.right + grab &&
        y >= each.top - grab &&
        y <= each.bottom + grab,
    ) ?? null
  )
}
