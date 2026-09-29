import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

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

  it('goes back to Learn when it was opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/lessons/reading-chord-symbols')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/learn'))
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
})
