import { createMemoryHistory } from '@tanstack/react-router'
import { act, cleanup, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { COLLECTIONS, PIECES_STORAGE_KEY } from '@/entities/piece'
import { SETTINGS_STORAGE_KEY } from '@/entities/settings'
import { createMemoryStorage, safeLocalStorage } from '@/shared/lib'
import { stubServiceWorker } from '@/shared/test/pwa-register'
import { testContext } from '@/app/testing/test-context'
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
  ['/practice/chords', '/practice/chords'],
  ['/practice/scales', '/practice/scales'],
  ['/practice/intervals', '/practice/intervals'],
  ['/practice/chords/find', '/practice/chords/find'],
  ['/practice/progressions/reharmonise', '/practice/progressions/reharmonise'],
  ['/practice/progressions/passing', '/practice/progressions/passing'],
  ['/practice/progressions', '/practice/progressions'],
  ['/play/progression', '/play/progression'],
  ['/learn/lessons/reading-chord-symbols', '/learn/lessons/$lessonId'],
  ['/practice/trainers/build-chord', '/practice/trainers/$trainerId'],
  ['/settings', '/settings'],
  ['/check?of=chords:tri', '/check'],
  ['/practice', '/practice'],
  ['/practice/studies/ex3', '/practice/studies/$pieceId'],
] as const

async function open(path: string) {
  const router = createAppRouter({
    history: createMemoryHistory({ initialEntries: [path] }),
    ...testContext(),
  })
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
    ['/practice/chords?step=scale:major', ['step']],
    ['/practice/scales?step=chords:tri', ['step']],
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

  it.each([
    '/theory',
    '/theory/chords',
    '/learn/lessons/nothing',
    '/practice/trainers/nothing',
    '/practice/quiz/gaps',
    '/practice/progressions/flow',
    '/practice/passing-chords',
    '/practice/reharmonise',
    '/practice/tensions',
    '/practice/chord-finder',
  ])('shows not found at %s', async (path) => {
    await renderApp(path)
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('keeps every screen a lazy route component, so it loads on demand', async () => {
    // The route tree is module state and a loaded lazy component drops `preload`: only a fresh
    // module shows screens nothing has loaded yet.
    vi.resetModules()
    const fresh = await import('./router')
    const router = fresh.createAppRouter({ history: createMemoryHistory(), ...testContext() })
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
    expect(links.map((link) => link.textContent)).toEqual([
      'Path',
      'Songs',
      'Learn',
      'Practice',
      'Settings',
    ])
    expect(within(nav).getByRole('link', { name: 'Songs' })).toHaveAttribute('aria-current', 'page')
  })

  it.each([
    ['/practice/scales', 'Practice'],
    ['/learn/lessons/reading-chord-symbols', 'Learn'],
    ['/practice/trainers/gaps', 'Practice'],
  ])('marks the place of %s current: %s', async (path, place) => {
    await renderApp(path)
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    expect(within(nav).getByRole('link', { name: place })).toHaveAttribute('aria-current', 'page')
  })

  it('reaches Settings from the Path screen', async () => {
    const user = userEvent.setup()
    await renderApp('/')
    await user.click(
      within(await screen.findByRole('main')).getByRole('link', { name: 'Settings' }),
    )
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
    await user.click(await screen.findByRole('radio', { name: 'Русский' }))
    const nav = await screen.findByRole('navigation', { name: 'Основная навигация' })
    expect(within(nav).getByRole('link', { name: 'Путь' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('ru')
  })

  it('repaints the app as soon as the learner picks a theme', async () => {
    const user = userEvent.setup()
    await renderApp('/settings')
    await user.click(await screen.findByRole('radio', { name: 'Dark' }))
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

describe('going back', () => {
  it('returns to where the learner was on the screen it goes back to', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    await screen.findByRole('heading', { level: 1, name: 'Practice' })
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(480)
    act(() => void document.dispatchEvent(new Event('scroll')))
    await user.click(screen.getByRole('link', { name: /^Intervals / }))
    await screen.findByRole('heading', { level: 1, name: 'Intervals' })
    vi.mocked(window.scrollTo).mockClear()
    await act(() => router.history.back())
    await waitFor(() =>
      expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 480 })),
    )
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

  it('goes back from a study opened directly to Accompaniment’s studies', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/studies/ex3')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/studies'))
  })

  it('closes the Player of a song written in degrees, opened directly, to its page on Songs', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/romashki')
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/romashki'))
  })
})

describe('the learner’s pieces', () => {
  const saved = (state: object) => {
    const storage = createMemoryStorage()
    storage.setItem(PIECES_STORAGE_KEY, JSON.stringify({ state, version: 1 }))
    return storage
  }
  const SONG = {
    id: 'my-1',
    title: 'Morning',
    key: 'G',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: ['G C D G'] }],
  }

  it('plays a song in the learner’s version', async () => {
    const version = {
      ...SONG,
      key: 'Bm',
      meter: '12/8',
      sections: [{ kind: 'verse', lines: ['Em A'] }],
    }
    await renderApp('/play/bz1', { storage: saved({ versions: { bz1: version } }) })
    expect(await screen.findByRole('button', { name: 'Bar 1: Em' })).toBeInTheDocument()
  })

  it('plays an own song, and shows its page on Songs', async () => {
    const storage = saved({ songs: [SONG], nextSong: 2 })
    await renderApp('/play/my-1', { storage })
    expect(await screen.findByRole('button', { name: 'Bar 2: C' })).toBeInTheDocument()
    cleanup()
    await renderApp('/songs/my-1', { storage })
    expect(await screen.findByRole('heading', { level: 1, name: 'Morning' })).toBeInTheDocument()
  })

  it('opens a listing in the Player once the learner has written its chart', async () => {
    const version = {
      ...SONG,
      key: 'Cm',
      meter: '3/4',
      sections: [{ kind: 'verse', lines: ['Cm Fm'] }],
    }
    await renderApp('/play/bz4', { storage: saved({ versions: { bz4: version } }) })
    expect(await screen.findByRole('button', { name: 'Bar 1: Cm' })).toBeInTheDocument()
  })

  it('shows not found for an own song that is not there', async () => {
    await renderApp('/play/my-3')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
