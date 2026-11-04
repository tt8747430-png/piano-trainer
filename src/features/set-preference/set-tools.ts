import type { DroneSettings, SettingsStore } from '@/entities/settings'
import { A4_RANGE, DRONE_OCTAVES } from '@/entities/settings'

const within = (value: number, { min, max }: { min: number; max: number }) =>
  Math.min(max, Math.max(min, Math.round(value)))

/** Saves the Tuner's A (R29 B11), held to whole hertz within its range. */
export function setTunerA4(store: SettingsStore, a4: number): void {
  store.setState({ tuner: { a4: within(a4, A4_RANGE) } })
}

/** Saves the Drone's root, kind, octave or volume (R29 B11), keeping the rest, each held to its range. */
export function setDrone(store: SettingsStore, change: Partial<DroneSettings>): void {
  store.setState(({ drone }) => {
    const next = { ...drone, ...change }
    return {
      drone: {
        ...next,
        root: within(next.root, { min: 0, max: 11 }),
        octave: within(next.octave, DRONE_OCTAVES),
        volume: within(next.volume, { min: 0, max: 100 }),
      },
    }
  })
}
