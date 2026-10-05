import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { createMemoryStorage } from '@/shared/lib'

const nav = () => screen.findByRole('navigation', { name: 'Main navigation' })

describe('AppNav', () => {
  it('lists the four places and Settings', async () => {
    await renderApp('/songs')
    const links = within(await nav()).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual([
      'Path',
      'Songs',
      'Learn',
      'Practice',
      'Settings',
    ])
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
