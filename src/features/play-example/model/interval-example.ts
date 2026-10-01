import {
  INTERVALS,
  midi,
  midiOf,
  note,
  spellAbove,
  TICKS_PER_BEAT,
  type IntervalName,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import type { KeyMark, ShownKeys } from '@/shared/ui'

/** The octave an interval's lower note is written in: middle C's. */
const LOWER_OCTAVE = 4
const HALF_NOTE = 2 * TICKS_PER_BEAT

/** An interval over a root: its two keys, as the keys show them, and as a staff writes them. */
export interface IntervalExample {
  readonly low: Midi
  readonly high: Midi
  readonly shown: ShownKeys
  /** The lower note then the upper, a half note each, in a bar of 4/4 with no key signature. */
  readonly music: TimedMusic
}

const TONIC: KeyMark = { tone: 'tonic', label: '1' }

/** The root alone, in octave 4, marked as the tonic: the keys before an interval is played. */
export function intervalRoot(root: SpelledNote): ShownKeys {
  const low = midiOf(root, LOWER_OCTAVE)
  return { keys: [low], marks: new Map([[low, TONIC]]) }
}

/**
 * An interval over a root in octave 4: the upper note spelled by letter steps from the root (the
 * minor 2nd over D♭ is E𝄫, since the letters are what number an interval), the lower key marked as
 * the tonic and the upper labelled with its degree.
 */
export function intervalExample(root: SpelledNote, name: IntervalName): IntervalExample {
  const interval = INTERVALS[name]
  const upper = spellAbove(root, interval)
  const low = midiOf(root, LOWER_OCTAVE)
  const high = midi(low + interval.semitones)
  // The upper first, so a unison's one key keeps the tonic's 1.
  const marks = new Map<Midi, KeyMark>([
    [high, { tone: 'scale', label: interval.degree }],
    [low, TONIC],
  ])
  return {
    low,
    high,
    shown: { keys: high === low ? [low] : [low, high], marks },
    music: {
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [{ startTick: 0, beats: 4 }],
      notes: [
        { midi: low, spelled: root, hand: 'rh', startTick: 0, durationTicks: HALF_NOTE, roll: 0 },
        {
          midi: high,
          spelled: upper,
          hand: 'rh',
          startTick: HALF_NOTE,
          durationTicks: HALF_NOTE,
          roll: 0,
        },
      ],
      chords: [],
    },
  }
}

/** Whole tones, a half written ½: 3 semitones are 1½. */
export function tonesText(semitones: number): string {
  const whole = Math.floor(semitones / 2)
  if (semitones % 2 === 0) return String(whole)
  return whole === 0 ? '½' : `${whole}½`
}
