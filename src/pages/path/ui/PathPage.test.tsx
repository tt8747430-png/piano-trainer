import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Path', () => {
  it('suggests the first step on a first run', async () => {
    await renderApp('/')
    const card = await screen.findByRole('region', { name: 'Triads' })
    expect(within(card).getByRole('link', { name: 'Continue' }).getAttribute('href')).toMatch(
      /^\/theory\/chords\?.*step=chords(%3A|:)tri/,
    )
  })

  it('suggests the song practised last, with the chords it has to check', async () => {
    const { progressStore } = await renderApp('/')
    act(() => progressStore.setState({ practised: { bz5: '2026-09-25T10:00:00Z' } }))
    const card = await screen.findByRole('region', { name: 'Still, my soul, be still' })
    expect(within(card).getByRole('link', { name: 'Continue' })).toHaveAttribute(
      'href',
      '/play/bz5',
    )
    expect(
      within(card)
        .getByRole('link', { name: /^Chords to check: \d+$/ })
        .getAttribute('href'),
    ).toMatch(/^\/check\?of=piece(%3A|:)bz5$/)
  })

  it('lists level 1 with its count and marks a step learned from its row', async () => {
    const user = userEvent.setup()
    await renderApp('/')
    const level = await screen.findByRole('region', { name: 'Level 1 · Beginner' })
    const total = within(level).getAllByRole('listitem').length
    expect(within(level).getByText(`0 of ${total}`)).toBeInTheDocument()
    await user.click(within(level).getByRole('button', { name: 'Triads: learned' }))
    expect(within(level).getByText(`1 of ${total}`)).toBeInTheDocument()
  })

  it('opens a song from its row, and a chord step in its explorer', async () => {
    await renderApp('/')
    const level = await screen.findByRole('region', { name: 'Level 1 · Beginner' })
    expect(within(level).getByRole('link', { name: /Still, my soul, be still/ })).toHaveAttribute(
      'href',
      '/songs/bz5',
    )
    expect(
      within(level)
        .getByRole('link', { name: /^Triads/ })
        .getAttribute('href'),
    ).toMatch(/^\/theory\/chords\?.*step=chords(%3A|:)tri/)
  })
})
