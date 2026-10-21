import { DEFAULT_INSTRUMENT, type Instrument, type Midi } from '@/shared/lib/music'
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
 * How each instrument a sung part is played on sounds (ADR 0070), built from a few waves: their mix,
 * how fast it speaks and lets go, its vibrato (Hz, and how far at A4), how bright its low-pass is (a
 * multiple of the note, up to a ceiling), and whether it is plucked: struck, then dying away.
 */
interface Tone {
  readonly waves: readonly (readonly [OscillatorType, number])[]
  readonly attack: number
  readonly release: number
  readonly vibrato: { readonly rate: number; readonly depth: number } | null
  readonly bright: number
  readonly ceiling: number
  readonly pluck?: true
}

const TONES: Readonly<Record<Instrument, Tone>> = {
  voice: {
    waves: [
      ['sawtooth', 0.35],
      ['triangle', 0.65],
    ],
    attack: 0.08,
    release: 0.15,
    vibrato: { rate: 5.5, depth: 0.012 },
    bright: 4,
    ceiling: 3200,
  },
  violin: {
    waves: [
      ['sawtooth', 0.8],
      ['triangle', 0.2],
    ],
    attack: 0.06,
    release: 0.2,
    vibrato: { rate: 6, depth: 0.008 },
    bright: 6,
    ceiling: 6000,
  },
  cello: {
    waves: [
      ['sawtooth', 0.9],
      ['sine', 0.1],
    ],
    attack: 0.09,
    release: 0.25,
    vibrato: { rate: 5, depth: 0.008 },
    bright: 5,
    ceiling: 2500,
  },
  flute: {
    waves: [
      ['sine', 0.85],
      ['triangle', 0.15],
    ],
    attack: 0.05,
    release: 0.1,
    vibrato: { rate: 5, depth: 0.006 },
    bright: 8,
    ceiling: 8000,
  },
  oboe: {
    waves: [
      ['sawtooth', 0.5],
      ['square', 0.5],
    ],
    attack: 0.03,
    release: 0.08,
    vibrato: { rate: 5.5, depth: 0.005 },
    bright: 6,
    ceiling: 4500,
  },
  clarinet: {
    waves: [
      ['square', 0.6],
      ['triangle', 0.4],
    ],
    attack: 0.04,
    release: 0.1,
    vibrato: null,
    bright: 5,
    ceiling: 3000,
  },
  trumpet: {
    waves: [['sawtooth', 1]],
    attack: 0.03,
    release: 0.1,
    vibrato: { rate: 5, depth: 0.004 },
    bright: 8,
    ceiling: 5000,
  },
  horn: {
    waves: [
      ['sawtooth', 0.5],
      ['triangle', 0.5],
    ],
    attack: 0.07,
    release: 0.2,
    vibrato: null,
    bright: 3,
    ceiling: 1500,
  },
  guitar: {
    waves: [
      ['triangle', 0.6],
      ['sawtooth', 0.4],
    ],
    attack: 0.005,
    release: 0.3,
    vibrato: null,
    bright: 6,
    ceiling: 4000,
    pluck: true,
  },
}

/** How long a plucked string takes to die away, at the most. */
const PLUCK_DECAY = 1.6

/**
 * A sung part's note (ADR 0066, 0070), played on its instrument: its waves through a low-pass, rising
 * over its attack, held (or, plucked, dying away), with its vibrato, and let go over its release.
 */
const playSung: Render<NoteSound> = (context, note, at, ended) => {
  const tone = TONES[note.timbre ?? DEFAULT_INSTRUMENT]
  const frequency = frequencyOf(note.midi)
  const end = at + note.duration
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = Math.min(tone.ceiling, frequency * tone.bright)
  const envelope = context.createGain()
  const peak = Math.max(SILENT, note.velocity)
  const spoken = at + tone.attack
  envelope.gain.setValueAtTime(SILENT, at)
  envelope.gain.exponentialRampToValueAtTime(peak, spoken)
  if (tone.pluck) {
    envelope.gain.exponentialRampToValueAtTime(
      SILENT,
      Math.max(spoken, Math.min(end + tone.release, at + PLUCK_DECAY)),
    )
  } else {
    envelope.gain.setValueAtTime(peak, Math.max(spoken, end))
    envelope.gain.exponentialRampToValueAtTime(SILENT, Math.max(spoken, end) + tone.release)
  }
  const tones = tone.waves.map(([type, mix]) => {
    const oscillator = context.createOscillator()
    const level = context.createGain()
    oscillator.type = type
    oscillator.frequency.value = frequency
    level.gain.value = mix
    oscillator.connect(level).connect(filter)
    return oscillator
  })
  const sources: OscillatorNode[] = [...tones]
  if (tone.vibrato) {
    const vibrato = context.createOscillator()
    const depth = context.createGain()
    vibrato.type = 'sine'
    vibrato.frequency.value = tone.vibrato.rate
    depth.gain.value = frequency * tone.vibrato.depth
    vibrato.connect(depth)
    for (const each of tones) depth.connect(each.frequency)
    sources.push(vibrato)
  }
  for (const source of sources) {
    source.start(at)
    source.stop(end + tone.release + 0.05)
  }
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

/** Whether the page has had a gesture, which lets it start audio; where the browser cannot say, yes. */
const browserActivated = () => navigator.userActivation?.hasBeenActive ?? true

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
  activated = browserActivated,
}: {
  createContext?: () => AudioContext | null
  frame?: (look: () => void) => void
  createMedia?: (src: string) => Media
  /** The page's clock, in milliseconds. */
  pageNow?: () => number
  /** Whether a gesture has let the page start audio. */
  activated?: () => boolean
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
    // A sung part is the app's own: the keyboard's speaker plays a piano.
    if (sound.kind === 'note' && piano && sound.timbre === undefined) {
      piano.render(sound, at)
      return
    }
    if (!context) return
    const ended = () => voices.delete(voice)
    const voice =
      sound.kind === 'note'
        ? (sound.timbre === undefined ? playNote : playSung)(context, sound, at, ended)
        : playClick(context, sound, at, ended)
    voices.add(voice)
  }

  const now = () => context?.currentTime ?? 0
  /**
   * What is heard now, on the notes' clock: a note leaves the output its latency after the clock
   * reaches it (none known where a browser does not say). An element's own time is what it plays out.
   */
  const heard = () => (context ? context.currentTime - (context.outputLatency || 0) : 0)
  /**
   * A moment heard on both clocks, the audio's and the page's: the output's own timestamp where the
   * browser gives one, which pairs the two exactly; else what is heard now with the page's now. The
   * audio clock alone moves a buffer at a time, 10 to 40 ms on some systems: a key's place against
   * the click would jitter by as much.
   */
  const heardPair = (): { readonly audio: number; readonly page: number } => {
    const stamp = context?.getOutputTimestamp?.()
    if (stamp?.contextTime !== undefined && stamp.performanceTime)
      return { audio: stamp.contextTime, page: stamp.performanceTime }
    return { audio: heard(), page: pageNow() }
  }
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
      // With no gesture behind it (a sound as a screen opens), resuming could only fail.
      if (audio && heldBack(audio) && activated()) await audio.resume()
    },
    play(sounds, at) {
      const audio = openContext()
      if (!audio) return NOTHING_PLAYED
      if (heldBack(audio)) {
        // Audio held back with no gesture to start it (a round sounded as its trainer opens) is let
        // go, not queued to burst out at the first tap; where the browser lets it run, it plays.
        if (!activated()) return NOTHING_PLAYED
        void audio.resume()
      }
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
            pageTimeOf: (audioTime) => {
              const pair = heardPair()
              return pair.page + (audioTime - pair.audio) * 1000
            },
            pageNow,
          })
        : null
    },
    loadRecording: (src) => recordings.load(src),
    playRecording: (src, play) => recordings.play(src, play),
    now,
    // What is heard now, moved by how long before or after now the page's moment was.
    audioTimeAt: (pageTime) => {
      if (!context) return pageTime / 1000
      const pair = heardPair()
      return pair.audio + (pageTime - pair.page) / 1000
    },
    sounding: keys.current,
    struck: keys.struck,
    live: keys.live,
    isPlaying: keys.isPlaying,
    onSounding: keys.subscribe,
  }
}
