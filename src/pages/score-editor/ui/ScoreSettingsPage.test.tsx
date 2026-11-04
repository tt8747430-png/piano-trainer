import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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

const withSong = () => {
  const storage = createMemoryStorage()
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({ state: { songs: [SONG], nextSong: 2 }, version: PIECES_VERSION }),
  )
  return storage
}

describe('the score’s Settings (round 28)', () => {
  it('opens from the editor’s bar and saves what prints under the title with the music', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1', { storage: withSong() })
    await user.click(await screen.findByRole('button', { name: 'Score settings' }))
    const composer = await screen.findByRole('textbox', { name: 'Composer' })
    await user.type(composer, 'Clara Schumann{Enter}')
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.header).toEqual({ composer: 'Clara Schumann' }),
    )
    // Back on the score, it prints under the title, and Undo takes it away.
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(await screen.findByText('Clara Schumann')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(piecesStore.getState().songs[0]?.header).toBeUndefined())
  })

  it('lists Title and credits, Music and How the editor works, each row opening its page (R29, 3.3)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/edit/my-1/settings', { storage: withSong() })
    expect(await screen.findByRole('region', { name: 'Title and credits' })).toBeInTheDocument()
    const rows = (group: string) =>
      within(screen.getByRole('region', { name: group })).getAllByRole('button')
    for (const [at, name] of [
      'Staves',
      'Key signature',
      'Time signature',
      'Tempo',
      'Bars',
    ].entries())
      expect(rows('Music')[at]).toHaveTextContent(name)
    for (const [at, name] of ['Layout', 'Note input', 'Recording'].entries())
      expect(rows('How the editor works')[at]).toHaveTextContent(name)
    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^Layout/ }))
    expect(router.state.location.search).toMatchObject({ page: 'layout' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Layout' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Score settings' }),
    ).toBeInTheDocument()
    expect(router.state.location.search).not.toHaveProperty('page')
    // Up again to the editor, no Settings page's step carried there.
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/my-1'))
    expect(router.state.location.search).not.toHaveProperty('page')
  })

  it('adds an instrument’s staff on Staves and makes the song longer on Bars, each saved', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/edit/my-1/settings?page=staves', {
      storage: withSong(),
    })
    await user.click(await screen.findByRole('button', { name: 'One more Tenor' }))
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.staves).toEqual([
        expect.objectContaining({ name: { en: 'Tenor', ru: 'Тенор' }, clef: 'treble-8vb' }),
      ]),
    )
    expect(screen.getByRole('status', { name: 'Tenor: 1' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await user.click(await screen.findByRole('button', { name: /^Bars/ }))
    await user.click(await screen.findByRole('button', { name: 'One bar more' }))
    await waitFor(() =>
      expect(piecesStore.getState().songs[0]?.sections[0]?.lines[0]?.split(' ')).toHaveLength(5),
    )
  })

  it('lays the score out on Layout and plays notes while editing on Note input', async () => {
    const user = userEvent.setup()
    const { piecesStore, settingsStore } = await renderApp('/edit/my-1/settings?page=layout', {
      storage: withSong(),
    })
    const lines = await screen.findByRole('radiogroup', { name: 'Bars per line' })
    await user.click(within(lines).getByRole('radio', { name: '2' }))
    await waitFor(() => expect(piecesStore.getState().songs[0]?.layout).toEqual({ barsPerLine: 2 }))
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await user.click(await screen.findByRole('button', { name: /^Note input/ }))
    await user.click(await screen.findByRole('switch', { name: /Play notes while editing/ }))
    expect(settingsStore.getState().editing.hearNotes).toBe(false)
  })

  it('holds Click while recording on Recording (R29, 3.10)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1/settings?page=recording', {
      storage: withSong(),
    })
    await user.click(await screen.findByRole('switch', { name: /Click while recording/ }))
    expect(settingsStore.getState().recorder.click).toBe(false)
  })

  it('changes the key from a section chosen on Key signature, the bars before keeping theirs (R29, 3.5)', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const song = {
      ...SONG,
      sections: [
        { kind: 'verse', lines: ['G G'] },
        { kind: 'chorus', lines: ['G G'] },
      ],
    }
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
    )
    const { piecesStore } = await renderApp('/edit/my-1/settings?page=key', { storage })
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
  it('has Play notes while editing, Input mode on opening and Palette side on Note input (R29 B7)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/edit/my-1/settings?page=input', {
      storage: withSong(),
    })
    expect(await screen.findByRole('switch', { name: /Play notes while editing/ })).toBeVisible()
    const mode = screen.getByRole('radiogroup', { name: 'Input mode on opening' })
    expect(within(mode).getByRole('radio', { name: /^Replace/ })).toBeChecked()
    await user.click(within(mode).getByRole('radio', { name: /^Insert/ }))
    const side = screen.getByRole('radiogroup', { name: 'Palette side' })
    await user.click(within(side).getByRole('radio', { name: 'Right' }))
    expect(settingsStore.getState().editing).toMatchObject({
      startMode: 'insert',
      paletteSide: 'right',
    })
  })

  it('opens the editor in Insert, its palette at the right, when chosen (R29 B7)', async () => {
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
    const settings = await renderApp('/edit/my-1/settings?page=input', { storage })
    const user = userEvent.setup()
    const mode = await screen.findByRole('radiogroup', { name: 'Input mode on opening' })
    await user.click(within(mode).getByRole('radio', { name: /^Insert/ }))
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Palette side' })).getByRole('radio', {
        name: 'Right',
      }),
    )
    expect(settings.settingsStore.getState().editing.startMode).toBe('insert')
    settings.unmount()
    // The next time the editor opens.
    await renderApp('/edit/my-1', { storage })
    const palette = await screen.findByRole('region', { name: 'Editor panel' })
    expect(palette.closest('aside')).toHaveAttribute('data-side', 'right')
    await waitFor(() =>
      expect(within(palette).getByRole('combobox', { name: 'Editing mode' })).toHaveTextContent(
        'Insert',
      ),
    )
  })
})
