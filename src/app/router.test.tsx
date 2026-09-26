import { createMemoryHistory } from '@tanstack/react-router'
import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { COLLECTIONS } from '@/entities/piece'
import { safeLocalStorage } from '@/shared/lib'
import { createAppRouter } from './router'
import { renderApp } from './testing/render-app'

const ROUTES = [
  ['/', '/'],
  ['/songs', '/songs'],
  ['/songs/bz5', '/songs/$pieceId'],
  ['/play/bz5', '/play/$pieceId'],
  ['/theory/chords', '/theory/chords'],
  ['/theory/scales', '/theory/scales'],
  ['/theory/symbols', '/theory/symbols'],
  ['/theory/quiz', '/theory/quiz'],
  ['/settings', '/settings'],
  ['/check?of=chords:tri', '/check'],
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
    ['/theory/chords?step=scale:major', ['step']],
    ['/theory/scales?step=chords:tri', ['step']],
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

  it('sends /theory to Chords', async () => {
    const router = await open('/theory')
    expect(router.state.location.pathname).toBe('/theory/chords')
  })

  it('keeps every screen a lazy route component, so it loads on demand', async () => {
    // The route tree is module state and a loaded lazy component drops `preload`: only a fresh
    // module shows screens nothing has loaded yet.
    vi.resetModules()
    const fresh = await import('./router')
    const router = fresh.createAppRouter(createMemoryHistory())
    for (const path of ['/', '/songs', '/songs/$pieceId', '/play/$pieceId', '/settings'] as const) {
      const component = router.routesByPath[path].options.component as { preload?: unknown }
      expect(component.preload, path).toBeTypeOf('function')
    }
  })
})

describe('the app shell', () => {
  it('shows the Path screen at /', async () => {
    await renderApp('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Path' })).toBeInTheDocument()
  })

  it('offers Path, Songs and Theory in the main navigation, marking the current one', async () => {
    await renderApp('/songs')
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(['Path', 'Songs', 'Theory'])
    expect(within(nav).getByRole('link', { name: 'Songs' })).toHaveAttribute('aria-current', 'page')
  })

  it('marks Theory current on every Theory section', async () => {
    await renderApp('/theory/quiz')
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    expect(within(nav).getByRole('link', { name: 'Theory' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('opens a deep link to a Theory section with its tab selected', async () => {
    await renderApp('/theory/scales')
    const tabs = await screen.findByRole('navigation', { name: 'Theory sections' })
    expect(within(tabs).getByRole('link', { name: 'Scales' })).toHaveAttribute(
      'aria-current',
      'page',
    )
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

  it('show not found for a listing in the Player', async () => {
    const listing = COLLECTIONS.flatMap((c) => c.entries).find((e) => e.kind === 'listing')
    if (!listing) throw new Error('the catalogue has no listing')
    await renderApp(`/play/${listing.id}`)
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
