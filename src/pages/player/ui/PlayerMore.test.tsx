import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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
  return within(menu)
    .getAllByRole('button')
    .map((action) => action.textContent)
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

describe('the Player’s More (ADR 0099)', () => {
  it.each([
    ['a song', '/play/bz5', ['Song information', 'Export to MIDI']],
    ['a study', '/play/ex3', ['Study information', 'Export to MIDI']],
    ['a walk', '/play/walk?root=D&kind=dorian', ['Export to MIDI']],
    ['a progression', '/play/progression?p=ii-V-I&key=Bb', ['Export to MIDI']],
    ['a chromatic walk', '/play/chromatic?chords=m9&root=G', ['Export to MIDI']],
    ['an exercise', '/play/exercise/hanon', ['Export to MIDI']],
  ])('lists what %s has', async (_music, path, actions) => {
    const user = userEvent.setup()
    await renderApp(path)
    expect(await moreActions(user)).toEqual(actions)
  })

  it('shares an own song alone, saying the link is copied where there is no share sheet', async () => {
    const user = userEvent.setup()
    await renderApp('/play/my-1', { storage: withSong() })
    expect(await moreActions(user)).toEqual(['Song information', 'Export to MIDI', 'Share'])
    await user.click(screen.getByRole('button', { name: 'Share' }))
    await waitFor(() =>
      expect(screen.getByText(/^Link copied\./)).toHaveAttribute('role', 'status'),
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
    ])
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
    ])
    // A study's title is translated whole: no printed one stands under it.
    expect(within(sheet).queryByText(/^Урок 3/)).not.toBeInTheDocument()
  })

  it('exports the music as it plays to a MIDI file named for it, at the tempo chosen', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5?tempo=36')
    const saved = catchDownloads()
    await chooseMore(user, 'Export to MIDI')
    expect(saved.names).toEqual(['Still, my soul, be still.mid'])
    const [file] = saved.files
    if (!file) throw new Error('a file is saved')
    expect(file.type).toBe('audio/midi')
    const bytes = new Uint8Array(await file.arrayBuffer())
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('MThd')
    expect(firstTempo(bytes)).toBe(36)
  })

  it('exports a walk under its title, at the tempo it plays', async () => {
    const user = userEvent.setup()
    await renderApp('/play/walk?root=D&kind=dorian')
    const saved = catchDownloads()
    await chooseMore(user, 'Export to MIDI')
    expect(saved.names).toEqual(['Walk the chords in D Dorian.mid'])
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
    await user.click(await screen.findByRole('button', { name: 'Экспорт в MIDI' }))
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
