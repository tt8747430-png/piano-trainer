import { describe, expect, it } from 'vitest'
import { levelOf } from '@/entities/path'
import { COLLECTIONS, type Entry } from '@/entities/piece'
import { songsView } from './songs-view'

const levelOfEntry = (entry: Entry) =>
  entry.kind === 'listing' ? undefined : levelOf(`piece:${entry.id}`)
const ids = (groups: ReturnType<typeof songsView>) =>
  groups.flatMap((g) => g.entries.map((e) => e.id))
const ALL = { q: '', collection: 'all', level: 'any' } as const

describe('songsView', () => {
  it('shows every entry, by collection, when nothing filters', () => {
    const groups = songsView(COLLECTIONS, ALL, levelOfEntry)
    expect(groups.map((g) => g.collection.id)).toEqual(COLLECTIONS.map((c) => c.id))
  })

  it('finds a song by either title or a credited name, ignoring case', () => {
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'ДУША' }, levelOfEntry))).toContain('bz5')
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'still, my soul' }, levelOfEntry))).toContain(
      'bz5',
    )
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'getty' }, levelOfEntry))).toContain('bz5')
  })

  it('keeps one collection', () => {
    const groups = songsView(COLLECTIONS, { ...ALL, collection: 'hymns' }, levelOfEntry)
    expect(groups.map((g) => g.collection.id)).toEqual(['hymns'])
  })

  it('filters by level, which listings do not have', () => {
    const entries = songsView(COLLECTIONS, { ...ALL, level: 1 }, levelOfEntry).flatMap(
      (g) => g.entries,
    )
    expect(entries.every((e) => e.kind !== 'listing')).toBe(true)
  })

  it('drops collections left empty', () => {
    expect(songsView(COLLECTIONS, { ...ALL, q: 'zzzz' }, levelOfEntry)).toEqual([])
  })
})
