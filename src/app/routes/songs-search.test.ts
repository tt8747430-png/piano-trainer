import { describe, expect, it } from 'vitest'
import { readSongsHomeSearch, SONGS_DEFAULTS, SONGS_HOME_DEFAULTS } from './songs-search'

describe('Songs’ Home search', () => {
  it('reads view mine|explore, default mine', () => {
    expect(readSongsHomeSearch({}).view).toBe('mine')
    expect(readSongsHomeSearch({ view: 'explore' }).view).toBe('explore')
    expect(readSongsHomeSearch({ view: 'public' }).view).toBe('mine')
  })

  it('reads Explore’s category and shelf, else all and the shelves', () => {
    expect(readSongsHomeSearch({ view: 'explore', cat: 'folk', shelf: 'rated' })).toEqual({
      ...SONGS_HOME_DEFAULTS,
      view: 'explore',
      cat: 'folk',
      shelf: 'rated',
    })
    expect(readSongsHomeSearch({ cat: 'jazz', shelf: 'best' })).toEqual(SONGS_HOME_DEFAULTS)
    expect(readSongsHomeSearch({ cat: 'patterns' }).cat).toBe('patterns')
  })

  it('keeps the library’s filters beside them', () => {
    expect(readSongsHomeSearch({ q: 'waltz', favourites: true })).toEqual({
      ...SONGS_HOME_DEFAULTS,
      ...SONGS_DEFAULTS,
      q: 'waltz',
      favourites: true,
    })
  })
})
