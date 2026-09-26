import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Theory → Quiz', () => {
  it('switches modes through the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/theory/quiz')
    await user.click(await screen.findByRole('button', { name: 'Build scale' }))
    expect(router.state.location.search).toEqual({ mode: 'build-scale' })
    expect(
      await screen.findByRole('heading', { name: /^Build .+ (major|minor)/ }),
    ).toBeInTheDocument()
  })

  it('says so when there are no gaps and offers the whole quiz', async () => {
    const user = userEvent.setup()
    await renderApp('/theory/quiz?mode=gaps')
    expect(await screen.findByText('No gaps found yet.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Whole quiz' }))
    expect(await screen.findByRole('heading', { name: /^Build / })).toBeInTheDocument()
  })

  it('counts an answer in the stats', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/theory/quiz')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(progressStore.getState().quiz.total).toBe(1)
  })
})
