import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createAppRouter } from './router'
import { RouteError } from './RouteError'

/** Path, and a full-screen screen that throws as it renders, under the app's error screen. */
function renderThrowing(initialEntries: string[], reload = vi.fn()) {
  const rootRoute = createRootRoute()
  const path = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <h1>Path</h1>,
  })
  const player = createRoute({
    getParentRoute: () => rootRoute,
    path: '/play/broken',
    component: () => {
      throw new Error('a screen that cannot draw')
    },
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([path, player]),
    history: createMemoryHistory({ initialEntries }),
    defaultErrorComponent: () => <RouteError reload={reload} />,
  })
  // React reports the error it caught; the test throws it on purpose.
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
  render(<RouterProvider router={router} />)
  return { router, reload }
}

describe('RouteError', () => {
  it('says something went wrong and offers a reload', async () => {
    const user = userEvent.setup()
    const { reload } = renderThrowing(['/play/broken'])
    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong')
    await user.click(screen.getByRole('button', { name: 'Reload' }))
    expect(reload).toHaveBeenCalledOnce()
  })

  it('leaves a screen that throws for where the learner came from', async () => {
    const user = userEvent.setup()
    const { router } = renderThrowing(['/', '/play/broken'])
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.history.canGoBack()).toBe(false)
  })

  it('leaves a screen opened directly for the Path', async () => {
    const user = userEvent.setup()
    const { router } = renderThrowing(['/play/broken'])
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    expect(await screen.findByRole('heading', { name: 'Path' })).toBeInTheDocument()
    expect(router.history.canGoBack()).toBe(false)
  })

  it('is the router’s default error screen', () => {
    const router = createAppRouter(createMemoryHistory())
    expect(router.options.defaultErrorComponent).toBe(RouteError)
  })
})
