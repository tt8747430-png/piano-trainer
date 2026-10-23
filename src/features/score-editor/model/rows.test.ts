import { describe, expect, it } from 'vitest'
import { hasRow, rowShown, shownRows } from './rows'

const draft = (melodyStaff: boolean, hidden: readonly string[] = []) => ({
  melodyStaff,
  hidden: hidden as never,
})

describe('the score’s rows', () => {
  it('lists the rows shown top down, a row the score has not or hides left out', () => {
    expect(shownRows(draft(true))).toEqual(['chords', 'melody', 'rh', 'lh'])
    expect(shownRows(draft(false, ['chords']))).toEqual(['rh', 'lh'])
    expect(rowShown(draft(true, ['melody']), 'melody')).toBe(false)
    expect(hasRow(draft(false), 'chords')).toBe(true)
    expect(hasRow(draft(false), 'melody')).toBe(false)
  })

  it('leaves both hands out where the piano is hidden, a lead sheet (ADR 0083)', () => {
    expect(shownRows(draft(true, ['piano']))).toEqual(['chords', 'melody'])
    expect(hasRow(draft(false), 'piano')).toBe(true)
    expect(rowShown(draft(true, ['piano']), 'piano')).toBe(false)
    expect(rowShown(draft(true), 'piano')).toBe(true)
  })
})
