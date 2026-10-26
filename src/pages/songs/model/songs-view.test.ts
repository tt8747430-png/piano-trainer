import { describe, expect, it } from 'vitest'
import { pieceStage } from '@/entities/course'
import { COLLECTIONS, pieceById, type Entry } from '@/entities/piece'
import { chordListParam } from '@/shared/lib'
import { songsView, stagesIn } from './songs-view'

const ids = (groups: ReturnType<typeof songsView>) =>
  groups.flatMap((g) => g.entries.map((e) => e.id))
const ALL = { q: '', collection: 'all', withChords: false, stage: 'any', known: '' } as const

describe('songsView', () => {
  it('shows every entry, by collection, when nothing filters', () => {
    const groups = songsView(COLLECTIONS, ALL)
    expect(groups.map((g) => g.shelf.id)).toEqual(COLLECTIONS.map((c) => c.id))
  })

  it('finds a song by any of its titles or a credited name, ignoring case', () => {
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'ДУША' }))).toContain('bz5')
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'still, my soul' }))).toContain('bz5')
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'getty' }))).toContain('bz5')
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'тихая' }))).toContain('silent')
  })

  it('keeps one collection', () => {
    const groups = songsView(COLLECTIONS, { ...ALL, collection: 'hymns' })
    expect(groups.map((g) => g.shelf.id)).toEqual(['hymns'])
  })

  it('drops collections left empty', () => {
    expect(songsView(COLLECTIONS, { ...ALL, q: 'zzzz' })).toEqual([])
  })

  it('keeps only the songs with chords when asked, none whose chart is to come', () => {
    const every = songsView(COLLECTIONS, ALL).flatMap((g) => g.entries)
    const playable = songsView(COLLECTIONS, { ...ALL, withChords: true }).flatMap((g) => g.entries)
    expect(every.some((entry) => entry.kind === 'listing')).toBe(true)
    expect(playable.some((entry) => entry.kind === 'listing')).toBe(false)
    expect(playable).toHaveLength(every.filter((entry) => entry.kind !== 'listing').length)
  })

  it('keeps the songs of one stage, as their courses place them (ADR 0005)', () => {
    const every = songsView(COLLECTIONS, ALL).flatMap((g) => g.entries)
    for (const stage of stagesIn(COLLECTIONS, ALL)) {
      const kept = songsView(COLLECTIONS, { ...ALL, stage }).flatMap((g) => g.entries)
      expect(kept.length).toBeGreaterThan(0)
      expect(kept.every((entry) => pieceStage(entry.id) === stage)).toBe(true)
      expect(kept).toHaveLength(every.filter((entry) => pieceStage(entry.id) === stage).length)
    }
  })

  it('offers only the stages the shelves shown hold, whatever is searched or chosen', () => {
    const all = stagesIn(COLLECTIONS, ALL)
    expect(all.length).toBeGreaterThan(0)
    // Each one offered keeps a song.
    for (const stage of all)
      expect(songsView(COLLECTIONS, { ...ALL, stage }).length).toBeGreaterThan(0)
    expect(
      stagesIn(COLLECTIONS, { ...ALL, stage: 'beginner', q: 'zzzz', withChords: true }),
    ).toEqual(all)
    // A shelf whose songs no course places offers none.
    expect(stagesIn([{ id: 'none', entries: [] }], ALL)).toEqual([])
  })

  it('keeps only the songs that use no chord but those known, none of no chord (ADR 0103)', () => {
    const known = chordListParam(['G', 'C', 'Em', 'Dsus4', 'D', 'Am', 'D7'])
    const kept = songsView(COLLECTIONS, { ...ALL, known }).flatMap((g) => g.entries)
    expect(kept.map((entry) => entry.id)).toContain('bz5')
    expect(kept.some((entry) => entry.kind === 'listing')).toBe(false)
    const fewer = songsView(COLLECTIONS, { ...ALL, known: chordListParam(['G', 'C', 'Em']) })
    expect(fewer.flatMap((g) => g.entries).map((entry) => entry.id)).not.toContain('bz5')
  })

  it('shows the favourites on their own tab alone, never under All, whose songs are on their shelves', () => {
    const bz5 = pieceById('bz5') as Entry
    const shelves = [{ id: 'favourites', entries: [bz5] }, ...COLLECTIONS]
    expect(songsView(shelves, ALL).map((g) => g.shelf.id)).not.toContain('favourites')
    const favourites = songsView(shelves, { ...ALL, collection: 'favourites' })
    expect(favourites.map((g) => g.shelf.id)).toEqual(['favourites'])
    // The search and the filters keep to it.
    expect(songsView(shelves, { ...ALL, collection: 'favourites', q: 'zzzz' })).toEqual([])
  })
})
