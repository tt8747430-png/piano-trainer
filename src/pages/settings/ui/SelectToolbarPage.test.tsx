import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

const tiles = () =>
  within(screen.getByRole('list', { name: 'Select toolbar' }))
    .getAllByRole('button', { name: /: drag to move$/ })
    .map((tile) => tile.textContent)

describe('Settings › Select toolbar (R29 B10)', () => {
  it('opens from General, the bar’s tiles first', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings/general')
    await user.click(await screen.findByRole('link', { name: 'Select toolbar' }))
    expect(router.state.location.pathname).toBe('/settings/select-toolbar')
    expect(await screen.findByRole('heading', { level: 1, name: 'Select toolbar' })).toBeVisible()
    expect(tiles()).toEqual(['Favourite', 'Move', 'Archive', 'Delete'])
  })

  it('adds, says when the bar is full, removes, and resets', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/select-toolbar')
    await screen.findByRole('heading', { level: 1, name: 'Select toolbar' })
    expect(screen.getByText('The bar is full: take one off first.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Export' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Remove Favourite' }))
    expect(tiles()).toEqual(['Move', 'Archive', 'Delete'])
    await user.click(screen.getByRole('button', { name: 'Add Export' }))
    expect(settingsStore.getState().bars['select.songs']).toEqual([
      'move',
      'archive',
      'delete',
      'export',
    ])
    await user.click(screen.getByRole('button', { name: 'Reset to defaults' }))
    expect(tiles()).toEqual(['Favourite', 'Move', 'Archive', 'Delete'])
    expect(settingsStore.getState().bars['select.songs']).toEqual([
      'favourite',
      'move',
      'archive',
      'delete',
    ])
  })

  it('keeps the bar’s last act', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/select-toolbar')
    await screen.findByRole('heading', { level: 1, name: 'Select toolbar' })
    for (const act of ['Favourite', 'Move', 'Archive'])
      await user.click(screen.getByRole('button', { name: `Remove ${act}` }))
    expect(screen.getByRole('button', { name: 'Remove Delete' })).toBeDisabled()
    expect(settingsStore.getState().bars['select.songs']).toEqual(['delete'])
  })
})
