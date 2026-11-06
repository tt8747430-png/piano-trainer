import { hasFinePointer } from '@/shared/lib/fine-pointer'
import type { Midi } from '@/shared/lib/music'
import {
  SOFT_GAIN,
  type ClickSound,
  type ClickVoice,
  type DrumSound,
  type KitPiece,
  type NoteSound,
  type Sound,
} from '@/shared/lib/schedule'
import { createInstruments, type Instruments } from './instruments'
import { createLiveVoice } from './live-voice'
import { createLookahead } from './lookahead'
import { createMidiSoundOutput, type MidiSoundOutput } from './midi-sound-output'
import { createRecordingPlayer, type RecordingVoice } from './recording-player'
import { createSampleLoader, type SampleLoader } from './sample-loader'
import type { SamplerVoice } from './sampler'
import { createSoundingKeys, NOTHING_PLAYED } from './sounding'
import { stringDecay } from './string-decay'
import { PLAY_DELAY, type AudioOutput } from './types'
import {
  createRecordedSounds,
  fetchSound,
  isRecordedSound,
  type LoadSound,
  type RecordedSound,
} from './recorded-sounds'

/** The piano voice: a triangle with two sine partials, through a closing low-pass filter. */
const PARTIALS = [
  { multiple: 1, type: 'triangle', level: 1 },
  { multiple: 2, type: 'sine', level: 0.35 },
  { multiple: 3, type: 'sine', level: 0.12 },
] as const
const SILENT = 0.0001

const frequencyOf = (key: Midi) => 440 * 2 ** ((key - 69) / 12)

/**
 * A sound's nodes: the sources that make it and the gain it leaves by; a recorded voice's own damper
 * (`release`), where it has one.
 */
interface Voice {
  readonly sources: readonly AudioScheduledSourceNode[]
  readonly output: GainNode
  readonly release?: (at: number) => void
}

/** A recorded instrument's voice as the adapter keeps it: `ended` runs when it is over. */
function recordedVoice(sampled: SamplerVoice, ended: () => void): Voice {
  sampled.source.onended = ended
  return {
    sources: [sampled.source],
    output: sampled.output,
    release: (at) => sampled.release(at),
  }
}

/** Builds a sound's voice at `gain` of its loudness (ADR 0105); `ended` runs when it is over. */
type Render<S> = (
  context: AudioContext,
  sound: S,
  at: number,
  gain: number,
  ended: () => void,
) => Voice

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

/** How fast a damper silences a string: the level's time constant, in seconds. */
const DAMPING = 0.04
/** How long after its damper falls a voice's oscillators stop. */
const DAMPED = 0.25
/** The soft pedal's low-pass: this many times the key's pitch, kept between these (Hz), gently. */
const SOFT_TONE = { over: 6, lowest: 900, highest: 4000, q: 0.5 } as const

/**
 * A scheduled note (ADR 0034): it rises in 8 ms, then dies away as a string does (`stringDecay`, a
 * lower key longer) for as long as it sounds, held by a hand or by the pedal, and its damper falls
 * at its end (the pedal's lift, where the pedal holds it).
 */
const playNote: Render<NoteSound> = (context, note, at, gain, ended) => {
  const frequency = frequencyOf(note.midi)
  const decay = stringDecay(note.midi)
  const end = at + note.duration
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(Math.min(7000, frequency * 9), at)
  filter.frequency.setTargetAtTime(Math.max(300, frequency * 2), at, decay)
  const envelope = context.createGain()
  const peak = Math.max(SILENT, note.velocity * gain)
  envelope.gain.setValueAtTime(SILENT, at)
  envelope.gain.exponentialRampToValueAtTime(peak, at + 0.008)
  envelope.gain.setTargetAtTime(SILENT, at + 0.008, decay)
  envelope.gain.setTargetAtTime(SILENT, end, DAMPING)
  const sources = partials(context, frequency, filter, at)
  for (const source of sources) source.stop(end + DAMPED)
  if (sources[0]) sources[0].onended = ended
  filter.connect(envelope).connect(context.destination)
  return { sources, output: envelope }
}

/** A scheduled voice's damper falls at `at`, where its key is struck again (one voice a key). */
function dampedAt({ sources, output }: Voice, at: number) {
  output.gain.cancelScheduledValues(at)
  output.gain.setTargetAtTime(SILENT, at, DAMPING)
  for (const source of sources) source.stop(at + DAMPED)
}

/**
 * The soft pedal's tone for a key struck under it (una corda): fewer strings struck, by a softer
 * part of the hammer, so the upper partials fall away. A low-pass about two and a half octaves over
 * the key, into `destination`; what the voice sounds goes through it.
 */
function softTone(context: AudioContext, key: Midi): BiquadFilterNode {
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = Math.min(
    SOFT_TONE.highest,
    Math.max(SOFT_TONE.lowest, frequencyOf(key) * SOFT_TONE.over),
  )
  filter.Q.value = SOFT_TONE.q
  filter.connect(context.destination)
  return filter
}

/**
 * A key a hand holds, struck at `gain` now into `destination`: it rises in 8 ms, then dies away as a
 * string does (a lower key longer) and never stops by itself: its damper stops it (`damped`).
 */
function holdNote(context: AudioContext, key: Midi, gain: number, destination: AudioNode): Voice {
  const at = context.currentTime
  const frequency = frequencyOf(key)
  const decay = stringDecay(key)
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(Math.min(7000, frequency * 9), at)
  filter.frequency.setTargetAtTime(Math.max(300, frequency * 2), at, decay)
  const envelope = context.createGain()
  envelope.gain.setValueAtTime(SILENT, at)
  envelope.gain.exponentialRampToValueAtTime(Math.max(SILENT, gain), at + 0.008)
  envelope.gain.setTargetAtTime(SILENT, at + 0.008, decay)
  const sources = partials(context, frequency, filter, at)
  filter.connect(envelope).connect(destination)
  return { sources, output: envelope }
}

/** A held key's damper falls now: its sound dies in a moment, and its oscillators stop. */
function damped(context: AudioContext, { sources, output }: Voice) {
  const at = context.currentTime
  const level = output.gain.value
  output.gain.cancelScheduledValues(at)
  output.gain.setValueAtTime(level, at)
  output.gain.setTargetAtTime(SILENT, at, DAMPING)
  for (const source of sources) source.stop(at + DAMPED)
}

/** A click's loudness: the bar's first beat's louder. */
const CLICK_PEAK = { accent: 0.32, beat: 0.22 } as const

/** A short tone at `hz`: up in 2 ms, `peak` loud, gone by `length` seconds. */
function tone(
  context: AudioContext,
  {
    hz,
    peak,
    length,
    type = 'sine',
    drop,
  }: { hz: number; peak: number; length: number; type?: OscillatorType; drop?: number },
  at: number,
  ended: () => void,
): Voice {
  const oscillator = context.createOscillator()
  const envelope = context.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(hz, at)
  // A drum's body falls in pitch as it dies.
  if (drop) oscillator.frequency.exponentialRampToValueAtTime(drop, at + length * 0.6)
  envelope.gain.setValueAtTime(SILENT, at)
  envelope.gain.exponentialRampToValueAtTime(Math.max(SILENT, peak), at + 0.002)
  envelope.gain.exponentialRampToValueAtTime(SILENT, at + length)
  oscillator.connect(envelope).connect(context.destination)
  oscillator.start(at)
  oscillator.stop(at + length + 0.01)
  oscillator.onended = ended
  return { sources: [oscillator], output: envelope }
}

/** A second of white noise, made once for each context: the drums' rattle and the hat's. */
const noises = new WeakMap<AudioContext, AudioBuffer>()
function noiseOf(context: AudioContext): AudioBuffer {
  const made = noises.get(context)
  if (made) return made
  const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate)
  const samples = buffer.getChannelData(0)
  for (let index = 0; index < samples.length; index++) samples[index] = Math.random() * 2 - 1
  noises.set(context, buffer)
  return buffer
}

/** Noise through a filter at `hz` (a high-pass, or a band), `peak` loud and gone by `length` seconds. */
function noise(
  context: AudioContext,
  {
    hz,
    peak,
    length,
    type = 'highpass',
    q,
  }: { hz: number; peak: number; length: number; type?: BiquadFilterType; q?: number },
  at: number,
): Voice {
  const source = context.createBufferSource()
  source.buffer = noiseOf(context)
  const filter = context.createBiquadFilter()
  filter.type = type
  filter.frequency.value = hz
  if (q !== undefined) filter.Q.value = q
  const envelope = context.createGain()
  envelope.gain.setValueAtTime(SILENT, at)
  envelope.gain.exponentialRampToValueAtTime(Math.max(SILENT, peak), at + 0.001)
  envelope.gain.exponentialRampToValueAtTime(SILENT, at + length)
  source.connect(filter).connect(envelope).connect(context.destination)
  // Each strike from its own place in the noise, so no two hats are the same.
  source.start(at, Math.random() * 0.5)
  source.stop(at + length + 0.01)
  return { sources: [source], output: envelope }
}

/** Voices struck together as one sound, heard as `first`'s: it ends when `first` does. */
function together(ended: () => void, first: Voice, ...rest: readonly Voice[]): Voice {
  const [source] = first.sources
  if (source) source.onended = ended
  return {
    sources: [...first.sources, ...rest.flatMap((voice) => voice.sources)],
    output: first.output,
  }
}

const none = () => undefined

/**
 * The Metronome's click (ADR 0052): a woodblock's knock, a bright tone over a tick of noise; the
 * bar's first an octave higher, as a metronome's bell is.
 */
const playClick: Render<ClickSound> = (context, click, at, gain, ended) => {
  const peak = (click.accent ? CLICK_PEAK.accent : CLICK_PEAK.beat) * gain
  const hz = click.accent ? 2000 : 1000
  return together(
    ended,
    tone(context, { hz, peak, length: 0.06, type: 'triangle' }, at, none),
    noise(context, { hz, peak: peak * 0.5, length: 0.012, type: 'bandpass', q: 3 }, at),
  )
}

/** The Metronome's beep: a round tone, the bar's first an octave higher. */
const playBeep: Render<ClickSound> = (context, beep, at, gain, ended) =>
  tone(
    context,
    { hz: beep.accent ? 1760 : 880, peak: (beep.accent ? 0.3 : 0.22) * gain, length: 0.12 },
    at,
    ended,
  )

/** The kick: a sine thumping down from 120 Hz to 40 Hz, a click of its beater on top. */
const playKick: Render<ClickSound> = (context, kick, at, gain, ended) => {
  const peak = (kick.accent ? 1 : 0.85) * gain
  return together(
    ended,
    tone(context, { hz: 120, drop: 40, peak, length: 0.4 }, at, none),
    noise(context, { hz: 3000, peak: peak * 0.15, length: 0.008, type: 'lowpass' }, at),
  )
}

/** The snare: its wires' rattle, a band of noise, over the drum's short falling body. */
const playSnare: Render<ClickSound> = (context, snare, at, gain, ended) => {
  const peak = (snare.accent ? 0.6 : 0.5) * gain
  return together(
    ended,
    noise(context, { hz: 2500, peak, length: 0.2, type: 'bandpass', q: 0.7 }, at),
    tone(
      context,
      { hz: 220, drop: 160, peak: peak * 0.7, length: 0.1, type: 'triangle' },
      at,
      none,
    ),
  )
}

/** The closed hat: a tick of the brightest noise. */
const playHat: Render<ClickSound> = (context, hat, at, gain, ended) =>
  together(
    ended,
    noise(context, { hz: 8000, peak: (hat.accent ? 0.22 : 0.16) * gain, length: 0.05 }, at),
  )

/** How loud each recorded sound plays, on a beat and accented, and how far an accent is raised. */
const RECORDED_PEAK: Readonly<
  Record<RecordedSound, { readonly beat: number; readonly accent: number; readonly rate: number }>
> = {
  // The woodblock's accent is the same block a fifth higher, as a metronome's bell is higher.
  click: { beat: 0.5, accent: 0.6, rate: 1.5 },
  kick: { beat: 0.9, accent: 1, rate: 1 },
  snare: { beat: 0.7, accent: 0.8, rate: 1 },
  hat: { beat: 0.3, accent: 0.38, rate: 1 },
}

/** A recorded sound struck at `at`, as loud as its level and `gain` say. */
function playRecorded(
  context: AudioContext,
  buffer: AudioBuffer,
  sound: RecordedSound,
  click: ClickSound,
  at: number,
  gain: number,
  ended: () => void,
): Voice {
  const { beat, accent, rate } = RECORDED_PEAK[sound]
  const source = context.createBufferSource()
  source.buffer = buffer
  if (click.accent) source.playbackRate.value = rate
  const output = context.createGain()
  output.gain.value = (click.accent ? accent : beat) * gain
  source.connect(output).connect(context.destination)
  source.start(at)
  source.onended = ended
  return { sources: [source], output }
}

/**
 * How each beat's sound is made where its recording cannot be had (offline before the cache):
 * synthesised, nothing fetched. The Beeps are always these.
 */
/**
 * A kit's piece as the synthesised beat voices stand in for it, until its recorded kit is loaded
 * (R29 SND): the kick and the toms a kick, the snare and the rim a snare, the cymbals a hat.
 */
const DRUM_STAND_IN: Readonly<Record<KitPiece, ClickVoice>> = {
  kick: 'kick',
  snare: 'snare',
  rim: 'snare',
  hatClosed: 'hat',
  hatOpen: 'hat',
  hatPedal: 'hat',
  ride: 'hat',
  rideBell: 'hat',
  crash: 'hat',
  tomHigh: 'kick',
  tomMid: 'kick',
  tomFloor: 'kick',
}

const drumStandIn = (drum: DrumSound): ClickSound & { voice: ClickVoice } => ({
  kind: 'click',
  at: drum.at,
  accent: drum.velocity >= 0.8,
  voice: DRUM_STAND_IN[drum.piece],
})

const CLICK_VOICES: Readonly<Record<ClickVoice, Render<ClickSound>>> = {
  click: playClick,
  beep: playBeep,
  kick: playKick,
  snare: playSnare,
  hat: playHat,
}

const browserContext = (): AudioContext | null =>
  typeof AudioContext === 'function' ? new AudioContext() : null

const animationFrame = (look: () => void) => void requestAnimationFrame(look)

/** Whether the page has had a gesture, which lets it start audio; where the browser cannot say, yes. */
const browserActivated = () => navigator.userActivation?.hasBeenActive ?? true

/** Audio a browser holds back until a gesture: started suspended, or interrupted (iOS, by a call). */
/** How long a first sound waits for the recordings, in milliseconds, before it plays without them. */
const SOUNDS_WAIT = 1500

/** `promise`, or `ms` gone by: whichever comes first, the timer cleared either way. */
function within(promise: Promise<void>, ms: number): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined
  return Promise.race([
    promise,
    new Promise<void>((resolve) => (timer = setTimeout(resolve, ms))),
  ]).finally(() => clearTimeout(timer))
}

const heldBack = (context: AudioContext) =>
  context.state === 'suspended' || context.state === 'interrupted'

/** A recording's file, fetched once: its bytes, or null where it cannot be had (it stays silent). */
const recordingFiles = new Map<string, Promise<ArrayBuffer | null>>()
const fetchRecording = (src: string): Promise<ArrayBuffer | null> => {
  const known = recordingFiles.get(src)
  if (known) return known
  const fetched = fetch(src)
    .then((response) => (response.ok ? response.arrayBuffer() : null))
    .catch(() => null)
  recordingFiles.set(src, fetched)
  return fetched
}

/** Whether this is a phone: the stretch runs its cheaper preset there. */
const onPhone = () => !hasFinePointer()

/**
 * A recording's voice through signalsmith-stretch (R34, ADR 0034): the file decoded whole and handed
 * to one Stretch node, loaded only once a song with a recording plays, which keeps it on the audio
 * clock, slows it without smearing and shifts its pitch with Transpose; a gain after it for its
 * volume. Null where the file or the node cannot be had.
 */
export async function stretchVoice(
  context: AudioContext,
  src: string,
): Promise<RecordingVoice | null> {
  const [{ default: SignalsmithStretch }, bytes] = await Promise.all([
    import('signalsmith-stretch'),
    fetchRecording(src),
  ])
  if (!bytes) return null
  const file = await context.decodeAudioData(bytes.slice(0)).catch(() => null)
  if (!file) return null
  const node = await SignalsmithStretch(context, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [file.numberOfChannels],
  }).catch(() => null)
  if (!node) return null
  if (onPhone()) await node.configure({ blockMs: null, preset: 'cheaper' })
  await node.addBuffers(
    Array.from({ length: file.numberOfChannels }, (_, channel) => file.getChannelData(channel)),
  )
  const gain = context.createGain()
  node.connect(gain).connect(context.destination)
  return {
    play: ({ output, input, rate, semitones }) =>
      void node.schedule({ output, input, rate, semitones, active: true }),
    pause: (output) => void node.schedule({ output, active: false }),
    volume: (level) => {
      gain.gain.value = level
    },
  }
}

/**
 * The WebAudio adapter. No AudioContext exists before the first unlock or play, and none at all
 * where the browser has none: then every call does nothing. The keys sounding are followed on the
 * audio clock every animation frame while a note sounds.
 */
export function createWebAudioOutput({
  createContext = browserContext,
  frame = animationFrame,
  makeVoice = stretchVoice,
  pageNow = () => performance.now(),
  activated = browserActivated,
  loadSound = fetchSound,
  loadSamples = (context) => createSampleLoader({ context }),
}: {
  createContext?: () => AudioContext | null
  frame?: (look: () => void) => void
  /** A recording's voice in a context. */
  makeVoice?: (context: AudioContext, src: string) => Promise<RecordingVoice | null>
  /** The page's clock, in milliseconds. */
  pageNow?: () => number
  /** Whether a gesture has let the page start audio. */
  activated?: () => boolean
  /** How a recorded sound is fetched and decoded. */
  loadSound?: LoadSound
  /** The recorded instruments' loader for a context (R29 SND). */
  loadSamples?: (context: AudioContext) => SampleLoader
} = {}): AudioOutput {
  let context: AudioContext | null | undefined
  /** The recorded instruments: the grand, the light piano, the basses and the kit. */
  let instruments: Instruments | null = null
  const voices = new Set<Voice>()
  const recorded = createRecordedSounds(loadSound)
  /**
   * Each instrument's key's scheduled voice, and where it ends: a key struck again damps it (ADR 0034).
   */
  const strings = new Map<string, { readonly voice: Voice; readonly end: number }>()
  /** The keys the live voice holds sounding: apart from `voices`, so stop() never reaches them. */
  const held = new Map<Midi, Voice>()
  /** The keyboard's speaker the notes go to, while they go through the piano. */
  let piano: MidiSoundOutput | null = null
  /** The live voice's volume: a gain, the square of the Volume's share (ADR 0105's way). */
  let liveVolume = 1

  /** The AudioContext, created on first use; null where the browser has none. */
  const openContext = (): AudioContext | null => {
    if (context === undefined) {
      context = createContext()
      if (context) {
        void recorded.ready(context)
        instruments = createInstruments(context, loadSamples(context), context.destination)
      }
    }
    return context
  }

  const render = (sound: Sound, at: number, gain: number) => {
    // A sound turned right down is not played at all.
    if (gain <= 0) return
    // A note goes to the keyboard's speaker where one is chosen, struck as hard as its gain leaves it;
    // the pedal goes there as the pedal.
    if (sound.kind === 'pedal') {
      // In the browser the pedal is in the notes' lengths: each it holds sounds to its lift.
      piano?.render(sound, at)
      return
    }
    if (sound.kind === 'note' && piano) {
      piano.render({ ...sound, velocity: sound.velocity * gain }, at)
      return
    }
    if (!context) return
    const ended = () => voices.delete(voice)
    let voice: Voice
    if (sound.kind === 'note') {
      const instrument = sound.instrument ?? 'piano'
      const string = `${instrument}:${sound.midi}`
      const ringing = strings.get(string)
      if (ringing && ringing.end > at && voices.has(ringing.voice)) dampedAt(ringing.voice, at)
      // A bass note from its set; while that loads, and every piano note, the grand's or the light
      // piano's; the synthesised voice only where neither is in (R29 SND).
      const sampled =
        (instrument === 'piano'
          ? null
          : instruments?.bass(instrument, sound.midi, sound.velocity, at, gain)) ??
        instruments?.piano(sound.midi, sound.velocity, at, gain)
      if (sampled) {
        sampled.release(at + sound.duration)
        voice = recordedVoice(sampled, ended)
      } else voice = playNote(context, sound, at, gain, ended)
      strings.set(string, { voice, end: at + sound.duration })
    } else if (sound.kind === 'drum') {
      const sampled = instruments?.drum(sound.piece, sound.velocity, at, gain)
      if (sampled) voice = recordedVoice(sampled, ended)
      else {
        const click = drumStandIn(sound)
        voice = CLICK_VOICES[click.voice](context, click, at, gain * sound.velocity, ended)
      }
    } else {
      const name = sound.voice ?? 'click'
      const buffer = isRecordedSound(name) ? recorded.buffer(context, name) : null
      voice =
        buffer && isRecordedSound(name)
          ? playRecorded(context, buffer, name, sound, at, gain * (sound.gain ?? 1), ended)
          : CLICK_VOICES[name](context, sound, at, gain * (sound.gain ?? 1), ended)
    }
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
  const recordings = createRecordingPlayer({
    now,
    voiceFor: (src) => {
      const audio = openContext()
      return audio ? makeVoice(audio, src) : Promise.resolve(null)
    },
  })
  const voice = createLiveVoice({
    strike(key, gain, soft) {
      const audio = openContext()
      if (!audio) return
      if (heldBack(audio)) void audio.resume()
      // Under the soft pedal two thirds as loud and darker; every key as loud as the piano's Volume.
      const level = liveVolume * (soft ? SOFT_GAIN : 1)
      const out = soft ? softTone(audio, key) : audio.destination
      const sampled = instruments?.piano(key, gain, audio.currentTime, level, out)
      held.set(
        key,
        sampled ? recordedVoice(sampled, none) : holdNote(audio, key, gain * level, out),
      )
    },
    silence(key) {
      const sound = held.get(key)
      if (!context || !sound) return
      if (sound.release) sound.release(context.currentTime)
      else damped(context, sound)
      held.delete(key)
    },
    changed: keys.setLive,
  })

  return {
    async unlock() {
      const audio = openContext()
      // With no gesture behind it (a sound as a screen opens), resuming could only fail.
      if (audio && heldBack(audio) && activated()) await audio.resume()
      // The light piano and the grand's middle are loaded as the audio opens, in the background.
      void instruments?.warm()
      // The recorded clicks and drums are in before the first beat, or given up on soon.
      if (audio) await within(recorded.ready(audio), SOUNDS_WAIT)
    },
    play(sounds, at, gain) {
      const audio = openContext()
      if (!audio) return NOTHING_PLAYED
      if (heldBack(audio)) {
        // Audio held back with no gesture to start it (a round sounded as its trainer opens) is let
        // go, not queued to burst out at the first tap; where the browser lets it run, it plays.
        if (!activated()) return NOTHING_PLAYED
        void audio.resume()
      }
      const start = at ?? audio.currentTime + PLAY_DELAY
      // What the sounds strike is fetched as they are scheduled: in by the time they sound.
      instruments?.need(sounds)
      lookahead.add(sounds, start, gain)
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
      strings.clear()
    },
    press: voice.press,
    release: voice.release,
    pedal: voice.pedal,
    pedals: voice.pedals,
    pianoVolume(share) {
      liveVolume = Math.min(1, Math.max(0, share)) ** 2
    },
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
    loadRecording: (src) => void fetchRecording(src),
    playRecording: (src, play, volume) => recordings.play(src, play, volume),
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
