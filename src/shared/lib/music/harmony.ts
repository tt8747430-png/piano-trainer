import { qualityIntervals, type ChordQuality } from './chord'
import { letterIndex, type SpelledNote } from './note'
import type { Numeral } from './numerals'

/**
 * What a chord does in its key: rests at home (tonic), leads away towards the dominant
 * (subdominant, or predominant), or pulls back home (dominant). The three functions of tonal harmony, as theory
 * books colour a progression's chords.
 */
export const HARMONIC_FUNCTIONS = ['tonic', 'subdominant', 'dominant'] as const
export type HarmonicFunction = (typeof HARMONIC_FUNCTIONS)[number]

const hasSemitones = (quality: ChordQuality, ...semitones: number[]): boolean => {
  const own = qualityIntervals(quality).map((interval) => interval.semitones % 12)
  return semitones.every((each) => own.includes(each))
}

/** A dominant 7th's frame (a major 3rd and a minor 7th): V7, V9, V7♭9, a backdoor ♭VII7. */
const isDominantSeventh = (quality: ChordQuality): boolean => hasSemitones(quality, 4, 10)
/** A diminished 5th over a minor 3rd: vii°, vii°7, viiø7. */
const isDiminished = (quality: ChordQuality): boolean => hasSemitones(quality, 3, 6)

/**
 * A numeral's function in a major or minor key, by its degree: I, iii and vi (i, III, VI) tonic; ii
 * and IV (ii°, iv) subdominant; V and vii° dominant. In a minor key the subtonic VII is a dominant.
 * Borrowed chords in a major key read as their family: ♭II (the Neapolitan), ♭VI and ♭VII
 * subdominant, ♭III tonic, a ♭VII7 the backdoor dominant. An applied chord is what it is in its own
 * key (`V/V` a dominant, `ii/V` a subdominant).
 */
export function harmonicFunction(numeral: Numeral, minor: boolean): HarmonicFunction {
  const { degree, shift, quality } = numeral
  if (numeral.of) return harmonicFunction({ degree, shift, quality }, numeral.of.minor)
  switch (degree) {
    case 0:
    case 2:
      return 'tonic'
    case 1:
      return 'subdominant'
    case 3:
      // A raised 4th's diminished chord leads to V: the leading tone of the dominant.
      return shift > 0 && isDiminished(quality) ? 'dominant' : 'subdominant'
    case 4:
      return 'dominant'
    case 5:
      return shift < 0 ? 'subdominant' : 'tonic'
    default:
      // The 7th: the leading-tone chord and the subtonic dominant; a major key's ♭VII its plagal colour.
      return shift < 0 && !minor && !isDominantSeventh(quality) && !isDiminished(quality)
        ? 'subdominant'
        : 'dominant'
  }
}

/** How far a root moves, by letters: a 4th up is a 5th down, a 6th up a 3rd down, a 7th up a 2nd down. */
export const ROOT_STEPS = ['fifth', 'third', 'second'] as const
export type RootStep = (typeof ROOT_STEPS)[number]

/** A root's move to the next chord's root: by a 5th, a 3rd or a 2nd, down or up. */
export interface RootMove {
  readonly by: RootStep
  readonly down: boolean
}

/** Each count of letters up, 1 to 6, as the move it is. */
const MOVES: readonly RootMove[] = [
  { by: 'second', down: false },
  { by: 'third', down: false },
  { by: 'fifth', down: true },
  { by: 'fifth', down: false },
  { by: 'third', down: true },
  { by: 'second', down: true },
]

/** The move from one root to the next, counted by letters; none where the letter stays (C to C♯). */
export function rootMove(from: SpelledNote, to: SpelledNote): RootMove | null {
  const up = (letterIndex(to.letter) - letterIndex(from.letter) + 7) % 7
  return MOVES[up - 1] ?? null
}

const STEP_NUMBERS: Readonly<Record<RootStep, number>> = { fifth: 5, third: 3, second: 2 }

/** A move as an arrow and its interval's number: `↓5`, `↑2`. */
export const rootMoveText = ({ by, down }: RootMove): string =>
  `${down ? '↓' : '↑'}${STEP_NUMBERS[by]}`

/**
 * The moves that drive harmony forward: a 5th down (the strongest), a 3rd down (two notes kept) and
 * a 2nd up (none kept). Their opposites step back.
 */
export const isStrongMove = ({ by, down }: RootMove): boolean => (by === 'second' ? !down : down)
