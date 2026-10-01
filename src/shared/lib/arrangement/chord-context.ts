import {
  midi,
  pitchClass,
  pitchClassOf,
  scaleIntervals,
  spellAbove,
  spellChord,
  spellInKey,
  type ChordQuality,
  type Finger,
  type Hand,
  type Inversion,
  type Key,
  type Midi,
  type PitchClass,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'
import type { FigureToken } from './types'
import {
  inversionPitchClasses,
  rightHandPitchClasses,
  voiceInversion,
  voiceLead,
} from './voice-leading'

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
  /** The chord voice-led from the previous one, or in the inversion asked for. */
  readonly voiced: readonly Midi[]
  /** The key the piece is played in, for its I, IV and V triads. */
  readonly key: Key
  /** The chord's tones as it spells them. */
  readonly tones: readonly Tone[]
  /** The root and the bass as the chord spells them. */
  readonly rootNote: SpelledNote
  readonly bassNote: SpelledNote
}

export interface ContextChord {
  readonly root: SpelledNote
  readonly bass: SpelledNote
  readonly tones: readonly Tone[]
}

const within = (semitones: number | undefined, fallback: number) =>
  semitones === undefined ? fallback : semitones % 12

export function chordContext(
  chord: ContextChord,
  previous: readonly Midi[] | null,
  key: Key,
  /** Every chord in this inversion; `null` voice-leads each from the last. */
  inversion: Inversion | null,
): ChordContext {
  const rootPc = pitchClassOf(chord.root)
  const bassPc = pitchClassOf(chord.bass)
  const third = within(chord.tones[1]?.semitones, 4)
  const fifth = within(chord.tones[2]?.semitones, 7)
  const seventh = within(chord.tones.find((tone) => tone.role === '7th')?.semitones, 10)
  const root = midi(55 + pitchClass(rootPc - 7))
  const voiced =
    inversion === null
      ? voiceLead(previous, rightHandPitchClasses(chord.tones))
      : voiceInversion(previous, inversionPitchClasses(chord.tones), inversion)
  return {
    third,
    fifth,
    seventh,
    major: third === 4,
    minor: third === 3,
    pitchClasses: chord.tones.map((tone) => tone.pitchClass),
    root,
    bass: midi(bassPc + (bassPc >= 7 ? 24 : 36)),
    triad: [root, root + third, root + fifth].map(midi),
    voiced,
    key,
    tones: chord.tones,
    rootNote: chord.root,
    bassNote: chord.bass,
  }
}

/** A key a token plays, spelled as it is written. */
export interface TokenNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
}

/** Keys of the chord, each as the chord spells it (any other as the key does). */
export function spellInChord(context: ChordContext, keys: readonly number[]): TokenNote[] {
  return keys.map((key) => ({
    midi: midi(key),
    spelled:
      context.tones.find((tone) => tone.pitchClass === pitchClass(key))?.note ??
      spellInKey(pitchClass(key), context.key),
  }))
}

/** A key some letters from a spelled note: its letter by the steps, its accidental by the key it is. */
const stepsFrom = (from: SpelledNote, steps: number, key: number): TokenNote => ({
  midi: midi(key),
  spelled: spellAbove(from, { steps, semitones: pitchClass(key - pitchClassOf(from)) }),
})

const KEY_TRIAD_ROOTS = {
  I: { steps: 0, semitones: 0 },
  IV: { steps: 3, semitones: 5 },
  V: { steps: 4, semitones: 7 },
} as const

/** The key's I, IV or V triad (minor I and IV in a minor key), voice-led from the chord, spelled from the key. */
function keyTriad(triad: keyof typeof KEY_TRIAD_ROOTS, context: ChordContext): TokenNote[] {
  const quality: ChordQuality = triad === 'V' || !context.key.minor ? 'maj' : 'min'
  const tones = spellChord(spellAbove(context.key.tonic, KEY_TRIAD_ROOTS[triad]), quality)
  return voiceLead(
    context.voiced,
    tones.map((tone) => tone.pitchClass),
  ).map((key) => ({
    midi: key,
    spelled:
      tones.find((tone) => tone.pitchClass === pitchClass(key))?.note ??
      spellInKey(pitchClass(key), context.key),
  }))
}

/** The lowest note moved up an octave, `times` times. */
function invert(notes: readonly number[], times: number): number[] {
  const inverted = [...notes].sort((a, b) => a - b)
  for (let i = 0; i < times; i++) inverted.push((inverted.shift() ?? 0) + 12)
  return inverted
}

type Stack = Pick<ChordContext, 'third' | 'fifth' | 'seventh'>

/** Degrees 1–15 above a note, on a stack's 3rd, 5th and 7th. */
function degreeAbove(degree: number, stack: Stack): number {
  const steps = [0, 2, stack.third, 5, stack.fifth, 9, stack.seventh]
  return (steps[(degree - 1) % 7] ?? 0) + 12 * Math.floor((degree - 1) / 7)
}

/** The tones a chord stacks from its bass: its root, 3rd, 5th and 7th, never a tension. */
const STACKED = new Set(['root', '3rd', '5th', '7th'])

/**
 * The 3rd, 5th and 7th above the bass: the chord's own over its root; over another bass, the chord's
 * tones stacked up from it (Dm/F: A, then D), so every note the left hand plays is the chord's.
 */
function stackFromBass(context: ChordContext): Stack {
  const bass = pitchClass(context.bass)
  if (bass === pitchClass(context.root)) return context
  const above = [
    ...new Set(
      context.tones
        .filter((tone) => STACKED.has(tone.role))
        .map((tone) => pitchClass(tone.pitchClass - bass)),
    ),
  ]
    .filter((semitones) => semitones !== 0)
    .sort((a, b) => a - b)
  return {
    third: above[0] ?? context.third,
    fifth: above[1] ?? context.fifth,
    seventh: above[2] ?? context.seventh,
  }
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

/** A figure token's keys against the chord being played, each spelled (spec §2.2). */
export function tokenNotes(token: FigureToken, context: ChordContext): TokenNote[] {
  switch (token.kind) {
    case 'chord':
      return spellInChord(context, context.voiced)
    case 'triad':
      return spellInChord(context, invert(context.triad, token.inversion))
    case 'triad-octave':
      return spellInChord(
        context,
        context.triad.map((m) => m + 12),
      )
    case 'upper-pair':
      return spellInChord(context, context.triad.slice(1))
    case 'voice': {
      const count = context.voiced.length
      const voice = context.voiced[token.index % count] ?? context.root
      return spellInChord(context, [voice + 12 * Math.floor(token.index / count)])
    }
    case 'key-triad':
      return keyTriad(token.triad, context)
    case 'bass-degree': {
      const key = context.bass + degreeAbove(token.degree, stackFromBass(context))
      // The 3rd, 5th and 7th are chord tones, spelled as the chord spells them.
      const step = (token.degree - 1) % 7
      return step > 0 && step % 2 === 0
        ? spellInChord(context, [key])
        : [stepsFrom(context.bassNote, token.degree - 1, key)]
    }
    case 'scale-degree':
      return [
        stepsFrom(
          context.rootNote,
          token.degree,
          context.root + scaleStepAbove(token.degree, context),
        ),
      ]
    case 'below-root':
      return [
        stepsFrom(
          context.rootNote,
          token.semitones === 3 ? -2 : -1,
          context.root - token.semitones,
        ),
      ]
    case 'chord-degree':
      return [
        stepsFrom(
          context.rootNote,
          token.degree - 1,
          context.root + degreeAbove(token.degree, context),
        ),
      ]
  }
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
