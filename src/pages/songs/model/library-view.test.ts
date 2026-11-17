import { describe, expect, it } from 'vitest'
import { arrangeLibrary, INITIAL_LIBRARY, libraryCatalog } from '@/entities/library'
import { entryById, SONG_COLLECTIONS } from '@/entities/piece'
import { libraryView, sortSongs, type ViewLookups } from './library-view'
import type { SongsFilter } from './songs-filter'

const CATALOG = libraryCatalog({ ownSongs: [] })
const layout = arrangeLibrary(INITIAL_LIBRARY, CATALOG)
// Hymns stands in Called to Play; a folder of the learner's in Hymns.
const nestedLayout = arrangeLibrary(
  {
    ...INITIAL_LIBRARY,
    folders: [
      { id: 'called-to-play', parent: null, picture: 'piano', paint: 'sky', songs: [] },
      { id: 'hymns', parent: 'called-to-play', picture: 'church', paint: 'grass', songs: [] },
      {
        id: 'folder-1',
        parent: 'hymns',
        name: 'Advent',
        picture: 'star',
        paint: 'sky',
        songs: ['bz5'],
      },
    ],
  },
  CATALOG,
)
const NONE: SongsFilter = { q: '' }
const lookups: ViewLookups = {
  entryOf: entryById,
  titleOf: (entry) => entry.title,
  folderName: (folder) => folder.name ?? folder.id,
  favourites: new Set(['bz5', 'silent']),
  learned: new Set(['silent']),
  opened: ['silent', 'bz5'],
  compare: (a, b) => a.localeCompare(b, 'en'),
  home: 'Home',
  allSongs: 'All songs',
  addedOf: () => null,
  detailWords: () => [],
}
const view = (filter: Partial<SongsFilter> = {}, folder: string | null = null, at = layout) =>
  libraryView(at, folder as never, { ...NONE, ...filter }, 'title', 'ascending', lookups)
const ids = (groups: ReturnType<typeof view>['groups']) =>
  groups.flatMap((group) => group.entries.map((entry) => entry.id))
const byTitle = (entries: readonly { title: string }[]) =>
  entries.map((e) => e.title).toSorted((a, b) => a.localeCompare(b, 'en'))
const songsOf = (id: string) => SONG_COLLECTIONS.find((c) => c.id === id)?.entries ?? []
const every = SONG_COLLECTIONS.flatMap((c) => c.entries)

describe('libraryView', () => {
  it('lists every song in one list, by title, the folders left out (All songs)', () => {
    const all = libraryView(layout, null, NONE, 'title', 'ascending', lookups, { tree: true })
    expect(all.folders).toEqual([])
    expect(all.groups).toHaveLength(1)
    expect(all.groups[0]?.entries.map((e) => e.title)).toEqual(byTitle(every))
    expect(all.hidden).toBe(0)
  })

  it('lists the favourites alone (My songs’ Favourites card)', () => {
    const found = libraryView(layout, null, NONE, 'title', 'ascending', lookups, {
      tree: true,
      favouritesOnly: true,
    })
    expect(ids(found.groups).toSorted()).toEqual(['bz5', 'silent'])
  })

  it('lists a folder’s own songs in one list', () => {
    const inHymns = libraryView(nestedLayout, 'hymns', NONE, 'title', 'ascending', lookups, {
      tree: true,
    })
    expect(inHymns.folders).toEqual([])
    expect(inHymns.groups[0]?.entries.map((e) => e.title)).toEqual(byTitle(songsOf('hymns')))
  })

  it('at Home lists every song under the folders, in one list headed All songs', () => {
    const home = libraryView(layout, null, NONE, 'title', 'ascending', lookups, {
      everySong: true,
    })
    expect(home.folders.map((each) => each.folder.id)).toEqual(SONG_COLLECTIONS.map((c) => c.id))
    expect(home.groups[0]?.heading).toBe('All songs')
    expect(ids(home.groups).toSorted()).toEqual(every.map((e) => e.id).toSorted())
  })

  it('counts a folder’s songs, folders and learned songs', () => {
    const [first] = view().folders
    expect(first).toMatchObject({ folders: 0, songs: songsOf('learning-songs').length })
    const hymns = view({}, 'called-to-play', nestedLayout).folders
    expect(hymns.map((each) => [each.folder.id, each.folders])).toEqual([['hymns', 1]])
  })

  it('at Home, a search looks through every folder, the songs under their folders’ paths', () => {
    const found = view({ q: 'тихая' })
    expect(found.groups.map((group) => group.heading)).toEqual(['hymns'])
    expect(ids(found.groups)).toContain('silent')
    expect(found.hidden).toBe(found.scope.length - found.shown)
    expect(view({ q: 'hymns' }).folders.map((each) => each.folder.id)).toEqual(['hymns'])
  })

  it('in a folder, a search narrows its songs, saying how many it hides', () => {
    const narrowed = view({ q: 'zzzz' }, 'hymns')
    expect(narrowed.groups).toEqual([])
    expect(narrowed.hidden).toBe(narrowed.scope.length)
  })
})

describe('sortSongs', () => {
  const songs = ['bz5', 'silent', 'h1'].flatMap((id) => entryById(id) ?? [])
  it('sorts by title either way', () => {
    const up = sortSongs(songs, 'title', 'ascending', lookups).map((e) => e.title)
    expect(up).toEqual(byTitle(songs))
    expect(sortSongs(songs, 'title', 'descending', lookups).map((e) => e.title)).toEqual(
      up.toReversed(),
    )
  })

  it('puts the songs played last first, those never played after', () => {
    expect(sortSongs(songs, 'played', 'descending', lookups).map((e) => e.id)).toEqual([
      'silent',
      'bz5',
      'h1',
    ])
    expect(sortSongs(songs, 'played', 'ascending', lookups).map((e) => e.id)).toEqual([
      'bz5',
      'silent',
      'h1',
    ])
  })

  it('sorts by when a song came in, the app’s songs after the learner’s', () => {
    const added = {
      ...lookups,
      addedOf: (id: string) => (id === 'h1' ? '2026-11-04T10:00:00Z' : null),
    }
    expect(sortSongs(songs, 'added', 'descending', added)[0]?.id).toBe('h1')
  })
})
