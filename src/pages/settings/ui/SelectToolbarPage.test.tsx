import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { LAPTOP } from '@/shared/lib'

const tiles = () =>
  within(screen.getByRole('list', { name: 'Selection toolbar' }))
    .getAllByRole('button', { name: /: drag to reorder$/ })
    .map((tile) => tile.textContent)

/** A laptop's screen, as `matchMedia` answers it. */
const onLaptop = () =>
  vi.stubGlobal('matchMedia', (media: string) => ({
    media,
    matches: media === LAPTOP,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))

describe('Settings › Library › Selection toolbar (R29 B10, R32)', () => {
  it('opens from Settings’ Library, the bar’s tiles first, and Back returns there', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings')
    const library = await screen.findByRole('region', { name: 'Library' })
    await user.click(within(library).getByRole('link', { name: 'Selection toolbar' }))
    expect(router.state.location.pathname).toBe('/settings/select-toolbar')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Selection toolbar' }),
    ).toBeVisible()
    expect(tiles()).toEqual(['Favourite', 'Move', 'Archive', 'Delete'])
    // The owner's bug: the page had no Back. A phone's goes up to Settings.
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings'))
  })

  it('stands marked in the laptop’s sidebar, never stranded under General', async () => {
    onLaptop()
    await renderApp('/settings/select-toolbar')
    const sidebar = await screen.findByRole('complementary', { name: 'Settings' })
    expect(within(sidebar).getByRole('link', { name: 'Selection toolbar' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('adds, says when the bar is full, removes, and resets', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/select-toolbar')
    await screen.findByRole('heading', { level: 1, name: 'Selection toolbar' })
    expect(
      screen.getByText('All slots are in use. Remove an action to add another.'),
    ).toBeInTheDocument()
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
    await user.click(screen.getByRole('button', { name: 'Restore defaults' }))
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
    await screen.findByRole('heading', { level: 1, name: 'Selection toolbar' })
    for (const act of ['Favourite', 'Move', 'Archive'])
      await user.click(screen.getByRole('button', { name: `Remove ${act}` }))
    expect(screen.getByRole('button', { name: 'Remove Delete' })).toBeDisabled()
    expect(settingsStore.getState().bars['select.songs']).toEqual(['delete'])
  })
})
