import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { forgetScreens, type Up } from './up-context'
import { UpProvider } from './up-provider'
import { useUp } from './use-up'

function Back() {
  const up = useUp()
  return (
    <button type="button" onClick={up}>
      Back
    </button>
  )
}

/** Each screen's parent: a song's is Songs, Songs is a place. */
const PARENTS: Record<string, Up | null> = { '/songs/grace': { to: '/songs' }, '/songs': null }

/** A song's page opened over `entries`, under a provider that knows each screen's parent. */
async function open(entries: string[]) {
  const root = createRootRoute({
    component: () => (
      <UpProvider findUp={() => PARENTS[router.state.location.pathname] ?? null}>
        <Outlet />
      </UpProvider>
    ),
  })
  const page = (path: string, text: string) =>
    createRoute({
      getParentRoute: () => root,
      path,
      component: () => (
        <>
          <p>{text}</p>
          <Back />
        </>
      ),
    })
  const router = createRouter({
    routeTree: root.addChildren([
      page('/', 'Learn'),
      page('/songs', 'Songs'),
      page('/songs/grace', 'Grace'),
    ]),
    history: createMemoryHistory({ initialEntries: entries }),
  })
  render(<RouterProvider router={router} />)
  await screen.findByRole('button', { name: 'Back' })
  if (router.state.location.pathname !== '/songs/grace') {
    router.history.push('/songs/grace')
  }
  await screen.findByText('Grace')
  return router
}

const at = (router: Awaited<ReturnType<typeof open>>) => ({
  path: router.history.location.pathname,
  index: router.history.location.state.__TSR_index,
})

describe('useUp', () => {
  it('steps back when the entry before is the parent: nothing piles up', async () => {
    const user = userEvent.setup()
    const router = await open(['/songs'])
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await screen.findByText('Songs')
    expect(at(router)).toEqual({ path: '/songs', index: 0 })
  })

  it('returns to the screen the learner came from in the app, as a phone’s Back does', async () => {
    const user = userEvent.setup()
    const router = await open(['/'])
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await screen.findByText('Learn')
    expect(at(router)).toEqual({ path: '/', index: 0 })
  })

  it('opened directly (a link, a reload), goes up to the parent, never out of the app', async () => {
    const user = userEvent.setup()
    const router = await open(['/songs/grace'])
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await screen.findByText('Songs')
    expect(at(router)).toEqual({ path: '/songs', index: 1 })
  })

  it('does nothing on a place', async () => {
    const user = userEvent.setup()
    const router = await open(['/songs'])
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await screen.findByText('Songs')
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(at(router)).toEqual({ path: '/songs', index: 0 })
  })

  it('steps past a screen deleted since, to the parent where none is left before it', async () => {
    const user = userEvent.setup()
    const router = await open(['/songs'])
    forgetScreens(router.history, '/songs')
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await screen.findByText('Songs')
    expect(at(router)).toEqual({ path: '/songs', index: 2 })
  })
})
