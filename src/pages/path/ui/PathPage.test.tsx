import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { lessonsIn } from '@/entities/lesson'

describe('Path', () => {
  it('suggests the first step on a first run, saying what it is and how far along', async () => {
    await renderApp('/')
    const card = await screen.findByRole('region', { name: 'Triads' })
    expect(within(card).getByText('Chords · 0 of 6 known · Beginner')).toBeInTheDocument()
    expect(within(card).getByRole('link', { name: 'Continue' }).getAttribute('href')).toMatch(
      /^\/practice\/chords\?.*step=chords(%3A|:)tri/,
    )
  })

  it('suggests the next lesson beside it: the first, then on from the one learned last', async () => {
    const { progressStore } = await renderApp('/')
    const lesson = await screen.findByRole('region', { name: 'Next lesson' })
    const link = within(lesson).getByRole('link', { name: /Finding your way on the keys/ })
    expect(link).toHaveAttribute('href', '/learn/lessons/finding-home')
    expect(link).toHaveTextContent(`Fundamentals · Lesson 1 of ${lessonsIn('fundamentals').length}`)
    act(() =>
      progressStore.setState({ learned: { 'lesson:finding-home': '2026-10-01T10:00:00Z' } }),
    )
    expect(
      within(screen.getByRole('region', { name: 'Next lesson' })).getByRole('link'),
    ).toHaveAttribute('href', '/learn/lessons/reading-notes')
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

  it('lists the pieces practised last, latest first, and none before the first', async () => {
    const { progressStore } = await renderApp('/')
    expect(screen.queryByRole('region', { name: 'Recently practised' })).not.toBeInTheDocument()
    act(() =>
      progressStore.setState({
        practised: {
          bz5: '2026-09-25T10:00:00Z',
          ode: '2026-09-27T10:00:00Z',
          'my-404': '2026-09-28T10:00:00Z',
        },
      }),
    )
    const recent = await screen.findByRole('region', { name: 'Recently practised' })
    expect(
      within(recent)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(['/songs/ode', '/songs/bz5'])
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
    const user = userEvent.setup()
    await renderApp('/')
    const level = await screen.findByRole('region', { name: 'Level 1 · Beginner' })
    const elementary = await screen.findByRole('region', { name: 'Level 2 · Elementary' })
    await user.click(within(elementary).getByRole('button', { name: /Level 2/ }))
    expect(
      within(elementary).getByRole('link', { name: /Still, my soul, be still/ }),
    ).toHaveAttribute('href', '/songs/bz5')
    expect(
      within(level)
        .getByRole('link', { name: /^Triads/ })
        .getAttribute('href'),
    ).toMatch(/^\/practice\/chords\?.*step=chords(%3A|:)tri/)
  })

  it('opens the level the learner is at, the others folded until opened', async () => {
    const user = userEvent.setup()
    await renderApp('/')
    const beginner = await screen.findByRole('region', { name: 'Level 1 · Beginner' })
    const elementary = screen.getByRole('region', { name: 'Level 2 · Elementary' })
    expect(within(beginner).getByRole('button', { name: /Level 1/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(within(elementary).queryByRole('list')).not.toBeInTheDocument()
    await user.click(within(elementary).getByRole('button', { name: /Level 2/ }))
    expect(within(elementary).getByRole('list')).toBeInTheDocument()
    await user.click(within(beginner).getByRole('button', { name: /Level 1/ }))
    expect(within(beginner).queryByRole('list')).not.toBeInTheDocument()
  })

  it('leaves the learned steps out with Hide learned, kept in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/')
    const level = await screen.findByRole('region', { name: 'Level 1 · Beginner' })
    expect(screen.queryByRole('button', { name: 'Hide learned' })).not.toBeInTheDocument()
    await user.click(within(level).getByRole('button', { name: 'Triads: learned' }))
    await user.click(screen.getByRole('button', { name: 'Hide learned' }))
    expect(router.state.location.search).toMatchObject({ hideLearned: true })
    expect(within(level).queryByRole('link', { name: /^Triads/ })).not.toBeInTheDocument()
    expect(within(level).getByText(/^1 of /)).toBeInTheDocument()
  })
})
