import type { Sound } from '@/shared/lib/schedule'
import { PLAY_DELAY, type AudioOutput } from './types'

/** An AudioOutput for tests: records what it is asked, and keeps a clock the test moves. */
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
  return {
    async unlock() {
      unlocks++
    },
    play(sounds, at) {
      played.push({ sounds, at: at ?? clock + PLAY_DELAY })
    },
    stop() {
      stops++
    },
    now: () => clock,
    setNow(seconds) {
      clock = seconds
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
