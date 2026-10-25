import { chordLabels, chordLabelWidth } from '@/shared/lib'
import { printedSymbol, type Tick } from '@/shared/lib/music'
import { xAtTick, type ScoreLayout } from './layout'

/** A chord name's size at full size where it has the room: smaller where many share a bar. */
const CHORD_PX = 16

/** A chord symbol over the staff: where it starts, and what follows it smaller (how a hand plays it). */
export interface RowChord {
  readonly startTick: Tick
  readonly symbol: string
  readonly detail?: string
}

/** A chord symbol as the labels' row prints it: as a lead sheet writes it, where, how large and how wide. */
export interface PrintedChord extends RowChord {
  readonly x: number
  readonly size: number
  readonly width: number
}

/**
 * The chord symbols the labels' row prints over a line at its labels' size (`size`, 1 at full size;
 * ADR 0072): those in its bars, each at its chord's onset as a lead sheet writes it (♯ ♭), drawn
 * smaller or moved on where it would run into the next (`chordLabels`), with the width it and what
 * follows it take. Where the row prints them, and where the editor's chord-symbol field stands on one
 * (ADR 0096).
 */
export function rowChords(
  layout: Pick<ScoreLayout, 'measures' | 'onsets' | 'width'>,
  chords: readonly RowChord[],
  size: number,
): PrintedChord[] {
  const [first] = layout.measures
  const last = layout.measures.at(-1)
  const end = last ? last.x + last.width : layout.width
  const shown = chords.flatMap((chord) =>
    first &&
    last &&
    chord.startTick >= first.startTick &&
    chord.startTick < last.startTick + last.ticks
      ? [{ ...chord, symbol: printedSymbol(chord.symbol), x: xAtTick(layout, chord.startTick) }]
      : [],
  )
  const written = ({ symbol, detail }: RowChord) => (detail ? `${symbol} ${detail}` : symbol)
  const placed = chordLabels(
    shown.map((chord) => ({ x: chord.x, symbol: written(chord) })),
    end,
    CHORD_PX * size,
  )
  return shown.map((chord, at) => {
    const label = placed[at] ?? { x: chord.x, size: CHORD_PX * size }
    return { ...chord, ...label, width: chordLabelWidth(written(chord), label.size) }
  })
}
