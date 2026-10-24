import { describe, expect, it } from 'vitest'
import type { HiddenRow } from '@/entities/piece'
import { layerInSight, rowsInSight, seenDraft } from './seen-draft'

/** A score's staves: the tune's added or not, the rows it hides. */
const score = (melodyStaff: boolean, hidden: readonly HiddenRow[] = []) => ({ melodyStaff, hidden })

/** The View: every staff and the chord symbols, unless said. */
const view = (
  shown: { chordNames?: boolean; melodyStaff?: boolean; hidden?: ('treble' | 'bass')[] } = {},
) => ({ chordNames: true, melodyStaff: true, hidden: [], ...shown })

describe('the score as the View shows it (ADR 0094)', () => {
  it('leaves out the tune’s staff the View hides, and the piano where both its staves are hidden', () => {
    expect(seenDraft(score(true), view({ melodyStaff: false }))).toEqual(score(false))
    expect(seenDraft(score(true), view({ hidden: ['treble', 'bass'] }))).toEqual(
      score(true, ['piano']),
    )
    expect(seenDraft(score(true, ['chords']), view())).toEqual(score(true, ['chords']))
  })

  it('never leaves every staff out: a lead sheet keeps its tune, as the Player’s sheet does', () => {
    expect(seenDraft(score(true, ['piano']), view({ melodyStaff: false }))).toEqual(
      score(true, ['piano']),
    )
    expect(seenDraft(score(false), view({ hidden: ['treble', 'bass'] }))).toEqual(score(false))
  })

  it('lets the caret write in the rows in sight alone, the chord symbols too', () => {
    expect(rowsInSight(score(true), view())).toEqual(['chords', 'melody', 'rh', 'lh'])
    expect(rowsInSight(score(true), view({ chordNames: false, melodyStaff: false }))).toEqual([
      'rh',
      'lh',
    ])
    expect(rowsInSight(score(false, ['chords']), view())).toEqual(['rh', 'lh'])
  })
})

describe('the caret kept in sight', () => {
  it('stays where it went, in a row in sight', () => {
    expect(layerInSight(['chords', 'rh', 'lh'], 'rh', 'lh')).toBe('lh')
  })

  it('steps over a row out of sight the way it was going', () => {
    expect(layerInSight(['chords', 'rh', 'lh'], 'rh', 'melody')).toBe('chords')
    expect(layerInSight(['chords', 'rh', 'lh'], 'chords', 'melody')).toBe('rh')
  })

  it('stays where it was with no row in sight that way', () => {
    expect(layerInSight(['rh', 'lh'], 'rh', 'melody')).toBe('rh')
    expect(layerInSight(['rh', 'lh'], 'rh', 'chords')).toBe('rh')
  })

  it('goes to the row under it as its own goes out of sight, else the one over it', () => {
    expect(layerInSight(['rh', 'lh'], 'melody', 'melody')).toBe('rh')
    expect(layerInSight(['chords', 'melody'], 'lh', 'lh')).toBe('melody')
  })
})
