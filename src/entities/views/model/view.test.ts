import { describe, expect, it } from 'vitest'
import { MOST_VIEWS, sameView, viewOf, withView } from './view'

describe('viewOf', () => {
  it('keeps the params that are text, numbers or switches, but for those left out', () => {
    expect(
      viewOf(
        { key: 'A', tempo: 80, swing: true, loop: '1-2', pattern: undefined, bad: Number.NaN },
        new Set(['loop']),
      ),
    ).toEqual({ key: 'A', tempo: 80, swing: true })
  })
})

describe('sameView', () => {
  it('compares the params given, a left-out one as absent', () => {
    expect(sameView({ key: 'A', tempo: undefined }, { key: 'A' })).toBe(true)
    expect(sameView({ key: 'A' }, { key: 'A', tempo: 80 })).toBe(false)
    expect(sameView({ key: 'A' }, { key: 'B' })).toBe(false)
  })
})

describe('withView', () => {
  it('puts the screen used last at the end, forgetting the oldest past 200', () => {
    let views = {}
    for (let i = 0; i <= MOST_VIEWS; i++) views = withView(views, `/play/p${i}`, { tempo: i })
    views = withView(views, '/play/p1', { tempo: 99 })
    const paths = Object.keys(views)
    expect(paths).toHaveLength(MOST_VIEWS)
    expect(paths[0]).toBe('/play/p2')
    expect(paths.at(-1)).toBe('/play/p1')
  })
})
