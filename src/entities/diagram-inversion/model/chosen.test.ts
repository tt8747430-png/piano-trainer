import { describe, expect, it } from 'vitest'
import { MOST_PIECES, withChosen, type PieceInversions } from './chosen'
import { selectChosenInversions } from './selectors'
import type { DiagramInversionsState } from './store'

describe('withChosen', () => {
  it('keeps a chord’s inversion as chosen last, its piece as chosen in last', () => {
    const pieces: PieceInversions = { bz5: { Dm: 2 }, silent: { G7: 3 } }
    const next = withChosen(pieces, 'bz5', 'Em', 1)
    expect(next).toEqual({ silent: { G7: 3 }, bz5: { Dm: 2, Em: 1 } })
    expect(Object.keys(next)).toEqual(['silent', 'bz5'])
    expect(Object.keys(withChosen(next, 'bz5', 'Dm', 0).bz5 ?? {})).toEqual(['Em', 'Dm'])
  })

  it('forgets a choice, and a piece with none left', () => {
    const pieces: PieceInversions = { bz5: { Dm: 2, Em: 1 } }
    expect(withChosen(pieces, 'bz5', 'Dm', null)).toEqual({ bz5: { Em: 1 } })
    expect(withChosen({ bz5: { Dm: 2 } }, 'bz5', 'Dm', null)).toEqual({})
  })

  it('forgets the piece chosen in longest ago past 200', () => {
    const pieces: PieceInversions = Object.fromEntries(
      Array.from({ length: MOST_PIECES }, (_, i) => [`p${i}`, { Dm: 1 } as const]),
    )
    const next = withChosen(pieces, 'bz5', 'Dm', 2)
    expect(Object.keys(next)).toHaveLength(MOST_PIECES)
    expect(next.p0).toBeUndefined()
    expect(next.bz5).toEqual({ Dm: 2 })
  })
})

describe('selectChosenInversions', () => {
  it('is a piece’s inversions by chord, the same none for a piece of none', () => {
    const state: DiagramInversionsState = { pieces: { bz5: { Dm: 2 } } }
    expect(selectChosenInversions('bz5')(state)).toEqual({ Dm: 2 })
    expect(selectChosenInversions('silent')(state)).toEqual({})
    expect(selectChosenInversions('silent')(state)).toBe(selectChosenInversions('olen')(state))
  })
})
