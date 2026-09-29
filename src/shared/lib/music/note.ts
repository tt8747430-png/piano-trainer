import { midi, pitchClass, type Midi, type PitchClass } from './pitch'

export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const
export type Letter = (typeof LETTERS)[number]

/** Semitones from the letter: −2 double flat … 2 double sharp. */
export const ACCIDENTALS = [-2, -1, 0, 1, 2] as const
export type Accidental = (typeof ACCIDENTALS)[number]
export const isAccidental = (semitones: number): semitones is Accidental =>
  ACCIDENTALS.some((accidental) => accidental === semitones)

export interface SpelledNote {
  readonly letter: Letter
  readonly accidental: Accidental
}

const NATURAL_PITCHES: Readonly<Record<Letter, number>> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
}

const ACCIDENTAL_SIGNS: Readonly<Record<Accidental, string>> = {
  [-2]: '𝄫',
  [-1]: '♭',
  0: '',
  1: '#',
  2: '𝄪',
}

// A Map, not an object: a name like 'Cconstructor' must not find Object.prototype.constructor.
const ACCIDENTALS_WRITTEN = new Map<string, Accidental>([
  ['', 0],
  ['b', -1],
  ['♭', -1],
  ['bb', -2],
  ['♭♭', -2],
  ['𝄫', -2],
  ['#', 1],
  ['♯', 1],
  ['##', 2],
  ['♯♯', 2],
  ['𝄪', 2],
])

export const note = (letter: Letter, accidental: Accidental = 0): SpelledNote => ({
  letter,
  accidental,
})

export const letterIndex = (letter: Letter): number => LETTERS.indexOf(letter)

export const letterAt = (index: number): Letter => LETTERS[((index % 7) + 7) % 7] as Letter

export const naturalPitch = (letter: Letter): number => NATURAL_PITCHES[letter]

export const pitchClassOf = (spelled: SpelledNote): PitchClass =>
  pitchClass(naturalPitch(spelled.letter) + spelled.accidental)

/** The key a spelled note names in an octave, in scientific pitch: C4 is middle C (60), B♯3 is 60 too. */
export const midiOf = (spelled: SpelledNote, octave: number): Midi =>
  midi(12 * (octave + 1) + naturalPitch(spelled.letter) + spelled.accidental)

/** A note with its octave, as scientific pitch writes it: `C4` is middle C, `B♭3` the key below A3's. */
export function parseNoteInOctave(
  text: string,
): { readonly note: SpelledNote; readonly midi: Midi } | null {
  const match = /^(.+?)(-?\d)$/.exec(text)
  const spelled = match?.[1] === undefined ? null : parseNoteName(match[1])
  if (!match || !spelled) return null
  return { note: spelled, midi: midiOf(spelled, Number(match[2])) }
}

/** The octave a key is written in under a spelling: B♯3 and C4 are both 60, C♭5 is 71. */
export const writtenOctave = (key: Midi, spelled: SpelledNote): number =>
  Math.floor((key - spelled.accidental) / 12) - 1

export const noteName = (spelled: SpelledNote): string =>
  spelled.letter + ACCIDENTAL_SIGNS[spelled.accidental]

const isLetter = (value: string): value is Letter => (LETTERS as readonly string[]).includes(value)

/** 'Eb', 'E♭', 'F##', 'F𝄪', 'Bbb': a capital letter and what is written after it, or null. */
export function parseNoteName(text: string): SpelledNote | null {
  const letter = text.charAt(0)
  const accidental = ACCIDENTALS_WRITTEN.get(text.slice(1))
  if (!isLetter(letter) || accidental === undefined) return null
  return note(letter, accidental)
}

// The only name tables: for a pitch with no letter context (CODE_STYLE §8).
const SHARP_SPELLINGS: readonly SpelledNote[] = [
  note('C'),
  note('C', 1),
  note('D'),
  note('D', 1),
  note('E'),
  note('F'),
  note('F', 1),
  note('G'),
  note('G', 1),
  note('A'),
  note('A', 1),
  note('B'),
]
const FLAT_SPELLINGS: readonly SpelledNote[] = [
  note('C'),
  note('D', -1),
  note('D'),
  note('E', -1),
  note('E'),
  note('F'),
  note('G', -1),
  note('G'),
  note('A', -1),
  note('A'),
  note('B', -1),
  note('B'),
]

/** A pitch with no letter context: at most one accidental, sharps or flats as asked. */
export function plainSpelling(pc: PitchClass, preferSharps: boolean): SpelledNote {
  const spelled = (preferSharps ? SHARP_SPELLINGS : FLAT_SPELLINGS)[pc]
  if (!spelled) throw new RangeError(`${pc} is not a pitch class`)
  return spelled
}

/**
 * A root named plainly where its letters would give F♭, C♭, E♯, B♯ or a double sharp or flat (the
 * tritone substitution of E♭ is F♭7 by letters, written E7), leaning the way its accidental does.
 */
export function plainRoot(spelled: SpelledNote): SpelledNote {
  const odd =
    Math.abs(spelled.accidental) === 2 ||
    (spelled.accidental === -1 && (spelled.letter === 'F' || spelled.letter === 'C')) ||
    (spelled.accidental === 1 && (spelled.letter === 'E' || spelled.letter === 'B'))
  return odd ? plainSpelling(pitchClassOf(spelled), spelled.accidental > 0) : spelled
}

/** The root a chord or scale on this pitch class is named from: only C♯/D♭ and G♯/A♭ lean. */
export function rootSpelling(pc: PitchClass, preferSharps: boolean): SpelledNote {
  switch (pc) {
    case 1:
      return preferSharps ? note('C', 1) : note('D', -1)
    case 3:
      return note('E', -1)
    case 6:
      return note('F', 1)
    case 8:
      return preferSharps ? note('G', 1) : note('A', -1)
    case 10:
      return note('B', -1)
    default:
      return plainSpelling(pc, false)
  }
}

export const sameNote = (a: SpelledNote, b: SpelledNote): boolean =>
  a.letter === b.letter && a.accidental === b.accidental

/** A note as a URL writes it, ASCII `b` and `#` (`Bb`, `F#`): only noteParam makes one. */
export type NoteParam = string & { readonly __brand: 'NoteParam' }

export const noteParam = (spelled: SpelledNote): NoteParam =>
  (spelled.letter +
    (spelled.accidental < 0
      ? 'b'.repeat(-spelled.accidental)
      : '#'.repeat(spelled.accidental))) as NoteParam

/** The note noteParam wrote. */
export function noteFromParam(param: NoteParam): SpelledNote {
  const spelled = parseNoteName(param)
  if (!spelled) throw new RangeError(`noteParam wrote ${param}, which is not a note`)
  return spelled
}
