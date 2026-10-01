import {
  MIDDLE_C,
  midi,
  pitchClassOf,
  scaleChordAt,
  scaleHasChords,
  spellScale,
  TICKS_PER_BEAT,
  spellAbove,
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

export const EIGHTH: Tick = TICKS_PER_BEAT / 2
export const BAR: Tick = 4 * TICKS_PER_BEAT

/** A key of the line, as it is written, and the finger on it where the method gives one. */
export interface Played {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly finger?: Finger
}

/**
 * The right hand's tonic: at or above middle C for one or two octaves, an octave lower for three or
 * four, so the run stays on the keyboard; the left hand plays an octave below it.
 */
export const tonicKey = (root: SpelledNote, octaves = 1): Midi =>
  midi(MIDDLE_C + pitchClassOf(root) - (octaves >= 3 ? 12 : 0))

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

/** Keys an octave away: the left hand's under the right's. */
export const octaveBelow = (keys: readonly Played[]): Played[] =>
  keys.map(({ finger: _finger, ...key }) => ({ ...key, midi: midi(key.midi - 12) }))

/**
 * Each hand's keys one after another in 8ths from `from`, both hands together, the last held to the
 * end of its bar.
 */
export function inEighths(
  hands: Readonly<Partial<Record<Hand, readonly Played[]>>>,
  from: Tick = 0,
): LineNote[] {
  return (Object.entries(hands) as [Hand, readonly Played[]][]).flatMap(([hand, keys]) =>
    keys.map((key, i) => {
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
  return (Object.entries(hands) as [Hand, readonly (readonly Played[])[]][]).flatMap(
    ([hand, chords]) =>
      chords.flatMap((keys, i) => {
        const startTick = from + i * every
        const last = i === chords.length - 1
        const durationTicks = last ? Math.ceil((startTick + every) / BAR) * BAR - startTick : every
        return keys.map((key) => ({ ...key, hand, startTick, durationTicks }))
      }),
  )
}

/** The left hand's shell of a chord: its root (F2 to E3) and its 7th, `seventh` semitones above. */
export function shell(chord: Chord, seventh: number): Played[] {
  const pc = pitchClassOf(chord.root)
  const rootKey = midi(MIDDLE_C - 24 + pc + (pc < 5 ? 12 : 0))
  const top = spellAbove(chord.root, { steps: 6, semitones: seventh })
  return [
    { midi: rootKey, spelled: chord.root },
    { midi: midi(rootKey + seventh), spelled: top },
  ]
}

/** The chord a scale is over: its tonic triad, or a pentatonic's or blues scale's major or minor one. */
export function tonicChord(root: SpelledNote, kind: ScaleKind): Chord {
  if (scaleHasChords(kind)) return scaleChordAt(root, kind, 0, 3)
  const degrees = spellScale(root, kind).map((tone) => tone.degree)
  return { root, quality: degrees.includes('♭3') && !degrees.includes('3') ? 'min' : 'maj' }
}
