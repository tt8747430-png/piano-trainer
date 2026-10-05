import { isCompound, TICKS_PER_BEAT, type Meter, type Midi, type Tick } from '@/shared/lib/music'
import { ticksOf, type Duration } from '@/shared/lib/notation'
import type { Take } from './types'

/** Note values, the first the beat: never none. */
type Grids = readonly [Duration, ...Duration[]]

const SIMPLE_GRIDS: Grids = [
  { value: 4, dots: 0, triplet: false },
  { value: 8, dots: 0, triplet: false },
  { value: 16, dots: 0, triplet: false },
  { value: 8, dots: 0, triplet: true },
]
const COMPOUND_GRIDS: Grids = [
  { value: 4, dots: 1, triplet: false },
  { value: 8, dots: 0, triplet: false },
  { value: 16, dots: 0, triplet: false },
]

/**
 * The shortest notes a take in `meter` is snapped to (spec 2026-10-05 §4): the beat, an eighth, a
 * sixteenth, and in x/4 an eighth triplet.
 */
export const takeGrids = (meter: Meter): Grids =>
  isCompound(meter) ? COMPOUND_GRIDS : SIMPLE_GRIDS

/** A take's note on the piece's timeline: ticks from the take's first downbeat. */
export interface QuantisedNote {
  readonly midi: Midi
  readonly startTick: Tick
  readonly durationTicks: Tick
}

/** Milliseconds into a take as ticks at its tempo (a compound meter's beat is its dotted quarter). */
const ticksAt = (ms: number, tempo: number): number => (ms / 1000) * (tempo / 60) * TICKS_PER_BEAT

/** A key's strike snapped: where it starts and where its release fell. */
interface Strike {
  readonly startTick: Tick
  readonly end: Tick
}

/**
 * A take snapped to `grid`, a note value in the take's own meter (spec 2026-10-05 §4): each onset and
 * release to the nearest step at the take's tempo, a note a step long at least; a key cut where it
 * starts again, and two strikes of a key snapped to one step kept as the first.
 */
export function quantise(take: Take, grid: Duration): QuantisedNote[] {
  const step = ticksOf(grid, take.meter)
  const snap = (ms: number) => Math.round(ticksAt(ms, take.tempo) / step) * step
  const strikes = new Map<Midi, Strike[]>()
  for (const note of take.notes) {
    const startTick = snap(note.at)
    const end = Math.max(snap(note.at + note.held), startTick + step)
    const key = strikes.get(note.midi) ?? []
    key.push({ startTick, end })
    strikes.set(note.midi, key)
  }
  const notes: QuantisedNote[] = []
  for (const [midi, struck] of strikes) {
    const kept = struck
      .toSorted((a, b) => a.startTick - b.startTick)
      .filter((strike, i, sorted) => strike.startTick !== sorted[i - 1]?.startTick)
    kept.forEach(({ startTick, end }, i) => {
      const next = kept[i + 1]?.startTick ?? end
      notes.push({ midi, startTick, durationTicks: Math.min(end, next) - startTick })
    })
  }
  return notes.sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)
}
