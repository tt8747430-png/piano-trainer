import type { SettingsStore } from '@/entities/settings'
import { A4_RANGE } from '@/entities/settings'

const within = (value: number, { min, max }: { min: number; max: number }) =>
  Math.min(max, Math.max(min, Math.round(value)))

/** Saves the Tuner's A (R29 B11), held to whole hertz within its range. */
export function setTunerA4(store: SettingsStore, a4: number): void {
  store.setState({ tuner: { a4: within(a4, A4_RANGE) } })
}
