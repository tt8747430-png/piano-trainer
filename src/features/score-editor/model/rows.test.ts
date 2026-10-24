import { describe, expect, it } from 'vitest'
import { shownRows } from './rows'

const draft = (melodyStaff: boolean, leadSheet = false) => ({ melodyStaff, leadSheet })

describe('the score’s rows', () => {
  it('lists the rows top down: the chord symbols, the tune’s staff where the score has one (ADR 0094)', () => {
    expect(shownRows(draft(true))).toEqual(['chords', 'melody', 'rh', 'lh'])
    expect(shownRows(draft(false))).toEqual(['chords', 'rh', 'lh'])
  })

  it('leaves both hands out of a lead sheet, its piano hidden (ADR 0083)', () => {
    expect(shownRows(draft(true, true))).toEqual(['chords', 'melody'])
  })
})
