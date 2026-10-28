import { describe, expect, it } from 'vitest'
import { arrangeLibrary, createLibraryStore, libraryCatalog } from '@/entities/library'
import { createPiecesStore, musicOf, PIECES, type ChartPiece } from '@/entities/piece'
import { makeFolder } from '@/features/manage-library'
import { createMemoryStorage } from '@/shared/lib'
import { standardMidiFile, noteEvents } from '@/shared/lib/standard-midi-file'
import { importSong } from './import-song'
import { musicXmlOf } from './model/music-xml-of'
import { MOST_BYTES, readSongFile } from './model/read-song-file'

const saving = () => ({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
const fileOf = (name: string, content: string | Uint8Array, size?: number) => {
  const bytes = typeof content === 'string' ? new TextEncoder().encode(content) : content
  return { name, size: size ?? bytes.length, arrayBuffer: async () => bytes.slice().buffer }
}
const PIECE = PIECES.find((piece) => piece.id === 'bz5') as ChartPiece
const NAMES = { title: 'Still, my soul', headings: [], staffNames: [], piano: 'Piano' }

describe('readSongFile', () => {
  it('reads a MusicXML file, a MIDI file, whatever their names say', async () => {
    const xml = await readSongFile(fileOf('song.txt', musicXmlOf(musicOf(PIECE), NAMES)))
    expect(xml).toMatchObject({ ok: true, song: { title: 'Still, my soul' } })
    const midi = standardMidiFile([
      { events: noteEvents([{ key: 60, on: 0, off: 1920, velocity: 80 }], 0), end: 1920 },
    ])
    expect(await readSongFile(fileOf('tune.xml', midi))).toMatchObject({
      ok: true,
      song: { title: 'tune', music: { hands: { rh: 'C4/4' } } },
    })
  })

  it('says why a file is no song: too large, no score, broken', async () => {
    expect(await readSongFile(fileOf('big.mid', 'x', MOST_BYTES + 1))).toEqual({
      ok: false,
      problem: 'too-large',
    })
    expect(await readSongFile(fileOf('photo.jpg', 'not a score at all'))).toEqual({
      ok: false,
      problem: 'not-a-score',
    })
    expect(await readSongFile(fileOf('page.xml', '<html><body/></html>'))).toEqual({
      ok: false,
      problem: 'not-a-score',
    })
    expect(await readSongFile(fileOf('cut.musicxml', '<score-partwise><part-list>'))).toEqual({
      ok: false,
      problem: 'broken',
    })
  })
})

describe('importSong', () => {
  it('makes the song the learner’s, in the folder open', async () => {
    const pieces = createPiecesStore(saving())
    const library = createLibraryStore(saving())
    const read = await readSongFile(fileOf('song.musicxml', musicXmlOf(musicOf(PIECE), NAMES)))
    if (!read.ok) throw new Error('read')
    const catalog = () => libraryCatalog({ ownSongs: pieces.getState().songs })
    const folder = makeFolder(library, catalog(), { name: 'Hymns', picture: 'music', paint: 'sky' })
    const id = importSong(pieces, library, read.song, folder)
    expect(id).toBe('my-1')
    expect(pieces.getState().songs[0]).toMatchObject({ id, title: 'Still, my soul', key: 'G' })
    const layout = arrangeLibrary(library.getState(), catalog())
    expect(layout.folders.find((each) => each.id === folder)?.songs).toEqual([id])
  })
})
