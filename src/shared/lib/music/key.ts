import { intervalBetween, spellAbove } from './interval'
import {
  note,
  noteName,
  noteParam,
  parseNoteName,
  pitchClassOf,
  plainSpelling,
  ROOT_ACCIDENTALS,
  rootSpelling,
  type Letter,
  type RootAccidental,
  type SpelledNote,
} from './note'
import type { PitchClass } from './pitch'

/** A tonic, major or minor. */
export interface Key {
  readonly tonic: SpelledNote
  readonly minor: boolean
}

/** 'G', 'G#m', 'Ebm', 'B♭': a note name, then `m` for minor. */
export function parseKey(text: string): Key | null {
  const minor = text.endsWith('m')
  const tonic = parseNoteName(minor ? text.slice(0, -1) : text)
  return tonic ? { tonic, minor } : null
}

/** A key written as a chord symbol is: `Am`, `F#`. */
export const keySymbol = (key: Key): string => noteName(key.tonic) + (key.minor ? 'm' : '')

/** Each letter's place on the circle of fifths, as a major tonic: sharps above 0, flats below. */
const LETTER_FIFTHS: Readonly<Record<Letter, number>> = {
  F: -1,
  C: 0,
  G: 1,
  D: 2,
  A: 3,
  E: 4,
  B: 5,
}

/** Sharps in the key signature (> 0) or flats (< 0). */
export const keySignature = (key: Key): number =>
  LETTER_FIFTHS[key.tonic.letter] + 7 * key.tonic.accidental - (key.minor ? 3 : 0)

export const keyPrefersSharps = (key: Key): boolean => keySignature(key) > 0

/** The most sharps or flats a key signature writes: C♯ major's seven, C♭ major's. */
const MOST_IN_SIGNATURE = 7

/** Whether a signature writes the key: one of the 15 major and 15 minor keys. */
const isWrittenKey = (key: Key): boolean => Math.abs(keySignature(key)) <= MOST_IN_SIGNATURE

/** The accidentals that make a written key on a letter, in a chooser's order: D♭ major, never D♭ minor. */
export const writtenKeyAccidentals = (letter: Letter, minor: boolean): RootAccidental[] =>
  ROOT_ACCIDENTALS.filter((accidental) => isWrittenKey({ tonic: note(letter, accidental), minor }))

/** A key as the learner wrote it, or, where no signature writes it, its tonic spelled by the key's rule. */
export const writtenKey = (key: Key): Key =>
  isWrittenKey(key)
    ? key
    : { tonic: tonicSpelling(pitchClassOf(key.tonic), key.minor), minor: key.minor }

/** The tonic a key on this pitch class is named from: minor keys lean sharp (G♯ minor, D♭ major). */
export const tonicSpelling = (pc: PitchClass, minor: boolean): SpelledNote =>
  rootSpelling(pc, minor)

/**
 * Moves a note from one tonic to another by the interval between them, so its letter moves with the
 * key (D in G is E♭ in A♭). A note that would need a double accidental takes its plain spelling.
 */
export function transposeNote(note: SpelledNote, from: SpelledNote, to: SpelledNote): SpelledNote {
  const moved = spellAbove(to, intervalBetween(from, note))
  if (Math.abs(moved.accidental) < 2) return moved
  return plainSpelling(pitchClassOf(moved), moved.accidental > 0)
}

/** A key as a URL writes it: its tonic's `NoteParam`, then `m` for minor (`Eb`, `C#m`): only keyParam makes one. */
export type KeyParam = string & { readonly __brand: 'KeyParam' }

export const keyParam = (key: Key): KeyParam =>
  (noteParam(key.tonic) + (key.minor ? 'm' : '')) as KeyParam

/** The key keyParam wrote. */
export function keyFromParam(param: KeyParam): Key {
  const key = parseKey(param)
  if (!key) throw new RangeError(`keyParam wrote ${param}, which is not a key`)
  return key
}

const SHARPS_IN_ORDER: readonly Letter[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
const FLATS_IN_ORDER: readonly Letter[] = ['B', 'E', 'A', 'D', 'G', 'C', 'F']

/** The sharps or flats of a key's signature, in the order they are written: F♯ C♯ G♯ …, B♭ E♭ A♭ …. */
export function signatureNotes(key: Key): SpelledNote[] {
  const count = keySignature(key)
  const letters = count > 0 ? SHARPS_IN_ORDER : FLATS_IN_ORDER
  return letters.slice(0, Math.abs(count)).map((letter) => note(letter, count > 0 ? 1 : -1))
}
