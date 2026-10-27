import type { Midi } from '@/shared/lib/music'
import {
  damp,
  QUIET_DAMPER,
  SOFT_GAIN,
  velocityGain,
  type Damper,
  type DamperEvent,
  type PedalKind,
} from '@/shared/lib/schedule'

/** The keys a hand plays, sounding while held, under the pedals. */
interface LiveVoice {
  press(key: Midi, velocity: number): void
  release(key: Midi): void
  pedal(pedal: PedalKind, down: boolean): void
  pedals(): Readonly<Record<PedalKind, boolean>>
}

/** How an adapter sounds the live voice: `strike` a key at a gain, `silence` it; `changed` after each change. */
interface LiveRender {
  strike(key: Midi, gain: number): void
  silence(key: Midi): void
  changed(damper: Damper): void
}

/**
 * The damper over an adapter's sound: what each hand and pedal does is heard as the damper says. A
 * key held from two places (the MIDI keyboard and a finger on the screen) is let go when both let go
 * of it: one letting go never cuts the other's sound. A pedal is the same: held from two places (Space,
 * the rail's button, the MIDI foot), it comes up when both let it up.
 */
export function createLiveVoice(render: LiveRender): LiveVoice {
  let damper = QUIET_DAMPER
  /** How many hands hold each key down now. */
  const holds = new Map<Midi, number>()
  /** How many sources hold each pedal down now. */
  const pedalHolds = new Map<PedalKind, number>()

  const apply = (event: DamperEvent) => {
    const next = damp(damper, event)
    damper = next.damper
    for (const key of next.stopped) render.silence(key)
  }

  return {
    press(key, velocity) {
      holds.set(key, (holds.get(key) ?? 0) + 1)
      if (damper.sounding.has(key)) render.silence(key)
      apply({ kind: 'press', midi: key })
      render.strike(key, velocityGain(velocity) * (damper.pedals.soft ? SOFT_GAIN : 1))
      render.changed(damper)
    },
    release(key) {
      const held = (holds.get(key) ?? 0) - 1
      if (held > 0) {
        holds.set(key, held)
        return
      }
      holds.delete(key)
      apply({ kind: 'release', midi: key })
      render.changed(damper)
    },
    pedal(pedal, down) {
      const before = pedalHolds.get(pedal) ?? 0
      const after = down ? before + 1 : Math.max(0, before - 1)
      pedalHolds.set(pedal, after)
      if (before > 0 === after > 0) return
      apply({ kind: 'pedal', pedal, down })
      render.changed(damper)
    },
    pedals: () => damper.pedals,
  }
}
