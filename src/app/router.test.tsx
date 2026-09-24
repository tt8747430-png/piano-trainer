import { createMemoryHistory } from '@tanstack/react-router'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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
] as const

async function open(path: string) {
  const router = createAppRouter(createMemoryHistory({ initialEntries: [path] }))
  await router.load()
  return router
}

describe('routes', () => {
  it.each(ROUTES)('%s opens %s', async (path, routeId) => {
    const router = await open(path)
    expect(router.state.matches.at(-1)?.routeId).toBe(routeId)
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
    renderApp('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Path' })).toBeInTheDocument()
  })

  it('calls a piece a song on screen', async () => {
    renderApp('/songs/bz5')
    expect(await screen.findByRole('heading', { level: 1, name: 'Song' })).toBeInTheDocument()
  })

  it('offers Path, Songs and Theory in the main navigation, marking the current one', async () => {
    renderApp('/songs')
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(['Path', 'Songs', 'Theory'])
    expect(within(nav).getByRole('link', { name: 'Songs' })).toHaveAttribute('aria-current', 'page')
  })

  it('marks Theory current on every Theory section', async () => {
    renderApp('/theory/quiz')
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    expect(within(nav).getByRole('link', { name: 'Theory' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('opens a deep link to a Theory section with its tab selected', async () => {
    renderApp('/theory/scales')
    expect(await screen.findByRole('heading', { level: 2, name: 'Scales' })).toBeInTheDocument()
    const tabs = screen.getByRole('navigation', { name: 'Theory sections' })
    expect(within(tabs).getByRole('link', { name: 'Scales' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('reaches Settings from the Path screen', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.click(await screen.findByRole('link', { name: 'Settings' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument()
  })

  it('shows a not-found screen for an unknown address', async () => {
    renderApp('/nowhere')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to Songs' })).toHaveAttribute('href', '/songs')
  })

  it('speaks Russian when the learner chose it', async () => {
    renderApp('/', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Путь' })).toBeInTheDocument()
  })

  it('still opens when the browser blocks storage', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    renderApp('/', { storage: safeLocalStorage() })
    expect(await screen.findByRole('heading', { level: 1, name: 'Path' })).toBeInTheDocument()
  })

  it('relabels the app as soon as the learner switches to Russian', async () => {
    const user = userEvent.setup()
    renderApp('/settings')
    await user.click(await screen.findByRole('radio', { name: 'Русский' }))
    const nav = await screen.findByRole('navigation', { name: 'Основная навигация' })
    expect(within(nav).getByRole('link', { name: 'Путь' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('ru')
  })

  it('repaints the app as soon as the learner picks a theme', async () => {
    const user = userEvent.setup()
    renderApp('/settings')
    await user.click(await screen.findByRole('radio', { name: 'Dark' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
