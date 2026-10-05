import type { RecordingPlay, Sound } from '@/shared/lib/schedule'
import { createSoundingKeys } from './sounding'
import { PLAY_DELAY, type AudioOutput } from './types'

/**
 * An AudioOutput for tests: records what it is asked, and keeps a clock the test moves. The keys
 * sounding follow that clock: a test sees them change when it moves it. The page's clock is heard as
 * its own (a key struck at 1500 ms falls at 1.5 s), so a test times MIDI keys on the audio clock.
 */
export interface FakeAudio extends AudioOutput {
  readonly unlocks: number
  readonly played: readonly { readonly sounds: readonly Sound[]; readonly at: number }[]
  readonly stops: number
  readonly loadedRecordings: readonly string[]
  readonly recordings: readonly { readonly src: string; readonly play: RecordingPlay }[]
  setNow(seconds: number): void
}

export function createFakeAudio(): FakeAudio {
  let clock = 0
  let unlocks = 0
  let stops = 0
  const played: { sounds: readonly Sound[]; at: number }[] = []
  const loadedRecordings: string[] = []
  const recordings: { src: string; play: RecordingPlay }[] = []
  const keys = createSoundingKeys({ now: () => clock })
  return {
    async unlock() {
      unlocks++
    },
    play(sounds, at, options) {
      const start = at ?? clock + PLAY_DELAY
      played.push({ sounds, at: start })
      return keys.add(sounds, start, options)
    },
    stop() {
      stops++
      keys.clear()
    },
    loadRecording(src) {
      loadedRecordings.push(src)
    },
    playRecording(src, play) {
      recordings.push({ src, play })
    },
    now: () => clock,
    audioTimeAt: (pageTime) => pageTime / 1000,
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
    get loadedRecordings() {
      return loadedRecordings
    },
    get recordings() {
      return recordings
    },
  }
}
