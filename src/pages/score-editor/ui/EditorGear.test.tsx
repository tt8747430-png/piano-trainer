import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { openGear } from '@/app/testing/editor-gear'
import { renderApp } from '@/app/testing/render-app'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { createMemoryStorage } from '@/shared/lib'

const SONG = {
  id: 'my-1',
  title: 'Morning',
  added: '2026-11-01T09:00:00.000Z',
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['G G G G'] }],
  hands: { rh: 'r/4 | r/4 | r/4 | r/4', lh: 'r/4 | r/4 | r/4 | r/4' },
}

const withSong = (song: object = SONG) => {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
  )
  return storage
}

describe('the editor’s gear (R32-B, Flat’s document menu)', () => {
  it('holds the score’s pages under its title, then each setting one tap away, then Export and Print', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    const sheet = await openGear(user)
    expect(within(sheet).getByRole('heading', { name: 'Morning' })).toBeInTheDocument()
    const rows = within(sheet)
      .getAllByRole('button')
      .map((row) => row.textContent)
    for (const name of [
      'Title and credits',
      'Score view',
      'Transpose',
      'Instruments',
      'Layout',
      'Note input',
      'Recording',
      'Export…',
      'Print',
    ])
      expect(rows.some((row) => row?.startsWith(name))).toBe(true)
    // What the score prints otherwise is set where it prints: no key, time or tempo here.
    for (const gone of ['Music', 'Key signature', 'Time signature', 'Tempo'])
      expect(rows.some((row) => row?.startsWith(gone))).toBe(false)
    // Takes only once there are some; Record a take is the note band's.
    expect(within(sheet).queryByRole('button', { name: /^Takes/ })).not.toBeInTheDocument()
    expect(within(sheet).queryByRole('button', { name: /^Record a take/ })).not.toBeInTheDocument()
    // An own song has no draft to publish.
    expect(within(sheet).queryByRole('button', { name: /^Publish/ })).not.toBeInTheDocument()
    await user.click(within(sheet).getByRole('button', { name: /^Layout/ }))
    expect(
      within(await screen.findByRole('dialog')).getByRole('heading', { name: 'Layout' }),
    ).toBeInTheDocument()
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: 'Back' }),
    )
    expect(
      within(await screen.findByRole('dialog')).getByRole('heading', { name: 'Morning' }),
    ).toBeInTheDocument()
  })

  it('leads to the MIDI keyboard’s one home, Settings › MIDI devices', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/edit/my-1', { storage: withSong() })
    const sheet = await openGear(user)
    // A row to its home, never the fields themselves.
    expect(within(sheet).queryByRole('radiogroup', { name: 'Key size' })).not.toBeInTheDocument()
    await user.click(within(sheet).getByRole('link', { name: /^MIDI keyboard/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/connect-piano'))
  })

  it('opens Title and credits from the title printed on the score, the one place it is typed', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Morning' }))
    const sheet = await screen.findByRole('dialog')
    expect(within(sheet).getByRole('heading', { name: 'Title and credits' })).toBeInTheDocument()
    // Back goes to the gear's first page, whose first row it is, however it was opened.
    expect(within(sheet).getByRole('button', { name: 'Back' })).toBeInTheDocument()
    await user.type(
      within(sheet).getByRole('textbox', { name: 'Composer' }),
      'Clara Schumann{Enter}',
    )
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.header).toEqual({ composer: 'Clara Schumann' }),
    )
    await user.click(within(sheet).getByRole('button', { name: 'Done' }))
    expect(await screen.findByRole('button', { name: /Clara Schumann/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(piecesStore.getState().songs[0]?.header).toBeUndefined())
  })

  it('opens Title and credits from the credits printed on the score', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong({ ...SONG, header: { composer: 'Bach' } }) })
    await user.click(await screen.findByRole('button', { name: /Bach/ }))
    expect(
      within(await screen.findByRole('dialog')).getByRole('heading', {
        name: 'Title and credits',
      }),
    ).toBeInTheDocument()
  })

  it('adds a credit by its role from Add credit, and saves it with the score (A28)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Morning' }))
    const sheet = await screen.findByRole('dialog')
    expect(within(sheet).queryByRole('textbox', { name: 'Translator' })).not.toBeInTheDocument()
    await user.click(within(sheet).getByRole('button', { name: 'Add credit' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Translator' }))
    await user.type(
      await screen.findByRole('textbox', { name: 'Translator' }),
      'Boris Pasternak{Enter}',
    )
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.header).toEqual({ translator: 'Boris Pasternak' }),
    )
  })

  it('adds an instrument’s staff on Instruments, saved with the song', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await openGear(user, /^Instruments/)
    await user.click(await screen.findByRole('button', { name: 'New instrument' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Tenor' }))
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.staves).toEqual([
        expect.objectContaining({ name: { en: 'Tenor', ru: 'Тенор' }, clef: 'treble-8vb' }),
      ]),
    )
    expect(screen.getByRole('list', { name: 'Instruments' })).toHaveTextContent('Tenor')
  })

  it('lays the score out on Layout and plays notes while editing on Note input', async () => {
    const user = userEvent.setup()
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', {
      storage: withSong(),
    })
    await openGear(user, /^Layout/)
    await user.click(await screen.findByRole('button', { name: 'Bars' }))
    await user.click(screen.getByRole('button', { name: 'More bars per system' }))
    await user.click(screen.getByRole('button', { name: 'More bars per system' }))
    await waitFor(() => expect(piecesStore.getState().songs[0]?.layout).toEqual({ barsPerLine: 2 }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Back' }))
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: /^Note input/ }),
    )
    await user.click(await screen.findByRole('switch', { name: /Play notes while editing/ }))
    expect(settingsStore.getState().editing.hearNotes).toBe(false)
  })

  it('holds Click while recording on Recording (R29, 3.10)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await openGear(user, /^Recording/)
    await user.click(await screen.findByRole('switch', { name: /Click while recording/ }))
    expect(settingsStore.getState().recorder.click).toBe(false)
  })

  it('has Play notes while editing and Palette position on Note input, no input mode (R31-E)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await openGear(user, /^Note input/)
    expect(await screen.findByRole('switch', { name: /Play notes while editing/ })).toBeVisible()
    expect(screen.queryByRole('radiogroup', { name: /Input mode/ })).not.toBeInTheDocument()
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Palette position' })).getByRole('radio', {
        name: 'Right',
      }),
    )
    expect(settingsStore.getState().editing.paletteSide).toBe('right')
  })

  it('opens the editor as it was left: its mode, its palette at the side chosen (R31-E)', async () => {
    vi.stubGlobal('matchMedia', (media: string) => ({
      media,
      matches: media === '(min-width: 48rem)',
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }))
    const storage = withSong()
    const first = await renderApp('/edit/my-1', { storage })
    const user = userEvent.setup()
    await screen.findByRole('region', { name: 'Editor panel' })
    await user.keyboard('i')
    await waitFor(() => expect(first.settingsStore.getState().editorMode).toBe('insert'))
    first.settingsStore.setState((state) => ({
      editing: { ...state.editing, paletteSide: 'right' },
    }))
    first.unmount()
    // The next time the editor opens.
    await renderApp('/edit/my-1', { storage })
    const palette = await screen.findByRole('region', { name: 'Editor panel' })
    expect(palette.closest('aside')).toHaveAttribute('data-side', 'right')
    // Insert pressed wherever its key stands (its category, and Recent).
    const inserts = within(palette).getAllByRole('button', { name: 'Insert' })
    expect(inserts.length).toBeGreaterThan(0)
    for (const insert of inserts) expect(insert).toHaveAttribute('aria-pressed', 'true')
  })
})
