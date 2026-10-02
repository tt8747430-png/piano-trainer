import {
  MIDDLE_C,
  midi,
  PIANO,
  pitchClassOf,
  scaleChordAt,
  scaleHasChords,
  spellChord,
  spellScale,
  type Chord,
  type Finger,
  type Hand,
  type Midi,
  type ScaleKind,
  type SpelledNote,
  type Tick,
  type Tone,
} from '@/shared/lib/music'
import type { LineNote } from './performance'
import { BAR, EIGHTH } from './time'

/** The whole numbers from `from` to `to`, both kept, counting up or down. */
export function range(from: number, to: number): number[] {
  const step = to >= from ? 1 : -1
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => from + i * step)
}

/** A run up and back down the same keys, its top played once. */
export const upAndBack = <T>(up: readonly T[]): T[] => [...up, ...[...up].reverse().slice(1)]

const BOTH_HANDS: readonly Hand[] = ['rh', 'lh']

/** A key of the line, as it is written, and the finger on it where the method gives one. */
export interface Played {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly finger?: Finger
}

/**
 * The right hand's tonic for a run of `octaves`: at or above middle C, an octave lower only when the
 * run's top would leave the keyboard.
 */
export function tonicKey(root: SpelledNote, octaves = 1): Midi {
  const tonic = MIDDLE_C + pitchClassOf(root)
  return midi(tonic + 11 + 12 * octaves > PIANO.to ? tonic - 12 : tonic)
}

/**
 * How far below the right hand the left plays a run: an octave, or two once the run spans two
 * octaves or more, so each hand stays on its own staff.
 */
export const leftHandBelow = (octaves: number): number => (octaves >= 2 ? 24 : 12)

/** A scale's notes by degree from its tonic's key (0 the tonic), past the octave either way. */
export const scaleDegrees = (root: SpelledNote, kind: ScaleKind, tonic: Midi) =>
  toneDegrees(spellScale(root, kind), tonic)

/** Any line of tones above a tonic (a scale's own, or Barry Harris's 6th-diminished) by degree. */
export function toneDegrees(tones: readonly Tone[], tonic: Midi) {
  return (degree: number): Played => {
    const count = tones.length
    const tone = tones[((degree % count) + count) % count]
    if (!tone) throw new RangeError(`No tone on degree ${degree}`)
    return {
      midi: midi(tonic + tone.semitones + 12 * Math.floor(degree / count)),
      spelled: tone.note,
    }
  }
}

/** Each key with its finger, where there is one. */
export const fingered = (keys: readonly Played[], fingers: readonly Finger[]): Played[] =>
  keys.map((key, i) => {
    const finger = fingers[i]
    return finger === undefined ? key : { ...key, finger }
  })

/** The left hand's keys `below` semitones under the right's, without the right's fingers. */
export const handBelow = (keys: readonly Played[], below = 12): Played[] =>
  keys.map(({ finger: _finger, ...key }) => ({ ...key, midi: midi(key.midi - below) }))

/**
 * Each hand's keys one after another in 8ths from `from`, both hands together, the last held to the
 * end of its bar.
 */
export function inEighths(
  hands: Readonly<Partial<Record<Hand, readonly Played[]>>>,
  from: Tick = 0,
): LineNote[] {
  return BOTH_HANDS.flatMap((hand) =>
    (hands[hand] ?? []).map((key, i, keys) => {
      const startTick = from + i * EIGHTH
      const last = i === keys.length - 1
      const durationTicks = last ? Math.ceil((startTick + EIGHTH) / BAR) * BAR - startTick : EIGHTH
      return { ...key, hand, startTick, durationTicks }
    }),
  )
}

/**
 * Each hand's chords one after another, `every` ticks apart from `from`, the last held to the end of
 * its bar.
 */
export function inBeats(
  hands: Readonly<Partial<Record<Hand, readonly (readonly Played[])[]>>>,
  every: Tick,
  from: Tick = 0,
): LineNote[] {
  return BOTH_HANDS.flatMap((hand) =>
    (hands[hand] ?? []).flatMap((keys, i, chords) => {
      const startTick = from + i * every
      const last = i === chords.length - 1
      const durationTicks = last ? Math.ceil((startTick + every) / BAR) * BAR - startTick : every
      return keys.map((key) => ({ ...key, hand, startTick, durationTicks }))
    }),
  )
}

/** The left hand's shell of a 7th chord: its root (F2 to E3) and its 7th above it. */
export function shell(chord: Chord): Played[] {
  const pc = pitchClassOf(chord.root)
  const rootKey = midi(MIDDLE_C - 24 + pc + (pc < 5 ? 12 : 0))
  const seventh = spellChord(chord.root, chord.quality).find((tone) => tone.degree.endsWith('7'))
  if (!seventh) throw new RangeError(`${chord.quality} has no 7th to hold`)
  return [
    { midi: rootKey, spelled: chord.root },
    { midi: midi(rootKey + seventh.semitones), spelled: seventh.note },
  ]
}

/** The chord a scale is over: its tonic triad, or a pentatonic's or blues scale's major or minor one. */
export function tonicChord(root: SpelledNote, kind: ScaleKind): Chord {
  if (scaleHasChords(kind)) return scaleChordAt(root, kind, 0, 3)
  const degrees = spellScale(root, kind).map((tone) => tone.degree)
  return { root, quality: degrees.includes('♭3') && !degrees.includes('3') ? 'min' : 'maj' }
}
