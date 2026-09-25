import {
  midi,
  pitchClass,
  pitchClassOf,
  qualityIntervals,
  scaleIntervals,
  type ChordQuality,
  type Finger,
  type Hand,
  type Key,
  type Midi,
  type PitchClass,
  type Tone,
} from '@/shared/lib/music'
import type { FigureToken } from './types'
import { rightHandPitchClasses, voiceLead } from './voice-leading'

/** Everything the figure tokens need to know about the chord being played. */
export interface ChordContext {
  /** Semitones above the root (within the octave) of the chord's 3rd, 5th and 7th. */
  readonly third: number
  readonly fifth: number
  readonly seventh: number
  readonly major: boolean
  readonly minor: boolean
  readonly pitchClasses: readonly PitchClass[]
  /** The root in the right hand's register, G3–F♯4. */
  readonly root: Midi
  /** The bass in the left hand's register, G1–F♯2. */
  readonly bass: Midi
  /** The close triad from `root`. */
  readonly triad: readonly Midi[]
  /** The chord voice-led from the previous one. */
  readonly voiced: readonly Midi[]
  /** The key the piece is played in, for its I, IV and V triads. */
  readonly key: Key
}

export interface ContextChord {
  readonly root: PitchClass
  readonly bass: PitchClass
  readonly tones: readonly Tone[]
}

const within = (semitones: number | undefined, fallback: number) =>
  semitones === undefined ? fallback : semitones % 12

export function chordContext(
  chord: ContextChord,
  previous: readonly Midi[] | null,
  key: Key,
): ChordContext {
  const third = within(chord.tones[1]?.semitones, 4)
  const fifth = within(chord.tones[2]?.semitones, 7)
  const seventh = within(chord.tones.find((tone) => tone.role === '7th')?.semitones, 10)
  const root = midi(55 + pitchClass(chord.root - 7))
  const voiced = voiceLead(previous, rightHandPitchClasses(chord.tones))
  return {
    third,
    fifth,
    seventh,
    major: third === 4,
    minor: third === 3,
    pitchClasses: chord.tones.map((tone) => tone.pitchClass),
    root,
    bass: midi(chord.bass + (chord.bass >= 7 ? 24 : 36)),
    triad: [root, root + third, root + fifth].map(midi),
    voiced,
    key,
  }
}

const KEY_TRIAD_DEGREES = { I: 0, IV: 5, V: 7 } as const

/** The key's I, IV or V triad (minor I and IV in a minor key), voice-led from the chord. */
function keyTriad(triad: keyof typeof KEY_TRIAD_DEGREES, context: ChordContext): Midi[] {
  const quality: ChordQuality = triad === 'V' || context.key.mode === 'major' ? 'maj' : 'min'
  const root = pitchClassOf(context.key.tonic) + KEY_TRIAD_DEGREES[triad]
  return voiceLead(
    context.voiced,
    qualityIntervals(quality).map((interval) => pitchClass(root + interval.semitones)),
  )
}

/** The lowest note moved up an octave, `times` times. */
function invert(notes: readonly number[], times: number): number[] {
  const inverted = [...notes].sort((a, b) => a - b)
  for (let i = 0; i < times; i++) inverted.push((inverted.shift() ?? 0) + 12)
  return inverted
}

/** Degrees 1–15 above a root, on the chord's own 3rd, 5th and 7th. */
function degreeAbove(degree: number, context: ChordContext): number {
  const steps = [0, 2, context.third, 5, context.fifth, 9, context.seventh]
  return (steps[(degree - 1) % 7] ?? 0) + 12 * Math.floor((degree - 1) / 7)
}

const semitonesOf = (kind: 'major' | 'natural') =>
  scaleIntervals(kind).map((interval) => interval.semitones)
const MAJOR_SCALE = semitonesOf('major')
const MINOR_SCALE = semitonesOf('natural')

/** `steps` up the chord's major or minor scale from its root. */
function scaleStepAbove(steps: number, context: ChordContext): number {
  const scale = context.minor ? MINOR_SCALE : MAJOR_SCALE
  return (scale[((steps % 7) + 7) % 7] ?? 0) + 12 * Math.floor(steps / 7)
}

export function tokenMidis(token: FigureToken, context: ChordContext): Midi[] {
  const played = ((): readonly number[] => {
    switch (token.kind) {
      case 'chord':
        return context.voiced
      case 'triad':
        return invert(context.triad, token.inversion)
      case 'triad-octave':
        return context.triad.map((m) => m + 12)
      case 'upper-pair':
        return context.triad.slice(1)
      case 'voice': {
        const count = context.voiced.length
        const voice = context.voiced[token.index % count] ?? context.root
        return [voice + 12 * Math.floor(token.index / count)]
      }
      case 'key-triad':
        return keyTriad(token.triad, context)
      case 'bass-degree':
        return [context.bass + degreeAbove(token.degree, context)]
      case 'scale-degree':
        return [context.root + scaleStepAbove(token.degree, context)]
      case 'below-root':
        return [context.root - token.semitones]
      case 'chord-degree':
        return [context.root + degreeAbove(token.degree, context)]
    }
  })()
  return played.map(midi)
}

const RIGHT_FINGERS: Readonly<Record<number, readonly Finger[]>> = {
  3: [1, 3, 5],
  4: [1, 2, 3, 5],
}
const LEFT_FINGERS: Readonly<Record<number, readonly Finger[]>> = {
  2: [5, 1],
  3: [5, 3, 1],
  4: [5, 4, 2, 1],
}

/** Two right-hand notes are fingered by their span: a 3rd 3–5, up to a 5th 2–5, wider 1–5. */
const rightPair = (span: number): readonly Finger[] =>
  span <= 4 ? [3, 5] : span <= 7 ? [2, 5] : [1, 5]

/**
 * Fingers for 2–4 notes played together, lowest first, in the order the notes were given; nothing for
 * a single note or more than four.
 */
export function autoFingers(midis: readonly Midi[], hand: Hand): (Finger | undefined)[] {
  const byPitch = midis.map((m, i) => ({ m, i })).sort((a, b) => a.m - b.m)
  const span = (byPitch.at(-1)?.m ?? 0) - (byPitch[0]?.m ?? 0)
  const fingers =
    hand === 'lh'
      ? LEFT_FINGERS[midis.length]
      : midis.length === 2
        ? rightPair(span)
        : RIGHT_FINGERS[midis.length]
  const assigned: (Finger | undefined)[] = midis.map(() => undefined)
  byPitch.forEach(({ i }, rank) => {
    assigned[i] = fingers?.[rank]
  })
  return assigned
}
