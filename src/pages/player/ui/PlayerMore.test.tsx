import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { readSongLink } from '@/features/share-song'
import { createMemoryStorage } from '@/shared/lib'

/** The learner's own song, Morning, as they made it. */
const MORNING = {
  title: 'Morning',
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['G C D G'] }],
} as const

/** A device holding Morning as the learner's first song. */
function withSong() {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({
      state: { songs: [{ id: 'my-1', ...MORNING }], nextSong: 2 },
      version: PIECES_VERSION,
    }),
  )
  return storage
}

type User = ReturnType<typeof userEvent.setup>

/** Opens the bar's More and reads its actions, in order. */
async function moreActions(user: User) {
  await user.click(await screen.findByRole('button', { name: 'More' }))
  const menu = await screen.findByRole('dialog', { name: 'More' })
  // Each by its name, the reason a greyed one gives left out.
  return within(menu)
    .getAllByRole('button')
    .map((action) =>
      [...action.childNodes]
        .filter((part) => !(part instanceof HTMLElement && part.hidden))
        .map((part) => part.textContent)
        .join(''),
    )
}

/** Opens More's Export… and chooses one of its rows, by its title. */
async function exportAs(user: User, row: string) {
  await chooseMore(user, 'Export…')
  const sheet = await screen.findByRole('dialog', { name: 'Export' })
  const title = within(sheet).getByText(row, { exact: true })
  const button = title.closest('button')
  if (!button) throw new Error(`${row} is a row of Export`)
  await user.click(button)
}

/** Opens More and chooses one of its actions. */
async function chooseMore(user: User, action: string) {
  await user.click(await screen.findByRole('button', { name: 'More' }))
  await user.click(await screen.findByRole('button', { name: action }))
}

/** The files the browser is handed to save, as a download hands them: each one's name and bytes. */
function catchDownloads() {
  const files: Blob[] = []
  const names: string[] = []
  vi.stubGlobal(
    'URL',
    class extends URL {
      static override createObjectURL = (file: Blob) => {
        files.push(file)
        return 'blob:music'
      }
      static override revokeObjectURL = () => {}
    },
  )
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    names.push(this.download)
  })
  return { files, names }
}

/** The facts a sheet lists, each its name and what it is. */
const factsIn = (sheet: HTMLElement) =>
  within(sheet)
    .getAllByRole('term')
    .map((term) => [term.textContent, term.nextElementSibling?.textContent])

/** A MIDI file's first tempo, in quarter notes a minute: its first Set Tempo event (FF 51 03). */
function firstTempo(bytes: Uint8Array): number {
  const at = bytes.findIndex((byte, i) => byte === 0xff && bytes[i + 1] === 0x51)
  const [a = 0, b = 0, c = 0] = bytes.slice(at + 3, at + 6)
  return Math.round(60_000_000 / ((a << 16) | (b << 8) | c))
}

/**
 * Where a MIDI file's first note is struck, in its ticks: the first Note On of its first part's
 * track, counted from its start.
 */
function firstNoteOn(bytes: Uint8Array): number {
  const tracks: Uint8Array[] = []
  for (let at = 14; at < bytes.length;) {
    const length = new DataView(bytes.buffer, bytes.byteOffset + at + 4, 4).getUint32(0)
    tracks.push(bytes.slice(at + 8, at + 8 + length))
    at += 8 + length
  }
  let first = Infinity
  for (const track of tracks.slice(1)) {
    let i = 0
    let tick = 0
    const varLength = () => {
      let value = 0
      for (;;) {
        const next = track[i++] ?? 0
        value = (value << 7) | (next & 0x7f)
        if (next < 0x80) return value
      }
    }
    while (i < track.length) {
      tick += varLength()
      const status = track[i++] ?? 0
      if (status === 0xff) {
        i += 1
        const length = varLength()
        i += length
      } else {
        if (status >> 4 === 0x9 && (track[i + 1] ?? 0) > 0) first = Math.min(first, tick)
        i += 2
      }
    }
  }
  return first
}

describe('the Player’s More (ADR 0108)', () => {
  const LIBRARY = ['Add to favourites', 'Move to…', 'Archive']
  it.each([
    ['a song', '/play/bz5', [...LIBRARY, 'Song information', 'Sections', 'Print', 'Export…']],
    // A study is in no library (ADR 0106).
    ['a study', '/play/ex3', ['Study information', 'Sections', 'Print', 'Export…']],
    ['a walk', '/play/walk?root=D&kind=dorian', ['Print', 'Export…']],
    ['an exercise', '/play/exercise/hanon', ['Print', 'Export…']],
  ])('lists what %s has', async (_music, path, actions) => {
    const user = userEvent.setup()
    await renderApp(path)
    expect(await moreActions(user)).toEqual(actions)
  })

  it.each([
    ['a song', '/play/bz5', ['MusicXML', 'MIDI', 'Share link']],
    // With a recording, its MIDI fixed tempo or time aligned to the recording (ADR 0107).
    [
      'a song with a recording',
      '/play/romashki',
      ['MusicXML', 'MIDI', 'MIDI, time aligned', 'Share link'],
    ],
    ['a progression', '/play/progression?p=ii-V-I&key=Bb', ['MIDI']],
    ['a chromatic walk', '/play/chromatic?chords=m9&root=G', ['MIDI']],
  ])('exports %s the ways the Export sheet lists', async (_music, path, rows) => {
    const user = userEvent.setup()
    await renderApp(path)
    await chooseMore(user, 'Export…')
    const sheet = await screen.findByRole('dialog', { name: 'Export' })
    expect(
      within(within(sheet).getByRole('list', { name: 'Export' }))
        .getAllByRole('button')
        .map((row) => row.textContent),
      // Each row's title, then its line.
    ).toEqual(rows.map((row) => expect.stringMatching(new RegExp(`^${row} [A-Z]`))))
  })

  it('shares an own song with its music, saying the link is copied where there is no share sheet', async () => {
    const user = userEvent.setup()
    await renderApp('/play/my-1', { storage: withSong() })
    expect(await moreActions(user)).toEqual([
      'Add to favourites',
      'Move to…',
      'Archive',
      'Song information',
      'Sections',
      'Print',
      'Export…',
    ])
    await user.keyboard('{Escape}')
    await exportAs(user, 'Share link')
    await waitFor(() =>
      expect(screen.getByText(/^Link copied\. Anyone who opens it can add/)).toHaveAttribute(
        'role',
        'status',
      ),
    )
    const link = new URL(await navigator.clipboard.readText())
    expect(link.pathname).toBe('/songs/shared')
    expect(await readSongLink(link.searchParams.get('song') ?? '')).toEqual({
      title: 'Morning',
      music: {
        key: 'G',
        meter: '4/4',
        tempo: 90,
        pattern: 'r1',
        sections: MORNING.sections,
      },
    })
  })

  it('shares a song of the app as a link to itself, in the key it is played and as simplified', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5?key=A&simple=true')
    await exportAs(user, 'Share link')
    await waitFor(() =>
      expect(screen.getByText(/^Link copied\. Anyone who opens it/)).toHaveAttribute(
        'role',
        'status',
      ),
    )
    const link = new URL(await navigator.clipboard.readText())
    expect(link.origin).toBe(window.location.origin)
    expect(link.pathname).toBe('/play/bz5')
    expect(Object.fromEntries(link.searchParams)).toEqual({ key: 'A', simple: 'true' })
  })

  it('hands the link to the device’s share sheet where it has one', async () => {
    const user = userEvent.setup()
    const share = vi.fn(() => Promise.resolve())
    Object.defineProperty(navigator, 'share', { value: share, configurable: true })
    onTestFinished(() => void Reflect.deleteProperty(navigator, 'share'))
    await renderApp('/play/bz5')
    await exportAs(user, 'Share link')
    await waitFor(() => expect(share).toHaveBeenCalledTimes(1))
    expect(share).toHaveBeenCalledWith({
      title: 'Still, my soul, be still',
      url: `${window.location.origin}/play/bz5?key=G&simple=false`,
    })
    // The share sheet says what it did: the screen says nothing.
    expect(screen.queryByText(/^Link copied/)).not.toBeInTheDocument()
  })

  it('keeps a piece among the favourites, moves it into a new folder and archives it, from More (ADR 0106)', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/play/bz5')
    await chooseMore(user, 'Add to favourites')
    expect(libraryStore.getState().favourites).toEqual(['bz5'])
    // Named by what it does now.
    await chooseMore(user, 'Remove from favourites')
    expect(libraryStore.getState().favourites).toEqual([])
    await chooseMore(user, 'Move to…')
    const sheet = await screen.findByRole('dialog', { name: 'Move to' })
    await user.click(within(sheet).getByRole('button', { name: 'New folder' }))
    const making = await screen.findByRole('dialog', { name: 'New folder' })
    await user.type(within(making).getByRole('textbox', { name: 'Name' }), 'Sunday')
    await user.click(within(making).getByRole('button', { name: 'Create folder' }))
    await waitFor(() =>
      expect(
        libraryStore.getState().folders.find((folder) => folder.id === 'folder-1'),
      ).toMatchObject({ name: 'Sunday', songs: ['bz5'] }),
    )
    expect(
      await screen.findByText('“Still, my soul, be still” moved to Sunday'),
    ).toBeInTheDocument()
    await chooseMore(user, 'Archive')
    expect(libraryStore.getState().archive).toEqual([
      { kind: 'song', id: 'bz5', from: { folder: 'folder-1', index: 0 } },
    ])
  })

  it('shows a song’s information: its chords, its key, time and tempo, its second title and who wrote it', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await chooseMore(user, 'Song information')
    const sheet = await screen.findByRole('dialog', { name: 'Song information' })
    const chords = within(sheet).getByRole('list', { name: 'Chords' })
    expect(
      within(chords)
        .getAllByRole('button')
        .map((chord) => chord.textContent),
    ).toEqual(['G', 'C', 'Em', 'G/B', 'C/E', 'Dsus4', 'D/F♯', 'Am', 'D7', 'D'])
    expect(factsIn(sheet)).toEqual([
      ['Key', 'G'],
      ['Time', '4/4'],
      ['Tempo', '72 BPM'],
      ['Tuning', 'A 440 Hz'],
    ])
    // At the standard pitch, nothing more is said of it.
    expect(within(sheet).queryByRole('button', { name: 'About Tuning' })).not.toBeInTheDocument()
    expect(within(sheet).getByText('Мир, душа, храни')).toBeInTheDocument()
    expect(
      within(sheet).getByText('Keith Getty, Kristyn Getty, Stuart Townend'),
    ).toBeInTheDocument()
  })

  it('opens a chord’s sheet from the song’s information, and goes back to More as it closes', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await chooseMore(user, 'Song information')
    const sheet = await screen.findByRole('dialog', { name: 'Song information' })
    const [, , em] = within(within(sheet).getByRole('list', { name: 'Chords' })).getAllByRole(
      'button',
    )
    if (!em) throw new Error('Em is the third chord')
    await user.click(em)
    const chord = await screen.findByRole('dialog', { name: 'Em chord' })
    expect(within(chord).queryByText('Play it on the keys')).not.toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Em chord' })).not.toBeInTheDocument(),
    )
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'More' })).toHaveFocus()
  })

  it('says the key the Setup plays it in, its chords in that key', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5?key=A')
    await chooseMore(user, 'Song information')
    const sheet = await screen.findByRole('dialog', { name: 'Song information' })
    const [first] = within(within(sheet).getByRole('list', { name: 'Chords' })).getAllByRole(
      'button',
    )
    expect(first).toHaveTextContent(/^A$/)
    expect(factsIn(sheet)[0]).toEqual(['Key', 'A'])
  })

  it('prints the key and the chords as the views print chord symbols, with ♯ and ♭', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5?key=F%23')
    await chooseMore(user, 'Song information')
    const sheet = await screen.findByRole('dialog', { name: 'Song information' })
    const chords = within(within(sheet).getByRole('list', { name: 'Chords' })).getAllByRole(
      'button',
    )
    expect(chords.map((chord) => chord.textContent).slice(0, 3)).toEqual(['F♯', 'B', 'D♯m'])
    expect(factsIn(sheet)[0]).toEqual(['Key', 'F♯'])
  })

  it('names a study’s information as a study’s, with no second title of its own', async () => {
    const user = userEvent.setup()
    await renderApp('/play/ex3')
    await chooseMore(user, 'Study information')
    const sheet = await screen.findByRole('dialog', { name: 'Study information' })
    expect(factsIn(sheet)).toEqual([
      ['Key', 'C'],
      ['Time', '4/4'],
      ['Tempo', '76 BPM'],
      ['Tuning', 'A 440 Hz'],
    ])
    // A study's title is translated whole: no printed one stands under it.
    expect(within(sheet).queryByText(/^Урок 3/)).not.toBeInTheDocument()
  })

  it('exports the music as it plays to a MIDI file named for it and its tempo, the tempo chosen', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5?tempo=36')
    const saved = catchDownloads()
    await exportAs(user, 'MIDI')
    expect(saved.names).toEqual(['Still, my soul, be still (36 BPM).mid'])
    const [file] = saved.files
    if (!file) throw new Error('a file is saved')
    expect(file.type).toBe('audio/midi')
    const bytes = new Uint8Array(await file.arrayBuffer())
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('MThd')
    expect(firstTempo(bytes)).toBe(36)
  })

  it('exports the music as written to a MusicXML file named for it (ADR 0107)', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5?key=A')
    const saved = catchDownloads()
    await exportAs(user, 'MusicXML')
    expect(saved.names).toEqual(['Still, my soul, be still.musicxml'])
    const [file] = saved.files
    if (!file) throw new Error('a file is saved')
    expect(file.type).toBe('application/vnd.recordare.musicxml+xml')
    const text = await file.text()
    expect(text).toContain('<score-partwise version="4.0">')
    expect(text).toContain('<work-title>Still, my soul, be still</work-title>')
    // In its own key, G, whatever key it is played in.
    expect(text).toContain('<fifths>1</fifths>')
  })

  it('exports a song with a recording at the tempo chosen, or time aligned to the recording', async () => {
    const user = userEvent.setup()
    await renderApp('/play/romashki?tempo=60')
    const saved = catchDownloads()
    await exportAs(user, 'MIDI')
    await exportAs(user, 'MIDI, time aligned')
    // Time aligned: at the recording's tempo, its notes from where its bar 1 is, 3.26 s in.
    expect(saved.names).toEqual(['Daisy fields (60 BPM).mid', 'Daisy fields (73 BPM).mid'])
    const [fixed, aligned] = await Promise.all(
      saved.files.map(async (file) => new Uint8Array(await file.arrayBuffer())),
    )
    if (!fixed || !aligned) throw new Error('two files are saved')
    expect(firstTempo(fixed)).toBe(60)
    expect(firstTempo(aligned)).toBe(73)
    expect(firstNoteOn(fixed)).toBe(0)
    // 3.26 s at 73 a minute, in 480 ticks a quarter.
    expect(firstNoteOn(aligned)).toBe(Math.round((3.26 * 73 * 480) / 60))
  })

  it('exports a walk under its title, at the tempo it plays', async () => {
    const user = userEvent.setup()
    await renderApp('/play/walk?root=D&kind=dorian')
    const saved = catchDownloads()
    await exportAs(user, 'MIDI')
    expect(saved.names).toEqual([
      expect.stringMatching(/^Walk the chords in D Dorian \(\d+ BPM\)\.mid$/),
    ])
    const [file] = saved.files
    if (!file) throw new Error('a file is saved')
    expect(String.fromCharCode(...new Uint8Array(await file.arrayBuffer()).slice(0, 4))).toBe(
      'MThd',
    )
  })

  it('names the file’s tracks as the screen names the parts, in the learner’s language', async () => {
    const user = userEvent.setup()
    await renderApp('/play/silent', { locale: 'ru' })
    const saved = catchDownloads()
    await user.click(await screen.findByRole('button', { name: 'Ещё' }))
    await user.click(await screen.findByRole('button', { name: 'Экспорт…' }))
    const sheet = await screen.findByRole('dialog', { name: 'Экспорт' })
    const midi = within(sheet).getByText('MIDI', { exact: true }).closest('button')
    if (!midi) throw new Error('MIDI is a row of Export')
    await user.click(midi)
    const [file] = saved.files
    if (!file) throw new Error('a file is saved')
    const text = new TextDecoder().decode(await file.arrayBuffer())
    // Silent Night's staff of no name of its own, by its place; then the hands.
    for (const name of ['Нотоносец 1', 'Правая рука', 'Левая рука']) expect(text).toContain(name)
    expect(text).not.toContain('Right hand')
  })

  it('reads in Russian, its menu and the song’s information', async () => {
    const user = userEvent.setup()
    await renderApp('/play/my-1', { storage: withSong(), locale: 'ru' })
    await user.click(await screen.findByRole('button', { name: 'Ещё' }))
    await screen.findByRole('dialog', { name: 'Ещё' })
    expect(untranslated(document.body)).toEqual([])
    await user.click(screen.getByRole('button', { name: 'О песне' }))
    await screen.findByRole('dialog', { name: 'О песне' })
    expect(untranslated(document.body)).toEqual([])
  })
})
