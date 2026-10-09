import type { Midi } from '@/shared/lib/music'
import type { ClickSound, NoteSound, Sound } from '@/shared/lib/schedule'
import { createLiveVoice } from './live-voice'
import { createLookahead } from './lookahead'
import { createMidiSoundOutput, type MidiSoundOutput } from './midi-sound-output'
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

const frequencyOf = (key: Midi) => 440 * 2 ** ((key - 69) / 12)

/** A sound's nodes: the oscillators that make it and the gain it leaves by. */
interface Voice {
  readonly sources: readonly OscillatorNode[]
  readonly output: GainNode
}

/** Builds a sound's voice; `ended` runs when it is over. */
type Render<S> = (context: AudioContext, sound: S, at: number, ended: () => void) => Voice

/** The piano's partials at `frequency` into `filter`, from `at`: each oscillator with its level. */
function partials(context: AudioContext, frequency: number, filter: AudioNode, at: number) {
  return PARTIALS.map(({ multiple, type, level }) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = type
    oscillator.frequency.value = frequency * multiple
    gain.gain.value = level
    oscillator.connect(gain).connect(filter)
    oscillator.start(at)
    return oscillator
  })
}

const playNote: Render<NoteSound> = (context, note, at, ended) => {
  const frequency = frequencyOf(note.midi)
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
  const sources = partials(context, frequency, filter, at)
  for (const source of sources) source.stop(at + note.duration + 0.25)
  if (sources[0]) sources[0].onended = ended
  filter.connect(envelope).connect(context.destination)
  return { sources, output: envelope }
}

/**
 * A key a hand holds, struck at `gain` now: it rises in 8 ms, then dies away as a string does (a
 * lower key longer) and never stops by itself: its damper stops it (`damped`).
 */
function holdNote(context: AudioContext, key: Midi, gain: number): Voice {
  const at = context.currentTime
  const frequency = frequencyOf(key)
  const decay = 1.5 + (4.5 * (108 - key)) / 87
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(Math.min(7000, frequency * 9), at)
  filter.frequency.setTargetAtTime(Math.max(300, frequency * 2), at, decay)
  const envelope = context.createGain()
  envelope.gain.setValueAtTime(SILENT, at)
  envelope.gain.exponentialRampToValueAtTime(Math.max(SILENT, gain), at + 0.008)
  envelope.gain.setTargetAtTime(SILENT, at + 0.008, decay)
  const sources = partials(context, frequency, filter, at)
  filter.connect(envelope).connect(context.destination)
  return { sources, output: envelope }
}

/** A held key's damper falls now: its sound dies in a moment, and its oscillators stop. */
function damped(context: AudioContext, { sources, output }: Voice) {
  const at = context.currentTime
  const level = output.gain.value
  output.gain.cancelScheduledValues(at)
  output.gain.setValueAtTime(level, at)
  output.gain.setTargetAtTime(SILENT, at, 0.04)
  for (const source of sources) source.stop(at + 0.25)
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
const heldBack = (context: AudioContext) =>
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
  pageNow = () => performance.now(),
}: {
  createContext?: () => AudioContext | null
  frame?: (look: () => void) => void
  createMedia?: (src: string) => Media
  /** The page's clock, in milliseconds. */
  pageNow?: () => number
} = {}): AudioOutput {
  let context: AudioContext | null | undefined
  const voices = new Set<Voice>()
  /** The keys the live voice holds sounding: apart from `voices`, so stop() never reaches them. */
  const held = new Map<Midi, Voice>()
  /** The keyboard's speaker the notes go to, while they go through the piano. */
  let piano: MidiSoundOutput | null = null

  /** The AudioContext, created on first use; null where the browser has none. */
  const openContext = (): AudioContext | null => {
    if (context === undefined) context = createContext()
    return context
  }

  const render = (sound: Sound, at: number) => {
    if (sound.kind === 'note' && piano) {
      piano.render(sound, at)
      return
    }
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
  const voice = createLiveVoice({
    strike(key, gain) {
      const audio = openContext()
      if (!audio) return
      if (heldBack(audio)) void audio.resume()
      held.set(key, holdNote(audio, key, gain))
    },
    silence(key) {
      const sound = held.get(key)
      if (!context || !sound) return
      damped(context, sound)
      held.delete(key)
    },
    changed: keys.setLive,
  })

  return {
    async unlock() {
      recordings.prime()
      const audio = openContext()
      if (audio && heldBack(audio)) await audio.resume()
    },
    play(sounds, at) {
      const audio = openContext()
      if (!audio) return NOTHING_PLAYED
      if (heldBack(audio)) void audio.resume()
      const start = at ?? audio.currentTime + PLAY_DELAY
      lookahead.add(sounds, start)
      return keys.add(sounds, start)
    },
    stop() {
      piano?.stop()
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
    press: voice.press,
    release: voice.release,
    pedal: voice.pedal,
    pedals: voice.pedals,
    notesTo(output) {
      piano?.stop()
      piano = output
        ? createMidiSoundOutput(output, {
            // A moment of the audio clock on the page's: the piano's note heard with the click.
            pageTimeOf: (audioTime) => pageNow() + (audioTime - heard()) * 1000,
            pageNow,
          })
        : null
    },
    loadRecording: (src) => recordings.load(src),
    playRecording: (src, play) => recordings.play(src, play),
    now,
    // What is heard now, moved by how long before or after now the page's moment was.
    audioTimeAt: (pageTime) =>
      context ? heard() + (pageTime - pageNow()) / 1000 : pageTime / 1000,
    sounding: keys.current,
    struck: keys.struck,
    live: keys.live,
    isPlaying: keys.isPlaying,
    onSounding: keys.subscribe,
  }
}
