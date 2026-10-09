import type { RecordingPlay, Sound } from '@/shared/lib/schedule'
import { createLiveVoice } from './live-voice'
import { createSoundingKeys } from './sounding'
import { PLAY_DELAY, type AudioOutput, type LiveEvent, type NoteOutput } from './types'

/**
 * An AudioOutput for tests: records what it is asked, and keeps a clock the test moves. The keys
 * sounding follow that clock: a test sees them change when it moves it. The page's now is heard as its
 * clock's now, with nothing lagging: a MIDI key struck after `setNow(2.5)` falls at 2.5 s.
 */
export interface FakeAudio extends AudioOutput {
  readonly unlocks: number
  readonly played: readonly { readonly sounds: readonly Sound[]; readonly at: number }[]
  readonly stops: number
  /** What the hands did to the live voice, in order. */
  readonly voice: readonly LiveEvent[]
  /** The keyboard's speaker the notes are sent to; null: the browser. */
  readonly notesOut: NoteOutput | null
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
  const voice: LiveEvent[] = []
  let notesOut: NoteOutput | null = null
  const keys = createSoundingKeys({ now: () => clock })
  const live = createLiveVoice({ strike() {}, silence() {}, changed: keys.setLive })
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
    press(key, velocity) {
      voice.push({ kind: 'press', midi: key, velocity })
      live.press(key, velocity)
    },
    release(key) {
      voice.push({ kind: 'release', midi: key })
      live.release(key)
    },
    pedal(pedal, down) {
      voice.push({ kind: 'pedal', pedal, down })
      live.pedal(pedal, down)
    },
    pedals: live.pedals,
    notesTo(output) {
      notesOut = output
    },
    loadRecording(src) {
      loadedRecordings.push(src)
    },
    playRecording(src, play) {
      recordings.push({ src, play })
    },
    now: () => clock,
    audioTimeAt: (pageTime) => clock + (pageTime - performance.now()) / 1000,
    sounding: keys.current,
    struck: keys.struck,
    live: keys.live,
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
    get voice() {
      return voice
    },
    get notesOut() {
      return notesOut
    },
    get loadedRecordings() {
      return loadedRecordings
    },
    get recordings() {
      return recordings
    },
  }
}
