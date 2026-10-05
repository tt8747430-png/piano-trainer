import { describe, expect, it } from 'vitest'
import { COLLECTIONS } from '@/entities/piece'
import { songsView } from './songs-view'

const ids = (groups: ReturnType<typeof songsView>) =>
  groups.flatMap((g) => g.entries.map((e) => e.id))
const ALL = { q: '', collection: 'all' } as const

describe('songsView', () => {
  it('shows every entry, by collection, when nothing filters', () => {
    const groups = songsView(COLLECTIONS, ALL)
    expect(groups.map((g) => g.shelf.id)).toEqual(COLLECTIONS.map((c) => c.id))
  })

  it('finds a song by either title or a credited name, ignoring case', () => {
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'ДУША' }))).toContain('bz5')
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'still, my soul' }))).toContain('bz5')
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'getty' }))).toContain('bz5')
  })

  it('keeps one collection', () => {
    const groups = songsView(COLLECTIONS, { ...ALL, collection: 'hymns' })
    expect(groups.map((g) => g.shelf.id)).toEqual(['hymns'])
  })

  it('drops collections left empty', () => {
    expect(songsView(COLLECTIONS, { ...ALL, q: 'zzzz' })).toEqual([])
  })
})
