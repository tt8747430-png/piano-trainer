import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { recordAnswer } from '@/features/record-answer'
import { chordSkill, qualitiesIn } from '@/shared/lib/music'

describe('Check', () => {
  it('checks a piece’s chords in six questions with a progress bar', async () => {
    await renderApp('/check?of=piece:bz5')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Check: Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '6')
  })

  it('shows the score and each skill’s rating at the end', async () => {
    const user = userEvent.setup()
    await renderApp('/check?of=scale:blues')
    for (let i = 0; i < 6; i++) {
      const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
      await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
      await user.click(screen.getByRole('button', { name: 'Check' }))
      await user.click(screen.getByRole('button', { name: 'Next' }))
    }
    expect(await screen.findByText('0 of 6')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Done' })).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Open in Scales' })).toBeInTheDocument()
  })

  it('says when the check marked its step learned', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/check?of=chords:tri')
    await screen.findByRole('progressbar')
    act(() => {
      for (const quality of qualitiesIn('tri'))
        for (let i = 0; i < 4; i++)
          recordAnswer(progressStore, { skill: chordSkill(quality), correct: true }, new Date())
    })
    // Finish the check (answers wrong or right do not matter for the line: the step is now learned).
    while (!screen.queryByText(/is now marked learned/)) {
      const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
      await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
      await user.click(screen.getByRole('button', { name: 'Check' }))
      await user.click(screen.getByRole('button', { name: 'Next' }))
    }
    expect(screen.getByText('Triads is now marked learned.')).toBeInTheDocument()
  })

  it('shows not found for a check of nothing', async () => {
    await renderApp('/check?of=piece:gone')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
