import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { recordAnswer } from '@/features/record-answer'
import { createMemoryStorage } from '@/shared/lib'
import { chordSkill, qualitiesIn } from '@/shared/lib/music'
import { LearnedToggle } from './LearnedToggle'

function renderToggle(variant?: 'icon' | 'text') {
  const store = createProgressStore({ storage: createMemoryStorage() })
  render(
    <ProgressStoreProvider store={store}>
      <LearnedToggle step="chords:tri" title="Triads" variant={variant} />
    </ProgressStoreProvider>,
  )
  return store
}

describe('LearnedToggle', () => {
  it('marks a step learned and unmarks it', async () => {
    const user = userEvent.setup()
    const store = renderToggle()
    const toggle = screen.getByRole('button', { name: 'Triads: learned' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(store.getState().learned['chords:tri']).toBeDefined()
    await user.click(toggle)
    expect(store.getState().learned['chords:tri']).toBeUndefined()
  })

  it('shows a step the quiz marked learned', () => {
    const store = renderToggle('text')
    act(() => {
      for (const quality of qualitiesIn('tri'))
        for (let i = 0; i < 4; i++)
          recordAnswer(store, { skill: chordSkill(quality), correct: true }, new Date())
    })
    expect(screen.getByRole('button', { name: 'Learned' })).toHaveAttribute('aria-pressed', 'true')
  })
})
