import { describe, expect, it } from 'vitest'
import type { HiddenRow } from '@/entities/piece'
import { rowShown, shownRows } from './rows'

const draft = (melodyStaff: boolean, hidden: readonly HiddenRow[] = []) => ({ melodyStaff, hidden })

describe('the score’s rows', () => {
  it('lists the rows shown top down: the tune’s staff where the score has one (ADR 0094)', () => {
    expect(shownRows(draft(true))).toEqual(['chords', 'melody', 'rh', 'lh'])
    expect(shownRows(draft(false))).toEqual(['chords', 'rh', 'lh'])
    expect(shownRows(draft(false, ['chords']))).toEqual(['rh', 'lh'])
  })

  it('leaves both hands out where the piano is hidden, a lead sheet (ADR 0083)', () => {
    expect(shownRows(draft(true, ['piano']))).toEqual(['chords', 'melody'])
    expect(rowShown(draft(true, ['piano']), 'piano')).toBe(false)
    expect(rowShown(draft(true), 'piano')).toBe(true)
  })
})
