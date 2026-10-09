import { barMs, takeBarCount, type Take } from '@/entities/take'
import { beatsPerBar, midi, type Midi } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'

/** How hard a note was struck, in four shades: soft to loud. */
export type Shade = 1 | 2 | 3 | 4

/** A key's note on its lane: from its onset for as long as it was held (ms). */
export interface RollNote {
  readonly midi: Midi
  readonly at: number
  readonly held: number
  readonly shade: Shade
}

/** A pedal held down, from `down` to `up` (ms). */
export interface RollPress {
  readonly down: number
  readonly up: number
}

/** A take laid out as a piano roll (spec 2026-10-09 §4.3), in milliseconds from its downbeat. */
export interface Roll {
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
  const bar = barMs(take)
  const count = takeBarCount(take)
  const beat = 60_000 / take.tempo
  const beatsInBar = beatsPerBar(take.meter)
  const pressesOf = (pedal: PedalKind): RollPress[] =>
    take.pedals.filter((press) => press.pedal === pedal).map(({ down, up }) => ({ down, up }))
  return {
    lanes: Array.from({ length: highest - lowest + 1 }, (_, i) => midi(highest - i)),
    length: count * bar,
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
    bars: Array.from({ length: count }, (_, i) => ({ at: i * bar, number: take.fromBar + i })),
    beats: Array.from({ length: count }, (_, i) =>
      Array.from({ length: beatsInBar - 1 }, (_, j) => i * bar + (j + 1) * beat),
    ).flat(),
  }
}
