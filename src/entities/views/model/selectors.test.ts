import { describe, expect, it } from 'vitest'
import { selectView } from './selectors'

describe('selectView', () => {
  it('finds a screen’s last view by its path, none for a screen not used', () => {
    const state = { views: { '/learn/chords': { root: 'G' } } }
    expect(selectView(state, '/learn/chords')).toEqual({ root: 'G' })
    expect(selectView(state, '/learn/scales')).toBeUndefined()
  })
})
