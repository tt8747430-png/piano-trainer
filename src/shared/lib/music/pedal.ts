import type { Pedal } from './marks'
import { TICKS_PER_BEAT, type Tick } from './time'

/**
 * The sustain pedal at a tick of the music (ADR 0097): pressed, let up, or let up and pressed again
 * (a change). A piece has one sustain pedal, its own line apart from the notes, so it moves over a
 * rest or after the last note as written.
 */
export interface PedalEvent {
  readonly tick: Tick
  readonly kind: Pedal
}

/** How near a lift may come before the next press and still be one change with it: a 32nd. */
const CHANGE_REACH = TICKS_PER_BEAT / 8

/**
 * A pedal line in order: by tick, one event at a tick, a change where an up and a down meet (as
 * Finale writes one, a stop and a start together) or where a change is written with anything else;
 * a lift up to a 32nd before the next press is that press's change (an import writing the two a
 * hair apart prints one mark, not a lift's and a press's side by side).
 */
export function pedalLine(events: readonly PedalEvent[]): PedalEvent[] {
  const presses = events.filter((event) => event.kind === 'down').map((event) => event.tick)
  const byTick = new Map<Tick, Set<Pedal>>()
  for (const { tick, kind } of events) {
    // A lift just before a press stands at the press, to make its change.
    const at =
      kind === 'up'
        ? (presses
            .filter((press) => press >= tick && press - tick <= CHANGE_REACH)
            .sort((a, b) => a - b)[0] ?? tick)
        : tick
    byTick.set(at, (byTick.get(at) ?? new Set()).add(kind))
  }
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
