import { describe, expect, it } from 'vitest'
import { arrangeLibrary, savedLayout, type LibraryCatalog } from './arrangement'
import { INITIAL_LIBRARY, type LibraryState } from './store'

const CATALOG: LibraryCatalog = {
  collections: [
    { id: 'learning-songs', songs: ['a1', 'a2', 'a3'] },
    { id: 'hymns', songs: ['h1', 'h2'] },
    { id: 'gorshkov', songs: ['g1'] },
  ],
  ownSongs: ['my-1', 'my-2'],
}

const library = (state: Partial<LibraryState>) => ({ ...INITIAL_LIBRARY, ...state })
const MINE = { id: 'folder-1', name: 'Mine', picture: 'star', paint: 'sky' } as const

describe('arrangeLibrary', () => {
  it('stands each collection as a folder of its songs, in catalog order, and the own songs at Home', () => {
    const layout = arrangeLibrary(INITIAL_LIBRARY, CATALOG)
    expect(layout.folders).toEqual([
      {
        id: 'learning-songs',
        picture: 'music',
        paint: 'yellow',
        builtIn: true,
        songs: ['a1', 'a2', 'a3'],
      },
      { id: 'hymns', picture: 'church', paint: 'grass', builtIn: true, songs: ['h1', 'h2'] },
      { id: 'gorshkov', picture: 'mic', paint: 'sand', builtIn: true, songs: ['g1'] },
    ])
    expect(layout.home).toEqual(['my-1', 'my-2'])
    expect(layout.archive).toEqual([])
  })

  it('stands a built-in folder it does not hold after the folders it holds', () => {
    const layout = arrangeLibrary(
      library({
        folders: [
          { ...MINE, songs: [] },
          { id: 'hymns', picture: 'star', paint: 'sky', songs: ['h2', 'h1'] },
        ],
      }),
      CATALOG,
    )
    expect(layout.folders.map((folder) => folder.id)).toEqual([
      'folder-1',
      'hymns',
      'learning-songs',
      'gorshkov',
    ])
    expect(layout.folders[1]?.songs).toEqual(['h2', 'h1'])
  })

  it('stands a built-in song it places nowhere last in its collection’s folder, archived with it', () => {
    const layout = arrangeLibrary(
      library({
        folders: [{ id: 'learning-songs', picture: 'music', paint: 'yellow', songs: ['a3'] }],
        home: ['a1'],
        archive: [
          {
            kind: 'folder',
            folder: { id: 'hymns', picture: 'church', paint: 'grass', songs: [] },
            index: 1,
          },
        ],
      }),
      CATALOG,
    )
    expect(layout.folders.find((folder) => folder.id === 'learning-songs')?.songs).toEqual([
      'a3',
      'a2',
    ])
    expect(layout.home).toEqual(['a1', 'my-1', 'my-2'])
    expect(layout.archive).toEqual([
      {
        kind: 'folder',
        folder: {
          id: 'hymns',
          picture: 'church',
          paint: 'grass',
          builtIn: true,
          songs: ['h1', 'h2'],
        },
        index: 1,
      },
    ])
  })

  it('stands an own song placed nowhere at Home, and leaves out what the repertoire has not', () => {
    const layout = arrangeLibrary(
      library({ folders: [{ ...MINE, songs: ['my-9', 'my-2', 'gone'] }], home: ['my-7'] }),
      CATALOG,
    )
    expect(layout.folders[0]?.songs).toEqual(['my-2'])
    expect(layout.home).toEqual(['my-1'])
  })

  it('keeps the archive’s songs out of the library, newest first', () => {
    const layout = arrangeLibrary(
      library({
        archive: [
          { kind: 'song', id: 'my-1', from: { folder: null, index: 0 } },
          { kind: 'song', id: 'a2', from: { folder: 'learning-songs', index: 1 } },
          { kind: 'song', id: 'my-8', from: { folder: null, index: 0 } },
        ],
      }),
      CATALOG,
    )
    expect(layout.home).toEqual(['my-2'])
    expect(layout.folders[0]?.songs).toEqual(['a1', 'a3'])
    expect(layout.archive.map((entry) => (entry.kind === 'song' ? entry.id : ''))).toEqual([
      'my-1',
      'a2',
    ])
  })

  it('writes nothing as it reads, and saves a layout back as the store holds it', () => {
    const state = library({ home: ['my-2'] })
    const layout = arrangeLibrary(state, CATALOG)
    expect(state).toEqual(library({ home: ['my-2'] }))
    const saved = savedLayout(layout)
    expect(saved.home).toEqual(['my-2', 'my-1'])
    expect(saved.folders[0]).toEqual({
      id: 'learning-songs',
      picture: 'music',
      paint: 'yellow',
      songs: ['a1', 'a2', 'a3'],
    })
    expect(arrangeLibrary(library(saved), CATALOG)).toEqual(layout)
  })
})
