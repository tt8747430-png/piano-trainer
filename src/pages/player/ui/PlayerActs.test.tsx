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
  added: '2026-11-01T09:00:00.000Z',
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

/** A menu's items in order: its commands and its checked ones. */
const itemsOf = (menu: HTMLElement) =>
  [
    ...within(menu).queryAllByRole('menuitem'),
    ...within(menu).queryAllByRole('menuitemcheckbox'),
  ].sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))

type User = ReturnType<typeof userEvent.setup>

/** Opens the Player's gear, the home of its settings and its acts on the music. */
async function openGear(user: User, gear = 'Player settings') {
  await user.click(await screen.findByRole('button', { name: gear }))
  return screen.findByRole('dialog', { name: gear })
}

/** Opens the gear's More and gives its menu. */
async function openMore(user: User, gear = 'Player settings', more = 'More') {
  const sheet = await openGear(user, gear)
  await user.click(within(sheet).getByRole('button', { name: more }))
  return screen.findByRole('menu')
}

/** Opens the gear's More and reads the acts on its music, in order, each by its name. */
async function moreActions(user: User) {
  const menu = await openMore(user)
  return itemsOf(menu).map((act) => (act.textContent ?? '').replace(act.title, ''))
}

/** Opens More's Export… and chooses one of its rows, by its title. */
async function exportAs(user: User, row: string) {
  await chooseMore(user, 'Export…')
  const sheet = await screen.findByRole('dialog', { name: 'Export' })
  const title = within(sheet).getByText(row, { exact: true })
  const button = title.closest('button')
  if (!button) throw new Error(`${row} is a row of Export`)
  await user.click(button)
  // Saved, the sheets close, back to the Player.
  while (screen.queryByRole('dialog')) await user.keyboard('{Escape}')
}

/** Opens the gear's More and chooses one of its acts. */
async function chooseMore(user: User, action: string, gear = 'Player settings', more = 'More') {
  const menu = await openMore(user, gear, more)
  const found = itemsOf(menu).find((item) => item.textContent?.startsWith(action))
  if (!found) throw new Error(`${action} is an act of More`)
  await user.click(found)
}

/** Share link, at the head of the gear beside More. */
async function shareLink(user: User) {
  const sheet = await openGear(user)
  await user.click(within(sheet).getByRole('button', { name: 'Share link' }))
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

describe('the acts on the music in the gear’s More (R31-P)', () => {
  it.each([
    ['a song', '/play/bz5', ['Sections', 'Annotate', 'Print', 'Export…']],
    // A study is in no library (ADR 0106); of one section, it has no Sections.
    ['a study', '/play/ex3', ['Annotate', 'Print', 'Export…']],
  ])('lists what %s has, Share link beside More', async (_music, path, actions) => {
    const user = userEvent.setup()
    await renderApp(path)
    expect(await moreActions(user)).toEqual(actions)
    await user.keyboard('{Escape}')
    const sheet = screen.getByRole('dialog', { name: 'Player settings' })
    expect(within(sheet).getByRole('button', { name: 'Share link' })).toBeInTheDocument()
  })

  it('leaves a run its music alone: no More in its gear (the run boards)', async () => {
    const user = userEvent.setup()
    await renderApp('/play/walk?root=D&kind=dorian')
    await user.click(
      within(await screen.findByRole('dialog', { name: 'Setup' })).getByRole('button', {
        name: 'Close',
      }),
    )
    const sheet = await openGear(user)
    expect(within(sheet).queryByRole('button', { name: 'More' })).not.toBeInTheDocument()
  })

  it('opens the piano’s sheet from the transport, its Sound and MIDI keyboard each a link to its home in Settings', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    const transport = await screen.findByRole('toolbar', { name: 'Playback' })
    await user.click(within(transport).getByRole('button', { name: 'Keyboard' }))
    const piano = await screen.findByRole('dialog', { name: 'Piano' })
    expect(within(piano).getByRole('link', { name: /^Sound/ })).toHaveAttribute(
      'href',
      '/settings/storage',
    )
    await user.click(within(piano).getByRole('link', { name: /^MIDI keyboard/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/connect-piano'))
  })

  it.each([
    // Its files alone: its link is Share link, an act of its own (R31-S).
    ['a song', '/play/bz5', ['MusicXML', 'Compressed MusicXML (.mxl)', 'MIDI']],
    // With a recording, its MIDI fixed tempo or time aligned to the recording (ADR 0107).
    [
      'a song with a recording',
      '/play/romashki',
      ['MusicXML', 'Compressed MusicXML (.mxl)', 'MIDI', 'MIDI, time aligned'],
    ],
  ])('exports %s the ways the Export sheet lists', async (_music, path, rows) => {
    const user = userEvent.setup()
    await renderApp(path)
    await chooseMore(user, 'Export…')
    const sheet = await screen.findByRole('dialog', { name: 'Export' })
    expect(
      within(within(sheet).getByRole('list', { name: 'Export' }))
        .getAllByRole('button')
        .map((row) => row.textContent),
      // Each row named for its file, no line under it.
    ).toEqual(rows)
  })

  it('shares an own song with its music, saying the link is copied where there is no share sheet', async () => {
    const user = userEvent.setup()
    await renderApp('/play/my-1', { storage: withSong() })
    await shareLink(user)
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
    await renderApp('/play/bz5?transpose=2&version=simple')
    await shareLink(user)
    await waitFor(() =>
      expect(screen.getByText(/^Link copied\. Anyone who opens it/)).toHaveAttribute(
        'role',
        'status',
      ),
    )
    const link = new URL(await navigator.clipboard.readText())
    expect(link.origin).toBe(window.location.origin)
    expect(link.pathname).toBe('/play/bz5')
    expect(Object.fromEntries(link.searchParams)).toEqual({ transpose: '2', version: 'simple' })
  })

  it('hands the link to the device’s share sheet where it has one', async () => {
    const user = userEvent.setup()
    const share = vi.fn(() => Promise.resolve())
    Object.defineProperty(navigator, 'share', { value: share, configurable: true })
    onTestFinished(() => void Reflect.deleteProperty(navigator, 'share'))
    await renderApp('/play/bz5')
    await shareLink(user)
    await waitFor(() => expect(share).toHaveBeenCalledTimes(1))
    expect(share).toHaveBeenCalledWith({
      title: 'Still, my soul, be still',
      url: `${window.location.origin}/play/bz5?transpose=0&version=original`,
    })
    // The share sheet says what it did: the screen says nothing.
    expect(screen.queryByText(/^Link copied/)).not.toBeInTheDocument()
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
    await renderApp('/play/bz5?transpose=2')
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

  it('names the file’s tracks as the screen names the parts, in the learner’s language', async () => {
    const user = userEvent.setup()
    await renderApp('/play/silent', { locale: 'ru' })
    const saved = catchDownloads()
    await chooseMore(user, 'Экспорт…', 'Настройки плеера', 'Ещё')
    const sheet = await screen.findByRole('dialog', { name: 'Экспорт' })
    const midi = within(sheet).getByText('MIDI', { exact: true }).closest('button')
    if (!midi) throw new Error('MIDI is a row of Export')
    await user.click(midi)
    const [file] = saved.files
    if (!file) throw new Error('a file is saved')
    const text = new TextDecoder().decode(await file.arrayBuffer())
    // Silent Night's staff of no name of its own, by its place; then the hands.
    for (const name of ['Мелодия', 'Правая рука', 'Левая рука']) expect(text).toContain(name)
    expect(text).not.toContain('Right hand')
  })

  it('reads in Russian, its gear and its More', async () => {
    const user = userEvent.setup()
    await renderApp('/play/my-1', { storage: withSong(), locale: 'ru' })
    await openMore(user, 'Настройки плеера', 'Ещё')
    expect(untranslated(document.body)).toEqual([])
  })
})
