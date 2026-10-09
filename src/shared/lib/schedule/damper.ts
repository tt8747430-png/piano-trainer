import type { Midi } from '@/shared/lib/music'

/** A piano's three pedals: the sustain lifts every damper, the sostenuto those of the keys down. */
export const PEDALS = ['sustain', 'soft', 'sostenuto'] as const
export type PedalKind = (typeof PEDALS)[number]

/** A key struck under the soft pedal sounds at two thirds of its gain. */
export const SOFT_GAIN = 2 / 3

/** Which keys a hand holds, which sound, the pedals, and the keys the sostenuto caught. */
export interface Damper {
  readonly held: ReadonlySet<Midi>
  readonly sounding: ReadonlySet<Midi>
  readonly pedals: Readonly<Record<PedalKind, boolean>>
  readonly caught: ReadonlySet<Midi>
}

export type DamperEvent =
  | { readonly kind: 'press' | 'release'; readonly midi: Midi }
  | { readonly kind: 'pedal'; readonly pedal: PedalKind; readonly down: boolean }

const NO_KEYS: ReadonlySet<Midi> = new Set()

export const QUIET_DAMPER: Damper = {
  held: NO_KEYS,
  sounding: NO_KEYS,
  pedals: { sustain: false, soft: false, sostenuto: false },
  caught: NO_KEYS,
}

const withKey = (keys: ReadonlySet<Midi>, key: Midi): ReadonlySet<Midi> =>
  keys.has(key) ? keys : new Set(keys).add(key)

/** The keys left sounding once `stopped` stop, and those that do. */
function stopping(damper: Damper, stops: (key: Midi) => boolean) {
  const stopped = [...damper.sounding].filter(stops)
  if (stopped.length === 0) return { sounding: damper.sounding, stopped }
  return { sounding: new Set([...damper.sounding].filter((key) => !stops(key))), stopped }
}

type Damped = { damper: Damper; stopped: Midi[] }

function pressed(damper: Damper, key: Midi): Damped {
  const held = withKey(damper.held, key)
  const sounding = withKey(damper.sounding, key)
  return { damper: { ...damper, held, sounding }, stopped: [] }
}

function released(damper: Damper, key: Midi): Damped {
  if (!damper.held.has(key)) return { damper, stopped: [] }
  const held = new Set(damper.held)
  held.delete(key)
  const rings = damper.pedals.sustain || damper.caught.has(key)
  const { sounding, stopped } = stopping(damper, (sounded) => sounded === key && !rings)
  return { damper: { ...damper, held, sounding }, stopped }
}

function pedalled(damper: Damper, pedal: PedalKind, down: boolean): Damped {
  if (damper.pedals[pedal] === down) return { damper, stopped: [] }
  const changed = { ...damper, pedals: { ...damper.pedals, [pedal]: down } }
  if (pedal === 'soft' || (pedal === 'sustain' && down)) return { damper: changed, stopped: [] }
  if (pedal === 'sostenuto' && down)
    return { damper: { ...changed, caught: damper.held }, stopped: [] }
  const { sounding, stopped } =
    pedal === 'sostenuto'
      ? stopping(
          damper,
          (key) => damper.caught.has(key) && !damper.held.has(key) && !damper.pedals.sustain,
        )
      : stopping(damper, (key) => !damper.held.has(key) && !damper.caught.has(key))
  return {
    damper: { ...changed, sounding, caught: pedal === 'sostenuto' ? NO_KEYS : damper.caught },
    stopped,
  }
}

/**
 * The damper after `event` (spec 2026-10-09 §2.1, §3.4), and the keys whose dampers fell: they stop
 * sounding now. A key let go stops unless the sustain is down or the sostenuto caught it; the
 * sustain's up stops every key no hand holds and the sostenuto did not catch; the sostenuto catches
 * the keys held as it goes down and lets them go as it comes up. The soft pedal stops nothing.
 */
export function damp(damper: Damper, event: DamperEvent): Damped {
  if (event.kind === 'pedal') return pedalled(damper, event.pedal, event.down)
  return event.kind === 'press' ? pressed(damper, event.midi) : released(damper, event.midi)
}
