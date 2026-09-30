import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { createProgressStore } from '@/entities/progress'
import { recordAnswer } from '@/features/record-answer'
import { createMemoryStorage } from '@/shared/lib'
import { scaleSkill } from '@/shared/lib/music'

describe('Check', () => {
  it('checks a piece’s chords in six questions with a progress bar', async () => {
    await renderApp('/check?of=piece:bz5')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Check: Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '6')
  })

  it('asks a scale the learner already knows once', async () => {
    const storage = createMemoryStorage()
    const progressStore = createProgressStore({ storage })
    for (let i = 0; i < 4; i++)
      recordAnswer(progressStore, { skill: scaleSkill('blues'), correct: true }, new Date())
    await renderApp('/check?of=scale:blues', { storage })
    expect(await screen.findByRole('progressbar')).toHaveAttribute('aria-valuemax', '1')
  })

  it('shows the score and each skill’s rating at the end', async () => {
    const user = userEvent.setup()
    await renderApp('/check?of=scale:blues')
    for (let i = 0; i < 4; i++) {
      const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
      await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
      await user.click(screen.getByRole('button', { name: 'Check' }))
      await user.click(screen.getByRole('button', { name: 'Next' }))
    }
    expect(await screen.findByText('0 of 4')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Done' })).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Open in Scales' })).toBeInTheDocument()
  })

  it('says when the check marked its step learned', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/check?of=scale:blues')
    await screen.findByRole('progressbar')
    act(() => {
      for (let i = 0; i < 4; i++)
        recordAnswer(progressStore, { skill: scaleSkill('blues'), correct: true }, new Date())
    })
    // Finish the check (answers wrong or right do not matter for the line: the step is now learned).
    while (!screen.queryByText(/is now marked learned/)) {
      const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
      await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
      await user.click(screen.getByRole('button', { name: 'Check' }))
      await user.click(screen.getByRole('button', { name: 'Next' }))
    }
    expect(screen.getByText('Minor blues is now marked learned.')).toBeInTheDocument()
  })

  it.each(['/check?of=piece:gone', '/check', '/check?of=nothing'])(
    'shows not found for a check of nothing: %s',
    async (path) => {
      await renderApp(path)
      expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    },
  )
})
