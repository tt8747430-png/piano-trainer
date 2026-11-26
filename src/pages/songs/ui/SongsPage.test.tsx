import { setBar } from '@/features/set-preference'
import { act, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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
  added: '2026-11-01T09:00:00.000Z',
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

/** The learner's own folder, Sunday, holding two of the app's hymns (a learner's own place, D8). */
const SUNDAY = {
  folders: [
    {
      id: 'folder-1',
      name: 'Sunday',
      picture: 'church',
      paint: 'sky',
      songs: ['silent', 'amazing'],
    },
  ],
  nextFolder: 2,
}

/** Where a song stands in the library the store holds, over the catalog and these own songs. */
const placeOf = (state: LibraryState, id: string, ownSongs: readonly string[] = []) =>
  placeIn(
    arrangeLibrary(state, libraryCatalog({ ownSongs: ownSongs.map((each) => ({ id: each })) })),
    id,
  )

/** The links of a place by their words: its playlists, or its songs. */
const linkNames = (place: HTMLElement) =>
  within(place)
    .getAllByRole('link')
    .map((link) => (link.textContent ?? '').trim())

/** A row in Select by its check's name: the row, and its face after the check, which carries it. */
function rowOf(check: string) {
  const box = screen.getByRole('checkbox', { name: check })
  const row = box.closest('li')
  const face = box.nextElementSibling
  if (!row || !(face instanceof HTMLElement)) throw new Error(`a row for ${check}`)
  return { row, face }
}

/** Opens a row's More (⋯) by what it is the More of, and chooses an action. */
async function rowAction(user: ReturnType<typeof userEvent.setup>, name: string, action: string) {
  await user.click(await screen.findByRole('button', { name: `More for ${name}` }))
  await user.click(await screen.findByRole('menuitem', { name: action }))
}

describe('Songs: the library’s Home and its playlists (ADR 0106)', () => {
  it('stands the collections at Home as playlists, each counted, a tap opening its page', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    expect(await screen.findByRole('heading', { level: 1, name: 'Songs' })).toBeInTheDocument()
    const playlists = screen.getByRole('region', { name: 'Playlists' })
    expect(linkNames(playlists)).toEqual([
      'FavouritesEmpty',
      'Songs to learn23 songs',
      'Bozhe, spasibo20 songs',
      'Called to Play15 songs',
      'Called to Play 225 songs',
      'Hymns5 songs',
      'Worship songs1 song',
      'Gorshkov’s songs4 songs',
    ])
    await user.click(within(playlists).getByRole('link', { name: /^Hymns/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/folders/hymns'))
    // The bar's title says where the learner is; Back goes up a level.
    expect(await screen.findByRole('heading', { level: 1, name: 'Hymns' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /Silent Night/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back to Songs' })).toBeInTheDocument()
  })

  it('nests playlists: a playlist’s playlists first, its songs after, Back going up a level', async () => {
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
    const inside = await screen.findByRole('region', { name: 'Playlists' })
    expect(linkNames(inside)).toEqual(['Advent 1 song'])
    await user.click(within(inside).getByRole('link', { name: /^Advent/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/folders/folder-1'))
    expect(await screen.findByRole('heading', { level: 1, name: 'Advent' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back to Hymns' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/folders/hymns'))
    await user.click(await screen.findByRole('button', { name: 'Back to Songs' }))
    // Hymns counts the playlist in it beside its songs; Advent stands inside it alone.
    const home = await screen.findByRole('region', { name: 'Playlists' })
    expect(linkNames(home)).toContain('Hymns1 playlist · 4 songs')
    expect(within(home).queryByRole('link', { name: /^Advent/ })).toBeNull()
  })

  it('lists a playlist’s songs, marking a listing with no chart', async () => {
    await renderApp('/songs/folders/bozhe-spasibo')
    expect(await screen.findAllByText('Chart not available')).not.toHaveLength(0)
  })

  it('looks through the whole library at Home, the songs found under their playlists’ names', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    await user.type(await screen.findByRole('searchbox', { name: 'Search your songs' }), 'душа')
    expect(router.state.location.search).toMatchObject({ q: 'душа' })
    const found = await screen.findByRole('link', { name: /Still, my soul, be still/ })
    expect(found).toHaveAttribute('href', '/songs/bz5')
    expect(screen.getByRole('heading', { level: 2, name: /^Bozhe, spasibo/ })).toBeInTheDocument()
    // The search hides songs: it says how many it shows, and clears it.
    expect(screen.getByRole('status')).toHaveTextContent(/^Shown: \d+ of 93$/)
  })

  it('keeps a key typed before the URL caught up with the one before it', async () => {
    const { router } = await renderApp('/songs')
    const box = await screen.findByRole('searchbox', { name: 'Search your songs' })
    fireEvent.change(box, { target: { value: 'д' } })
    fireEvent.change(box, { target: { value: 'ду' } })
    expect(box).toHaveValue('ду')
    await waitFor(() => expect(router.state.location.search).toMatchObject({ q: 'ду' }))
    expect(box).toHaveValue('ду')
  })

  it('narrows a playlist’s songs, names the search that found nothing, and clears it', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/folders/hymns?q=zzzz')
    expect(await screen.findByText('No songs match “zzzz”.')).toBeInTheDocument()
    // Or looks for it through the whole library.
    expect(screen.getByRole('button', { name: 'Search everywhere' })).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Clear search' })[0] as HTMLElement)
    expect(await screen.findByRole('link', { name: /Silent Night/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Hymns' })).toBeInTheDocument()
  })

  it('shows a song’s key, where it stands and, once learned, that it is', async () => {
    const { progressStore } = await renderApp('/songs/folders/bozhe-spasibo')
    const song = await screen.findByRole('link', { name: /Still, my soul, be still/ })
    expect(song).toHaveTextContent('Мир, душа, храни · G major')
    expect(song).toHaveTextContent('Not started')
    act(() => markLearned(progressStore, 'piece:bz5', new Date()))
    expect(song).toHaveTextContent(/Learned$/)
  })

  it('prints a row’s key as the Player prints it, with ♯ and ♭', async () => {
    await renderApp('/songs?q=morning light')
    const song = await screen.findByRole('link', { name: /You waited for the morning light/ })
    expect(song).toHaveTextContent('C♯ minor')
  })

  it('holds no study: the method books’ studies are Practice’s', async () => {
    await renderApp('/songs?q=ex3')
    await screen.findByRole('heading', { level: 1, name: 'Songs' })
    expect(screen.queryByRole('link', { name: /Study/ })).not.toBeInTheDocument()
  })

  it('is not found at a playlist it has not, or one archived', async () => {
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

describe('Songs: a song’s and a playlist’s actions (ADR 0106)', () => {
  it('moves a song by the Move sheet, and its toast’s Undo puts it back', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1', {
      storage: saved({ library: SUNDAY }),
    })
    await rowAction(user, 'Silent Night', 'Add to a playlist')
    const sheet = await screen.findByRole('dialog', { name: 'Move to' })
    // What moves, whole under the title; where it stands, marked Here.
    expect(sheet).toHaveAccessibleDescription('Silent Night')
    const here = within(sheet).getByRole('button', { name: 'Sunday Here' })
    expect(here).toHaveAttribute('aria-disabled', 'true')
    // A tap on a place moves there at once, and the sheet closes.
    await user.click(within(sheet).getByRole('button', { name: 'Home' }))
    expect(placeOf(libraryStore.getState(), 'silent')).toMatchObject({ folder: null })
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Move to' })).toBeNull())
    expect(await screen.findByText('“Silent Night” moved to Home')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(placeOf(libraryStore.getState(), 'silent')).toMatchObject({ folder: 'folder-1' })
  })

  it('archives a song from its More, and Undo brings it back where it stood', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    // At once, Undo in its toast: hidden from the playlist (D10), to come back from its Archived.
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
    await waitFor(() => expect(placeOf(libraryStore.getState(), 'silent')).toBe('archived'))
  })

  it('renames a playlist in place from its ···: its name and colour, Done saving them', async () => {
    const user = userEvent.setup()
    const { libraryStore, router } = await renderApp('/songs/folders/folder-1', {
      storage: saved({ library: SUNDAY }),
    })
    await user.click(await screen.findByRole('button', { name: 'More for Sunday' }))
    expect((await screen.findAllByRole('menuitem')).map((item) => item.textContent)).toEqual([
      'Rename',
      'Colour',
      'Share with a group',
      'Archive playlist',
    ])
    await user.click(screen.getByRole('menuitem', { name: 'Rename' }))
    // Its name and colour under the bar, in its URL.
    const form = await screen.findByRole('form', { name: 'Edit playlist' })
    expect(router.state.location.search).toMatchObject({ edit: true })
    const name = within(form).getByRole('textbox', { name: 'Name' })
    expect(name).toHaveAttribute('placeholder', 'Sunday')
    await user.type(name, 'Vespers')
    await user.click(within(form).getByRole('radio', { name: 'Lilac' }))
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(
      libraryStore.getState().folders.find((folder) => folder.id === 'folder-1'),
    ).toMatchObject({ name: 'Vespers', paint: 'lilac' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Vespers' })).toBeInTheDocument()
    expect(screen.queryByRole('form', { name: 'Edit playlist' })).toBeNull()
    expect(router.state.location.search).not.toHaveProperty('edit')
  })

  it('changes only a playlist’s colour from Colour; nothing typed keeps its name', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1', {
      storage: saved({ library: SUNDAY }),
    })
    await user.click(await screen.findByRole('button', { name: 'More for Sunday' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Colour' }))
    await user.click(
      within(await screen.findByRole('form', { name: 'Edit playlist' })).getByRole('radio', {
        name: 'Lilac',
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(
      libraryStore.getState().folders.find((folder) => folder.id === 'folder-1'),
    ).toMatchObject({ name: 'Sunday', paint: 'lilac' })
  })

  it('makes a playlist from New, at Home, last, its name suggested', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs')
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New playlist' }))
    const sheet = await screen.findByRole('dialog', { name: 'New playlist' })
    expect(within(sheet).getByRole('textbox', { name: 'Name' })).toHaveAttribute(
      'placeholder',
      'New playlist',
    )
    await user.click(within(sheet).getByRole('button', { name: 'Create' }))
    expect(libraryStore.getState().folders.at(-1)).toMatchObject({
      id: 'folder-1',
      name: 'New playlist',
    })
    const playlists = await screen.findByRole('region', { name: 'Playlists' })
    expect(linkNames(playlists).at(-1)).toBe('New playlistEmpty')
  })

  it('New only adds: a song, a recording, an import, a playlist; Explore is its own place', async () => {
    const user = userEvent.setup()
    await renderApp('/songs')
    expect(await screen.findByRole('region', { name: /^Explore/ })).toBeInTheDocument()
    await user.click(await screen.findByRole('button', { name: 'New' }))
    expect(await screen.findByRole('button', { name: 'New song' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Record' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Import' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'New playlist' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Public library/ })).not.toBeInTheDocument()
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
    // Import says what came in, and opens it on Open song.
    const sheet = await screen.findByRole('dialog', { name: 'Import' })
    expect(await within(sheet).findByText('Everything in the file came in.')).toBeInTheDocument()
    expect(piecesStore.getState().songs).toMatchObject([{ id: 'my-1', title: 'Tune' }])
    await user.click(within(sheet).getByRole('button', { name: 'Open song' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Tune' })).toBeInTheDocument()
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
    await renderApp('/songs/all')
    const text = `<score-partwise><part-list><score-part id="P1"><part-name>Flute</part-name></score-part></part-list>
      <part id="P1"><measure><attributes><divisions>1</divisions></attributes>
      <direction><direction-type><dynamics><pppp/></dynamics></direction-type></direction>
      <note><pitch><step>A</step><octave>4</octave></pitch><duration>4</duration></note></measure></part></score-partwise>`
    const file = new File([text], 'Air.musicxml')
    // Dropped on All songs, a laptop's way in.
    fireEvent.drop(await screen.findByRole('region', { name: 'Songs' }), {
      dataTransfer: { types: ['Files'], files: [file] },
    })
    const sheet = await screen.findByRole('dialog', { name: 'Import' })
    expect(
      await within(sheet).findByText('Dynamics the app doesn’t write (pppp, ffff, niente)'),
    ).toBeInTheDocument()
    await user.click(within(sheet).getByRole('button', { name: 'Open song' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Air' })).toBeInTheDocument()
  })

  it('says plainly why a file is no song, offering another', async () => {
    await renderApp('/songs')
    await screen.findByRole('button', { name: 'New' })
    choose(new File(['just words'], 'notes.txt'))
    const sheet = await screen.findByRole('dialog', { name: 'Import' })
    expect(await within(sheet).findByText('Can’t import notes.txt')).toBeInTheDocument()
    expect(within(sheet).getByRole('alert')).toHaveTextContent(/^It isn’t a score\./)
    expect(within(sheet).getByRole('button', { name: 'Choose another file' })).toBeInTheDocument()
  })

  it('archives a playlist with its songs from its ···, the toast’s Undo putting it back', async () => {
    const user = userEvent.setup()
    const { libraryStore, router } = await renderApp('/songs/folders/folder-1', {
      storage: saved({ library: SUNDAY }),
    })
    await user.click(await screen.findByRole('button', { name: 'More for Sunday' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Archive playlist' }))
    // At once, back to where it stood, Undo in its toast.
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs'))
    expect(libraryStore.getState().archive[0]).toMatchObject({ kind: 'folder', index: 0 })
    expect(await screen.findByText('“Sunday” archived with its songs')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    const playlists = await screen.findByRole('region', { name: 'Playlists' })
    expect(linkNames(playlists)).toContain('Sunday2 songs')
  })

  it('deletes an own playlist from its row’s ···, asked first: its own songs to the Trash, the app’s to the archive', async () => {
    const user = userEvent.setup()
    const { libraryStore, piecesStore } = await renderApp('/songs/folders/folder-2', {
      storage: saved({
        pieces: { songs: [SONG], nextSong: 2 },
        library: {
          folders: [
            { id: 'folder-2', name: 'Church', picture: 'sun', paint: 'sand', songs: [] },
            {
              id: 'folder-1',
              parent: 'folder-2',
              name: 'Sunday',
              picture: 'church',
              paint: 'sky',
              songs: ['my-1', 'silent'],
            },
          ],
          nextFolder: 3,
        },
      }),
    })
    await rowAction(user, 'Sunday', 'Delete playlist')
    const ask = await screen.findByRole('alertdialog', { name: 'Delete “Sunday”?' })
    expect(ask).toHaveTextContent(
      'The playlist will be permanently deleted. Your songs in it (1) will be moved to the Trash. Built-in songs in it (1) will be moved to the archive.',
    )
    await user.click(within(ask).getByRole('button', { name: 'Delete' }))
    await waitFor(() =>
      expect(libraryStore.getState().folders.some((folder) => folder.id === 'folder-1')).toBe(
        false,
      ),
    )
    expect(piecesStore.getState().songs).toEqual([SONG])
    expect(libraryStore.getState().trash.map((each) => each.id)).toEqual(['my-1'])
    expect(placeOf(libraryStore.getState(), 'silent')).toBe('archived')
  })

  it('moves a playlist into another by Move to…, never into itself, Undo putting it back', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-2', {
      storage: saved({
        library: {
          folders: [
            { id: 'folder-2', name: 'Church', picture: 'sun', paint: 'sand', songs: [] },
            { ...SUNDAY.folders[0], parent: 'folder-2' },
            { id: 'folder-3', name: 'Weekday', picture: 'sun', paint: 'sand', songs: [] },
          ],
          nextFolder: 4,
        },
      }),
    })
    await rowAction(user, 'Sunday', 'Move to playlist…')
    const sheet = await screen.findByRole('dialog', { name: 'Move to' })
    expect(within(sheet).getByRole('button', { name: 'Sunday' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    expect(within(sheet).getByRole('button', { name: 'Church Here' })).toBeInTheDocument()
    // The app's playlists take nothing of a learner's (D8).
    expect(within(sheet).getByRole('button', { name: 'Hymns' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await user.click(within(sheet).getByRole('button', { name: 'Weekday' }))
    const moved = () => libraryStore.getState().folders.find((folder) => folder.id === 'folder-1')
    expect(moved()?.parent).toBe('folder-3')
    expect(await screen.findByText('“Sunday” moved to Weekday')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(moved()?.parent).toBe('folder-2'))
  })

  it('leaves a built-in playlist its place alone: no Rename, Colour, Archive or Delete (D8)', async () => {
    await renderApp('/songs/folders/hymns')
    await screen.findByRole('heading', { level: 1, name: 'Hymns' })
    expect(screen.queryByRole('button', { name: 'More for Hymns' })).toBeNull()
    // Its one act, Share with a group, its own button.
    expect(screen.getByRole('button', { name: 'Share with a group' })).toBeInTheDocument()
  })
})

describe('Songs: Select (ADR 0106)', () => {
  it('chooses rows, says how many, and archives them from its bar at the foot', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1', {
      storage: saved({ library: SUNDAY }),
    })
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    expect(screen.getByRole('heading', { level: 1, name: '0 selected' })).toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: 'Select Silent Night' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Amazing Grace' }))
    expect(screen.getByRole('heading', { level: 1, name: '2 selected' })).toBeInTheDocument()
    const bar = screen.getByRole('toolbar', { name: 'Selection actions' })
    // At once, Undo in its toast.
    await user.click(within(bar).getByRole('button', { name: 'Archive' }))
    expect(placeOf(libraryStore.getState(), 'silent')).toBe('archived')
    expect(placeOf(libraryStore.getState(), 'amazing')).toBe('archived')
    expect(await screen.findByText('Archived: 2', {}, { timeout: 5000 })).toBeInTheDocument()
  })

  it('the bar on screen matches the page tile for tile (R29 B10)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/songs/folders/folder-1', {
      storage: saved({ library: SUNDAY }),
    })
    act(() => setBar(settingsStore, 'select.songs', ['delete', 'export', 'move']))
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    const bar = screen.getByRole('toolbar', { name: 'Selection actions' })
    expect(
      within(bar)
        .getAllByRole('button')
        .map((each) => each.textContent),
    ).toEqual(['Delete', 'Export', 'Add to playlist', 'More'])
  })

  it('archives playlists and songs chosen together in one go, one Undo putting all of them back', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-2', {
      storage: saved({
        pieces: { songs: [SONG], nextSong: 2 },
        library: {
          folders: [
            { id: 'folder-2', name: 'Church', picture: 'sun', paint: 'sand', songs: ['my-1'] },
            { ...SUNDAY.folders[0], parent: 'folder-2' },
            {
              id: 'folder-3',
              parent: 'folder-2',
              name: 'Weekday',
              picture: 'sun',
              paint: 'sand',
              songs: ['ode'],
            },
          ],
          nextFolder: 4,
        },
      }),
    })
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Sunday' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Weekday' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Morning' }))
    const bar = screen.getByRole('toolbar', { name: 'Selection actions' })
    await user.click(within(bar).getByRole('button', { name: 'Archive' }))
    expect(libraryStore.getState().archive).toHaveLength(3)
    expect(await screen.findByText('Archived: 3')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(libraryStore.getState().archive).toEqual([]))
    const playlists = await screen.findByRole('region', { name: 'Playlists' })
    expect(linkNames(playlists)).toEqual(['Sunday 2 songs', 'Weekday 1 song'])
    expect(placeOf(libraryStore.getState(), 'my-1', ['my-1'])).toEqual({
      folder: 'folder-2',
      index: 0,
    })
  })

  it('favourites the songs chosen, its toast’s Undo taking back only what it changed', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns', {
      storage: saved({ library: { favourites: ['amazing'] } }),
    })
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Silent Night' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Amazing Grace' }))
    const bar = screen.getByRole('toolbar', { name: 'Selection actions' })
    await user.click(within(bar).getByRole('button', { name: 'Favourite' }))
    expect(libraryStore.getState().favourites).toEqual(['silent', 'amazing'])
    await user.click(await screen.findByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(libraryStore.getState().favourites).toEqual(['amazing']))
  })

  it('exports the songs chosen, a file each, from the one Export sheet', async () => {
    const user = userEvent.setup()
    const names: string[] = []
    vi.stubGlobal(
      'URL',
      class extends URL {
        static override createObjectURL = () => 'blob:music'
        static override revokeObjectURL = () => {}
      },
    )
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      names.push(this.download)
    })
    await renderApp('/songs/folders/hymns')
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    const bar = screen.getByRole('toolbar', { name: 'Selection actions' })
    // Export is under More on the bar as it comes (R29 B10). Nothing chosen, nothing to export.
    await user.click(within(bar).getByRole('button', { name: 'More' }))
    expect(await screen.findByRole('button', { name: 'Export' })).toBeDisabled()
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('checkbox', { name: 'Select Silent Night' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Amazing Grace' }))
    await user.click(within(bar).getByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('button', { name: 'Export' }))
    const sheet = await screen.findByRole('dialog', { name: 'Export' })
    expect(within(sheet).getByText('2 selected')).toBeInTheDocument()
    const midi = within(sheet).getByText('MIDI', { exact: true }).closest('button')
    if (!midi) throw new Error('MIDI is a row of Export')
    await user.click(midi)
    expect(names).toEqual([
      expect.stringMatching(/^Silent Night.*\.mid$/),
      expect.stringMatching(/^Amazing Grace.*\.mid$/),
    ])
  })

  it('acts only on the rows chosen that are in sight, a search hiding the rest', async () => {
    const user = userEvent.setup()
    const { libraryStore, router } = await renderApp('/songs/folders/hymns')
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Silent Night' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Amazing Grace' }))
    // The search, kept in the URL, narrows the rows while Select is on.
    await act(() =>
      router.navigate({
        to: '/songs/folders/$folderId',
        params: { folderId: 'hymns' },
        search: (prev) => ({ ...prev, q: 'Amazing' }),
        replace: true,
      }),
    )
    await waitFor(() =>
      expect(screen.queryByRole('checkbox', { name: 'Select Silent Night' })).toBeNull(),
    )
    expect(screen.getByRole('heading', { level: 1, name: '1 selected' })).toBeInTheDocument()
    const bar = screen.getByRole('toolbar', { name: 'Selection actions' })
    await user.click(within(bar).getByRole('button', { name: 'Archive' }))
    expect(placeOf(libraryStore.getState(), 'amazing')).toBe('archived')
    expect(placeOf(libraryStore.getState(), 'silent')).toMatchObject({ folder: 'hymns' })
  })

  it('starts Select with a row chosen by a long press, Cancel ending it', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/folders/hymns')
    const link = await screen.findByRole('link', { name: /Silent Night/ })
    fireEvent.pointerDown(link, { clientX: 0, clientY: 0 })
    expect(
      await screen.findByRole('heading', { level: 1, name: '1 selected' }, { timeout: 2000 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Select Silent Night' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Hymns' })).toBeInTheDocument()
  })

  it('carries a song by its face into a playlist, the playlist lit as the target, with Undo', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-2', {
      storage: saved({
        pieces: { songs: [SONG], nextSong: 2 },
        library: {
          folders: [
            { id: 'folder-2', name: 'Church', picture: 'sun', paint: 'sand', songs: ['my-1'] },
            { ...SUNDAY.folders[0], parent: 'folder-2' },
          ],
          nextFolder: 3,
        },
      }),
    })
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    const song = rowOf('Select Morning')
    const folder = rowOf('Select Sunday')
    stubBox(song.row, { top: 600, width: 360, height: 72 })
    stubBox(folder.row, { top: 100, width: 360, height: 72 })
    const mouse = { button: 0, buttons: 1 }
    fireEvent.mouseDown(song.face, { ...mouse, clientX: 20, clientY: 630 })
    fireEvent.mouseMove(document, { ...mouse, clientX: 20, clientY: 400 })
    fireEvent.mouseMove(document, { ...mouse, clientX: 30, clientY: 130 })
    // Carried, the bar is where it drops; the folder under the pointer is lit.
    expect(await screen.findByRole('group', { name: 'Drop here' })).toBeInTheDocument()
    await waitFor(() => expect(folder.row.querySelector('[data-drop]')).not.toBeNull())
    fireEvent.mouseUp(document, { button: 0, clientX: 30, clientY: 130 })
    await waitFor(() =>
      expect(placeOf(libraryStore.getState(), 'my-1', ['my-1'])).toMatchObject({
        folder: 'folder-1',
      }),
    )
    expect(await screen.findByText('“Morning” moved to Sunday')).toBeInTheDocument()
    // The drag library stops every click for 50ms after a drop (the click a real release sends);
    // the learner's tap on Undo comes after it.
    await act(() => new Promise((done) => setTimeout(done, 60)))
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() =>
      expect(placeOf(libraryStore.getState(), 'my-1', ['my-1'])).toMatchObject({
        folder: 'folder-2',
      }),
    )
  })

  // A drag across the library, measured by the drag library a frame at a time: slow under a full
  // suite's load, so its own limit, and two more tries (it passes alone every time; under load the
  // drop is now and then measured before the zones are, and nothing is carried).
  it(
    'carries every row chosen onto Archive on the bar',
    { timeout: 15_000, retry: 2 },
    async () => {
      const user = userEvent.setup()
      const { libraryStore } = await renderApp('/songs/folders/folder-1', {
        storage: saved({ library: SUNDAY }),
      })
      await user.click(await screen.findByRole('button', { name: 'Select' }))
      await user.click(screen.getByRole('checkbox', { name: 'Select Silent Night' }))
      await user.click(screen.getByRole('checkbox', { name: 'Select Amazing Grace' }))
      const song = rowOf('Select Silent Night')
      // The bar's places stand at the foot, as they are drawn once the rows are carried.
      const box = HTMLElement.prototype.getBoundingClientRect
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement,
      ) {
        return this.dataset.slot === 'drop-zone'
          ? DOMRect.fromRect({
              x: this.textContent === 'Archive' ? 200 : 0,
              y: 760,
              width: 180,
              height: 56,
            })
          : box.call(this)
      })
      const mouse = { button: 0, buttons: 1 }
      fireEvent.mouseDown(song.face, { ...mouse, clientX: 20, clientY: 20 })
      fireEvent.mouseMove(document, { ...mouse, clientX: 20, clientY: 300 })
      const zones = await screen.findByRole('group', { name: 'Drop here' })
      expect(within(zones).getByText('Move to Home')).toBeInTheDocument()
      fireEvent.mouseMove(document, { ...mouse, clientX: 240, clientY: 770 })
      fireEvent.mouseMove(document, { ...mouse, clientX: 241, clientY: 780 })
      // Let go only once the drag stands over Archive: under load it is measured a frame late.
      const archive = within(zones).getByText('Archive').closest('[data-slot="drop-zone"]')
      await waitFor(() => {
        fireEvent.mouseMove(document, { ...mouse, clientX: 241, clientY: 780 })
        expect(archive).toHaveAttribute('data-drop')
      })
      fireEvent.mouseUp(document, { button: 0, clientX: 241, clientY: 780 })
      await waitFor(() => expect(placeOf(libraryStore.getState(), 'silent')).toBe('archived'), {
        timeout: 5000,
      })
      expect(placeOf(libraryStore.getState(), 'amazing')).toBe('archived')
      expect(await screen.findByText('Archived: 2', {}, { timeout: 5000 })).toBeInTheDocument()
    },
  )

  it('moves what is chosen by the Move sheet, into a new playlist', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1', {
      storage: saved({ library: SUNDAY }),
    })
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Silent Night' }))
    await user.click(screen.getByRole('button', { name: 'Add to playlist' }))
    const sheet = await screen.findByRole('dialog', { name: 'Move to' })
    await user.click(within(sheet).getByRole('button', { name: 'New playlist' }))
    const making = await screen.findByRole('dialog', { name: 'New playlist' })
    await user.type(within(making).getByRole('textbox', { name: 'Name' }), 'Christmas')
    await user.click(within(making).getByRole('button', { name: 'Create' }))
    await waitFor(() =>
      expect(placeOf(libraryStore.getState(), 'silent')).toMatchObject({ folder: 'folder-2' }),
    )
  })

  it('offers Delete where every song chosen is the learner’s own, to the Trash with Undo', async () => {
    const user = userEvent.setup()
    const { piecesStore, libraryStore } = await renderApp('/songs/all', {
      storage: saved({ pieces: { songs: [SONG], nextSong: 2 } }),
    })
    await user.click(await screen.findByRole('button', { name: 'Select' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Morning' }))
    // Delete under the bar's More, as the bar comes (R29 B10).
    await user.click(screen.getByRole('button', { name: 'More' }))
    await user.click(
      within(await screen.findByRole('dialog', { name: 'More' })).getByRole('button', {
        name: 'Delete',
      }),
    )
    expect(await screen.findByText('“Morning” moved to the Trash')).toBeInTheDocument()
    expect(libraryStore.getState().trash.map((each) => each.id)).toEqual(['my-1'])
    expect(piecesStore.getState().songs).toEqual([SONG])
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(libraryStore.getState().trash).toEqual([])
  })
})

describe('Songs: the sort and the favourites (ADR 0106)', () => {
  it('sorts by Title, kept in the library, the menu saying how', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/hymns')
    await user.click(await screen.findByRole('button', { name: 'Sort by: Last played' }))
    await user.click(await screen.findByRole('menuitemradio', { name: 'Title' }))
    expect(libraryStore.getState().sort).toBe('title')
    const titles = within(screen.getByRole('region', { name: 'Songs' }))
      .getAllByRole('link')
      .map((link) => link.textContent ?? '')
    expect(titles).toEqual(titles.toSorted((a, b) => a.localeCompare(b, 'en')))
    expect(screen.getByRole('button', { name: 'Sort by: Title' })).toBeInTheDocument()
  })

  it('keeps the favourites alone in Favourites, a place of its own at Home', async () => {
    const user = userEvent.setup()
    await renderApp('/songs', { storage: saved({ library: { favourites: ['silent'] } }) })
    const playlists = await screen.findByRole('region', { name: 'Playlists' })
    await user.click(within(playlists).getByRole('link', { name: /^Favourites/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Favourites' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /Silent Night/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Amazing Grace/ })).not.toBeInTheDocument()
  })
})

describe('Songs: your own', () => {
  it('makes a new song at Home in one sheet: its name, staves, tempo and bars, key and time', async () => {
    const user = userEvent.setup()
    const { router, piecesStore, libraryStore } = await renderApp('/songs')
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New song' }))
    const sheet = await screen.findByRole('dialog', { name: 'New song' })
    expect(within(sheet).getByRole('button', { name: 'Create' })).toBeDisabled()
    await user.type(within(sheet).getByRole('textbox', { name: 'Name' }), 'Evening')
    const tempo = within(sheet).getByRole('group', { name: 'Tempo' })
    await user.click(within(tempo).getByRole('button', { name: 'Faster' }))
    const bars = within(sheet).getByRole('group', { name: 'Bars' })
    await user.click(within(bars).getByRole('button', { name: 'One bar fewer' }))
    await user.click(within(sheet).getByRole('radio', { name: 'G major' }))
    await user.click(within(sheet).getByRole('radio', { name: '3/4' }))
    await user.click(within(sheet).getByRole('button', { name: 'Create' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/my-1'))
    const song = piecesStore.getState().songs[0]
    expect(song).toMatchObject({ id: 'my-1', title: 'Evening', key: 'G', meter: '3/4', tempo: 84 })
    // The seven bars asked.
    expect(song?.sections[0]?.lines[0]?.split(' ')).toHaveLength(7)
    expect(placeOf(libraryStore.getState(), 'my-1', ['my-1'])).toMatchObject({ folder: null })
  })

  it('makes a new song inside the playlist open', async () => {
    const user = userEvent.setup()
    const { router, libraryStore } = await renderApp('/songs/folders/folder-1', {
      storage: saved({ library: SUNDAY }),
    })
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New song' }))
    const sheet = await screen.findByRole('dialog', { name: 'New song' })
    await user.type(within(sheet).getByRole('textbox', { name: 'Name' }), 'Doxology')
    await user.click(within(sheet).getByRole('button', { name: 'Create' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/my-1'))
    expect(placeOf(libraryStore.getState(), 'my-1', ['my-1'])).toEqual({
      folder: 'folder-1',
      index: 2,
    })
  })

  it('makes a melody alone, one staff: a lead sheet (ADR 0114, 0097)', async () => {
    const user = userEvent.setup()
    const { piecesStore, router } = await renderApp('/songs')
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New song' }))
    const sheet = await screen.findByRole('dialog', { name: 'New song' })
    await user.type(within(sheet).getByRole('textbox', { name: 'Name' }), 'Hymn')
    await user.click(within(sheet).getByRole('radio', { name: /^Melody/ }))
    await user.click(within(sheet).getByRole('button', { name: 'Create' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/my-1'))
    expect(piecesStore.getState().songs[0]).toMatchObject({ leadSheet: true })
    expect(piecesStore.getState().songs[0]?.staves).toHaveLength(1)
  })

  it('stands the learner’s own songs at Home, after the folders', async () => {
    await renderApp('/songs', { storage: saved({ pieces: { songs: [SONG], nextSong: 2 } }) })
    expect(await screen.findByRole('link', { name: /Morning/ })).toHaveAttribute(
      'href',
      '/songs/my-1',
    )
  })

  it('makes a playlist in the playlist open', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/folders/folder-1', {
      storage: saved({ library: SUNDAY }),
    })
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New playlist' }))
    const sheet = await screen.findByRole('dialog', { name: 'New playlist' })
    await user.click(within(sheet).getByRole('button', { name: 'Create' }))
    expect(libraryStore.getState().folders.at(-1)).toMatchObject({
      id: 'folder-2',
      parent: 'folder-1',
    })
    const playlists = await screen.findByRole('region', { name: 'Playlists' })
    expect(linkNames(playlists)).toEqual(['New playlist Empty'])
  })

  it('says what an empty playlist is for, and leads to the library to fill it', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/folders/folder-1', {
      storage: saved({
        library: {
          folders: [{ id: 'folder-1', name: 'Sunday', picture: 'church', paint: 'sky', songs: [] }],
          nextFolder: 2,
        },
      }),
    })
    expect(await screen.findByText('Nothing in this playlist yet')).toBeInTheDocument()
    expect(screen.getByText('The songs you put in this playlist show here.')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Add songs from your library' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/all'))
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
    expect(row).not.toHaveTextContent('Chart not available')
  })
})

describe('Songs: the archive’s and the Trash’s way in (ADR 0106)', () => {
  it('stands Archive and Trash at Home’s foot, each counting what it holds', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs', {
      storage: saved({
        library: { archive: [{ kind: 'song', id: 'silent', from: { folder: 'hymns', index: 0 } }] },
      }),
    })
    expect(await screen.findByRole('link', { name: 'Archive 1' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Trash 0' })).toHaveAttribute('href', '/songs/trash')
    // A playlist's page holds neither: only its own songs archived, under Archived (n).
    await user.click(screen.getByRole('link', { name: /^Hymns/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Hymns' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /^Trash/ })).toBeNull()
    expect(screen.getByRole('link', { name: /^Archived/ })).toHaveAttribute(
      'href',
      '/songs/folders/hymns/archived',
    )
    await user.click(screen.getByRole('button', { name: 'Back to Songs' }))
    await user.click(await screen.findByRole('link', { name: 'Archive 1' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/archive'))
  })
})

describe('Songs: in Russian', () => {
  it('reads in Russian, with nothing left in English', async () => {
    const user = userEvent.setup()
    await renderApp('/songs', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Песни' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Гимны.*5 песен/ })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
    await user.click(screen.getByRole('link', { name: /^Гимны/ }))
    await user.click(await screen.findByRole('button', { name: 'Выбрать' }))
    expect(screen.getByRole('toolbar', { name: /./ })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
