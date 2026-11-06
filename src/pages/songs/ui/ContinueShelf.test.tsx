import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Songs’ Continue (R30 S3)', () => {
  it('opens Home with the last two songs played, the latest first, each a way back in', async () => {
    const { progressStore } = await renderApp('/songs')
    await screen.findByRole('heading', { level: 1, name: 'Songs' })
    expect(screen.queryByRole('region', { name: 'Continue' })).toBeNull()
    act(() =>
      progressStore.setState({
        practised: {
          ode: '2026-11-01T10:00:00.000Z',
          amazing: '2026-11-04T10:00:00.000Z',
          silent: '2026-11-03T10:00:00.000Z',
        },
      }),
    )
    const shelf = await screen.findByRole('region', { name: 'Continue' })
    const links = within(shelf).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/songs/amazing',
      '/songs/silent',
    ])
  })

  it('folds every song at Home after ten, Show all opening the rest', async () => {
    const user = userEvent.setup()
    await renderApp('/songs')
    const all = await screen.findByRole('region', { name: 'All songs' })
    expect(within(all).getAllByRole('listitem')).toHaveLength(10)
    await user.click(within(all).getByRole('button', { name: /^Show all \d+$/ }))
    expect(within(all).getAllByRole('listitem').length).toBeGreaterThan(10)
  })
})
