import { describe, expect, it } from 'vitest'
import { pieceStage } from '@/entities/course'
import { arrangeLibrary, INITIAL_LIBRARY, libraryCatalog } from '@/entities/library'
import { entryById, SONG_COLLECTIONS, type Entry } from '@/entities/piece'
import type { KeyParam } from '@/shared/lib/music'
import {
  compareKeys,
  filtersOn,
  keysIn,
  libraryView,
  songKeyParam,
  sortSongs,
  stagesIn,
  type ViewLookups,
} from './library-view'
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
const NONE: SongsFilter = {
  q: '',
  stage: 'any',
  key: '',
  favourites: false,
  folder: 'any',
  learned: 'any',
}
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
}
const view = (filter: Partial<SongsFilter> = {}, folder: string | null = null, at = layout) =>
  libraryView(at, folder as never, { ...NONE, ...filter }, 'manual', lookups)
const ids = (groups: ReturnType<typeof view>['groups']) =>
  groups.flatMap((group) => group.entries.map((entry) => entry.id))
const songsOf = (id: string) => SONG_COLLECTIONS.find((c) => c.id === id)?.entries ?? []

describe('libraryView', () => {
  it('Not in a folder keeps Home’s own songs alone, through the whole library (R31-S)', () => {
    // A song moved out of its collection stands at Home, in no folder; filtering looks through all.
    const at = arrangeLibrary({ ...INITIAL_LIBRARY, home: ['bz5'] }, CATALOG)
    expect(ids(view({ folder: 'none' }, null, at).groups)).toEqual(['bz5'])
    expect(filtersOn({ ...NONE, folder: 'none' })).toBe(1)
  })

  it('Progress keeps the songs learned, or those not learned yet (R31-S)', () => {
    expect(ids(view({ learned: 'yes' }).groups)).toEqual(['silent'])
    const notYet = ids(view({ learned: 'no' }).groups)
    expect(notYet).not.toContain('silent')
    expect(notYet).toContain('bz5')
    expect(filtersOn({ ...NONE, learned: 'no' })).toBe(1)
  })

  it('at Home lists every song under the folders, in one list headed All songs', () => {
    const home = libraryView(layout, null, NONE, 'manual', lookups, { everySong: true })
    expect(home.folders.map((each) => each.folder.id)).toEqual(SONG_COLLECTIONS.map((c) => c.id))
    expect(home.groups).toHaveLength(1)
    expect(home.groups[0]?.key).toBe('all')
    expect(home.groups[0]?.heading).toBe('All songs')
    expect(ids(home.groups)).toEqual(SONG_COLLECTIONS.flatMap((c) => c.entries.map((e) => e.id)))
  })

  it('on a laptop lists every song at Home in one list, the tree holding the folders', () => {
    const all = libraryView(layout, null, NONE, 'manual', lookups, { tree: true })
    expect(all.folders).toEqual([])
    expect(all.groups).toHaveLength(1)
    expect(ids(all.groups)).toEqual(SONG_COLLECTIONS.flatMap((c) => c.entries.map((e) => e.id)))
    expect(all.hidden).toBe(0)
  })

  it('on a laptop lists a folder’s own songs, its folders in the tree', () => {
    const inHymns = libraryView(nestedLayout, 'hymns', NONE, 'manual', lookups, { tree: true })
    expect(inHymns.folders).toEqual([])
    expect(ids(inHymns.groups)).toEqual(songsOf('hymns').map((e) => e.id))
  })

  it('on a laptop narrows every song at Home, in one list', () => {
    const found = libraryView(layout, null, { ...NONE, favourites: true }, 'manual', lookups, {
      tree: true,
    })
    expect(found.groups).toHaveLength(1)
    expect(ids(found.groups).toSorted()).toEqual(['bz5', 'silent'])
  })

  it('shows Home’s folders, then its own songs, hiding nothing while nothing filters', () => {
    const home = view()
    expect(home.folders.map((each) => each.folder.id)).toEqual(SONG_COLLECTIONS.map((c) => c.id))
    expect(home.groups).toEqual([{ key: 'home', heading: null, folder: null, entries: [] }])
    expect(home.hidden).toBe(0)
  })

  it('counts a folder’s songs, folders and learned songs', () => {
    const [first] = view().folders
    const songs = songsOf('learning-songs')
    expect(first).toMatchObject({ folders: 0, songs: songs.length })
    expect(first?.learned).toBe(0)
    const hymns = view({}, 'called-to-play', nestedLayout).folders
    expect(hymns.map((each) => [each.folder.id, each.folders])).toEqual([['hymns', 1]])
  })

  it('shows a folder’s folders, then its songs in their order', () => {
    const hymns = view({}, 'hymns', nestedLayout)
    expect(hymns.folders.map((each) => each.folder.id)).toEqual(['folder-1'])
    expect(ids(hymns.groups)).toEqual(songsOf('hymns').map((e) => e.id))
    expect(view({}, null, nestedLayout).folders.map((each) => each.folder.id)).not.toContain(
      'hymns',
    )
  })

  it('at Home, looks through every folder, the songs that match under their folders’ paths', () => {
    const found = view({ q: 'тихая' })
    expect(found.groups.map((group) => group.heading)).toEqual(['hymns'])
    expect(ids(found.groups)).toContain('silent')
    expect(found.hidden).toBe(found.scope.length - found.shown)
    expect(found.folders).toEqual([])
    expect(view({ q: 'hymns' }).folders.map((each) => each.folder.id)).toEqual(['hymns'])
    const deep = view({ favourites: true }, null, nestedLayout)
    expect(deep.groups.map((group) => [group.heading, ids([group])])).toEqual([
      ['called-to-play › hymns', ['silent']],
      ['called-to-play › hymns › Advent', ['bz5']],
    ])
  })

  it('in a folder, looks through the folders in it too, their paths from it', () => {
    const found = view({ favourites: true }, 'called-to-play', nestedLayout)
    expect(found.groups.map((group) => group.heading)).toEqual(['hymns', 'hymns › Advent'])
    expect(found.scope.length).toBe(songsOf('called-to-play').length + songsOf('hymns').length + 1)
  })

  it('narrows by the favourites, the level and the key, counting the filters on', () => {
    expect(ids(view({ favourites: true }).groups).toSorted()).toEqual(['bz5', 'silent'])
    const stage = pieceStage('bz5')
    if (stage)
      expect(ids(view({ stage }).groups).every((id) => pieceStage(id) === stage)).toBe(true)
    const bz5 = entryById('bz5')
    if (!bz5) throw new Error('bz5')
    const inKey = ids(view({ key: songKeyParam(bz5) }).groups)
    expect(inKey).toContain('bz5')
    expect(inKey.every((id) => songKeyParam(entryById(id) as Entry) === songKeyParam(bz5))).toBe(
      true,
    )
    expect(filtersOn({ ...NONE, q: 'x' })).toBe(0)
    expect(filtersOn({ ...NONE, key: songKeyParam(bz5), favourites: true })).toBe(2)
  })

  it('in a folder, narrows its songs, saying how many it hides', () => {
    const narrowed = view({ q: 'zzzz' }, 'hymns')
    expect(narrowed.groups).toEqual([])
    expect(narrowed.hidden).toBe(narrowed.scope.length)
  })
})

describe('sortSongs', () => {
  const songs = ['bz5', 'silent', 'h1'].flatMap((id) => entryById(id) ?? [])
  it('keeps the order dragged, sorts by title or key, or puts the songs played last first', () => {
    expect(sortSongs(songs, 'manual', lookups).map((e) => e.id)).toEqual(songs.map((e) => e.id))
    const byName = sortSongs(songs, 'name', lookups).map((e) => e.title)
    expect(byName).toEqual(songs.map((e) => e.title).toSorted((a, b) => a.localeCompare(b, 'en')))
    expect(
      sortSongs(songs, 'recent', lookups)
        .map((e) => e.id)
        .slice(0, 2),
    ).toEqual(['silent', 'bz5'])
    const keys = sortSongs(songs, 'key', lookups).map(songKeyParam)
    expect(keys).toEqual(keys.toSorted(compareKeys))
  })
})

describe('the keys', () => {
  it('orders the majors from C up, then the minors', () => {
    const keys = ['Am', 'G', 'C', 'Eb', 'Em'] as KeyParam[]
    expect(keys.toSorted(compareKeys)).toEqual(['C', 'Eb', 'G', 'Em', 'Am'])
  })

  it('offers each key the songs hold once, with how many', () => {
    const all = SONG_COLLECTIONS.flatMap((collection) => collection.entries)
    const keys = keysIn(all)
    expect(keys.reduce((sum, each) => sum + each.count, 0)).toBe(all.length)
    expect(new Set(keys.map((each) => each.key)).size).toBe(keys.length)
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
