import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

/** A side's First and Second as their rows say them: "First Favourite", "Second No action". */
const side = (name: string) =>
  within(screen.getByRole('group', { name }))
    .getAllByRole('button')
    .map((row) => row.textContent)

describe('Settings › Library › Swipe actions (R29 B10, R32)', () => {
  it('is a page of Settings’ Library, its Back to Settings on a phone (the owner’s bug)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings')
    const library = await screen.findByRole('region', { name: 'Library' })
    await user.click(within(library).getByRole('link', { name: /^Swipe actions/ }))
    await screen.findByRole('heading', { level: 1, name: 'Swipe actions' })
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings'))
  })

  it('shows each side of a song’s swipe, and a playlist’s, each its First and Second', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/swipe-actions')
    await screen.findByRole('heading', { level: 1, name: 'Swipe actions' })
    expect(side('Leading swipe (right)')).toEqual(['FirstFavourite', 'SecondNo action'])
    expect(side('Trailing swipe (left)')).toEqual(['FirstMove', 'SecondArchive'])
    await user.click(screen.getByRole('radio', { name: 'Playlists' }))
    expect(side('Leading swipe (right)')).toEqual(['FirstEdit', 'SecondNo action'])
  })

  it('picks each slot from its side’s acts or No action, a slot left empty letting the next move up', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/swipe-actions')
    await screen.findByRole('heading', { level: 1, name: 'Swipe actions' })
    const trailing = within(screen.getByRole('group', { name: 'Trailing swipe (left)' }))
    await user.click(trailing.getAllByRole('button')[0]!)
    const first = await screen.findByRole('listbox', { name: 'Trailing swipe (left): First' })
    await user.click(within(first).getByRole('option', { name: 'No action' }))
    expect(settingsStore.getState().bars['swipe.songs.trailing']).toEqual(['archive'])
    expect(side('Trailing swipe (left)')).toEqual(['FirstArchive', 'SecondNo action'])
  })
})
