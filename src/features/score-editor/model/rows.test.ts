import { describe, expect, it } from 'vitest'
import { hasRow, hiddenWithout, rowShown, shownRows } from './rows'

const draft = (melodyStaff: boolean, voices: number, hidden: readonly string[] = []) => ({
  melodyStaff,
  voices: Array.from({ length: voices }, () => []),
  hidden: hidden as never,
})

describe('the score’s rows', () => {
  it('lists the rows shown top down, a row the score has not or hides left out', () => {
    expect(shownRows(draft(true, 2))).toEqual(['chords', 'melody', 'voice2', 'voice3', 'rh', 'lh'])
    expect(shownRows(draft(false, 1, ['chords', 'voice2']))).toEqual(['rh', 'lh'])
    expect(rowShown(draft(true, 0, ['melody']), 'melody')).toBe(false)
    expect(hasRow(draft(false, 0), 'chords')).toBe(true)
    expect(hasRow(draft(false, 1), 'voice3')).toBe(false)
  })

  it('leaves both hands out where the piano is hidden, a lead sheet (ADR 0083)', () => {
    expect(shownRows(draft(true, 0, ['piano']))).toEqual(['chords', 'melody'])
    expect(hasRow(draft(false, 0), 'piano')).toBe(true)
    expect(rowShown(draft(true, 0, ['piano']), 'piano')).toBe(false)
    expect(rowShown(draft(true, 0), 'piano')).toBe(true)
  })

  it('moves each lower voice’s hidden mark up when a voice is taken away', () => {
    expect(hiddenWithout(['chords', 'voice2', 'voice4'], 0)).toEqual(['chords', 'voice3'])
    expect(hiddenWithout(['voice3'], 1)).toEqual([])
    expect(hiddenWithout(['voice2'], 2)).toEqual(['voice2'])
  })
})
