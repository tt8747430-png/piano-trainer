import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Songs and its Explore (D1)', () => {
  it('has no Public library row', async () => {
    await renderApp('/songs')
    await screen.findByRole('heading', { level: 1, name: 'Songs' })
    expect(screen.queryByRole('link', { name: /Public library/ })).toBeNull()
  })

  it('opens Explore from its shelf’s See all without pushing history, Back coming home', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs')
    const shelf = await screen.findByRole('region', { name: 'Explore' })
    const before = router.history.length
    await user.click(within(shelf).getByRole('button', { name: 'See all' }))
    await waitFor(() => expect(router.state.location.search).toEqual({ view: 'explore' }))
    expect(router.history.length).toBe(before)
    expect(await screen.findByRole('searchbox', { name: 'Search songs and people' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Songs' }))
    await waitFor(() => expect(router.state.location.search).toEqual({}))
    expect(await screen.findByRole('heading', { level: 1, name: 'Songs' })).toBeInTheDocument()
  })

  it('opens on Songs when Songs opens plainly: Explore is never remembered', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs?view=explore')
    await screen.findByRole('searchbox', { name: 'Search songs and people' })
    await router.navigate({ to: '/practice' })
    await user.click((await screen.findAllByRole('link', { name: 'Songs' }))[0]!)
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs'))
    expect(router.state.location.search).toEqual({})
    expect(await screen.findByRole('heading', { level: 1, name: 'Songs' })).toBeInTheDocument()
  })
})
