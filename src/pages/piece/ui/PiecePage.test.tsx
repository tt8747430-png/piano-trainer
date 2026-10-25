import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { readSongLink } from '@/features/share-song'
import { COLLECTIONS, PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { createMemoryStorage } from '@/shared/lib'

/** Opens the bar's More, where its rarer actions fold. */
async function openMore(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: 'More' }))
}

describe('Piece', () => {
  it('titles a song in English over its printed title, with credits and source', async () => {
    await renderApp('/songs/bz5')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Мир, душа, храни')).toBeInTheDocument()
    expect(screen.getByText('«Боже, спасибо» · No. 5 · p. 16')).toBeInTheDocument()
  })

  it('says what the song is, and plays nothing: no chords, chart or keys (ADR 0098)', async () => {
    const { audio } = await renderApp('/songs/bz5')
    await screen.findByRole('heading', { level: 1, name: 'Still, my soul, be still' })
    expect(screen.getByText('72 BPM')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Scale: G major' })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Chords' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Bar 1/ })).not.toBeInTheDocument()
    // A page that plays nothing shows no keys, folded or not.
    expect(screen.queryByRole('group', { name: 'Keyboard' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Keys' })).not.toBeInTheDocument()
    expect(audio.played).toEqual([])
  })

  it('opens the Player at a section from its form, looping it (ADR 0098)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/bz5')
    const form = await screen.findByRole('navigation', { name: 'Form' })
    expect(
      within(form)
        .getAllByRole('link')
        .map((section) => [section.getAttribute('aria-label'), section.getAttribute('href')]),
    ).toEqual([
      ['Practise Verse', '/play/bz5?loop=1-8'],
      ['Practise Chorus', '/play/bz5?loop=9-18'],
      ['Practise Ending', '/play/bz5?loop=19-19'],
    ])
    // Each chip says its section and how long it is.
    const chorus = within(form).getByRole('link', { name: 'Practise Chorus' })
    expect(chorus).toHaveTextContent('Chorus10 bars')
    await user.click(chorus)
    await waitFor(() => expect(router.state.location.pathname).toBe('/play/bz5'))
    expect(router.state.location.search).toEqual({ loop: '9-18' })
  })

  it('checks the song’s chords from More, its one action there', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/bz5')
    await openMore(user)
    const more = await screen.findByRole('dialog', { name: 'More' })
    expect(
      within(more)
        .getAllByRole('button')
        .map((action) => action.textContent),
    ).toEqual(['Check these chords'])
    await user.click(within(more).getByRole('button', { name: 'Check these chords' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/check'))
    expect(router.state.location.search).toEqual({ of: 'piece:bz5' })
  })

  it('floats Practise, its main action, and keeps Edit, Learned and More in its bar', async () => {
    await renderApp('/songs/bz5')
    const practise = await screen.findByRole('link', { name: 'Practise' })
    expect(practise.closest('[data-slot="floating-actions"]')).not.toBeNull()
    const bar = screen.getByRole('heading', { level: 1 }).closest('header') as HTMLElement
    for (const name of ['Edit the score', 'Learned', 'More'])
      expect(
        within(bar).getByRole(name === 'Edit the score' ? 'link' : 'button', { name }),
      ).toBeInTheDocument()
    // Three actions beside Back: on a phone the title takes a row of its own under them.
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('max-sm:basis-full')
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

  it('reads in Russian, its form’s sections too', async () => {
    await renderApp('/songs/bz5', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Мир, душа, храни' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Играть: Куплет' })).toHaveTextContent('Куплет8 тактов')
    expect(untranslated(document.body)).toEqual([])
  })

  it('says a folk tune’s credit in Russian, and keeps names as printed', async () => {
    await renderApp('/songs/hot-cross-buns', { locale: 'ru' })
    expect(await screen.findByText('народная')).toBeInTheDocument()
    expect(screen.queryByText('Traditional')).toBeNull()
  })

  it('says “American folk tune” in Russian beside the tune’s name', async () => {
    await renderApp('/songs/amazing', { locale: 'ru' })
    expect(
      await screen.findByText('New Britain (американская народная мелодия)'),
    ).toBeInTheDocument()
  })

  it('shows a listing without a chart: its one action writes it', async () => {
    const listing = COLLECTIONS.flatMap((c) => c.entries).find((e) => e.kind === 'listing')
    if (!listing) throw new Error('the catalog has no listing')
    await renderApp(`/songs/${listing.id}`)
    // It says what is missing, and what writing it gives.
    expect(await screen.findByText('No chart yet')).toBeInTheDocument()
    expect(
      (await screen.findByRole('link', { name: 'Write the chart' })).closest(
        '[data-slot="floating-actions"]',
      ),
    ).not.toBeNull()
    expect(screen.queryByRole('link', { name: 'Practise' })).not.toBeInTheDocument()
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
    storage.setItem(PIECES_STORAGE_KEY, JSON.stringify({ state, version: PIECES_VERSION }))
    return storage
  }

  it('offers no Check for a new song of no chord symbol, only its own ways (ADR 0094)', async () => {
    const user = userEvent.setup()
    const silent = { rh: 'r/3 | r/3 | r/3 | r/3', lh: 'r/3 | r/3 | r/3 | r/3' }
    const song = {
      ...MUSIC,
      id: 'my-1',
      title: 'Morning',
      sections: [{ kind: 'verse', lines: ['_ _ _ _'] }],
      hands: silent,
    }
    await renderApp('/songs/my-1', { storage: saved({ songs: [song], nextSong: 2 }) })
    await openMore(user)
    const more = await screen.findByRole('dialog', { name: 'More' })
    expect(
      within(more)
        .getAllByRole('button')
        .map((action) => action.textContent),
    ).toEqual(['Share', 'Delete'])
  })

  it('loops a section with its repeats as the Player plays it, every pass (ADR 0067, 0098)', async () => {
    // The verse's first two bars repeated, then the chorus: played Em D Em D C, then G D.
    const song = {
      ...MUSIC,
      id: 'my-1',
      title: 'Morning',
      sections: [
        { kind: 'verse', lines: ['|: Em D :| C'] },
        { kind: 'chorus', lines: ['G D'] },
      ],
    }
    await renderApp('/songs/my-1', { storage: saved({ songs: [song], nextSong: 2 }) })
    const form = await screen.findByRole('navigation', { name: 'Form' })
    expect(
      within(form)
        .getAllByRole('link')
        .map((section) => [section.getAttribute('href'), section.textContent]),
    ).toEqual([
      ['/play/my-1?loop=1-5', 'Verse5 bars'],
      ['/play/my-1?loop=6-7', 'Chorus2 bars'],
    ])
  })

  it('edits a song in the score editor', async () => {
    await renderApp('/songs/amazing')
    expect(await screen.findByRole('link', { name: 'Edit the score' })).toHaveAttribute(
      'href',
      '/edit/amazing',
    )
  })

  it('shows the learner’s version, and resets it to the original once asked', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs/amazing', {
      storage: saved({ versions: { amazing: { ...MUSIC, tempo: 96 } } }),
    })
    expect((await screen.findByText('Your version')).closest('dl')).not.toBeNull()
    expect(screen.getByText('96 BPM')).toBeInTheDocument()
    await openMore(user)
    await user.click(screen.getByRole('button', { name: 'Reset to the original' }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    expect(piecesStore.getState().versions).toEqual({})
    expect(await screen.findByText('80 BPM')).toBeInTheDocument()
    expect(screen.queryByText('Your version')).toBeNull()
  })

  it('names a version by the learner’s own title in Songs, Search and on its page; Reset brings back the catalog’s (ADR 0094)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs?collection=hymns', {
      storage: saved({ versions: { amazing: { ...MUSIC, title: 'My grace' } } }),
    })
    expect(await screen.findByRole('link', { name: /My grace/ })).toHaveAttribute(
      'href',
      '/songs/amazing',
    )
    await act(() => router.navigate({ to: '/search', search: { q: 'my grace' } }))
    expect(await screen.findByRole('link', { name: /My grace/ })).toBeInTheDocument()
    await act(() => router.navigate({ to: '/songs/$pieceId', params: { pieceId: 'amazing' } }))
    expect(await screen.findByRole('heading', { level: 1, name: 'My grace' })).toBeInTheDocument()
    await openMore(user)
    await user.click(screen.getByRole('button', { name: 'Reset to the original' }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Amazing Grace' }),
    ).toBeInTheDocument()
  })

  it('gives the focus back to More once Reset is not wanted', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/amazing', { storage: saved({ versions: { amazing: MUSIC } }) })
    await openMore(user)
    await user.click(screen.getByRole('button', { name: 'Reset to the original' }))
    expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    await waitFor(() => expect(screen.getByRole('button', { name: 'More' })).toHaveFocus())
  })

  it('shares an own song as a link that carries it, copied where there is no share sheet', async () => {
    const user = userEvent.setup()
    const song = { id: 'my-1', title: 'Morning', ...MUSIC }
    await renderApp('/songs/my-1', { storage: saved({ songs: [song], nextSong: 2 }) })
    await openMore(user)
    await user.click(await screen.findByRole('button', { name: 'Share' }))
    // The status line is always there, empty until the song is deflated and copied.
    await waitFor(() =>
      expect(screen.getByRole('status', { name: '' })).toHaveTextContent('Link copied.'),
    )
    const link = new URL(await navigator.clipboard.readText())
    expect(link.pathname).toBe('/songs/shared')
    expect(await readSongLink(link.searchParams.get('song') ?? '')).toEqual({
      title: 'Morning',
      music: MUSIC,
    })
  })

  it('deletes an own song once asked, back on Songs', async () => {
    const user = userEvent.setup()
    const song = { id: 'my-1', title: 'Morning', ...MUSIC }
    const { router, piecesStore } = await renderApp('/songs/my-1', {
      storage: saved({ songs: [song], nextSong: 2 }),
    })
    expect(await screen.findByRole('heading', { level: 1, name: 'Morning' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Learned' })).toBeNull()
    await openMore(user)
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
