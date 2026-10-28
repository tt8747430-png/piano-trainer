import {
  CIRCLE_OF_FIFTHS,
  keySignature,
  midi,
  numeralChord,
  parseNumerals,
  pitchClassOf,
  spellChord,
  type Key,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'

/**
 * The cadences the cadence quiz asks: an authentic cadence where the level does not split it, its
 * perfect and imperfect kinds where it does, then the plagal, half, deceptive and Phrygian half.
 */
export const CADENCES = [
  'authentic',
  'perfect',
  'imperfect',
  'plagal',
  'half',
  'deceptive',
  'phrygian',
] as const
export type Cadence = (typeof CADENCES)[number]

/** A chord of a cadence as four voices play it: its numeral, then each voice's chord tone and key. */
interface WrittenChord {
  readonly numeral: string
  /** Bass first: the chord tone (0 root, 1 3rd, 2 5th) and its key, in semitones from middle C. */
  readonly voices: readonly (readonly [tone: number, semitones: number])[]
}

/** A cadence as written over a tonic on C: the tonic that sets the key, then its two chords. */
interface CadenceShape {
  readonly chords: readonly [WrittenChord, WrittenChord]
  /**
   * The chord the Play drill asks for, the one that tells the cadence: the one before the last (the
   * dominant of an authentic cadence) or the last (where a half cadence stops), in the inversion it
   * needs where it needs one.
   */
  readonly plays: { readonly at: 0 | 1; readonly inversion: number | null }
}

const chord = (numeral: string, ...voices: (readonly [number, number])[]): WrittenChord => ({
  numeral,
  voices,
})

// Each voicing: the bass in the left hand, three voices close in the right, the common tones held
// and the rest moving by step, as the cadences lesson writes them.
const MAJOR_TONIC = chord('I', [0, -12], [1, 4], [2, 7], [0, 12])
const MINOR_TONIC = chord('i', [0, -12], [1, 3], [2, 7], [0, 12])
const DOMINANT = chord('V', [0, -17], [2, 2], [0, 7], [1, 11])

/** Root position both, the tonic on top: the full stop. */
const perfect = (tonic: WrittenChord): CadenceShape => ({
  chords: [DOMINANT, tonic],
  plays: { at: 0, inversion: 0 },
})

const SHAPES: Readonly<Record<'major' | 'minor', Partial<Record<Cadence, CadenceShape>>>> = {
  major: {
    authentic: { ...perfect(MAJOR_TONIC), plays: { at: 0, inversion: null } },
    perfect: perfect(MAJOR_TONIC),
    // The dominant over its 3rd, the leading note rising in the bass; the tonic's 3rd on top.
    imperfect: {
      chords: [
        chord('V', [1, -13], [0, -5], [2, 2], [0, 7]),
        chord('I', [0, -12], [2, -5], [0, 0], [1, 4]),
      ],
      plays: { at: 0, inversion: 1 },
    },
    plagal: {
      chords: [chord('IV', [0, -19], [0, 5], [1, 9], [2, 12]), MAJOR_TONIC],
      plays: { at: 0, inversion: null },
    },
    half: {
      chords: [
        chord('IV', [0, -7], [2, 0], [0, 5], [1, 9]),
        chord('V', [0, -17], [1, -1], [2, 2], [0, 7]),
      ],
      plays: { at: 1, inversion: null },
    },
    deceptive: {
      chords: [DOMINANT, chord('vi', [0, -15], [2, 4], [0, 9], [1, 12])],
      plays: { at: 1, inversion: null },
    },
  },
  minor: {
    authentic: { ...perfect(MINOR_TONIC), plays: { at: 0, inversion: null } },
    perfect: perfect(MINOR_TONIC),
    imperfect: {
      chords: [
        chord('V', [1, -13], [0, -5], [2, 2], [0, 7]),
        chord('i', [0, -12], [2, -5], [0, 0], [1, 3]),
      ],
      plays: { at: 0, inversion: 1 },
    },
    plagal: {
      chords: [chord('iv', [0, -19], [0, 5], [1, 8], [2, 12]), MINOR_TONIC],
      plays: { at: 0, inversion: null },
    },
    half: {
      chords: [
        chord('iv', [0, -7], [2, 0], [0, 5], [1, 8]),
        chord('V', [0, -17], [1, -1], [2, 2], [0, 7]),
      ],
      plays: { at: 1, inversion: null },
    },
    deceptive: {
      chords: [DOMINANT, chord('VI', [0, -16], [2, 3], [0, 8], [1, 12])],
      plays: { at: 1, inversion: null },
    },
    // iv in first inversion: the bass falls a half step, ♭6 to 5, onto the dominant.
    phrygian: {
      chords: [
        chord('iv', [1, -16], [2, 0], [0, 5], [1, 8]),
        chord('V', [0, -17], [1, -1], [2, 2], [0, 7]),
      ],
      plays: { at: 0, inversion: 1 },
    },
  },
}

/** One key of a voiced chord: what sounds and how it is spelled. */
export interface VoicedKey {
  readonly midi: Midi
  readonly note: SpelledNote
}

/** A chord of a cadence in a key: its numeral, its inversion, and its keys from the bass up. */
export interface VoicedChord {
  readonly numeral: string
  readonly root: SpelledNote
  readonly inversion: number
  readonly keys: readonly VoicedKey[]
}

/** A cadence in a key: the tonic that sets the key, then the cadence's two chords. */
export interface CadenceVoicing {
  readonly tonic: VoicedChord
  readonly chords: readonly [VoicedChord, VoicedChord]
}

const shapeOf = (cadence: Cadence, key: Key): CadenceShape | undefined =>
  SHAPES[key.minor ? 'minor' : 'major'][cadence]

/** Whether a cadence is one a key has: the Phrygian half cadence is a minor key's. */
export const cadenceIn = (cadence: Cadence, key: Key): boolean =>
  shapeOf(cadence, key) !== undefined

/** A key's tonic as far from C as it lies, up to a tritone up or a fourth down: the keys stay mid-piano. */
const shiftOf = (key: Key): number => {
  const pc = pitchClassOf(key.tonic)
  return pc <= 6 ? pc : pc - 12
}

function voice(written: WrittenChord, key: Key): VoicedChord {
  const [numeral] = parseNumerals(written.numeral) ?? []
  if (!numeral) throw new RangeError(`${written.numeral} is not a numeral`)
  const { root, quality } = numeralChord(numeral, key, 'triads')
  const tones = spellChord(root, quality)
  const shift = shiftOf(key)
  const keys = written.voices.map(([index, semitones]) => {
    const tone = tones[index]
    if (!tone) throw new RangeError(`${written.numeral} has no tone ${index}`)
    return { midi: midi(60 + shift + semitones), note: tone.note }
  })
  return { numeral: written.numeral, root, inversion: written.voices[0]?.[0] ?? 0, keys }
}

/** A cadence voiced in a key, its tonic first; throws for one the key does not have. */
export function voiceCadence(cadence: Cadence, key: Key): CadenceVoicing {
  const shape = shapeOf(cadence, key)
  if (!shape) throw new RangeError(`A ${key.minor ? 'minor' : 'major'} key has no ${cadence}`)
  const [first, last] = shape.chords
  return {
    tonic: voice(key.minor ? MINOR_TONIC : MAJOR_TONIC, key),
    chords: [voice(first, key), voice(last, key)],
  }
}

/** The chord the Play drill asks of a cadence: which of its two, in what inversion if any. */
export function cadencePlays(
  cadence: Cadence,
  key: Key,
): { readonly at: 0 | 1; readonly inversion: number | null } {
  const shape = shapeOf(cadence, key)
  if (!shape) throw new RangeError(`A ${key.minor ? 'minor' : 'major'} key has no ${cadence}`)
  return shape.plays
}

/** A chord's numeral with its inversion's figure, as a cadence is written: `V6`, `iv6`, `I`. */
export const figured = (chord: VoicedChord): string =>
  `${chord.numeral}${['', '6', '64'][chord.inversion] ?? ''}`

/** A cadence's two chords as numerals: `V6–I`, `iv6–V`. */
export const cadenceNumerals = (voicing: CadenceVoicing): string =>
  voicing.chords.map(figured).join('–')

const MAJORS = CIRCLE_OF_FIFTHS.map((place) => place.major)
const MINORS = CIRCLE_OF_FIFTHS.map((place) => place.minor)
/** The keys a cadence is heard in: up to three sharps or flats. */
const upToThree = (keys: readonly Key[]) => keys.filter((key) => Math.abs(keySignature(key)) <= 3)

/**
 * The cadence quiz's ladder: the four kinds in major keys, then the authentic split into perfect and
 * imperfect, then a minor key's with its Phrygian half cadence, then all of them in either mode.
 */
export const CADENCE_LEVELS = ['four', 'perfect-imperfect', 'minor', 'all'] as const
export type CadenceLevel = (typeof CADENCE_LEVELS)[number]

export const CADENCE_LEVEL: Readonly<
  Record<CadenceLevel, { readonly keys: readonly Key[]; readonly cadences: readonly Cadence[] }>
> = {
  four: { keys: upToThree(MAJORS), cadences: ['authentic', 'plagal', 'half', 'deceptive'] },
  'perfect-imperfect': {
    keys: upToThree(MAJORS),
    cadences: ['perfect', 'imperfect', 'plagal', 'half', 'deceptive'],
  },
  minor: {
    keys: upToThree(MINORS),
    cadences: ['authentic', 'plagal', 'half', 'deceptive', 'phrygian'],
  },
  all: {
    keys: [...upToThree(MAJORS), ...upToThree(MINORS)],
    cadences: ['perfect', 'imperfect', 'plagal', 'half', 'deceptive', 'phrygian'],
  },
}
