import type { MetronomeSettings, SettingsStore } from '@/entities/settings'
import { clampBpm } from '@/shared/lib/schedule'

/**
 * Saves the Metronome's tempo, meter or sound (ADR 0052), keeping the rest; a tempo is held to whole
 * beats a minute within its range, the speed trainer's start and goal too.
 */
export function setMetronome(store: SettingsStore, change: Partial<MetronomeSettings>): void {
  store.setState((state) => ({
    metronome: {
      ...state.metronome,
      ...change,
      ...(change.bpm === undefined ? {} : { bpm: clampBpm(change.bpm) }),
      ...(change.speed === undefined
        ? {}
        : {
            speed: {
              ...change.speed,
              from: clampBpm(change.speed.from),
              to: clampBpm(change.speed.to),
            },
          }),
    },
  }))
}
