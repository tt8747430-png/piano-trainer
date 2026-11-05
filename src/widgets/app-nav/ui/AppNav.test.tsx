import { stubMatchMedia } from '@/shared/test/match-media'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { createMemoryStorage } from '@/shared/lib'

const nav = () => screen.findByRole('navigation', { name: 'Main navigation' })

describe('AppNav', () => {
  it('lists the four places on a phone, the Profile last, with Search and Settings in the places', async () => {
    await renderApp('/songs')
    const bar = within(await nav())
    expect(bar.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Learn',
      'Songs',
      'Practice',
      'Profile',
    ])
    expect(bar.queryByRole('button', { name: 'Search' })).not.toBeInTheDocument()
  })

  it("puts the Profile at the sidebar's foot on a laptop, under Search and Settings", async () => {
    // Every media query matches: the sidebar's among them.
    stubMatchMedia({ dark: true })
    await renderApp('/songs')
    const bar = within(await nav())
    expect(bar.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Learn',
      'Songs',
      'Practice',
      'Settings',
      'Profile',
    ])
    expect(bar.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('marks Settings alone current on a laptop, where it is in the sidebar', async () => {
    // Every media query matches: the sidebar's among them.
    stubMatchMedia({ dark: true })
    await renderApp('/settings')
    const links = within(await nav())
    expect(links.getByRole('link', { name: /^Settings/ })).toHaveAttribute('aria-current', 'page')
    expect(links.getByRole('link', { name: /^Profile/ })).not.toHaveAttribute('aria-current')
  })

  it('collapses to its icons, each place still named, and opens again', async () => {
    const user = userEvent.setup()
    await renderApp('/songs')
    const bar = await nav()
    expect(bar).toHaveAttribute('data-sidebar', 'open')
    await user.click(within(bar).getByRole('button', { name: 'Collapse the sidebar' }))
    expect(bar).toHaveAttribute('data-sidebar', 'collapsed')
    expect(within(bar).getByRole('link', { name: 'Songs' })).toHaveAttribute('aria-current', 'page')
    await user.click(within(bar).getByRole('button', { name: 'Open the sidebar' }))
    expect(bar).toHaveAttribute('data-sidebar', 'open')
  })

  it('stays collapsed the next time the app opens', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const first = await renderApp('/songs', { storage })
    await user.click(within(await nav()).getByRole('button', { name: 'Collapse the sidebar' }))
    first.unmount()
    await renderApp('/songs', { storage })
    expect(await nav()).toHaveAttribute('data-sidebar', 'collapsed')
  })
})
