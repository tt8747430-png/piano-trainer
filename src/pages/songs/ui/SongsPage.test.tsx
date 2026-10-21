import { act, cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PIECES_STORAGE_KEY } from '@/entities/piece'
import { markLearned } from '@/features/mark-learned/mark-learned'
import { createMemoryStorage } from '@/shared/lib'

describe('Songs', () => {
  it('lists the collections, marking listings with no chart', async () => {
    await renderApp('/songs')
    expect(
      await screen.findByRole('heading', { level: 2, name: '«Боже, спасибо»' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('No chart yet').length).toBeGreaterThan(0)
  })

  it('searches through the URL and opens a song', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    await user.type(await screen.findByRole('searchbox', { name: 'Search songs' }), 'душа')
    expect(router.state.location.search).toMatchObject({ q: 'душа' })
    expect(await screen.findByRole('link', { name: /Still, my soul, be still/ })).toHaveAttribute(
      'href',
      '/songs/bz5',
    )
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

  it('names the search that found nothing, and clears the filters', async () => {
    const user = userEvent.setup()
    await renderApp('/songs?q=zzzz')
    expect(await screen.findByText('No songs match “zzzz”.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(
      await screen.findByRole('heading', { level: 2, name: '«Боже, спасибо»' }),
    ).toBeInTheDocument()
  })

  it('keeps one collection, which its tab names instead of a heading', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    const tabs = await screen.findByRole('tablist', { name: 'Collection' })
    expect(within(tabs).getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true')
    await user.click(within(tabs).getByRole('tab', { name: 'Hymns' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ collection: 'hymns' }))
    expect(await screen.findByRole('link', { name: /Silent Night/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
  })

  it('shows a song’s key, its stage and, once learned, that it is', async () => {
    const { progressStore } = await renderApp('/songs')
    const song = await screen.findByRole('link', { name: /Still, my soul, be still/ })
    expect(song).toHaveTextContent('G')
    expect(within(song).getByRole('img', { name: 'Intermediate' })).toBeInTheDocument()
    expect(within(song).queryByRole('img', { name: 'Learned' })).not.toBeInTheDocument()
    act(() => markLearned(progressStore, 'piece:bz5', new Date()))
    expect(within(song).getByRole('img', { name: 'Learned' })).toBeInTheDocument()
  })

  it('lists songs only: no study or progression', async () => {
    await renderApp('/songs')
    expect(await screen.findByRole('heading', { level: 2, name: 'Hymns' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Studies' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Progressions' })).not.toBeInTheDocument()
  })
})

describe('Songs: your own', () => {
  const SONG = {
    id: 'my-1',
    title: 'Morning',
    key: 'G',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: ['G C D G'] }],
  }
  const saved = (state: object) => {
    const storage = createMemoryStorage()
    storage.setItem(PIECES_STORAGE_KEY, JSON.stringify({ state, version: 1 }))
    return storage
  }

  it('makes a new song from its title, key and meter, and opens it in the editor', async () => {
    const user = userEvent.setup()
    const { router, piecesStore } = await renderApp('/songs')
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
  })

  it('lists your songs first, and chooses them from their tab', async () => {
    const { router } = await renderApp('/songs', { storage: saved({ songs: [SONG], nextSong: 2 }) })
    const headings = await screen.findAllByRole('heading', { level: 2 })
    expect(headings[0]).toHaveTextContent('Your songs')
    expect(screen.getByRole('link', { name: /Morning/ })).toHaveAttribute('href', '/songs/my-1')
    cleanup()
    await renderApp('/songs?collection=mine', { storage: saved({ songs: [SONG], nextSong: 2 }) })
    expect(await screen.findByRole('link', { name: /Morning/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Still, my soul/ })).toBeNull()
    expect(router.state.location.pathname).toBe('/songs')
  })

  it('gives Your songs a tab when chosen, before there are any, its way to make one', async () => {
    const user = userEvent.setup()
    await renderApp('/songs?collection=mine')
    const empty = (await screen.findByText('No songs of your own yet')).closest('[data-slot=empty]')
    if (!(empty instanceof HTMLElement)) throw new Error('an empty shelf says so')
    expect(screen.queryByText(/No songs match/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Your songs' })).toHaveAttribute('aria-selected', 'true')
    await user.click(within(empty).getByRole('button', { name: 'New song' }))
    expect(await screen.findByRole('textbox', { name: 'Title' })).toBeInTheDocument()
  })

  it('has no tab for Your songs while there are none', async () => {
    await renderApp('/songs')
    await screen.findByRole('tablist', { name: 'Collection' })
    expect(screen.queryByRole('tab', { name: 'Your songs' })).not.toBeInTheDocument()
  })

  it('lists a listing whose chart the learner wrote as a song', async () => {
    const version = {
      ...SONG,
      key: 'Cm',
      meter: '3/4',
      sections: [{ kind: 'verse', lines: ['Cm'] }],
    }
    await renderApp('/songs?q=лань', { storage: saved({ versions: { bz4: version } }) })
    const row = await screen.findByRole('link', { name: /Как лань желает/ })
    expect(row).not.toHaveTextContent('No chart yet')
  })

  it('shows only the songs with chords while With chords is pressed, kept in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    await screen.findByRole('tablist', { name: 'Collection' })
    expect(screen.getAllByText('No chart yet').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'With chords' }))
    expect(router.state.location.search).toMatchObject({ withChords: true })
    expect(screen.queryByText('No chart yet')).not.toBeInTheDocument()
  })

  it('keeps the songs of one stage, chosen from Stage and kept in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    await user.click(await screen.findByRole('combobox', { name: /^Stage/ }))
    await user.click(await screen.findByRole('option', { name: 'Beginner' }))
    expect(router.state.location.search).toMatchObject({ stage: 'beginner' })
    expect(await screen.findByRole('link', { name: /Hot Cross Buns/ })).toBeInTheDocument()
    // A listing belongs to no course: no stage keeps it.
    expect(screen.queryByText('No chart yet')).not.toBeInTheDocument()
  })

  it('offers no stage where no song has one, and says which stage found nothing', async () => {
    await renderApp('/songs?collection=mine', {
      storage: createMemoryStorage(),
    })
    expect(await screen.findByText('No songs of your own yet')).toBeInTheDocument()
    // Your songs are in no course: Stage is not offered over them.
    expect(screen.queryByRole('combobox', { name: /^Stage/ })).not.toBeInTheDocument()
    cleanup()
    await renderApp('/songs?collection=hymns&stage=advanced')
    expect(await screen.findByText('No songs here at the “Advanced” stage.')).toBeInTheDocument()
    // Clear filters keeps the shelf.
    await userEvent.setup().click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(await screen.findByRole('tab', { name: 'Hymns' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })
})
