import { CIRCLE_OF_FIFTHS, keySignature, type Key } from '@/shared/lib/music'

// The key trainers' ladders: keys by how many sharps or flats they carry, majors before minors.

const MAJORS = CIRCLE_OF_FIFTHS.map((place) => place.major)
const MINORS = CIRCLE_OF_FIFTHS.map((place) => place.minor)
const upTo = (keys: readonly Key[], count: number) =>
  keys.filter((key) => Math.abs(keySignature(key)) <= count)

export const SIGNATURE_LEVELS = ['up-to-two', 'up-to-four', 'majors', 'minors', 'all'] as const
export type SignatureLevel = (typeof SIGNATURE_LEVELS)[number]

export const SIGNATURE_LEVEL: Readonly<Record<SignatureLevel, readonly Key[]>> = {
  'up-to-two': upTo(MAJORS, 2),
  'up-to-four': upTo(MAJORS, 4),
  majors: MAJORS,
  minors: MINORS,
  all: [...MAJORS, ...MINORS],
}

export const DEGREE_LEVELS = ['c-g-f', 'up-to-three', 'majors', 'minors', 'all'] as const
export type DegreeLevel = (typeof DEGREE_LEVELS)[number]

export const DEGREE_LEVEL: Readonly<Record<DegreeLevel, readonly Key[]>> = {
  'c-g-f': upTo(MAJORS, 1),
  'up-to-three': upTo(MAJORS, 3),
  majors: MAJORS,
  minors: upTo(MINORS, 3),
  all: [...MAJORS, ...MINORS],
}

export const ROLE_LEVELS = ['primary', 'with-vi', 'with-ii-iii', 'all-major', 'minor'] as const
export type RoleLevel = (typeof ROLE_LEVELS)[number]

/** The keys a chord's role is heard in: up to three sharps or flats. */
const ROLE_MAJORS = upTo(MAJORS, 3)
const ROLE_MINORS = upTo(MINORS, 3)

export const ROLE_LEVEL: Readonly<
  Record<RoleLevel, { readonly keys: readonly Key[]; readonly numerals: readonly string[] }>
> = {
  primary: { keys: ROLE_MAJORS, numerals: ['I', 'IV', 'V'] },
  'with-vi': { keys: ROLE_MAJORS, numerals: ['I', 'IV', 'V', 'vi'] },
  'with-ii-iii': { keys: ROLE_MAJORS, numerals: ['I', 'ii', 'iii', 'IV', 'V', 'vi'] },
  'all-major': { keys: ROLE_MAJORS, numerals: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] },
  minor: { keys: ROLE_MINORS, numerals: ['i', 'ii°', 'III', 'iv', 'V', 'VI', 'VII'] },
}

/**
 * Progressions by ear: four lines a level, each heard after its key's tonic, in a key of up to three
 * sharps or flats. A line is told by its chords and their order; the first two levels' lines share
 * their chords, so there by its order alone.
 */
export const PROGRESSION_LEVELS = ['primary', 'pop', 'jazz', 'minor'] as const
export type ProgressionLevel = (typeof PROGRESSION_LEVELS)[number]

export const PROGRESSION_LEVEL: Readonly<
  Record<ProgressionLevel, { readonly keys: readonly Key[]; readonly lines: readonly string[] }>
> = {
  primary: { keys: ROLE_MAJORS, lines: ['I IV V I', 'I V IV I', 'I IV I V', 'I V I IV'] },
  pop: { keys: ROLE_MAJORS, lines: ['I V vi IV', 'I vi IV V', 'I IV vi V', 'vi IV I V'] },
  jazz: { keys: ROLE_MAJORS, lines: ['ii V I', 'I vi ii V', 'iii vi ii V', 'I IV ii V'] },
  minor: { keys: ROLE_MINORS, lines: ['i iv V i', 'i VI VII i', 'i VII VI V', 'i iv VII III'] },
}
