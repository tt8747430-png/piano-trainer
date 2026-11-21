import type { ChordSheetSong } from '../model/types'

/**
 * The songs the Chord player's library holds as chord sheets, written as the sheet's text
 * (`sheetToText`): each opens in place of the sheet in hand, to be played, changed and saved.
 */
export const CHORD_SHEET_SONGS: readonly ChordSheetSong[] = [
  {
    // From Chordify's chart (2026-11-21), bar for bar; its sharps spelled as the key writes them
    // (A♯ as B♭, D♯ as E♭). Its opening bar, three beats of F, is a whole bar here: a sheet has
    // no pickup. It turns to G at bar 71, and its last three bars of rest are left out.
    id: 'isus-s-a-nascut',
    name: 'Isus s-a născut',
    by: 'David Preuteasa Band',
    tempo: 130,
    text: [
      'F 4/4',
      'verse: F | Bb:2 C:2 | Dm | Bb | C:2 F:2 | Bb:2 C:2 | Dm | Bb:2 C:2 | F | Bb | C | Am7 | Dm | Bb | C | Eb:2 Bb:2 | F | F',
      'verse: F | Gm7 | Gm7 | C | C | Bb | C | C:2 F:2 | Bb | C | A7 | Dm | Bb | C | Bb | F | Bb | C | A | Dm | Bb | C',
      'verse: Eb:2 Bb:2 | F | F | Bb:2 C:2 | Dm | Bb:2 C:2 | F | F | F | Gm | Gm | C | C | Bb | C | C:2 F:2 | Bb | C | Am | Dm | Bb | C | Bb | F | Bb | C | A7 | Dm | Bb | C | Eb:2 Bb:2',
      'chorus: F | G | C | D | Em:2 D:2 | C | D | G | G | G | G | Am | Am | D | D | C | D | D:2 G:2 | C | D | B | Em | C | D | C | G | C | D | B | Em | C | D | C | G | C | D | F:2 C:2 | G | Eb:2 D:2 | G | G',
    ].join('; '),
  },
]
