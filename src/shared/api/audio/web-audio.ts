import type { ClickSound, NoteSound, Sound } from '@/shared/lib/schedule'
import { createLookahead } from './lookahead'
import { PLAY_DELAY, type AudioOutput } from './types'

/** The piano voice: a triangle with two sine partials, through a closing low-pass filter. */
const PARTIALS = [
  { multiple: 1, type: 'triangle', level: 1 },
  { multiple: 2, type: 'sine', level: 0.35 },
  { multiple: 3, type: 'sine', level: 0.12 },
] as const
const SILENT = 0.0001

const frequencyOf = (note: NoteSound) => 440 * 2 ** ((note.midi - 69) / 12)

/** Builds a sound's nodes and returns the gain that silences it; `ended` runs when it is over. */
type Render<S> = (context: AudioContext, sound: S, at: number, ended: () => void) => GainNode

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
  for (const { multiple, type, level } of PARTIALS) {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = type
    oscillator.frequency.value = frequency * multiple
    gain.gain.value = level
    oscillator.connect(gain).connect(filter)
    oscillator.start(at)
    oscillator.stop(at + note.duration + 0.25)
    if (multiple === 1) oscillator.onended = ended
  }
  filter.connect(envelope).connect(context.destination)
  return envelope
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
  return gain
}

const browserContext = (): AudioContext | null =>
  typeof AudioContext === 'function' ? new AudioContext() : null

/**
 * The WebAudio adapter. No AudioContext exists before the first unlock or play, and none at all
 * where the browser has none: then every call does nothing.
 */
export function createWebAudioOutput({
  createContext = browserContext,
}: { createContext?: () => AudioContext | null } = {}): AudioOutput {
  let context: AudioContext | null | undefined
  const voices = new Set<GainNode>()

  const contextNow = (): AudioContext | null => {
    if (context === undefined) context = createContext()
    return context
  }

  const render = (sound: Sound, at: number) => {
    if (!context) return
    const ended = () => voices.delete(gain)
    const gain =
      sound.kind === 'note'
        ? playNote(context, sound, at, ended)
        : playClick(context, sound, at, ended)
    voices.add(gain)
  }

  const lookahead = createLookahead({ now: () => context?.currentTime ?? 0, render })

  return {
    async unlock() {
      const audio = contextNow()
      if (audio?.state === 'suspended') await audio.resume()
    },
    play(sounds, at) {
      const audio = contextNow()
      if (!audio) return
      if (audio.state === 'suspended') void audio.resume()
      lookahead.add(sounds, at ?? audio.currentTime + PLAY_DELAY)
    },
    stop() {
      lookahead.clear()
      if (!context) return
      for (const gain of voices) {
        gain.gain.cancelScheduledValues(0)
        gain.gain.setValueAtTime(0, context.currentTime)
        gain.disconnect()
      }
      voices.clear()
    },
    now: () => context?.currentTime ?? 0,
  }
}
