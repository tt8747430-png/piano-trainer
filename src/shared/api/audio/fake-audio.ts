import type { Sound } from '@/shared/lib/schedule'
import { createSoundingKeys } from './sounding'
import { PLAY_DELAY, type AudioOutput } from './types'

/**
 * An AudioOutput for tests: records what it is asked, and keeps a clock the test moves. The keys
 * sounding follow that clock: a test sees them change when it moves it.
 */
export interface FakeAudio extends AudioOutput {
  readonly unlocks: number
  readonly played: readonly { readonly sounds: readonly Sound[]; readonly at: number }[]
  readonly stops: number
  setNow(seconds: number): void
}

export function createFakeAudio(): FakeAudio {
  let clock = 0
  let unlocks = 0
  let stops = 0
  const played: { sounds: readonly Sound[]; at: number }[] = []
  const keys = createSoundingKeys({ now: () => clock })
  return {
    async unlock() {
      unlocks++
    },
    play(sounds, at) {
      const start = at ?? clock + PLAY_DELAY
      played.push({ sounds, at: start })
      return keys.add(sounds, start)
    },
    stop() {
      stops++
      keys.clear()
    },
    now: () => clock,
    sounding: keys.current,
    struck: keys.struck,
    isPlaying: keys.isPlaying,
    onSounding: keys.subscribe,
    setNow(seconds) {
      clock = seconds
      keys.update()
    },
    get unlocks() {
      return unlocks
    },
    get played() {
      return played
    },
    get stops() {
      return stops
    },
  }
}
