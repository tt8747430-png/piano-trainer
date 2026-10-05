import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { VIEWS_STORAGE_KEY } from '@/entities/views'
import { createMemoryStorage } from '@/shared/lib'
import { renderApp } from './testing/render-app'

/** Leaves a screen the way a learner leaves the app: the next session starts on the same storage. */
async function useScreen(path: string, storage: Storage) {
  const { unmount, viewsStore } = await renderApp(path, { storage })
  await waitFor(() => expect(Object.keys(viewsStore.getState().views)).not.toHaveLength(0))
  unmount()
}

describe('Remembered views', () => {
  it('brings a piece back as it was played when it is opened plainly again, but not its loop', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    await useScreen('/play/bz5?key=A&pattern=r3&inversion=1&tempo=50&loop=1-2', storage)
    const { router } = await renderApp('/songs/bz5', { storage })
    await user.click(await screen.findByRole('link', { name: 'Practise' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/play/bz5'))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        key: 'A',
        pattern: 'r3',
        inversion: 1,
        tempo: 50,
      }),
    )
  })

  it('opens the progression the tool names, played the learner’s way', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    await useScreen(
      '/play/progression?p=ii-V-I&key=D&chordSize=ninths&pattern=jazz&walk=fifths',
      storage,
    )
    const { router } = await renderApp('/practice/progressions?p=I-IV-V&key=G', { storage })
    await user.click(await screen.findByRole('link', { name: 'Practise in the Player' }))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        p: 'I-IV-V',
        key: 'G',
        pattern: 'jazz',
        walk: 'fifths',
      }),
    )
  })

  it('shows what a link names, even the screen’s defaults, over the remembered view', async () => {
    const storage = createMemoryStorage()
    await useScreen('/practice/chords?root=D&triad=min&hands=both', storage)
    const named = await renderApp('/practice/chords?root=G&triad=min', { storage })
    await waitFor(() =>
      expect(named.router.state.location.search).toMatchObject({ root: 'G', triad: 'min' }),
    )
    expect(named.router.state.location.search).toMatchObject({ hands: 'both' })
    named.unmount()
    // A link naming C major leaves the URL bare: still C major, never the remembered D minor.
    const bare = await renderApp('/practice/chords', { storage })
    expect(await screen.findByRole('heading', { level: 1, name: 'Chords' })).toBeInTheDocument()
    expect(bare.router.state.location.search).not.toHaveProperty('root')
  })

  it('opens a page Practice explores as it was left, and Back from it returns to Practice', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    await useScreen('/practice/chords?root=D&triad=min', storage)
    const { router } = await renderApp('/practice', { storage })
    await user.click(await screen.findByRole('link', { name: /^Chords / }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ root: 'D', triad: 'min' }),
    )
    router.history.back()
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice'))
  })

  it('opens an unreadable remembered value as the default, redirecting once', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    storage.setItem(
      VIEWS_STORAGE_KEY,
      JSON.stringify({
        state: { views: { '/play/bz5': { key: 'A', tempo: 'fast' } } },
        version: 1,
      }),
    )
    const { router } = await renderApp('/songs/bz5', { storage })
    await user.click(await screen.findByRole('link', { name: 'Practise' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ key: 'A' }))
    expect(router.state.location.search).not.toHaveProperty('tempo', 'fast')
    expect(
      await screen.findByRole('heading', { name: 'Still, my soul, be still' }),
    ).toBeInTheDocument()
    router.history.back()
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/bz5'))
  })
})
