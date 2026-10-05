import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { COLLECTIONS, PIECES_STORAGE_KEY } from '@/entities/piece'
import { createMemoryStorage } from '@/shared/lib'

describe('Piece', () => {
  it('titles a song in English over its printed title, with credits and source', async () => {
    await renderApp('/songs/bz5')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Мир, душа, храни')).toBeInTheDocument()
    expect(screen.getByText('«Боже, спасибо» · No. 5 · p. 16')).toBeInTheDocument()
  })

  it('lists the chords the song plays, each by its own name, to tap and hear', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/songs/bz5')
    const chords = await screen.findByRole('region', { name: 'Chords' })
    const names = within(chords)
      .getAllByRole('button')
      .map((button) => button.textContent)
    expect(names[0]).toBe('G')
    expect(new Set(names).size).toBe(names.length)
    await user.click(within(chords).getByRole('button', { name: 'G' }))
    expect(
      audio.played.at(-1)?.sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : [])),
    ).toEqual([67, 71, 74])
    expect(within(chords).getByRole('button', { name: 'G' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('checks the song’s chords from their row', async () => {
    await renderApp('/songs/bz5')
    const chords = await screen.findByRole('region', { name: 'Chords' })
    expect(
      within(chords).getByRole('link', { name: 'Check these chords' }).getAttribute('href'),
    ).toMatch(/^\/check\?of=piece(%3A|:)bz5$/)
  })

  it('plays a tapped bar, and shows its notes going down on the keyboard', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/songs/bz5')
    await user.click(await screen.findByRole('button', { name: /^Bar 1: G$/ }))
    expect(audio.played).toHaveLength(1)
    act(() => audio.setNow((audio.played[0]?.at ?? 0) + 0.05))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    const down = within(keyboard)
      .getAllByRole('button')
      .filter((key) => key.hasAttribute('data-down'))
      .map((key) => key.getAttribute('aria-label'))
    expect(down.length).toBeGreaterThan(0)
    // G major: G, B and D in any octave.
    expect(down.every((name) => /^[GBD]\d$/.test(name ?? ''))).toBe(true)
  })

  it('offers Practise before the chords and the chart, in the first screenful', async () => {
    await renderApp('/songs/bz5')
    const practise = await screen.findByRole('link', { name: 'Practise' })
    const chords = screen.getByRole('region', { name: 'Chords' })
    expect(practise.compareDocumentPosition(chords) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('opens the Player and marks the song learned', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/songs/bz5')
    expect(await screen.findByRole('link', { name: 'Practise' })).toHaveAttribute(
      'href',
      '/play/bz5',
    )
    const learned = screen.getByRole('button', { name: 'Learned' })
    expect(learned).toHaveAttribute('aria-pressed', 'false')
    await user.click(learned)
    expect(learned).toHaveAttribute('aria-pressed', 'true')
    expect(progressStore.getState().learned['piece:bz5']).toBeDefined()
  })

  it('reads in Russian, section headings too', async () => {
    await renderApp('/songs/bz5', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Мир, душа, храни' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Куплет' })).toBeInTheDocument()
  })

  it('shows a listing without a chart: its one action writes it', async () => {
    const listing = COLLECTIONS.flatMap((c) => c.entries).find((e) => e.kind === 'listing')
    if (!listing) throw new Error('the catalogue has no listing')
    await renderApp(`/songs/${listing.id}`)
    expect(await screen.findByRole('link', { name: 'Write the chart' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Practise' })).not.toBeInTheDocument()
  })

  it('plays a bar as a toggle: pressed while it plays, a second tap stops it', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/songs/bz5')
    const bar = await screen.findByRole('button', { name: /^Bar 1: G$/ })
    await user.click(bar)
    expect(bar).toHaveAttribute('aria-pressed', 'true')
    const stops = audio.stops
    await user.click(bar)
    expect(audio.stops).toBe(stops + 1)
    expect(bar).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('Piece: the learner’s own music', () => {
  const MUSIC = {
    key: 'G',
    meter: '3/4',
    tempo: 80,
    pattern: 'r2',
    sections: [{ kind: 'verse', lines: ['Em D C G'] }],
  }
  const saved = (state: object) => {
    const storage = createMemoryStorage()
    storage.setItem(PIECES_STORAGE_KEY, JSON.stringify({ state, version: 1 }))
    return storage
  }

  it('edits a song in the score editor', async () => {
    await renderApp('/songs/amazing')
    expect(await screen.findByRole('link', { name: 'Edit' })).toHaveAttribute(
      'href',
      '/edit/amazing',
    )
  })

  it('shows the learner’s version, and resets it to the original once asked', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs/amazing', {
      storage: saved({ versions: { amazing: MUSIC } }),
    })
    expect((await screen.findByText('Your version')).closest('dl')).not.toBeNull()
    expect(screen.getByRole('button', { name: /^Bar 1: Em$/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reset to the original' }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    expect(piecesStore.getState().versions).toEqual({})
    expect(await screen.findByRole('button', { name: /^Bar 1: G$/ })).toBeInTheDocument()
    expect(screen.queryByText('Your version')).toBeNull()
  })

  it('deletes an own song once asked, back on Songs', async () => {
    const user = userEvent.setup()
    const song = { id: 'my-1', title: 'Morning', ...MUSIC }
    const { router, piecesStore } = await renderApp('/songs/my-1', {
      storage: saved({ songs: [song], nextSong: 2 }),
    })
    expect(await screen.findByRole('heading', { level: 1, name: 'Morning' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Learned' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(await screen.findByRole('button', { name: 'Delete for good' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs'))
    expect(piecesStore.getState().songs).toEqual([])
  })

  it('writes a listing’s chart in the editor', async () => {
    await renderApp('/songs/bz4')
    expect(await screen.findByRole('link', { name: 'Write the chart' })).toHaveAttribute(
      'href',
      '/edit/bz4',
    )
  })
})
