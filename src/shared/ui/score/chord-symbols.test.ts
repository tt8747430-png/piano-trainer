import { describe, expect, it } from 'vitest'
import { CHORD_SYMBOL_FONT, chordSymbolWidth } from './chord-symbols'

describe('chordSymbolWidth', () => {
  it('measures a chord symbol in the face the sheet prints it in', () => {
    expect(CHORD_SYMBOL_FONT).toBe('600 17px "Literata Variable"')
    // The test canvas measures 0.6em a character.
    expect(chordSymbolWidth('C7')).toBeCloseTo(2 * 17 * 0.6)
    expect(chordSymbolWidth('Csus4')).toBeGreaterThan(chordSymbolWidth('C7'))
  })
})
