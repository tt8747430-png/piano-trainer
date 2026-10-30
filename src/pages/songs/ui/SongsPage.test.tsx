import { act, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import {
  arrangeLibrary,
  LIBRARY_STORAGE_KEY,
  LIBRARY_VERSION,
  libraryCatalog,
  placeIn,
  type LibraryState,
} from '@/entities/library'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { markLearned } from '@/features/mark-learned/mark-learned'
import { createMemoryStorage } from '@/shared/lib'
import { noteEvents, standardMidiFile } from '@/shared/lib/standard-midi-file'
import { stubBox } from '@/shared/test/layout'

/** A file chosen in Import's picker. */
function choose(file: File) {
  const picker = document.querySelector<HTMLInputElement>('input[type="file"]')
  if (!picker) throw new Error('a file picker')
  fireEvent.change(picker, { target: { files: [file] } })
}

const SONG = {
  id: 'my-1',
  title: 'Morning',
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['G C D G'] }],
}

/** A device holding the learner's songs (`pieces`) and library (`library`). */
function saved({ pieces, library }: { pieces?: object; library?: object }) {
  const storage = createMemoryStorage()
  if (pieces)
    storage.setItem(PIECES_STORAGE_KEY, JSON.stringify({ state: pieces, version: PIECES_VERSION }))
  if (library)
    storage.setItem(
      LIBRARY_STORAGE_KEY,
      JSON.stringify({ state: library, version: LIBRARY_VERSION }),
    )
  return storage
}

/** Where a song stands in the library the store holds, over the catalog and these own songs. */
const placeOf = (state: LibraryState, id: string, ownSongs: readonly string[] = []) =>
  placeIn(
    arrangeLibrary(state, libraryCatalog({ ownSongs: ownSongs.map((each) => ({ id: each })) })),
    id,
  )

/** The rows of a list by their names and details, a folder's first songs left out. */
const rowNames = (list: HTMLElement) =>
  within(list)
    .getAllByRole('listitem')
    .map((row) => {
      const face = row.cloneNode(true) as HTMLElement
      face.querySelector('[data-slot="row-first"]')?.remove()
      return (face.textContent ?? '').trim()
    })

/** Opens the Filter button's sheet. */
async function openFilters(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: /^Filters/ }))
  return screen.findByRole('dialog', { name: 'Filters' })
}

/** Opens a row's More (⋯) by what it is the More of, and chooses an action. */
async function rowAction(user: ReturnType<typeof userEvent.setup>, name: string, action: string) {
  await user.click(await screen.findByRole('button', { name: `More for ${name}` }))
  await user.click(await screen.findByRole('button', { name: action }))
}

describe('Songs: the library’s Home and its folders (ADR 0106)', () => {
  it('stands the collections at Home as folders, each counted, a tap opening its page', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    expect(await screen.findByRole('heading', { level: 1, name: 'Songs' })).toBeInTheDocument()
    const folders = screen.getByRole('region', { name: 'Folders' })
    expect(rowNames(folders)).toEqual([
      'Songs to learn 23 songs',
      '«Боже, спасибо» 20 songs',
      'Called to Play 15 songs',
      'Called to Play, level 2 25 songs',
      'Hymns 5 songs',
      'Gorshkov’s songs 4 songs',
    ])
    await user.click(within(folders).getByRole('link', { name: /^Hymns/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/folders/hymns'))
    // The bar's title says where the learner is; Back goes up a level.
    expect(await screen.findByRole('heading', { level: 1, name: 'Hymns' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /Silent Night/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Songs' })).toHaveAttribute('href', '/songs')
  })

  it('names a folder’s first songs under its count', async () => {
    await renderApp('/songs')
    const folders = await screen.findByRole('region', { name: 'Folders' })
    const hymns = within(folders).getByRole('link', { name: /^Hymns/ })
    expect(hymns.querySelector('[data-slot="row-first"]')?.textContent).toMatch(
      /^[^·]+ · [^·]+ · [^·]+$/,
    )
  })

  it('nests folders: a folder’s folders first, its songs after, Back going up a level', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/folders/hymns', {
      storage: saved({
        library: {
          folders: [
            { id: 'hymns', parent: null, picture: 'church', paint: 'grass', songs: ['silent'] },
            {
              id: 'folder-1',
              parent: 'hymns',
              name: 'Advent',
              picture: 'star',
              paint: 'sky',
              songs: ['amazing'],
            },
          ],
          nextFolder: 2,
        },
      }),
    })
    const folders = await screen.findByRole('region', { name: 'Folders' })
    expect(rowNames(folders)).toEqual(['Advent 1 song'])
    // Hymns counts the folder in it beside its songs.
    await user.click(within(folders).getByRole('link', { name: /^Advent/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/folders/folder-1'))
    expect(await screen.findByRole('heading', { level: 1, name: 'Advent' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Back to Hymns' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/folders/hymns'))
    await user.click(await screen.findByRole('link', { name: 'Back to Songs' }))
    const home = await screen.findByRole('region', { name: 'Folders' })
    expect(rowNames(home)).toContain('Hymns 1 folder · 4 songs')
    expect(within(home).queryByRole('link', { name: /^Advent/ })).toBeNull()
  })

  it('lists a folder’s songs, marking a listing with no chart', async () => {
    await renderApp('/songs/folders/bozhe-spasibo')
    expect(await screen.findAllByText('No chart yet')).not.toHaveLength(0)
  })

  it('looks through the whole library at Home, the songs found under their folders’ names', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    await user.type(await screen.findByRole('searchbox', { name: 'Search songs' }), 'душа')
    expect(router.state.location.search).toMatchObject({ q: 'душа' })
    const found = await screen.findByRole('link', { name: /Still, my soul, be still/ })
    expect(found).toHaveAttribute('href', '/songs/bz5')
    expect(screen.getByRole('heading', { level: 2, name: '«Боже, спасибо»' })).toBeInTheDocument()
    // The filters hide songs: it says how many it shows, and clears them.
    expect(screen.getByRole('status')).toHaveTextContent(/^Shown: \d+ of 92$/)
  })

  it('keeps a key typed before the URL caught up with the one before it', async () => {
    const { router } = await renderApp('/songs')
    const box = await screen.findByRole('searchbox', { name: 'Search songs' })
    fireEvent.change(box, { target: { value: 'д' } })
    fireEvent.change(box, { target: { value: 'ду' } })
    expect(box).toHaveValue('ду')
    await waitFor(() => expect(router.state.location.search).toMatchObject({ q: 'ду' }))
    expect(box).toHaveValue('ду')
  })

  it('narrows a folder’s songs, names the search that found nothing, and clears the filters', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/folders/hymns?q=zzzz')
    expect(await screen.findByText('No songs match “zzzz”.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(await screen.findByRole('link', { name: /Silent Night/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Hymns' })).toBeInTheDocument()
  })

  it('shows a song’s key, its stage and, once learned, that it is', async () => {
    const { progressStore } = await renderApp('/songs/folders/bozhe-spasibo')
    const song = await screen.findByRole('link', { name: /Still, my soul, be still/ })
    // Its key named for a screen reader, which else hears a bare letter after the title.
    expect(song).toHaveAccessibleName(/Key G/)
    expect(within(song).getByRole('img', { name: 'Intermediate' })).toBeInTheDocument()
    expect(within(song).queryByRole('img', { name: 'Learned' })).not.toBeInTheDocument()
    act(() => markLearned(progressStore, 'piece:bz5', new Date()))
    expect(within(song).getByRole('img', { name: 'Learned' })).toBeInTheDocument()
  })

  it('lists a song’s first chords and counts them, a listing having none', async () => {
    await renderApp('/songs/folders/bozhe-spasibo')
    const song = await screen.findByRole('link', { name: /Still, my soul, be still/ })
    // Each chord once over any bass: its G/B is G.
    expect(within(song).getByText('G C Em Dsus4')).toBeVisible()
    expect(song).not.toHaveAccessibleName(/Dsus4/)
    expect(within(song).getByText('Мир, душа, храни')).toBeVisible()
    expect(within(song).getByText('7 chords')).toBeVisible()
    const listing = screen.getAllByRole('link', { name: /No chart yet/ })[0]
    expect(listing?.querySelector('[data-slot="row-chords"]')).toBeNull()
    expect(listing).not.toHaveAccessibleName(/chord/)
  })

  it('prints a row’s chords and its key as the Player prints chord symbols, with ♯ and ♭', async () => {
    await renderApp('/songs?q=morning light')
    const song = await screen.findByRole('link', { name: /You waited for the morning light/ })
    expect(within(song).getByText('C♯m F♯m G♯ C♯')).toBeVisible()
    expect(song).toHaveAccessibleName(/Key C♯m/)
  })

  it('holds no study: the method books’ studies are Practice’s', async () => {
    await renderApp('/songs?q=ex3')
    await screen.findByRole('heading', { level: 1, name: 'Songs' })
    expect(screen.queryByRole('link', { name: /Study/ })).not.toBeInTheDocument()
  })

  it('is not found at a folder it has not, or one archived', async () => {
    await renderApp('/songs/folders/folder-9')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeInTheDocument()
    cleanup()
    await renderApp('/songs/folders/hymns', {
      storage: saved({
        library: {
          archive: [
            {
              kind: 'folder',
              folder: { id: 'hymns', parent: null, picture: 'church', paint: 'grass', songs: [] },
              subfolders: [],
              index: 4,
            },
          ],
        },
      }),
    })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})

describe('Songs: a song’s and a folder’s actions (ADR 0106)', () => {
  it('moves a song by the Move sheet, and its toast’s Undo puts it back', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    await rowAction(user, 'Silent Night', 'Move to…')
    const sheet = await screen.findByRole('dialog', { name: 'Move to' })
    // What moves, whole under the title; where it stands, marked Here.
    expect(sheet).toHaveAccessibleDescription('Silent Night')
    const here = within(sheet).getByRole('button', { name: 'Hymns Here' })
    expect(here).toHaveAttribute('aria-disabled', 'true')
    // A tap on a place moves there at once, and the sheet closes.
    await user.click(within(sheet).getByRole('button', { name: 'Home' }))
    expect(placeOf(libraryStore.getState(), 'silent')).toMatchObject({ folder: null })
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Move to' })).toBeNull())
    expect(await screen.findByText('“Silent Night” moved to Home')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(placeOf(libraryStore.getState(), 'silent')).toMatchObject({ folder: 'hymns' })
  })

  it('archives a song from its More, and Undo brings it back where it stood', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    await rowAction(user, 'Silent Night', 'Archive')
    expect(placeOf(libraryStore.getState(), 'silent')).toBe('archived')
    await waitFor(() =>
      expect(screen.queryByRole('link', { name: /Silent Night/ })).not.toBeInTheDocument(),
    )
    await user.click(await screen.findByRole('button', { name: 'Undo' }))
    expect(await screen.findByRole('link', { name: /Silent Night/ })).toBeInTheDocument()
  })

  it('archives a song by a swipe to the left, Favourite by a swipe to the right', async () => {
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    /** A swipe across a song's row, from one point to another. */
    const swipe = async (song: RegExp, from: number, to: number) => {
      const link = await screen.findByRole('link', { name: song })
      // The row's sled: the card the finger drags.
      const sled = link.parentElement?.parentElement
      if (!sled) throw new Error('a row slides')
      stubBox(sled, { width: 360, height: 72 })
      const finger = { pointerId: 1, pointerType: 'touch', isPrimary: true }
      fireEvent.pointerDown(sled, { ...finger, buttons: 1, clientX: from, clientY: 10 })
      fireEvent.pointerMove(sled, { ...finger, buttons: 1, clientX: to, clientY: 10 })
      fireEvent.pointerUp(sled, { ...finger, buttons: 0, clientX: to, clientY: 10 })
    }
    await swipe(/Amazing Grace/, 20, 340)
    expect(libraryStore.getState().favourites).toEqual(['amazing'])
    await swipe(/Silent Night/, 340, 20)
    expect(placeOf(libraryStore.getState(), 'silent')).toBe('archived')
  })

  it('edits a folder from its More: its name and look', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs')
    await rowAction(user, 'Hymns', 'Edit folder')
    const sheet = await screen.findByRole('dialog', { name: 'Edit folder' })
    // The field starts empty, its name the placeholder: nothing to select, nothing for iOS to lift.
    const name = within(sheet).getByRole('textbox', { name: 'Name' })
    expect(name).toHaveValue('')
    expect(name).toHaveAttribute('placeholder', 'Hymns')
    await user.type(name, 'Sunday')
    await user.click(within(sheet).getByRole('radio', { name: 'Star' }))
    await user.click(within(sheet).getByRole('radio', { name: 'Lilac' }))
    await user.click(within(sheet).getByRole('button', { name: 'Save' }))
    expect(libraryStore.getState().folders.find((folder) => folder.id === 'hymns')).toMatchObject({
      name: 'Sunday',
      picture: 'star',
      paint: 'lilac',
    })
    expect(await screen.findByRole('link', { name: /^Sunday/ })).toBeInTheDocument()
  })

  it('makes a folder from New, at Home, last, its name suggested', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs')
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New folder' }))
    const sheet = await screen.findByRole('dialog', { name: 'New folder' })
    expect(within(sheet).getByRole('textbox', { name: 'Name' })).toHaveAttribute(
      'placeholder',
      'New folder',
    )
    await user.click(within(sheet).getByRole('button', { name: 'Create folder' }))
    expect(libraryStore.getState().folders.at(-1)).toMatchObject({
      id: 'folder-1',
      name: 'New folder',
    })
    const folders = await screen.findByRole('region', { name: 'Folders' })
    expect(rowNames(folders).at(-1)).toBe('New folder Empty')
  })

  it('New only adds: a song, an import, a folder; the Public library is a row of its own', async () => {
    const user = userEvent.setup()
    await renderApp('/songs')
    expect(
      await screen.findByRole('link', { name: /Public library Browse songs and patterns/ }),
    ).toHaveAttribute('href', '/songs/public')
    await user.click(await screen.findByRole('button', { name: 'New' }))
    expect(await screen.findByRole('button', { name: /New song/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Import/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /New folder/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Public library/ })).not.toBeInTheDocument()
  })

  it('exports a song from its row’s More: one sheet of MusicXML, MIDI and its link', async () => {
    const user = userEvent.setup()
    await renderApp('/songs', { storage: saved({ pieces: { songs: [SONG], nextSong: 2 } }) })
    await rowAction(user, 'Morning', 'Export…')
    const sheet = await screen.findByRole('dialog', { name: 'Export' })
    expect(
      within(sheet)
        .getAllByRole('button')
        .flatMap((row) => (row.textContent ? [row.textContent] : [])),
    ).toEqual([
      'MusicXML The score, for MuseScore, Sibelius, Finale or Dorico',
      'MIDI The music as played, for a DAW or a keyboard',
      'Share link A link that carries the song: whoever opens it can add it',
    ])
    await user.click(within(sheet).getByRole('button', { name: /^Share link/ }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Export' })).not.toBeInTheDocument(),
    )
    expect(new URL(await navigator.clipboard.readText()).pathname).toBe('/songs/shared')
  })

  it('imports a MIDI file from New as the learner’s song, opening its page (ADR 0107)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs')
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'Import' }))
    const midi = standardMidiFile([
      { events: noteEvents([{ key: 60, on: 0, off: 1920, velocity: 80 }], 0), end: 1920 },
    ])
    choose(new File([midi], 'Tune.mid', { type: 'audio/midi' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Tune' })).toBeInTheDocument()
    expect(piecesStore.getState().songs).toMatchObject([{ id: 'my-1', title: 'Tune' }])
  })

  it('makes nothing of a file whose reading was closed before it was read', async () => {
    const user = userEvent.setup()
    const { piecesStore, router } = await renderApp('/songs')
    await screen.findByRole('button', { name: 'New' })
    const midi = standardMidiFile([
      { events: noteEvents([{ key: 60, on: 0, off: 1920, velocity: 80 }], 0), end: 1920 },
    ])
    // A large file still being read.
    let read: (bytes: ArrayBuffer) => void = () => undefined
    const file = new File([midi], 'Tune.mid')
    file.arrayBuffer = () => new Promise((done) => (read = done))
    choose(file)
    const sheet = await screen.findByRole('dialog', { name: 'Import' })
    await user.click(within(sheet).getByRole('button', { name: 'Close' }))
    await act(async () => read(await new Blob([midi]).arrayBuffer()))
    await act(() => new Promise((done) => setTimeout(done, 50)))
    expect(piecesStore.getState().songs).toEqual([])
    expect(router.state.location.pathname).toBe('/songs')
  })

  it('says what a file dropped on the library left out, then opens the song', async () => {
    const user = userEvent.setup()
    await renderApp('/songs')
    const text = `<score-partwise><part-list><score-part id="P1"><part-name>Flute</part-name></score-part></part-list>
      <part id="P1"><measure><attributes><divisions>1</divisions></attributes>
      <direction><direction-type><dynamics><pppp/></dynamics></direction-type></direction>
      <note><pitch><step>A</step><octave>4</octave></pitch><duration>4</duration></note></measure></part></score-partwise>`
    const file = new File([text], 'Air.musicxml')
    fireEvent.drop(await screen.findByRole('region', { name: 'Folders' }), {
      dataTransfer: { types: ['Files'], files: [file] },
    })
    const sheet = await screen.findByRole('dialog', { name: 'Imported' })
    expect(
      within(sheet).getByText('Dynamics the app doesn’t write (pppp, ffff, niente)'),
    ).toBeInTheDocument()
    await user.click(within(sheet).getByRole('button', { name: 'Open the song' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Air' })).toBeInTheDocument()
  })

  it('says plainly why a file is no song, offering another', async () => {
    await renderApp('/songs')
    await screen.findByRole('button', { name: 'New' })
    choose(new File(['just words'], 'notes.txt'))
    const sheet = await screen.findByRole('dialog', { name: 'Can’t import notes.txt' })
    expect(within(sheet).getByRole('alert')).toHaveTextContent(/^It isn’t a score\./)
    expect(within(sheet).getByRole('button', { name: 'Choose another file' })).toBeInTheDocument()
  })

  it('archives a folder with its songs, the toast’s Undo putting it back where it stood', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs')
    await rowAction(user, 'Hymns', 'Archive folder')
    expect(libraryStore.getState().archive[0]).toMatchObject({ kind: 'folder', index: 4 })
    expect(await screen.findByText('“Hymns” archived with its songs')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    const folders = await screen.findByRole('region', { name: 'Folders' })
    expect(rowNames(folders)[4]).toBe('Hymns 5 songs')
  })

  it('deletes an own folder, asked first: its own songs for good, the app’s to the archive', async () => {
    const user = userEvent.setup()
    const { libraryStore, piecesStore } = await renderApp('/songs/folders/folder-1', {
      storage: saved({
        pieces: { songs: [SONG], nextSong: 2 },
        library: {
          folders: [
            {
              id: 'folder-1',
              name: 'Sunday',
              picture: 'church',
              paint: 'sky',
              songs: ['my-1', 'silent'],
            },
          ],
          nextFolder: 2,
        },
      }),
    })
    await user.click(await screen.findByRole('button', { name: 'More for Sunday' }))
    await user.click(await screen.findByRole('button', { name: 'Delete folder' }))
    const ask = await screen.findByRole('alertdialog', { name: 'Delete “Sunday”?' })
    expect(ask).toHaveTextContent(
      'The folder is deleted for good. Your own songs in it are deleted for good, with their takes: 1. The app’s songs in it go to the archive: 1.',
    )
    await user.click(within(ask).getByRole('button', { name: 'Delete' }))
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: 'Songs' })).toBeInTheDocument(),
    )
    expect(piecesStore.getState().songs).toEqual([])
    expect(libraryStore.getState().folders.some((folder) => folder.id === 'folder-1')).toBe(false)
    expect(placeOf(libraryStore.getState(), 'silent')).toBe('archived')
  })

  it('moves a folder into another by Move to…, never into itself, Undo putting it back', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs')
    await rowAction(user, 'Hymns', 'Move to…')
    const sheet = await screen.findByRole('dialog', { name: 'Move to' })
    expect(within(sheet).getByRole('button', { name: 'Hymns' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    expect(within(sheet).getByRole('button', { name: 'Home Here' })).toBeInTheDocument()
    await user.click(within(sheet).getByRole('button', { name: 'Called to Play' }))
    const moved = () => libraryStore.getState().folders.find((folder) => folder.id === 'hymns')
    expect(moved()?.parent).toBe('called-to-play')
    expect(await screen.findByText('“Hymns” moved to Called to Play')).toBeInTheDocument()
    // The Move sheet shows it in its folder, which opens and closes on its folders.
    await rowAction(user, 'Gorshkov’s songs', 'Move to…')
    const again = await screen.findByRole('dialog', { name: 'Move to' })
    expect(within(again).getByRole('button', { name: 'Hymns' })).toBeInTheDocument()
    await user.click(
      within(again).getByRole('button', { name: 'Hide the folders in Called to Play' }),
    )
    expect(within(again).queryByRole('button', { name: 'Hymns' })).toBeNull()
    await user.click(within(again).getByRole('button', { name: 'Close' }))
    await user.click(await screen.findByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(moved()?.parent).toBeNull())
  })

  it('deletes a built-in folder to the archive whole, saying so', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs')
    await rowAction(user, 'Hymns', 'Delete folder')
    const ask = await screen.findByRole('alertdialog', { name: 'Delete “Hymns”?' })
    expect(ask).toHaveTextContent('It goes to the archive with the app’s songs in it: 5.')
    await user.click(within(ask).getByRole('button', { name: 'Delete' }))
    expect(libraryStore.getState().archive[0]).toMatchObject({
      kind: 'folder',
      folder: { id: 'hymns' },
    })
  })
})

describe('Songs: Select (ADR 0106)', () => {
  it('chooses rows, says how many, and archives them from its bar at the foot', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Selected: 0' })).toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: 'Select Silent Night' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Amazing Grace' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Selected: 2' })).toBeInTheDocument()
    const bar = screen.getByRole('toolbar', { name: 'For what is selected' })
    // Delete is for the learner's own songs and folders: none of these, so it is greyed, kept in
    // its slot so the bar's buttons never shift as rows are chosen.
    expect(within(bar).getByRole('button', { name: 'Delete' })).toBeDisabled()
    await user.click(within(bar).getByRole('button', { name: 'Archive' }))
    expect(placeOf(libraryStore.getState(), 'silent')).toBe('archived')
    expect(placeOf(libraryStore.getState(), 'amazing')).toBe('archived')
    expect(await screen.findByText('Archived: 2')).toBeInTheDocument()
  })

  it('archives folders and songs chosen together in one go, one Undo putting all of them back', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs', {
      storage: saved({ pieces: { songs: [SONG], nextSong: 2 } }),
    })
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Hymns' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Gorshkov’s songs' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Morning' }))
    const bar = screen.getByRole('toolbar', { name: 'For what is selected' })
    await user.click(within(bar).getByRole('button', { name: 'Archive' }))
    expect(libraryStore.getState().archive).toHaveLength(3)
    expect(await screen.findByText('Archived: 3')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(libraryStore.getState().archive).toEqual([]))
    const folders = await screen.findByRole('region', { name: 'Folders' })
    expect(rowNames(folders).slice(4)).toEqual(['Hymns 5 songs', 'Gorshkov’s songs 4 songs'])
    expect(placeOf(libraryStore.getState(), 'my-1', ['my-1'])).toEqual({ folder: null, index: 0 })
  })

  it('favourites the songs chosen, its toast’s Undo taking back only what it changed', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns', {
      storage: saved({ library: { favourites: ['amazing'] } }),
    })
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Silent Night' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Amazing Grace' }))
    const bar = screen.getByRole('toolbar', { name: 'For what is selected' })
    await user.click(within(bar).getByRole('button', { name: 'Favourite' }))
    expect(libraryStore.getState().favourites).toEqual(['silent', 'amazing'])
    await user.click(await screen.findByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(libraryStore.getState().favourites).toEqual(['amazing']))
  })

  it('acts only on the rows chosen that are in sight, a search hiding the rest', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Silent Night' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Amazing Grace' }))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search songs' }), {
      target: { value: 'Amazing' },
    })
    await waitFor(() =>
      expect(screen.queryByRole('checkbox', { name: 'Select Silent Night' })).toBeNull(),
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Selected: 1' })).toBeInTheDocument()
    const bar = screen.getByRole('toolbar', { name: 'For what is selected' })
    await user.click(within(bar).getByRole('button', { name: 'Archive' }))
    expect(placeOf(libraryStore.getState(), 'amazing')).toBe('archived')
    expect(placeOf(libraryStore.getState(), 'silent')).toMatchObject({ folder: 'hymns' })
  })

  it('chooses every row by Select all, and starts with a row chosen by a long press', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/folders/hymns')
    const link = await screen.findByRole('link', { name: /Silent Night/ })
    fireEvent.pointerDown(link, { clientX: 0, clientY: 0 })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Selected: 1' }, { timeout: 2000 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Select Silent Night' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Select all' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Selected: 5' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Hymns' })).toBeInTheDocument()
  })

  it('moves what is chosen by the Move sheet, into a new folder', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Silent Night' }))
    await user.click(screen.getByRole('button', { name: 'Move' }))
    const sheet = await screen.findByRole('dialog', { name: 'Move to' })
    await user.click(within(sheet).getByRole('button', { name: 'New folder' }))
    const making = await screen.findByRole('dialog', { name: 'New folder' })
    await user.type(within(making).getByRole('textbox', { name: 'Name' }), 'Christmas')
    await user.click(within(making).getByRole('button', { name: 'Create folder' }))
    await waitFor(() =>
      expect(placeOf(libraryStore.getState(), 'silent')).toMatchObject({ folder: 'folder-1' }),
    )
  })

  it('moves a row by the keyboard in the Manual order, a screen reader told where it went', async () => {
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Select' }))
    const list = screen.getByRole('list', { name: 'Songs' })
    const rows = within(list).getAllByRole('listitem')
    // jsdom lays nothing out: the rows stand one under the other.
    rows.forEach((row, i) => stubBox(row, { top: i * 72, width: 400, height: 64 }))
    const first = within(rows[0] ?? list).getByRole('button', { name: /^Move / })
    const title = first.getAttribute('aria-label')?.slice('Move '.length) ?? ''
    // The keyboard's sensor hears the keys from the next task on, as it does in a browser.
    const settle = () => act(() => new Promise((done) => setTimeout(done, 0)))
    act(() => first.focus())
    fireEvent.keyDown(first, { code: 'Space', key: ' ' })
    await settle()
    fireEvent.keyDown(first, { code: 'ArrowDown', key: 'ArrowDown' })
    await settle()
    fireEvent.keyDown(first, { code: 'Space', key: ' ' })
    await waitFor(() =>
      expect(placeOf(libraryStore.getState(), 'otche')).toEqual({ folder: 'hymns', index: 1 }),
    )
    expect(await screen.findByText(`${title} put down at place 2 of 5.`)).toBeInTheDocument()
  })

  it('offers Delete where every song chosen is the learner’s own, asked first', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs', {
      storage: saved({ pieces: { songs: [SONG], nextSong: 2 } }),
    })
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Morning' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    const ask = await screen.findByRole('alertdialog', { name: 'Delete “Morning”?' })
    await user.click(within(ask).getByRole('button', { name: 'Delete' }))
    expect(piecesStore.getState().songs).toEqual([])
  })
})

describe('Songs: the sort and the filters (ADR 0106)', () => {
  it('sorts by Name, kept in the library, the Dropdown saying how', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    await user.click(await screen.findByRole('combobox', { name: /^Sort/ }))
    await user.click(await screen.findByRole('option', { name: 'Name' }))
    expect(libraryStore.getState().sort).toBe('name')
    const titles = within(screen.getByRole('region', { name: 'Songs' }))
      .getAllByRole('link')
      .map((link) => link.textContent ?? '')
    expect(titles).toEqual(titles.toSorted((a, b) => a.localeCompare(b, 'en')))
    expect(screen.getByRole('combobox', { name: /^Sort/ })).toHaveTextContent('Name')
  })

  it('keeps the favourites alone by the Filter sheet, kept in the URL, a chip taking it off', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs', {
      storage: saved({ library: { favourites: ['silent'] } }),
    })
    const sheet = await openFilters(user)
    await user.click(within(sheet).getByRole('switch', { name: 'Only favourites' }))
    expect(router.state.location.search).toMatchObject({ favourites: true })
    await user.click(within(sheet).getByRole('button', { name: 'Show 1 song' }))
    expect(await screen.findByRole('link', { name: /Silent Night/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Amazing Grace/ })).not.toBeInTheDocument()
    // The button counts the filters on; the chip under the search takes it off.
    expect(screen.getByRole('button', { name: 'Filters: 1 on' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Remove Favourites' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('favourites'))
  })

  it('keeps the songs of one stage, chosen in the Filter sheet’s Level and kept in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    const sheet = await openFilters(user)
    await user.click(within(sheet).getByRole('button', { name: 'Beginner' }))
    expect(router.state.location.search).toMatchObject({ stage: 'beginner' })
    await user.click(within(sheet).getByRole('button', { name: /^Show/ }))
    expect(await screen.findByRole('link', { name: /Hot Cross Buns/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove Level: Beginner' })).toBeInTheDocument()
  })

  it('keeps the songs in one key, each key offered with its count, and clears the filters', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/folders/bozhe-spasibo')
    const sheet = await openFilters(user)
    const keys = within(sheet).getByRole('region', { name: 'Key' })
    const g = within(keys).getByRole('button', { name: /^G major · \d+$/ })
    await user.click(g)
    expect(router.state.location.search).toMatchObject({ key: 'G' })
    expect(g).toHaveAttribute('aria-pressed', 'true')
    await user.click(within(sheet).getByRole('button', { name: /^Show/ }))
    expect(
      await screen.findByRole('link', { name: /Still, my soul, be still/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove Key: G major' })).toBeInTheDocument()
    const again = await openFilters(user)
    await user.click(within(again).getByRole('button', { name: 'Clear filters' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('key'))
  })

  it('says which filter found nothing, by its own words', async () => {
    await renderApp('/songs/folders/hymns?key=C%23m')
    // The key as the app names keys.
    expect(await screen.findByText('No songs here in C# minor.')).toBeInTheDocument()
    cleanup()
    await renderApp('/songs/folders/hymns?key=C%23m&favourites=true')
    expect(await screen.findByText('No songs here match these filters.')).toBeInTheDocument()
  })
})

describe('Songs: your own', () => {
  it('makes a new song at Home from its title, key and meter, and opens it in the editor', async () => {
    const user = userEvent.setup()
    const { router, piecesStore, libraryStore } = await renderApp('/songs')
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New song' }))
    const make = await screen.findByRole('button', { name: 'Make' })
    expect(make).toBeDisabled()
    await user.type(screen.getByRole('textbox', { name: 'Title' }), 'Evening')
    const key = screen.getByRole('group', { name: 'Key' })
    await user.click(within(key).getByRole('radio', { name: 'E' }))
    await user.click(within(key).getByRole('radio', { name: 'Minor' }))
    await user.click(screen.getByRole('radio', { name: '3/4' }))
    await user.click(make)
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/my-1'))
    expect(piecesStore.getState().songs).toMatchObject([
      { id: 'my-1', title: 'Evening', key: 'Em', meter: '3/4' },
    ])
    expect(placeOf(libraryStore.getState(), 'my-1', ['my-1'])).toMatchObject({ folder: null })
  })

  it('makes a new song inside the folder open', async () => {
    const user = userEvent.setup()
    const { router, libraryStore } = await renderApp('/songs/folders/hymns')
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New song' }))
    await user.type(await screen.findByRole('textbox', { name: 'Title' }), 'Doxology')
    await user.click(screen.getByRole('button', { name: 'Make' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/my-1'))
    expect(placeOf(libraryStore.getState(), 'my-1', ['my-1'])).toEqual({
      folder: 'hymns',
      index: 5,
    })
  })

  it('makes a lead sheet: a staff alone, the piano hidden (ADR 0114, 0097)', async () => {
    const user = userEvent.setup()
    const { piecesStore, router } = await renderApp('/songs/folders/hymns')
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New song' }))
    await user.type(await screen.findByRole('textbox', { name: 'Title' }), 'Hymn')
    await user.click(screen.getByRole('button', { name: 'Customize' }))
    const score = await screen.findByRole('dialog', { name: 'Score' })
    const staves = within(score).getByRole('radiogroup', { name: 'Staves' })
    expect(within(staves).getByRole('radio', { name: 'Piano' })).toBeChecked()
    await user.click(within(staves).getByRole('radio', { name: 'A staff' }))
    await user.click(within(score).getByRole('button', { name: 'Done' }))
    await user.click(await screen.findByRole('button', { name: 'Make' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/my-1'))
    expect(piecesStore.getState().songs[0]).toMatchObject({
      staves: [{ notes: 'r/4' }],
      leadSheet: true,
    })
  })

  it('stands the learner’s own songs at Home, after the folders', async () => {
    await renderApp('/songs', { storage: saved({ pieces: { songs: [SONG], nextSong: 2 } }) })
    expect(await screen.findByRole('link', { name: /Morning/ })).toHaveAttribute(
      'href',
      '/songs/my-1',
    )
  })

  it('makes a folder in the folder open', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New folder' }))
    const sheet = await screen.findByRole('dialog', { name: 'New folder' })
    await user.click(within(sheet).getByRole('button', { name: 'Create folder' }))
    expect(libraryStore.getState().folders.at(-1)).toMatchObject({
      id: 'folder-1',
      parent: 'hymns',
    })
    const folders = await screen.findByRole('region', { name: 'Folders' })
    expect(rowNames(folders)).toEqual(['New folder Empty'])
  })

  it('offers an empty folder New song and Move songs here, which moves the songs ticked in', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1', {
      storage: saved({
        library: {
          folders: [{ id: 'folder-1', name: 'Sunday', picture: 'church', paint: 'sky', songs: [] }],
          nextFolder: 2,
        },
      }),
    })
    expect(await screen.findByText('This folder is empty')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'New song' }).length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Move songs here' }))
    const sheet = await screen.findByRole('dialog', { name: 'Move songs here' })
    await user.click(within(sheet).getByRole('checkbox', { name: 'Silent Night' }))
    await user.click(within(sheet).getByRole('button', { name: 'Move here: 1' }))
    expect(placeOf(libraryStore.getState(), 'silent')).toEqual({ folder: 'folder-1', index: 0 })
  })

  it('lists a listing whose chart the learner wrote as a song', async () => {
    const { id: _id, title: _title, ...music } = SONG
    const version = {
      ...music,
      key: 'Cm',
      meter: '3/4',
      sections: [{ kind: 'verse', lines: ['Cm'] }],
    }
    await renderApp('/songs?q=лань', { storage: saved({ pieces: { versions: { bz4: version } } }) })
    const row = await screen.findByRole('link', { name: /Как лань желает/ })
    expect(row).not.toHaveTextContent('No chart yet')
  })
})

describe('Songs: the archive’s way in (ADR 0106)', () => {
  it('stands Archive in Home’s bar, counting what it holds', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs', {
      storage: saved({
        library: { archive: [{ kind: 'song', id: 'silent', from: { folder: 'hymns', index: 0 } }] },
      }),
    })
    const archive = await screen.findByRole('link', { name: 'Archive: 1' })
    expect(archive).toHaveAttribute('title', 'Archive: 1')
    expect(document.querySelector('[data-slot="archive-count"]')).toHaveTextContent('1')
    expect(archive).toHaveAttribute('href', '/songs/archive')
    // A folder's bar stays short: Back, its name, Select and its More.
    await user.click(screen.getByRole('link', { name: /^Hymns/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Hymns' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Archive: 1' })).toBeNull()
    await user.click(screen.getByRole('link', { name: 'Back to Songs' }))
    await user.click(await screen.findByRole('link', { name: 'Archive: 1' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/archive'))
  })

  it('names Archive alone, with no count, while it is empty', async () => {
    await renderApp('/songs')
    expect(await screen.findByRole('link', { name: 'Archive' })).toBeInTheDocument()
    expect(document.querySelector('[data-slot="archive-count"]')).toBeNull()
  })
})

describe('Songs: in Russian', () => {
  it('reads in Russian, with nothing left in English', async () => {
    const user = userEvent.setup()
    await renderApp('/songs', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Песни' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Гимны.*5 песен/ })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
    await user.click(screen.getByRole('button', { name: 'Выбрать' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Выбрано: 0' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
