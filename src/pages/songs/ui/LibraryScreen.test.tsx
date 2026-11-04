import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Songs’ switch', () => {
  it('no Public library row', async () => {
    await renderApp('/songs')
    await screen.findByRole('radiogroup', { name: 'My songs or Explore' })
    expect(screen.queryByRole('link', { name: /Public library/ })).toBeNull()
  })

  it('My songs · Explore switches without pushing history', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs?q=waltz')
    await screen.findByRole('radiogroup', { name: 'My songs or Explore' })
    expect(screen.getByRole('radio', { name: 'My songs' })).toBeChecked()
    const before = router.history.length
    await user.click(screen.getByRole('radio', { name: 'Explore' }))
    await waitFor(() => expect(router.state.location.search).toEqual({ view: 'explore' }))
    expect(router.history.length).toBe(before)
    expect(
      await screen.findByRole('searchbox', { name: 'Search songs and patterns' }),
    ).toBeVisible()
    await user.click(screen.getByRole('radio', { name: 'My songs' }))
    await waitFor(() => expect(router.state.location.search).toEqual({}))
    expect(await screen.findByRole('radio', { name: 'My songs' })).toBeChecked()
  })

  it('comes back to Explore when Songs opens plainly, the view remembered', async () => {
    const user = userEvent.setup()
    const { router, viewsStore } = await renderApp('/songs?view=explore')
    await screen.findByRole('searchbox', { name: 'Search songs and patterns' })
    expect(viewsStore.getState().views['/songs']).toEqual({ view: 'explore' })
    await router.navigate({ to: '/practice' })
    await user.click((await screen.findAllByRole('link', { name: 'Songs' }))[0]!)
    await waitFor(() => expect(router.state.location.search).toEqual({ view: 'explore' }))
  })
})
