import { intervalBetween, spellAbove } from './interval'
import {
  noteName,
  parseNoteName,
  pitchClassOf,
  plainSpelling,
  rootSpelling,
  type Letter,
  type SpelledNote,
} from './note'
import type { PitchClass } from './pitch'

export type Mode = 'major' | 'minor'

export interface Key {
  readonly tonic: SpelledNote
  readonly mode: Mode
}

/** 'G', 'G#m', 'Ebm', 'B♭': a note name, then `m` for minor. */
export function parseKey(text: string): Key | null {
  const minor = text.endsWith('m')
  const tonic = parseNoteName(minor ? text.slice(0, -1) : text)
  return tonic ? { tonic, mode: minor ? 'minor' : 'major' } : null
}

export const keyName = (key: Key): string => noteName(key.tonic) + (key.mode === 'minor' ? 'm' : '')

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
  LETTER_FIFTHS[key.tonic.letter] + 7 * key.tonic.accidental - (key.mode === 'minor' ? 3 : 0)

export const keyPrefersSharps = (key: Key): boolean => keySignature(key) > 0

/** The tonic a key on this pitch class is named from: minor keys lean sharp (G♯ minor, D♭ major). */
export const tonicSpelling = (pc: PitchClass, mode: Mode): SpelledNote =>
  rootSpelling(pc, mode === 'minor')

/**
 * Moves a note from one tonic to another by the interval between them, so its letter moves with the
 * key (D in G is E♭ in A♭). A note that would need a double accidental takes its plain spelling.
 */
export function transposeNote(note: SpelledNote, from: SpelledNote, to: SpelledNote): SpelledNote {
  const moved = spellAbove(to, intervalBetween(from, note))
  if (Math.abs(moved.accidental) < 2) return moved
  return plainSpelling(pitchClassOf(moved), moved.accidental > 0)
}
