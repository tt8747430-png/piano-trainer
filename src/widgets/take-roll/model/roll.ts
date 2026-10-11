import type { Take } from '@/entities/take'
import { midi, type Midi } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'

/** How hard a note was struck, in four shades: soft to loud. */
export type Shade = 1 | 2 | 3 | 4

/** A key's note on its lane: from its onset for as long as it was held (ms). */
interface RollNote {
  readonly midi: Midi
  readonly at: number
  readonly held: number
  readonly shade: Shade
}

/** A pedal held down, from `down` to `up` (ms). */
interface RollPress {
  readonly down: number
  readonly up: number
}

/** A take laid out as a piano roll (spec 2026-10-09 §4.3), in milliseconds from its downbeat. */
interface Roll {
  /** The lanes, highest key first: the take's keys, a key spare above and below (C4–C5 for none). */
  readonly lanes: readonly Midi[]
  /** Whole bars. */
  readonly length: number
  readonly notes: readonly RollNote[]
  readonly pedals: Readonly<Record<PedalKind, readonly RollPress[]>>
  /** Each bar's start and its number in the piece, from the bar the take was recorded at. */
  readonly bars: readonly { readonly at: number; readonly number: number }[]
  /** The beats between the bars' starts. */
  readonly beats: readonly number[]
}

/** The lanes of a take with no notes: an octave from middle C. */
const NO_NOTES = { lowest: 60, highest: 72 }

const SHADES: readonly Shade[] = [1, 2, 3, 4]

/** A velocity's shade: each 32 a shade louder. */
const shadeOf = (velocity: number): Shade => SHADES[Math.floor(velocity / 32)] ?? 4

export function rollOf(take: Take): Roll {
  const keys = take.notes.map((note) => note.midi)
  const { lowest, highest } =
    keys.length === 0 ? NO_NOTES : { lowest: Math.min(...keys) - 1, highest: Math.max(...keys) + 1 }
  const beat = 60_000 / take.tempo
  // Each bar from its barline to the next, as long as it was: a pickup's bar a beat, say.
  const spans = take.bars.slice(0, -1).map((at, i) => ({ at, end: take.bars[i + 1] ?? at }))
  const pressesOf = (pedal: PedalKind): RollPress[] =>
    take.pedals.filter((press) => press.pedal === pedal).map(({ down, up }) => ({ down, up }))
  return {
    lanes: Array.from({ length: highest - lowest + 1 }, (_, i) => midi(highest - i)),
    length: take.bars.at(-1) ?? take.length,
    notes: take.notes.map(({ midi: key, at, held, velocity }) => ({
      midi: key,
      at,
      held,
      shade: shadeOf(velocity),
    })),
    pedals: {
      sustain: pressesOf('sustain'),
      sostenuto: pressesOf('sostenuto'),
      soft: pressesOf('soft'),
    },
    bars: spans.map(({ at }, i) => ({ at, number: take.fromBar + i })),
    beats: spans.flatMap(({ at, end }) =>
      Array.from(
        { length: Math.max(0, Math.round((end - at) / beat) - 1) },
        (_, j) => at + (j + 1) * beat,
      ),
    ),
  }
}
