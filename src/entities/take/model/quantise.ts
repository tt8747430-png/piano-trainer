import { TICKS_PER_BEAT, type Midi, type Tick } from '@/shared/lib/music'
import type { Take } from './types'

/** A take's note on the piece's timeline: ticks from the take's first downbeat. */
export interface QuantisedNote {
  readonly midi: Midi
  readonly startTick: Tick
  readonly durationTicks: Tick
}

/** Milliseconds into a take as ticks at its tempo (a compound meter's beat is its dotted quarter). */
const ticksAt = (ms: number, tempo: number): number => (ms / 1000) * (tempo / 60) * TICKS_PER_BEAT

/**
 * A take snapped to steps of `step` ticks (spec 2026-10-05 §4): each onset and release to the nearest
 * step at the take's tempo, a note a step long at least; a key cut where it starts again, and two
 * strikes of a key snapped to one step kept as one.
 */
export function quantise(take: Take, step: Tick): QuantisedNote[] {
  const snap = (ms: number) => Math.round(ticksAt(ms, take.tempo) / step) * step
  const snapped = take.notes
    .map((note) => {
      const startTick = snap(note.at)
      const end = Math.max(snap(note.at + note.held), startTick + step)
      return { midi: note.midi, startTick, end }
    })
    .sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)
  const kept = snapped.filter(
    (note, i) =>
      !snapped
        .slice(0, i)
        .some((other) => other.midi === note.midi && other.startTick === note.startTick),
  )
  return kept.map(({ midi, startTick, end }) => {
    const next = kept.find((other) => other.midi === midi && other.startTick > startTick)
    return { midi, startTick, durationTicks: Math.min(end, next?.startTick ?? end) - startTick }
  })
}
