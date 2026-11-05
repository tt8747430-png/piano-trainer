import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

const side = (name: string) =>
  within(screen.getByRole('list', { name }))
    .queryAllByRole('button', { name: /: drag to reorder$/ })
    .map((tile) => tile.textContent)

describe('Settings › Library › Swipe actions (R29 B10, R32)', () => {
  it('is a page of Settings’ Library, its Back to Settings on a phone (the owner’s bug)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings')
    const library = await screen.findByRole('region', { name: 'Library' })
    await user.click(within(library).getByRole('link', { name: 'Swipe actions' }))
    await screen.findByRole('heading', { level: 1, name: 'Swipe actions' })
    expect(screen.getByText(/Archive and Delete always ask for confirmation/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings'))
  })

  it('shows each side of a song’s swipe, and a folder’s', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/swipe-actions')
    await screen.findByRole('heading', { level: 1, name: 'Swipe actions' })
    expect(side('Leading swipe (right)')).toEqual(['Favourite'])
    expect(side('Trailing swipe (left)')).toEqual(['Move', 'Archive'])
    await user.click(screen.getByRole('radio', { name: 'Folders' }))
    expect(side('Leading swipe (right)')).toEqual(['Edit'])
  })

  it('takes a side down to none, holds two at most, and resets', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/swipe-actions')
    await screen.findByRole('heading', { level: 1, name: 'Swipe actions' })
    await user.click(screen.getByRole('button', { name: 'Remove Favourite' }))
    expect(side('Leading swipe (right)')).toEqual([])
    expect(settingsStore.getState().bars['swipe.songs.leading']).toEqual([])
    await user.click(screen.getAllByRole('button', { name: 'Add Delete' })[0] as HTMLElement)
    await user.click(screen.getAllByRole('button', { name: 'Add Move' })[0] as HTMLElement)
    expect(settingsStore.getState().bars['swipe.songs.leading']).toEqual(['delete', 'move'])
    expect(screen.getAllByRole('button', { name: 'Add Archive' })[0]).toBeDisabled()
    await user.click(screen.getAllByRole('button', { name: 'Restore defaults' })[0] as HTMLElement)
    expect(side('Leading swipe (right)')).toEqual(['Favourite'])
  })
})
