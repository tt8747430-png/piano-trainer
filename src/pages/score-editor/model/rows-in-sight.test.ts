import { describe, expect, it } from 'vitest'
import type { StaffId } from '@/shared/lib/notation'
import { layerInSight, rowsInSight } from './rows-in-sight'

/** A score's staves: its single staves (by how many) and the piano, hidden (a lead sheet) or not. */
const score = (staves: number, leadSheet = false) => ({
  staves: Array.from({ length: staves }, () => ({})),
  leadSheet,
})

/** The View: every staff and the chord symbols, unless said. */
const view = (shown: { chordNames?: boolean; hidden?: StaffId[] } = {}) => ({
  chordNames: true,
  hidden: [],
  ...shown,
})

describe('the rows the caret writes in, as the View shows the score (ADR 0094, 0097)', () => {
  it('holds every staff in sight and the chord symbols the View shows', () => {
    expect(rowsInSight(score(1), view())).toEqual(['chords', 'staff0', 'rh', 'lh'])
    expect(rowsInSight(score(2), view())).toEqual(['chords', 'staff0', 'staff1', 'rh', 'lh'])
    expect(rowsInSight(score(0), view({ chordNames: false }))).toEqual(['rh', 'lh'])
    expect(rowsInSight(score(1, true), view())).toEqual(['chords', 'staff0'])
  })

  it('leaves out each staff the View hides, by its place', () => {
    expect(rowsInSight(score(2), view({ hidden: ['staff1'] }))).toEqual([
      'chords',
      'staff0',
      'rh',
      'lh',
    ])
    expect(rowsInSight(score(1), view({ chordNames: false, hidden: ['staff0'] }))).toEqual([
      'rh',
      'lh',
    ])
    expect(rowsInSight(score(1), view({ hidden: ['treble'] }))).toEqual(['chords', 'staff0', 'lh'])
    expect(rowsInSight(score(1), view({ hidden: ['treble', 'bass'] }))).toEqual([
      'chords',
      'staff0',
    ])
  })

  it('never leaves every staff out of sight, as the Player’s sheet never does (ADR 0083)', () => {
    expect(rowsInSight(score(0), view({ hidden: ['treble', 'bass'] }))).toEqual([
      'chords',
      'rh',
      'lh',
    ])
    expect(rowsInSight(score(1, true), view({ hidden: ['staff0'] }))).toEqual(['chords', 'staff0'])
  })
})

describe('the caret kept in sight', () => {
  const rows = ['chords', 'staff0', 'rh', 'lh'] as const

  it('stays where it went, in a row in sight', () => {
    expect(layerInSight(rows, ['chords', 'rh', 'lh'], 'rh', 'lh')).toBe('lh')
  })

  it('steps over a row out of sight the way it was going', () => {
    expect(layerInSight(rows, ['chords', 'rh', 'lh'], 'rh', 'staff0')).toBe('chords')
    expect(layerInSight(rows, ['chords', 'rh', 'lh'], 'chords', 'staff0')).toBe('rh')
  })

  it('stays where it was with no row in sight that way', () => {
    expect(layerInSight(rows, ['rh', 'lh'], 'rh', 'staff0')).toBe('rh')
    expect(layerInSight(rows, ['rh', 'lh'], 'rh', 'chords')).toBe('rh')
  })

  it('goes to the row under it as its own goes out of sight, else the one over it', () => {
    expect(layerInSight(rows, ['rh', 'lh'], 'staff0', 'staff0')).toBe('rh')
    expect(layerInSight(rows, ['chords', 'staff0'], 'lh', 'lh')).toBe('staff0')
  })
})
