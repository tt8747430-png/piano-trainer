import { chordLabels, chordLabelWidth } from '@/shared/lib'
import { printedSymbol, type Tick } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { nearestPlace } from './nearest'

/** A field the editor types in where it is printed (ADR 0096): a chord symbol over the staff. */
export type SheetField = { readonly kind: 'chord' }

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
