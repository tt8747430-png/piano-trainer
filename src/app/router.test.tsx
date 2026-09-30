import { createMemoryHistory } from '@tanstack/react-router'
import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { COLLECTIONS } from '@/entities/piece'
import { SETTINGS_STORAGE_KEY } from '@/entities/settings'
import { createMemoryStorage, safeLocalStorage } from '@/shared/lib'
import { stubServiceWorker } from '@/shared/test/pwa-register'
import { createAppRouter } from './router'
import { renderApp } from './testing/render-app'

const ROUTES = [
  ['/', '/'],
  ['/songs', '/songs'],
  ['/songs/bz5', '/songs/$pieceId'],
  ['/play/bz5', '/play/$pieceId'],
  ['/play/walk', '/play/walk'],
  ['/play/chromatic', '/play/chromatic'],
  ['/learn', '/learn'],
  ['/learn/chords', '/learn/chords'],
  ['/learn/scales', '/learn/scales'],
  ['/learn/keys', '/learn/keys'],
  ['/learn/intervals', '/learn/intervals'],
  ['/learn/tensions', '/learn/tensions'],
  ['/learn/chord-finder', '/learn/chord-finder'],
  ['/learn/reharmonise', '/learn/reharmonise'],
  ['/learn/passing-chords', '/learn/passing-chords'],
  ['/learn/progressions', '/learn/progressions'],
  ['/play/progression', '/play/progression'],
  ['/learn/lessons/reading-chord-symbols', '/learn/lessons/$lessonId'],
  ['/practice/quiz/build-chord', '/practice/quiz/$quiz'],
  ['/settings', '/settings'],
  ['/check?of=chords:tri', '/check'],
  ['/practice', '/practice'],
  ['/practice/studies/ex3', '/practice/studies/$pieceId'],
  ['/practice/progressions/flow', '/practice/progressions/$pieceId'],
] as const

async function open(path: string) {
  const router = createAppRouter(createMemoryHistory({ initialEntries: [path] }))
  await router.load()
  return router
}

describe('routes', () => {
  it.each(ROUTES)('%s opens %s', async (path, route) => {
    const router = await open(path)
    expect(router.state.matches.at(-1)?.fullPath).toBe(route)
  })

  it.each([
    [
      '/play/bz5?key=H&tempo=999&pattern=waltz&rh=zz&lh=zz&chordSize=elevenths',
      ['key', 'tempo', 'pattern', 'rh', 'lh', 'chordSize'],
    ],
    ['/learn/chords?step=scale:major', ['step']],
    ['/learn/scales?step=chords:tri', ['step']],
    ['/check?of=chords:tri&x=1', []],
  ] as const)('keeps a stale optional param in %s from the screen', async (path, dropped) => {
    const router = await open(path)
    const search: Record<string, unknown> = router.state.matches.at(-1)?.search ?? {}
    for (const param of dropped) expect(search[param]).toBeUndefined()
  })

  it('waits for a slow screen with a spinner, not a blank page', async () => {
    const router = await open('/')
    expect(router.options.defaultPendingComponent).toBeDefined()
    expect(router.options.defaultPendingMs).toBe(300)
  })

  it.each(['/theory', '/theory/chords', '/learn/lessons/nothing', '/practice/quiz/nothing'])(
    'shows not found at %s',
    async (path) => {
      await renderApp(path)
      expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    },
  )

  it('keeps every screen a lazy route component, so it loads on demand', async () => {
    // The route tree is module state and a loaded lazy component drops `preload`: only a fresh
    // module shows screens nothing has loaded yet.
    vi.resetModules()
    const fresh = await import('./router')
    const router = fresh.createAppRouter(createMemoryHistory())
    for (const [path, route] of Object.entries(router.routesByPath)) {
      expect(route.options.component, path).toHaveProperty('preload', expect.any(Function))
    }
  })
})

describe('the app shell', () => {
  it('shows the Path screen at /', async () => {
    await renderApp('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Path' })).toBeInTheDocument()
  })

  it('shows the theme another tab chose', async () => {
    const storage = createMemoryStorage()
    const { settingsStore } = await renderApp('/', { storage })
    const newValue = JSON.stringify({
      state: { ...settingsStore.getState(), theme: 'dark' },
      version: 5,
    })
    storage.setItem(SETTINGS_STORAGE_KEY, newValue)
    act(
      () =>
        void window.dispatchEvent(
          new StorageEvent('storage', { key: SETTINGS_STORAGE_KEY, newValue }),
        ),
    )
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('offers a waiting version in the shell, never over a practice', async () => {
    stubServiceWorker({ waiting: true })
    const { router } = await renderApp('/play/bz5')
    await screen.findByRole('button', { name: 'Play' })
    expect(screen.queryByText('A new version is ready')).not.toBeInTheDocument()
    await act(() => router.navigate({ to: '/' }))
    expect(await screen.findByText('A new version is ready')).toBeInTheDocument()
  })

  it('offers the places in the main navigation, marking the current one', async () => {
    await renderApp('/songs')
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(['Path', 'Songs', 'Learn', 'Practice'])
    expect(within(nav).getByRole('link', { name: 'Songs' })).toHaveAttribute('aria-current', 'page')
  })

  it.each([
    ['/learn/scales', 'Learn'],
    ['/learn/lessons/reading-chord-symbols', 'Learn'],
    ['/practice/quiz/gaps', 'Practice'],
  ])('marks the place of %s current: %s', async (path, place) => {
    await renderApp(path)
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    expect(within(nav).getByRole('link', { name: place })).toHaveAttribute('aria-current', 'page')
  })

  it('reaches Settings from the Path screen', async () => {
    const user = userEvent.setup()
    await renderApp('/')
    await user.click(await screen.findByRole('link', { name: 'Settings' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument()
  })

  it('shows a not-found screen for an unknown address', async () => {
    await renderApp('/nowhere')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to Songs' })).toHaveAttribute('href', '/songs')
  })

  it('speaks Russian when the learner chose it', async () => {
    await renderApp('/', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Путь' })).toBeInTheDocument()
  })

  it('still opens when the browser blocks storage', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    await renderApp('/', { storage: safeLocalStorage() })
    expect(await screen.findByRole('heading', { level: 1, name: 'Path' })).toBeInTheDocument()
  })

  it('relabels the app as soon as the learner switches to Russian', async () => {
    const user = userEvent.setup()
    await renderApp('/settings')
    await user.click(await screen.findByRole('button', { name: 'Русский' }))
    const nav = await screen.findByRole('navigation', { name: 'Основная навигация' })
    expect(within(nav).getByRole('link', { name: 'Путь' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('ru')
  })

  it('repaints the app as soon as the learner picks a theme', async () => {
    const user = userEvent.setup()
    await renderApp('/settings')
    await user.click(await screen.findByRole('button', { name: 'Dark' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})

describe('the Player', () => {
  it('opens full-screen, without the main navigation', async () => {
    await renderApp('/play/bz5')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Main navigation' })).not.toBeInTheDocument()
  })

  it('goes back to where the learner came from', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Path' })
    await act(() => router.navigate({ to: '/play/$pieceId', params: { pieceId: 'bz5' } }))
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
  })

  it('goes back to its song when it was opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/bz5'))
  })

  it('opened directly, leaves the history as it closes, so its song goes back to Songs', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs'))
  })
})

describe('a Piece', () => {
  it('goes back to where the learner came from', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Path' })
    await act(() => router.navigate({ to: '/songs/$pieceId', params: { pieceId: 'bz5' } }))
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
  })

  it('goes back to Songs when it was opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/bz5')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs'))
  })
})

describe('routes that name a piece', () => {
  it('show not found for a piece that is not there', async () => {
    await renderApp('/songs/nothing')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('shows not found for a walk of a scale without chords', async () => {
    await renderApp('/play/walk?kind=blues')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('show not found for a listing in the Player', async () => {
    const listing = COLLECTIONS.flatMap((c) => c.entries).find((e) => e.kind === 'listing')
    if (!listing) throw new Error('the catalogue has no listing')
    await renderApp(`/play/${listing.id}`)
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})

describe('shelves', () => {
  it.each(['/songs/ex3', '/songs/flow', '/practice/studies/bz5', '/practice/progressions/ex3'])(
    'show not found for a piece on the wrong shelf: %s',
    async (path) => {
      await renderApp(path)
      expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    },
  )

  it('opens a study on Practice, which the navigation marks', async () => {
    await renderApp('/practice/studies/ex3')
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    expect(within(nav).getByRole('link', { name: 'Practice' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('goes back from a study opened directly to Practice', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/studies/ex3')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice'))
  })

  it('closes a progression’s Player, opened directly, to its page on Practice', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/flow')
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/progressions/flow'))
  })
})
