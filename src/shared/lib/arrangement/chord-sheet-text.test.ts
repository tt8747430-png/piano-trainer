import { describe, expect, it } from 'vitest'
import { C_MAJOR, parseChordSymbol, parseKey } from '@/shared/lib/music'
import type { ChordSheet } from './chord-sheet'
import { sheetToText, textToSheet } from './chord-sheet-text'

const chord = (symbol: string, beats = 4) => ({ chord: parseChordSymbol(symbol), beats })

describe('a chord sheet as text', () => {
  const sheet: ChordSheet = {
    key: parseKey('Am') ?? C_MAJOR,
    meter: '3/4',
    sections: [
      { kind: 'intro', repeats: 1, variation: 4, chords: [chord('Am', 3)] },
      {
        kind: 'verse',
        repeats: 2,
        variation: 1,
        chords: [chord('Am', 2), chord('G/B', 1), chord('C', 3), chord('F#m7b5', 6)],
      },
      { kind: 'preChorus', repeats: 1, variation: 2, chords: [] },
    ],
  }
  it('sheetToText and textToSheet round-trip three sections with repeats and lengths', () => {
    const text = sheetToText(sheet)
    expect(text).toBe('Am 3/4; intro v4: Am; verse x2: Am:2 G/B:1 C F#m7♭5:6; preChorus v2:')
    expect(textToSheet(text)).toEqual(sheet)
  })
  it('reads what it can (Postel): any case, ♭ and ♯, a word it cannot read left out', () => {
    const read = textToSheet('c 4/4; CHORUS x3: B♭ zz Em7:2')
    expect(read?.key).toEqual(C_MAJOR)
    expect(read?.sections).toEqual([
      { kind: 'chorus', repeats: 3, variation: 1, chords: [chord('Bb'), chord('Em7', 2)] },
    ])
  })
  it('is no sheet without a key, nor with no section', () => {
    expect(textToSheet('')).toBeNull()
    expect(textToSheet('Q 4/4; verse: C')).toBeNull()
    expect(textToSheet('C 4/4')).toBeNull()
  })
  it('keeps lengths and repeats in their range and the time to the sheet’s', () => {
    const read = textToSheet('C 7/8; verse x99 v9: C:40')
    expect(read?.meter).toBe('4/4')
    expect(read?.sections[0]).toMatchObject({ repeats: 8, variation: 1, chords: [chord('C', 8)] })
  })
})
