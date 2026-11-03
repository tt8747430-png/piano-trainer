import type { Pedal } from './marks'
import type { Tick } from './time'

/**
 * The sustain pedal at a tick of the music (ADR 0097): pressed, let up, or let up and pressed again
 * (a change). A piece has one sustain pedal, its own line apart from the notes, so it moves over a
 * rest or after the last note as written.
 */
export interface PedalEvent {
  readonly tick: Tick
  readonly kind: Pedal
}

/**
 * A pedal line in order: by tick, one event at a tick, a change where an up and a down meet (as
 * Finale writes one, a stop and a start together) or where a change is written with anything else.
 */
export function pedalLine(events: readonly PedalEvent[]): PedalEvent[] {
  const byTick = new Map<Tick, Set<Pedal>>()
  for (const { tick, kind } of events) byTick.set(tick, (byTick.get(tick) ?? new Set()).add(kind))
  return [...byTick]
    .sort(([a], [b]) => a - b)
    .map(([tick, kinds]) => ({
      tick,
      kind:
        kinds.has('change') || (kinds.has('up') && kinds.has('down'))
          ? 'change'
          : kinds.has('down')
            ? 'down'
            : 'up',
    }))
}
