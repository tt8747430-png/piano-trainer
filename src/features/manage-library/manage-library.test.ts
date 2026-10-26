import { describe, expect, it } from 'vitest'
import {
  arrangeLibrary,
  childFolders,
  createLibraryStore,
  type FolderId,
  type LibraryCatalog,
  type LibraryStore,
} from '@/entities/library'
import { createPiecesStore } from '@/entities/piece'
import { createTakesStore } from '@/entities/take'
import { makeSong } from '@/features/edit-piece'
import { saveTake } from '@/features/manage-takes'
import { createMemoryStorage } from '@/shared/lib'
import { C_MAJOR } from '@/shared/lib/music'
import {
  archiveFolder,
  archiveSongs,
  deleteFolder,
  deleteOwnSongs,
  editFolder,
  makeFolder,
  moveTo,
  orderFolders,
  orderSongs,
  restoreAll,
  restoreFolder,
  restoreSongs,
  setFavourites,
  setSort,
  toggleFavourite,
  undoMove,
} from './index'

const saving = () => ({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
const CATALOG: LibraryCatalog = {
  collections: [
    { id: 'learning-songs', songs: ['a1', 'a2', 'a3'] },
    { id: 'hymns', songs: ['h1', 'h2'] },
  ],
  ownSongs: ['my-1', 'my-2'],
}
const LOOK = { picture: 'star', paint: 'sky' } as const

const fresh = () => createLibraryStore(saving())
const layout = (store: LibraryStore, catalog = CATALOG) => arrangeLibrary(store.getState(), catalog)
/** Each folder by its id with its songs, and Home's: the library at a glance. */
const shelves = (store: LibraryStore, catalog = CATALOG): Record<string, readonly string[]> => {
  const { folders, home } = layout(store, catalog)
  return { ...Object.fromEntries(folders.map((folder) => [folder.id, folder.songs])), home }
}
const archived = (store: LibraryStore, catalog = CATALOG) =>
  layout(store, catalog).archive.map((entry) =>
    entry.kind === 'song'
      ? entry.id
      : [entry.folder, ...entry.subfolders]
          .map((folder) => `${folder.id}[${folder.songs.join(' ')}]`)
          .join(' > '),
  )
/** Each folder by its id, where it stands, from Home down in each place's order: the tree at a glance. */
const tree = (store: LibraryStore, catalog = CATALOG) => {
  const { folders } = layout(store, catalog)
  const walk = (parent: FolderId | null): string[] =>
    childFolders(folders, parent).flatMap((folder) => [
      `${parent ?? 'home'}/${folder.id}`,
      ...walk(folder.id),
    ])
  return walk(null)
}

describe('favourites', () => {
  it('toggles a song, the newest first, and sets several at once', () => {
    const store = fresh()
    toggleFavourite(store, 'a1')
    toggleFavourite(store, 'h1')
    expect(store.getState().favourites).toEqual(['h1', 'a1'])
    toggleFavourite(store, 'a1')
    expect(store.getState().favourites).toEqual(['h1'])
    setFavourites(store, ['a2', 'h1'], true)
    expect(store.getState().favourites).toEqual(['a2', 'h1'])
    setFavourites(store, ['a2', 'h1'], false)
    expect(store.getState().favourites).toEqual([])
  })
})

describe('moveSongs', () => {
  it('moves songs to the end of a folder or of Home, and its Undo puts each back where it stood', () => {
    const store = fresh()
    const moved = moveTo(store, CATALOG, { songs: ['a2', 'my-1', 'h2'], folders: [] }, 'hymns')
    expect(shelves(store)).toEqual({
      'learning-songs': ['a1', 'a3'],
      hymns: ['h1', 'h2', 'a2', 'my-1'],
      home: ['my-2'],
    })
    undoMove(store, CATALOG, moved)
    expect(shelves(store)).toEqual({
      'learning-songs': ['a1', 'a2', 'a3'],
      hymns: ['h1', 'h2'],
      home: ['my-1', 'my-2'],
    })
  })

  it('moves to Home, and says nothing of a song already where it goes', () => {
    const store = fresh()
    expect(moveTo(store, CATALOG, { songs: ['a3', 'my-2'], folders: [] }, null)).toEqual({
      songs: [{ id: 'a3', from: { folder: 'learning-songs', index: 2 } }],
      folders: [],
    })
    expect(shelves(store).home).toEqual(['my-1', 'my-2', 'a3'])
  })
})

describe('the order', () => {
  it('writes the order dropped over the folders and over a list’s songs, those hidden keeping theirs', () => {
    const store = fresh()
    orderFolders(store, CATALOG, ['hymns', 'learning-songs'])
    orderSongs(store, CATALOG, 'learning-songs', ['a3', 'a1'])
    orderSongs(store, CATALOG, null, ['my-2', 'my-1'])
    expect(shelves(store)).toEqual({
      hymns: ['h1', 'h2'],
      'learning-songs': ['a3', 'a2', 'a1'],
      home: ['my-2', 'my-1'],
    })
    expect(layout(store).folders.map((folder) => folder.id)).toEqual(['hymns', 'learning-songs'])
  })

  it('keeps the sort chosen', () => {
    const store = fresh()
    setSort(store, 'recent')
    expect(store.getState().sort).toBe('recent')
  })
})

describe('the archive', () => {
  it('archives songs, the newest first, and restores each where it stood', () => {
    const store = fresh()
    expect(archiveSongs(store, CATALOG, ['a2', 'nope'])).toEqual(['a2'])
    archiveSongs(store, CATALOG, ['my-1'])
    expect(archived(store)).toEqual(['my-1', 'a2'])
    expect(shelves(store)).toMatchObject({ 'learning-songs': ['a1', 'a3'], home: ['my-2'] })
    restoreSongs(store, CATALOG, ['a2', 'my-1'])
    expect(archived(store)).toEqual([])
    expect(shelves(store)).toMatchObject({
      'learning-songs': ['a1', 'a2', 'a3'],
      home: ['my-1', 'my-2'],
    })
  })

  it('restores a song whose folder is gone at Home, last', () => {
    const store = fresh()
    archiveSongs(store, CATALOG, ['h1'])
    archiveFolder(store, CATALOG, 'hymns')
    restoreSongs(store, CATALOG, ['h1'])
    expect(shelves(store).home).toEqual(['my-1', 'my-2', 'h1'])
    expect(archived(store)).toEqual(['hymns[h2]'])
  })

  it('archives a folder with its songs; Restore brings it back at Home, last, Undo where it stood', () => {
    const store = fresh()
    archiveFolder(store, CATALOG, 'learning-songs')
    expect(archived(store)).toEqual(['learning-songs[a1 a2 a3]'])
    expect(layout(store).folders.map((folder) => folder.id)).toEqual(['hymns'])
    restoreFolder(store, CATALOG, 'learning-songs')
    expect(layout(store).folders.map((folder) => folder.id)).toEqual(['hymns', 'learning-songs'])
    expect(shelves(store)['learning-songs']).toEqual(['a1', 'a2', 'a3'])
    archiveFolder(store, CATALOG, 'hymns')
    restoreFolder(store, CATALOG, 'hymns', true)
    expect(layout(store).folders.map((folder) => folder.id)).toEqual(['hymns', 'learning-songs'])
  })

  it('restores everything: the folders at Home, then each song where it stood', () => {
    const store = fresh()
    archiveSongs(store, CATALOG, ['a1'])
    archiveFolder(store, CATALOG, 'learning-songs')
    archiveSongs(store, CATALOG, ['my-2'])
    restoreAll(store, CATALOG)
    expect(archived(store)).toEqual([])
    expect(shelves(store)).toEqual({
      hymns: ['h1', 'h2'],
      'learning-songs': ['a1', 'a2', 'a3'],
      home: ['my-1', 'my-2'],
    })
  })
})

describe('folders', () => {
  it('makes an own folder at Home, last, with the songs moved in, its id never given twice', () => {
    const store = fresh()
    expect(
      makeFolder(store, CATALOG, { name: '  Sunday ', ...LOOK }, { songs: ['a1', 'my-2'] }),
    ).toBe('folder-1')
    expect(makeFolder(store, CATALOG, { name: '   ', ...LOOK })).toBeNull()
    expect(layout(store).folders.at(-1)).toEqual({
      id: 'folder-1',
      parent: null,
      name: 'Sunday',
      ...LOOK,
      builtIn: false,
      songs: ['a1', 'my-2'],
    })
    expect(shelves(store)).toMatchObject({ 'learning-songs': ['a2', 'a3'], home: ['my-1'] })
    expect(store.getState().nextFolder).toBe(2)
  })

  it('edits a folder’s name and look; a built-in one given no name says its collection’s again', () => {
    const store = fresh()
    editFolder(store, CATALOG, 'hymns', { name: 'Sunday', picture: 'sun', paint: 'lilac' })
    expect(layout(store).folders[1]).toMatchObject({
      name: 'Sunday',
      picture: 'sun',
      paint: 'lilac',
    })
    editFolder(store, CATALOG, 'hymns', { name: undefined, picture: 'sun', paint: 'lilac' })
    expect(layout(store).folders[1]?.name).toBeUndefined()
    const own = makeFolder(store, CATALOG, { name: 'Mine', ...LOOK }) ?? 'folder-0'
    editFolder(store, CATALOG, own, { name: ' ', picture: 'heart', paint: 'sand' })
    expect(layout(store).folders.at(-1)).toMatchObject({ name: 'Mine', picture: 'heart' })
  })
})

describe('deleting', () => {
  const stores = () => {
    const pieces = createPiecesStore(saving())
    const takes = createTakesStore(saving())
    const library = fresh()
    const song = (title: string) =>
      makeSong(pieces, { title, key: C_MAJOR, meter: '4/4' }) ?? 'my-0'
    return { library, pieces, takes, song }
  }
  const catalogOf = (pieces: ReturnType<typeof stores>['pieces']): LibraryCatalog => ({
    ...CATALOG,
    ownSongs: pieces.getState().songs.map((song) => song.id),
  })

  it('deletes an own folder: its own songs for good with their takes, the app’s each to the archive', () => {
    const { library, pieces, takes, song } = stores()
    const [mine, kept] = [song('Mine'), song('Kept')]
    saveTake(takes, {
      pieceId: mine,
      made: 0,
      tempo: 90,
      meter: '4/4',
      fromBar: 1,
      notes: [],
      pedals: [],
      length: 0,
      bars: [0],
    })
    const catalog = catalogOf(pieces)
    toggleFavourite(library, mine)
    const folder = makeFolder(
      library,
      catalog,
      { name: 'Sunday', ...LOOK },
      {
        songs: ['h2', mine, 'a1'],
      },
    )
    deleteFolder({ library, pieces, takes }, catalog, folder ?? 'folder-0')
    expect(pieces.getState().songs.map((each) => each.id)).toEqual([kept])
    expect(takes.getState().takes).toEqual([])
    expect(library.getState().favourites).toEqual([])
    const after = catalogOf(pieces)
    expect(layout(library, after).folders.map((each) => each.id)).toEqual([
      'learning-songs',
      'hymns',
    ])
    expect(archived(library, after)).toEqual(['h2', 'a1'])
    expect(shelves(library, after).home).toEqual([kept])
    // Restored, each goes to its collection's folder, last.
    restoreSongs(library, after, ['h2', 'a1'])
    expect(shelves(library, after)).toEqual({
      'learning-songs': ['a2', 'a3', 'a1'],
      hymns: ['h1', 'h2'],
      home: [kept],
    })
  })

  it('deletes a built-in folder to the archive whole with the app’s songs, and restores it whole', () => {
    const { library, pieces, takes, song } = stores()
    const mine = song('Mine')
    const catalog = catalogOf(pieces)
    moveTo(library, catalog, { songs: [mine], folders: [] }, 'hymns')
    deleteFolder({ library, pieces, takes }, catalog, 'hymns')
    expect(pieces.getState().songs).toEqual([])
    const after = catalogOf(pieces)
    expect(archived(library, after)).toEqual(['hymns[h1 h2]'])
    restoreFolder(library, after, 'hymns')
    expect(shelves(library, after)).toEqual({
      'learning-songs': ['a1', 'a2', 'a3'],
      hymns: ['h1', 'h2'],
      home: [],
    })
  })

  it('deletes an own folder from the archive, its app’s songs staying there', () => {
    const { library, pieces, takes } = stores()
    const folder =
      makeFolder(library, CATALOG, { name: 'Sunday', ...LOOK }, { songs: ['h1'] }) ?? 'folder-0'
    archiveSongs(library, CATALOG, ['a2'])
    archiveFolder(library, CATALOG, folder)
    deleteFolder({ library, pieces, takes }, CATALOG, folder)
    expect(archived(library)).toEqual(['h1', 'a2'])
  })

  it('deletes the learner’s own songs for good, never the app’s', () => {
    const { library, pieces, takes, song } = stores()
    const [one, two] = [song('One'), song('Two')]
    const catalog = catalogOf(pieces)
    archiveSongs(library, catalog, [two])
    deleteOwnSongs({ library, pieces, takes }, catalog, [one, two, 'a1'])
    expect(pieces.getState().songs).toEqual([])
    const after = catalogOf(pieces)
    expect(archived(library, after)).toEqual([])
    expect(shelves(library, after)['learning-songs']).toEqual(['a1', 'a2', 'a3'])
  })
})

describe('folders in folders', () => {
  /** Sunday, at Home, holds Advent, which holds Hymns (moved in), and Advent holds a2. */
  const nested = () => {
    const store = fresh()
    const sunday = makeFolder(store, CATALOG, { name: 'Sunday', ...LOOK }) ?? 'folder-0'
    const advent =
      makeFolder(store, CATALOG, { name: 'Advent', ...LOOK }, { parent: sunday, songs: ['a2'] }) ??
      'folder-0'
    moveTo(store, CATALOG, { songs: [], folders: ['hymns'] }, advent)
    return { store, sunday, advent }
  }

  it('makes a folder in a folder, and moves a folder into another, its songs with it', () => {
    const { store } = nested()
    expect(tree(store)).toEqual([
      'home/learning-songs',
      'home/folder-1',
      'folder-1/folder-2',
      'folder-2/hymns',
    ])
    expect(shelves(store)).toMatchObject({ 'folder-2': ['a2'], hymns: ['h1', 'h2'] })
  })

  it('moves no folder into itself or a folder under it, and its Undo puts each back', () => {
    const { store, sunday, advent } = nested()
    expect(moveTo(store, CATALOG, { songs: [], folders: [sunday] }, advent).folders).toEqual([])
    const moves = moveTo(store, CATALOG, { songs: ['a1'], folders: [advent, 'hymns'] }, null)
    // Hymns moves with Advent, under it.
    expect(moves.folders).toEqual([{ id: advent, parent: sunday, index: 0 }])
    expect(tree(store)).toEqual([
      'home/learning-songs',
      'home/folder-1',
      'home/folder-2',
      'folder-2/hymns',
    ])
    undoMove(store, CATALOG, moves)
    expect(tree(store)).toEqual([
      'home/learning-songs',
      'home/folder-1',
      'folder-1/folder-2',
      'folder-2/hymns',
    ])
    expect(shelves(store)['learning-songs']).toEqual(['a1', 'a3'])
  })

  it('archives a folder with every folder under it, and restores it in its folder, Undo exactly', () => {
    const { store, sunday, advent } = nested()
    archiveFolder(store, CATALOG, advent)
    expect(archived(store)).toEqual(['folder-2[a2] > hymns[h1 h2]'])
    expect(tree(store)).toEqual(['home/learning-songs', 'home/folder-1'])
    restoreFolder(store, CATALOG, advent)
    expect(tree(store)).toEqual([
      'home/learning-songs',
      'home/folder-1',
      'folder-1/folder-2',
      'folder-2/hymns',
    ])
    // Its folder archived after it: Restore brings it to Home.
    archiveFolder(store, CATALOG, advent)
    archiveFolder(store, CATALOG, sunday)
    restoreFolder(store, CATALOG, advent)
    expect(tree(store)).toEqual(['home/learning-songs', 'home/folder-2', 'folder-2/hymns'])
    // A song archived with it comes out of it alone.
    archiveFolder(store, CATALOG, advent)
    restoreSongs(store, CATALOG, ['h1'])
    expect(shelves(store).home).toEqual(['my-1', 'my-2', 'h1'])
  })

  it('orders the folders of one place, the others keeping theirs', () => {
    const { store, sunday } = nested()
    const third = makeFolder(store, CATALOG, { name: 'Third', ...LOOK }, { parent: sunday })
    orderFolders(store, CATALOG, [third ?? 'folder-0', 'folder-2'])
    expect(tree(store)).toEqual([
      'home/learning-songs',
      'home/folder-1',
      'folder-1/folder-3',
      'folder-1/folder-2',
      'folder-2/hymns',
    ])
  })

  it('deletes a folder with every folder under it, each by its rule', () => {
    const { store, sunday } = nested()
    const pieces = createPiecesStore(saving())
    const takes = createTakesStore(saving())
    deleteFolder({ library: store, pieces, takes }, CATALOG, sunday)
    expect(tree(store)).toEqual(['home/learning-songs'])
    // Advent's app song to the archive on its own, Hymns whole.
    expect(archived(store)).toEqual(['a2', 'hymns[h1 h2]'])
    restoreFolder(store, CATALOG, 'hymns')
    expect(tree(store)).toEqual(['home/learning-songs', 'home/hymns'])
  })
})
