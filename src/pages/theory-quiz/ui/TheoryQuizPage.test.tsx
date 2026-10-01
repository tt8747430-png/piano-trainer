import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { midi } from '@/shared/lib/music'

describe('Practice → a Theory quiz', () => {
  it('is titled by its quiz and asks it', async () => {
    await renderApp('/practice/quiz/build-scale')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Build scale' }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { level: 2, name: /^Build .+ (major|minor)/ }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Quiz mode' })).not.toBeInTheDocument()
  })

  it('says so when there are no gaps and offers the whole quiz', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/quiz/gaps')
    expect(await screen.findByText('No gaps found yet.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Whole quiz' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/quiz/build-chord'))
    expect(await screen.findByRole('heading', { level: 2, name: /^Build / })).toBeInTheDocument()
  })

  it('counts an answer in the stats', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/practice/quiz/build-chord')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(progressStore.getState().quiz.total).toBe(1)
  })

  it('takes the keys played on a MIDI keyboard as the answer', async () => {
    const user = userEvent.setup()
    const { midi: midiKeyboard, progressStore } = await renderApp('/practice/quiz/build-chord')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    act(() => midiKeyboard.press(midi(60)))
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(progressStore.getState().quiz.total).toBe(1)
  })

  it('connects a MIDI keyboard from its header', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/quiz/build-chord')
    await user.click(await screen.findByRole('button', { name: 'MIDI keyboard' }))
    await user.click(await screen.findByRole('button', { name: 'Connect a MIDI keyboard' }))
    expect(
      await screen.findByRole('button', { name: 'MIDI keyboard, connected' }),
    ).toBeInTheDocument()
  })

  it('goes back to Practice when it was opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/quiz/name-chord')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice'))
  })
})
