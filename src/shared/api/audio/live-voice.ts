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

/** The keys a hand plays, sounding while held, under the pedals (spec 2026-10-09 §2.1). */
export interface LiveVoice {
  press(key: Midi, velocity: number): void
  release(key: Midi): void
  pedal(pedal: PedalKind, down: boolean): void
  pedals(): Readonly<Record<PedalKind, boolean>>
}

/** How an adapter sounds the live voice: `strike` a key at a gain, `silence` it; `changed` after each change. */
export interface LiveRender {
  strike(key: Midi, gain: number): void
  silence(key: Midi): void
  changed(damper: Damper): void
}

/** The damper over an adapter's sound: what each hand and pedal does is heard as the damper says. */
export function createLiveVoice(render: LiveRender): LiveVoice {
  let damper = QUIET_DAMPER

  const apply = (event: DamperEvent) => {
    const next = damp(damper, event)
    damper = next.damper
    for (const key of next.stopped) render.silence(key)
  }

  return {
    press(key, velocity) {
      if (damper.sounding.has(key)) render.silence(key)
      apply({ kind: 'press', midi: key })
      render.strike(key, velocityGain(velocity) * (damper.pedals.soft ? SOFT_GAIN : 1))
      render.changed(damper)
    },
    release(key) {
      apply({ kind: 'release', midi: key })
      render.changed(damper)
    },
    pedal(pedal, down) {
      apply({ kind: 'pedal', pedal, down })
      render.changed(damper)
    },
    pedals: () => damper.pedals,
  }
}
