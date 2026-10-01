import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'

describe('A lesson', () => {
  it('shows its title and summary over its sections', async () => {
    await renderApp('/learn/lessons/reading-chord-symbols')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'How to read chord symbols' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/what its numbers mean/)).toBeInTheDocument()
    expect(screen.getByText('Beginner · Chords')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Naming any chord in 7 steps' }),
    ).toBeInTheDocument()
  })

  it('plays one of a chord written twice, pressing only the one tapped', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/lessons/inversions')
    await screen.findByRole('heading', { level: 1 })
    // The row C, F/C, G/B, C: C before and after its inversions.
    const row = screen.getByRole('button', { name: 'G/B' }).parentElement
    if (!row) throw new Error('the lesson writes its row of inversions')
    const [first, ...others] = within(row).getAllByRole('button', { name: /^C$/ })
    if (!first || others.length === 0) throw new Error('the row writes C twice')
    await user.click(first)
    expect(first).toHaveAttribute('aria-pressed', 'true')
    for (const other of others) expect(other).toHaveAttribute('aria-pressed', 'false')
  })

  it('goes back to Learn when it was opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/lessons/reading-chord-symbols')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/learn'))
  })

  it('opens a pattern’s piece in the Player with it, and closes back to the lesson', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/lessons/five-ways')
    const card = await screen.findByRole('article', { name: '1 · Bass + chords' })
    await user.click(within(card).getByRole('link', { name: 'Open in the Player' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/play/ex3'))
    expect(router.state.location.search).toMatchObject({ pattern: 'M1' })
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/learn/lessons/five-ways'))
  })

  it('keeps a keyboard user on the quiz’s button as it opens, shows the answer and starts again', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/lessons/triads')
    const quiz = await screen.findByRole('group', { name: 'Play E major.' })
    within(quiz).getByRole('button', { name: 'Answer on the keys' }).focus()
    await user.keyboard('{Enter}')
    expect(within(quiz).getByRole('button', { name: 'Check' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'E4' }))
    await user.click(within(quiz).getByRole('button', { name: 'Check' }))
    await user.click(within(quiz).getByRole('button', { name: 'Show the answer' }))
    expect(within(quiz).getByRole('button', { name: 'Try again' })).toHaveFocus()
  })

  it('answers a Fundamentals quiz on its keys', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/lessons/triads')
    const quiz = await screen.findByRole('group', { name: 'Play E major.' })
    await user.click(within(quiz).getByRole('button', { name: 'Answer on the keys' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    for (const key of ['E4', 'G sharp 4', 'B4']) {
      await user.click(within(keyboard).getByRole('button', { name: key }))
    }
    await user.click(within(quiz).getByRole('button', { name: 'Check' }))
    expect(within(quiz).getByRole('status')).toHaveTextContent('Right')
  })

  it('speaks Russian on every block of a lesson', async () => {
    await renderApp('/learn/lessons/inversions', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1 })
    expect(untranslated(document.body)).toEqual([])
  })
})
