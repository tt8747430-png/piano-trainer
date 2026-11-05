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

describe('the editor’s gear (R31-E, round 28)', () => {
  it('holds the score’s acts, then its Settings, each a page with Back', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/my-1', { storage: withSong() })
    const sheet = await openGear(user)
    expect(within(sheet).getByRole('heading', { name: 'Score' })).toBeInTheDocument()
    const rows = within(sheet)
      .getAllByRole('button')
      .map((row) => row.textContent)
    for (const name of [
      'View',
      'Transpose',
      'Record a take',
      'Takes',
      'Title and credits',
      'Music',
      'How the editor works',
    ])
      expect(rows.some((row) => row?.startsWith(name))).toBe(true)
    // An own song has no draft to publish.
    expect(within(sheet).queryByRole('button', { name: /^Publish/ })).not.toBeInTheDocument()
    await user.click(within(sheet).getByRole('button', { name: /^Music/ }))
    for (const name of ['Staves', 'Key signature', 'Time signature', 'Tempo', 'Bars'])
      expect(
        within(await screen.findByRole('dialog')).getByRole('button', {
          name: new RegExp(`^${name}`),
        }),
      ).toBeInTheDocument()
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: /^Time/ }),
    )
    expect(
      within(await screen.findByRole('dialog')).getByRole('heading', { name: 'Time signature' }),
    ).toBeInTheDocument()
    // Back to Music, then to the first page.
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: 'Back' }),
    )
    expect(
      within(await screen.findByRole('dialog')).getByRole('heading', { name: 'Music' }),
    ).toBeInTheDocument()
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: 'Back' }),
    )
    expect(
      within(await screen.findByRole('dialog')).getByRole('heading', { name: 'Score' }),
    ).toBeInTheDocument()
  })

  it('saves what prints under the title with the music, Undo taking it away', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    const sheet = await openGear(user, /^Title and credits/)
    await user.type(
      within(sheet).getByRole('textbox', { name: 'Composer' }),
      'Clara Schumann{Enter}',
    )
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.header).toEqual({ composer: 'Clara Schumann' }),
    )
    await user.click(within(sheet).getByRole('button', { name: 'Close' }))
    expect(await screen.findByText('Clara Schumann')).toBeInTheDocument()
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
    const sheet = await openGear(user, /^Title and credits/)
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

  it('adds an instrument’s staff on Staves and makes the song longer on Bars, each saved', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await openGear(user, /^Music/, /^Staves/)
    await user.click(await screen.findByRole('button', { name: 'New instrument' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Tenor' }))
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.staves).toEqual([
        expect.objectContaining({ name: { en: 'Tenor', ru: 'Тенор' }, clef: 'treble-8vb' }),
      ]),
    )
    expect(screen.getByRole('list', { name: 'Instruments' })).toHaveTextContent('Tenor')
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Back' }))
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: /^Bars/ }),
    )
    await user.click(await screen.findByRole('button', { name: 'One bar more' }))
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.sections[0]?.lines[0]?.split(' ')).toHaveLength(5),
    )
  })

  it('lays the score out on Layout and plays notes while editing on Note input', async () => {
    const user = userEvent.setup()
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1', {
      storage: withSong(),
    })
    await openGear(user, /^How the editor works/, /^Layout/)
    await user.click(await screen.findByRole('button', { name: 'Measures' }))
    await user.click(screen.getByRole('button', { name: 'More measures per system' }))
    await user.click(screen.getByRole('button', { name: 'More measures per system' }))
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
    await openGear(user, /^How the editor works/, /^Recording/)
    await user.click(await screen.findByRole('switch', { name: /Click while recording/ }))
    expect(settingsStore.getState().recorder.click).toBe(false)
  })

  it('changes the key from a section chosen on Key signature, the bars before keeping theirs (R29, 3.5)', async () => {
    const user = userEvent.setup()
    const song = {
      ...SONG,
      sections: [
        { kind: 'verse', lines: ['G G'] },
        { kind: 'chorus', lines: ['G G'] },
      ],
    }
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong(song) })
    await openGear(user, /^Music/, /^Key signature/)
    await user.click(await screen.findByRole('combobox', { name: 'From' }))
    await user.click(await screen.findByRole('option', { name: /^Chorus, bar 3/ }))
    await user.click(screen.getByRole('button', { name: 'D major / B minor' }))
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.sections.map((each) => each.key)).toEqual([
        undefined,
        'D',
      ]),
    )
    expect(piecesStore.getState().songs[0]?.key).toBe('G')
  })

  it('has Play notes while editing and Palette side on Note input, no input mode (R31-E)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await openGear(user, /^How the editor works/, /^Note input/)
    expect(await screen.findByRole('switch', { name: /Play notes while editing/ })).toBeVisible()
    expect(screen.queryByRole('radiogroup', { name: /Input mode/ })).not.toBeInTheDocument()
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Palette side' })).getByRole('radio', {
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
    const modes = within(palette).getByRole('group', { name: 'Input mode' })
    expect(within(modes).getByRole('button', { name: 'Insert' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
