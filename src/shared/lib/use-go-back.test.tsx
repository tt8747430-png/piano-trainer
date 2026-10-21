import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useGoBack } from './use-go-back'

function Close() {
  const close = useGoBack({ to: '/songs' })
  return (
    <button type="button" onClick={close}>
      Close
    </button>
  )
}

/** A screen to leave at `/play/walk`, opened over `entries`, and the songs it falls back to. */
async function open(entries: string[]) {
  const root = createRootRoute({ component: Outlet })
  const router = createRouter({
    routeTree: root.addChildren([
      createRoute({ getParentRoute: () => root, path: '/', component: () => <p>Home</p> }),
      createRoute({ getParentRoute: () => root, path: '/songs', component: () => <p>Songs</p> }),
      createRoute({ getParentRoute: () => root, path: '/play/walk', component: Close }),
    ]),
    history: createMemoryHistory({ initialEntries: entries }),
  })
  render(<RouterProvider router={router} />)
  if (router.state.location.pathname !== '/play/walk') await router.navigate({ to: '/play/walk' })
  await screen.findByRole('button', { name: 'Close' })
  return router
}

describe('useGoBack', () => {
  it('goes back the way the learner came in', async () => {
    const user = userEvent.setup()
    const router = await open(['/'])
    await user.click(screen.getByRole('button', { name: 'Close' }))
    await screen.findByText('Home')
    expect(router.history.location.pathname).toBe('/')
  })

  it('opened directly, puts the fallback in the screen’s place, so going back never returns to it', async () => {
    const user = userEvent.setup()
    const router = await open(['/play/walk'])
    const entries = router.history.length
    await user.click(screen.getByRole('button', { name: 'Close' }))
    await screen.findByText('Songs')
    // Replaced, not pushed: no entry of the screen left behind the fallback, so Back leaves the app as it came in.
    expect(router.history.length).toBe(entries)
    router.history.back()
    await waitFor(() => expect(router.history.location.pathname).toBe('/songs'))
  })
})
