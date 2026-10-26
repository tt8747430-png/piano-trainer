import { describe, expect, it } from 'vitest'
import { pieceStage } from '@/entities/course'
import { arrangeLibrary, INITIAL_LIBRARY, libraryCatalog } from '@/entities/library'
import { entryById, SONG_COLLECTIONS, type Entry } from '@/entities/piece'
import { chordListParam } from '@/shared/lib'
import { libraryView, sortSongs, stagesIn, type ViewLookups } from './library-view'
import type { SongsFilter } from './songs-filter'

const layout = arrangeLibrary(INITIAL_LIBRARY, libraryCatalog({ ownSongs: [] }))
const NONE: SongsFilter = { q: '', withChords: false, stage: 'any', known: '', favourites: false }
const lookups: ViewLookups = {
  entryOf: entryById,
  titleOf: (entry) => entry.title,
  folderName: (folder) => folder.id,
  favourites: new Set(['bz5', 'silent']),
  opened: ['silent', 'bz5'],
  compare: (a, b) => a.localeCompare(b, 'en'),
  home: 'Home',
}
const view = (filter: Partial<SongsFilter> = {}, folder: string | null = null) =>
  libraryView(layout, folder as never, { ...NONE, ...filter }, 'manual', lookups)
const ids = (groups: ReturnType<typeof view>['groups']) =>
  groups.flatMap((group) => group.entries.map((entry) => entry.id))

describe('libraryView', () => {
  it('shows Home’s folders, then its own songs, hiding nothing while nothing filters', () => {
    const home = view()
    expect(home.folders.map((folder) => folder.id)).toEqual(SONG_COLLECTIONS.map((c) => c.id))
    expect(home.groups).toEqual([{ key: 'home', heading: null, folder: null, entries: [] }])
    expect(home.hidden).toBe(0)
  })

  it('shows a folder’s songs in their order', () => {
    const hymns = view({}, 'hymns')
    expect(hymns.folders).toEqual([])
    expect(ids(hymns.groups)).toEqual(
      SONG_COLLECTIONS.find((c) => c.id === 'hymns')?.entries.map((e) => e.id),
    )
  })

  it('at Home, looks through every folder, the songs that match under their folders’ names', () => {
    const found = view({ q: 'тихая' })
    expect(found.groups.map((group) => group.heading)).toEqual(['hymns'])
    expect(ids(found.groups)).toContain('silent')
    expect(found.hidden).toBe(found.scope.length - found.shown)
    expect(found.folders).toEqual([])
    expect(view({ q: 'hymns' }).folders.map((folder) => folder.id)).toEqual(['hymns'])
  })

  it('narrows by the favourites, With chords, the level and the chords known', () => {
    expect(ids(view({ favourites: true }).groups).toSorted()).toEqual(['bz5', 'silent'])
    expect(
      ids(view({ withChords: true }).groups).every((id) => entryById(id)?.kind !== 'listing'),
    ).toBe(true)
    const stage = pieceStage('bz5')
    if (stage)
      expect(ids(view({ stage }).groups).every((id) => pieceStage(id) === stage)).toBe(true)
    const known = ids(view({ known: chordListParam(['C', 'G', 'F', 'Am']) }).groups)
    expect(known.length).toBeGreaterThan(0)
  })

  it('in a folder, narrows its songs, saying how many it hides', () => {
    const narrowed = view({ q: 'zzzz' }, 'hymns')
    expect(narrowed.groups).toEqual([])
    expect(narrowed.hidden).toBe(narrowed.scope.length)
  })
})

describe('sortSongs', () => {
  const songs = ['bz5', 'silent', 'h1'].flatMap((id) => entryById(id) ?? []) as Entry[]
  it('keeps the order dragged, sorts by title, or puts the songs played last first', () => {
    expect(sortSongs(songs, 'manual', lookups).map((e) => e.id)).toEqual(songs.map((e) => e.id))
    const byName = sortSongs(songs, 'name', lookups).map((e) => e.title)
    expect(byName).toEqual(songs.map((e) => e.title).toSorted((a, b) => a.localeCompare(b, 'en')))
    expect(
      sortSongs(songs, 'recent', lookups)
        .map((e) => e.id)
        .slice(0, 2),
    ).toEqual(['silent', 'bz5'])
  })
})

describe('stagesIn', () => {
  it('offers the levels the songs hold, in order', () => {
    const all = SONG_COLLECTIONS.flatMap((collection) => collection.entries)
    const stages = stagesIn(all)
    expect(stages.length).toBeGreaterThan(0)
    expect(new Set(stages).size).toBe(stages.length)
  })
})
