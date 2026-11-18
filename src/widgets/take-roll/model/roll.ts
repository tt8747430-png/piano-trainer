import type { Take } from '@/entities/take'
import { midi, type Midi } from '@/shared/lib/music'

/** A key's note on its lane: from its onset for as long as it was held (ms). */
interface RollNote {
  readonly midi: Midi
  readonly at: number
  readonly held: number
}

/** A take laid out as a piano roll, in milliseconds from its downbeat. */
interface Roll {
  /** The lanes, highest key first: the take's keys, a key spare above and below (C4–C5 for none). */
  readonly lanes: readonly Midi[]
  /** Whole bars. */
  readonly length: number
  readonly notes: readonly RollNote[]
  /** Each bar's start and its number in the piece, from the bar the take was recorded at. */
  readonly bars: readonly { readonly at: number; readonly number: number }[]
}

/** The lanes of a take with no notes: an octave from middle C. */
const NO_NOTES = { lowest: 60, highest: 72 }

export function rollOf(take: Take): Roll {
  const keys = take.notes.map((note) => note.midi)
  const { lowest, highest } =
    keys.length === 0 ? NO_NOTES : { lowest: Math.min(...keys) - 1, highest: Math.max(...keys) + 1 }
  return {
    lanes: Array.from({ length: highest - lowest + 1 }, (_, i) => midi(highest - i)),
    length: take.bars.at(-1) ?? take.length,
    notes: take.notes.map(({ midi: key, at, held }) => ({ midi: key, at, held })),
    // Each bar from its barline, as long as it was: a pickup's bar a beat, say.
    bars: take.bars.slice(0, -1).map((at, i) => ({ at, number: take.fromBar + i })),
  }
}

/** The bar (from 0) a moment of the take falls in (ms): the last that starts at or before it. */
export function barIndexAt(roll: Roll, ms: number): number {
  const index = roll.bars.findLastIndex((bar) => bar.at <= ms)
  return Math.max(0, index)
}
