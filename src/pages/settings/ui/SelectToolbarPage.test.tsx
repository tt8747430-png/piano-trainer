import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { LAPTOP } from '@/shared/lib'

/** The acts on the bar, in order, as their rows name them. */
const tiles = () =>
  within(screen.getByRole('list', { name: 'Selection toolbar' }))
    .getAllByRole('listitem')
    .map((row) => row.textContent)

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
  it('opens from Settings’ Library, the bar’s acts first, and Back returns there', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings')
    const library = await screen.findByRole('region', { name: 'Library' })
    await user.click(within(library).getByRole('link', { name: 'Selection toolbar' }))
    expect(router.state.location.pathname).toBe('/settings/select-toolbar')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Selection toolbar' }),
    ).toBeVisible()
    expect(tiles()).toEqual(['Move', 'Favourite', 'Archive'])
    // The owner's bug: the page had no Back. A phone's goes up to Settings.
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings'))
  })

  it('stands marked in the laptop dialog’s nav, never stranded under General', async () => {
    onLaptop()
    await renderApp('/settings/select-toolbar')
    const dialog = await screen.findByRole('dialog', { name: 'Settings' })
    const nav = within(dialog).getByRole('navigation', { name: 'Settings' })
    expect(within(nav).getByRole('link', { name: 'Selection toolbar' })).toHaveAttribute(
      'data-active',
    )
    expect(within(nav).getByRole('link', { name: 'General' })).not.toHaveAttribute('data-active')
  })

  it('adds, says when the bar is full, removes, and resets', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/select-toolbar')
    await screen.findByRole('heading', { level: 1, name: 'Selection toolbar' })
    expect(screen.queryByText('All slots are in use. Remove an action to add another.')).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Add Export' }))
    expect(
      screen.getByText('All slots are in use. Remove an action to add another.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Delete' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Remove Favourite' }))
    expect(tiles()).toEqual(['Move', 'Archive', 'Export'])
    expect(settingsStore.getState().bars['select.songs']).toEqual(['move', 'archive', 'export'])
    await user.click(screen.getByRole('button', { name: 'Restore defaults' }))
    expect(tiles()).toEqual(['Move', 'Favourite', 'Archive'])
    expect(settingsStore.getState().bars['select.songs']).toEqual(['move', 'favourite', 'archive'])
  })

  it('keeps the bar’s last act', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/select-toolbar')
    await screen.findByRole('heading', { level: 1, name: 'Selection toolbar' })
    for (const act of ['Move', 'Favourite'])
      await user.click(screen.getByRole('button', { name: `Remove ${act}` }))
    expect(screen.getByRole('button', { name: 'Remove Archive' })).toBeDisabled()
    expect(settingsStore.getState().bars['select.songs']).toEqual(['archive'])
  })
})
