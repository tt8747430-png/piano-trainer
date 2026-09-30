import type { ClickSound, NoteSound, Sound } from '@/shared/lib/schedule'
import { createLookahead } from './lookahead'
import { createRecordingPlayer, type Media } from './recording-player'
import { createSoundingKeys, NOTHING_PLAYED } from './sounding'
import { PLAY_DELAY, type AudioOutput } from './types'

/** The piano voice: a triangle with two sine partials, through a closing low-pass filter. */
const PARTIALS = [
  { multiple: 1, type: 'triangle', level: 1 },
  { multiple: 2, type: 'sine', level: 0.35 },
  { multiple: 3, type: 'sine', level: 0.12 },
] as const
const SILENT = 0.0001

const frequencyOf = (note: NoteSound) => 440 * 2 ** ((note.midi - 69) / 12)

/** A sound's nodes: the oscillators that make it and the gain it leaves by. */
interface Voice {
  readonly sources: readonly OscillatorNode[]
  readonly output: GainNode
}

/** Builds a sound's voice; `ended` runs when it is over. */
type Render<S> = (context: AudioContext, sound: S, at: number, ended: () => void) => Voice

const playNote: Render<NoteSound> = (context, note, at, ended) => {
  const frequency = frequencyOf(note)
  const release = at + note.duration + 0.2
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(Math.min(7000, frequency * 9), at)
  filter.frequency.exponentialRampToValueAtTime(Math.max(300, frequency * 2), release)
  const envelope = context.createGain()
  const peak = Math.max(SILENT, note.velocity)
  envelope.gain.setValueAtTime(SILENT, at)
  envelope.gain.exponentialRampToValueAtTime(peak, at + 0.008)
  envelope.gain.exponentialRampToValueAtTime(peak * 0.4, at + Math.min(0.35, note.duration * 0.5))
  envelope.gain.exponentialRampToValueAtTime(SILENT, release)
  const sources = PARTIALS.map(({ multiple, type, level }) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = type
    oscillator.frequency.value = frequency * multiple
    gain.gain.value = level
    oscillator.connect(gain).connect(filter)
    oscillator.start(at)
    oscillator.stop(at + note.duration + 0.25)
    if (multiple === 1) oscillator.onended = ended
    return oscillator
  })
  filter.connect(envelope).connect(context.destination)
  return { sources, output: envelope }
}

const playClick: Render<ClickSound> = (context, click, at, ended) => {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.frequency.value = click.accent ? 1600 : 1100
  gain.gain.setValueAtTime(SILENT, at)
  gain.gain.exponentialRampToValueAtTime(click.accent ? 0.22 : 0.13, at + 0.002)
  gain.gain.exponentialRampToValueAtTime(SILENT, at + 0.05)
  oscillator.connect(gain).connect(context.destination)
  oscillator.start(at)
  oscillator.stop(at + 0.06)
  oscillator.onended = ended
  return { sources: [oscillator], output: gain }
}

const browserContext = (): AudioContext | null =>
  typeof AudioContext === 'function' ? new AudioContext() : null

const animationFrame = (look: () => void) => void requestAnimationFrame(look)

/** Audio a browser holds back until a gesture: started suspended, or interrupted (iOS, by a call). */
const held = (context: AudioContext) =>
  context.state === 'suspended' || context.state === 'interrupted'

/**
 * A recording's element, playing the whole file from memory. Streamed, an element asks for byte
 * ranges, and the service worker's precache answers with the whole file: the element could not seek,
 * so each seek landed back at 0 s and was made again and again (ADR 0016). Until the file is in, the
 * element has no source: a play waits for it.
 */
export function wholeFileMedia(src: string): HTMLAudioElement {
  const media = new Audio()
  media.preload = 'auto'
  // A file that cannot be had leaves the recording silent, as a missing one would.
  void fetch(src)
    .then((response) => (response.ok ? response.blob() : Promise.reject(new Error(src))))
    .then((file) => {
      media.src = URL.createObjectURL(file)
    })
    .catch(() => undefined)
  return media
}

/**
 * The WebAudio adapter. No AudioContext exists before the first unlock or play, and none at all
 * where the browser has none: then every call does nothing. The keys sounding are followed on the
 * audio clock every animation frame while a note sounds.
 */
export function createWebAudioOutput({
  createContext = browserContext,
  frame = animationFrame,
  createMedia = wholeFileMedia,
}: {
  createContext?: () => AudioContext | null
  frame?: (look: () => void) => void
  createMedia?: (src: string) => Media
} = {}): AudioOutput {
  let context: AudioContext | null | undefined
  const voices = new Set<Voice>()

  /** The AudioContext, created on first use; null where the browser has none. */
  const openContext = (): AudioContext | null => {
    if (context === undefined) context = createContext()
    return context
  }

  const render = (sound: Sound, at: number) => {
    if (!context) return
    const ended = () => voices.delete(voice)
    const voice =
      sound.kind === 'note'
        ? playNote(context, sound, at, ended)
        : playClick(context, sound, at, ended)
    voices.add(voice)
  }

  const now = () => context?.currentTime ?? 0
  /**
   * What is heard now, on the notes' clock: a note leaves the output its latency after the clock
   * reaches it (none known where a browser does not say). An element's own time is what it plays out.
   */
  const heard = () => (context ? context.currentTime - (context.outputLatency || 0) : 0)
  const lookahead = createLookahead({ now, render })
  const keys = createSoundingKeys({ now, frame })
  // By its own element, not through the AudioContext: WebKit's tap into it stalls the element about
  // 0.45 s after every seek, play or change of rate, so the recording could never be kept in time.
  const recordings = createRecordingPlayer({ now: heard, createMedia })

  return {
    async unlock() {
      recordings.prime()
      const audio = openContext()
      if (audio && held(audio)) await audio.resume()
    },
    play(sounds, at, options) {
      const audio = openContext()
      if (!audio) return NOTHING_PLAYED
      if (held(audio)) void audio.resume()
      const start = at ?? audio.currentTime + PLAY_DELAY
      lookahead.add(sounds, start)
      return keys.add(sounds, start, options)
    },
    stop() {
      recordings.stop()
      lookahead.clear()
      keys.clear()
      if (!context) return
      for (const { sources, output } of voices) {
        output.disconnect()
        for (const source of sources) source.stop(context.currentTime)
      }
      voices.clear()
    },
    loadRecording: (src) => recordings.load(src),
    playRecording: (src, play) => recordings.play(src, play),
    now,
    sounding: keys.current,
    struck: keys.struck,
    isPlaying: keys.isPlaying,
    onSounding: keys.subscribe,
  }
}
