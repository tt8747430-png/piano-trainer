import { describe, expect, it } from 'vitest'
import { shownRows, staffLeftFor, topStaff } from './rows'

/** A score of `staves` single staves over the piano, hidden (a lead sheet) or not. */
const score = (staves: number, leadSheet = false) => ({
  staves: Array.from({ length: staves }, () => ({})),
  leadSheet,
})

describe('the score’s rows', () => {
  it('lists the rows top down: the chord symbols, each single staff, the piano’s (ADR 0114, 0097)', () => {
    expect(shownRows(score(1))).toEqual(['chords', 'staff0', 'rh', 'lh'])
    expect(shownRows(score(2))).toEqual(['chords', 'staff0', 'staff1', 'rh', 'lh'])
    expect(shownRows(score(0))).toEqual(['chords', 'rh', 'lh'])
  })

  it('leaves both hands out of a lead sheet, its piano hidden (ADR 0114)', () => {
    expect(shownRows(score(2, true))).toEqual(['chords', 'staff0', 'staff1'])
  })

  it('starts on the top staff, and leaves a staff gone for the piano’s upper, else the top', () => {
    expect(topStaff(score(2))).toBe('staff0')
    expect(topStaff(score(0))).toBe('rh')
    expect(staffLeftFor(score(2))).toBe('rh')
    expect(staffLeftFor(score(2, true))).toBe('staff0')
  })
})
