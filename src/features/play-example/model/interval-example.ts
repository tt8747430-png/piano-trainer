import {
  INTERVALS,
  midi,
  midiOf,
  note,
  printedNote,
  spellAbove,
  spellsAbove,
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
interface IntervalExample {
  readonly low: Midi
  readonly high: Midi
  readonly shown: ShownKeys
  /** The lower note then the upper, a half note each, in a bar of 4/4 with no key signature. */
  readonly music: TimedMusic
}

/** The lower key in the root's paint, named, as a chord's root is painted on the Chords page. */
const lowerMark = (root: SpelledNote): KeyMark => ({ tone: 'root', label: printedNote(root) })

/** The root alone, in octave 4, in the root's paint: the keys before an interval is played. */
export function intervalRoot(root: SpelledNote): ShownKeys {
  const low = midiOf(root, LOWER_OCTAVE)
  return { keys: [low], marks: new Map([[low, lowerMark(root)]]) }
}

/** Whether the interval over a root is written on its letter (the A9 over E♯ would need F𝄪𝄪: not). */
export const writesInterval = (root: SpelledNote, name: IntervalName): boolean =>
  spellsAbove(root, INTERVALS[name])

/**
 * An interval over a root in octave 4: the upper note spelled by letter steps from the root (the
 * minor 2nd over D♭ is E𝄫, since the letters are what number an interval), each key named, the
 * lower in the root's rose and the upper in the 5th's sage, as the Intervals board paints them.
 */
export function intervalExample(root: SpelledNote, name: IntervalName): IntervalExample {
  const interval = INTERVALS[name]
  const upper = spellAbove(root, interval)
  const low = midiOf(root, LOWER_OCTAVE)
  const high = midi(low + interval.semitones)
  // The upper first, so a unison's one key keeps the root's paint.
  const marks = new Map<Midi, KeyMark>([
    [high, { tone: '5th', label: printedNote(upper) }],
    [low, lowerMark(root)],
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
        { midi: low, spelled: root, hand: 'rh', startTick: 0, durationTicks: HALF_NOTE },
        {
          midi: high,
          spelled: upper,
          hand: 'rh',
          startTick: HALF_NOTE,
          durationTicks: HALF_NOTE,
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
