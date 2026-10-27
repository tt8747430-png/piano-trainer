import { describe, expect, it } from 'vitest'
import { CLEF_FORMS, clefGlyph, clefOctaves, CLEFS, clefsInForce, topLineStep } from './clef'

describe('clefsInForce', () => {
  it('holds each hand’s clef from the bar that changes it to the next change', () => {
    expect(
      clefsInForce([{}, { clefs: { lh: 'treble' } }, {}, { clefs: { lh: 'bass', rh: 'bass' } }]),
    ).toEqual([
      { rh: 'treble', lh: 'bass' },
      { rh: 'treble', lh: 'treble' },
      { rh: 'treble', lh: 'treble' },
      { rh: 'bass', lh: 'bass' },
    ])
  })
})

describe('the clefs (ADR 0114)', () => {
  it('puts F5 on the treble’s top line, A3 on the bass’s, G4 on the alto’s', () => {
    expect(topLineStep('treble')).toBe(5 * 7 + 3)
    expect(topLineStep('bass')).toBe(3 * 7 + 5)
    expect(topLineStep('alto')).toBe(4 * 7 + 4)
    expect(topLineStep('tenor')).toBe(4 * 7 + 2)
    expect(topLineStep('soprano')).toBe(5 * 7 + 1)
    expect(topLineStep('baritone-f')).toBe(topLineStep('baritone'))
    expect(topLineStep('subbass')).toBe(3 * 7 + 3)
  })

  it('moves an octave clef’s notes an octave or two from where they are written', () => {
    expect(topLineStep('treble-8vb')).toBe(topLineStep('treble') - 7)
    expect(topLineStep('bass-15ma')).toBe(topLineStep('bass') + 14)
    expect(CLEFS.map(clefOctaves).filter((octaves) => octaves !== 0)).toHaveLength(8)
  })

  it('draws each as one character of the music font', () => {
    expect(clefGlyph('treble')).toBe('\u{1D11E}')
    expect(clefGlyph('treble-8vb')).toBe('\u{1D120}')
    expect(clefGlyph('alto')).toBe('\u{1D121}')
    expect(clefGlyph('bass-8va')).toBe('\u{1D123}')
    expect(CLEF_FORMS.tenor).toEqual({ shape: 'C', line: 4, octaves: 0 })
  })
})
