import type { Midi } from '@/shared/lib/music'
import type { Sound } from './schedule'

/** One note on the audio clock: its key sounds from `from` until `to`. */
export interface KeyWindow {
  readonly midi: Midi
  readonly from: number
  readonly to: number
}

/** The notes of sounds played from `at` on the clock, as windows; a click sounds no key. */
export const keyWindows = (sounds: readonly Sound[], at: number): KeyWindow[] =>
  sounds.flatMap((sound) =>
    sound.kind === 'note'
      ? [{ midi: sound.midi, from: at + sound.at, to: at + sound.at + sound.duration }]
      : [],
  )

/** The keys sounding at `time`: every window it falls in, lowest key first. */
export function keysSoundingAt(windows: readonly KeyWindow[], time: number): Set<Midi> {
  const keys = windows
    .filter((window) => window.from <= time && time < window.to)
    .map((window) => window.midi)
  return new Set(keys.sort((a, b) => a - b))
}

/** The keys sounding at `time` that were struck last: the open windows with the latest start. */
export function keysStruckAt(windows: readonly KeyWindow[], time: number): Set<Midi> {
  const open = windows.filter((window) => window.from <= time && time < window.to)
  const latest = Math.max(...open.map((window) => window.from))
  const keys = open.filter((window) => window.from === latest).map((window) => window.midi)
  return new Set(keys.sort((a, b) => a - b))
}
