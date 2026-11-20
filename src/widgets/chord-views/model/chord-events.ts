import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'

/** A change on the Diagrams view's row: a chord (an index into the performance's chords) or none. */
interface ChordEvent {
  /** None where the music has no chord: before the first, or a bar of none. */
  readonly chord: number | null
  /** The tick it starts at, as played. */
  readonly at: Tick
}

/**
 * The Diagrams view's row (loop round 61, the Player's Diagrams board): every change of chord in
 * played order, the repeats taken, a chord held on is one change; where the music starts or turns
 * to no chord, a change to none (N.C.).
 */
export function chordEvents(performance: Performance): readonly ChordEvent[] {
  const events: ChordEvent[] = []
  let end = 0
  let held: string | null = null
  performance.chords.forEach((chord, index) => {
    if (chord.startTick > end && (events.length === 0 || held !== null)) {
      events.push({ chord: null, at: end })
      held = null
    }
    if (chord.symbol !== held) {
      events.push({ chord: index, at: chord.startTick })
      held = chord.symbol
    }
    end = Math.max(end, chord.startTick + chord.durationTicks)
  })
  return events
}

/** The change sounding at a tick: the last to start by then, else the first. */
export const eventAt = (events: readonly ChordEvent[], tick: Tick): number =>
  Math.max(
    0,
    events.findLastIndex((event) => event.at <= tick),
  )
