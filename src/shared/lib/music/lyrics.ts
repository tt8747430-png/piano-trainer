/**
 * A syllable sung on a note of the tune (ADR 0093), as a verse writes it under the note: Flat's and
 * LilyPond's marks, a hyphen to the next syllable of its word, an extender line while it is held.
 */
export interface Syllable {
  readonly text: string
  /** Its word goes on in the next syllable sung: a hyphen is drawn to it (`A- ma- zing`). */
  readonly hyphen: boolean
  /** Held over the notes after it that sing nothing (a melisma): a line is drawn from it. */
  readonly melisma: boolean
}

/** What a note sings, by verse: null where a verse sings nothing on it (a rest in the words, a melisma). */
export type NoteLyrics = readonly (Syllable | null)[]
