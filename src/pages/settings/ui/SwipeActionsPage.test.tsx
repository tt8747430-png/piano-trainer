import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

const side = (name: string) =>
  within(screen.getByRole('list', { name }))
    .queryAllByRole('button', { name: /: drag to move$/ })
    .map((tile) => tile.textContent)

describe('Settings › Swipe actions (R29 B10)', () => {
  it('shows each side of a song’s swipe, and a folder’s', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/swipe-actions')
    await screen.findByRole('heading', { level: 1, name: 'Swipe actions' })
    expect(side('Swipe right')).toEqual(['Favourite'])
    expect(side('Swipe left')).toEqual(['Move', 'Archive'])
    await user.click(screen.getByRole('radio', { name: 'Folders' }))
    expect(side('Swipe right')).toEqual(['Name and look'])
  })

  it('takes a side down to none, holds two at most, and resets', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/swipe-actions')
    await screen.findByRole('heading', { level: 1, name: 'Swipe actions' })
    await user.click(screen.getByRole('button', { name: 'Remove Favourite' }))
    expect(side('Swipe right')).toEqual([])
    expect(settingsStore.getState().bars['swipe.songs.leading']).toEqual([])
    await user.click(screen.getAllByRole('button', { name: 'Add Delete' })[0] as HTMLElement)
    await user.click(screen.getAllByRole('button', { name: 'Add Move' })[0] as HTMLElement)
    expect(settingsStore.getState().bars['swipe.songs.leading']).toEqual(['delete', 'move'])
    expect(screen.getAllByRole('button', { name: 'Add Archive' })[0]).toBeDisabled()
    await user.click(screen.getAllByRole('button', { name: 'Reset to defaults' })[0] as HTMLElement)
    expect(side('Swipe right')).toEqual(['Favourite'])
  })
})
