import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { recordAnswer } from '@/features/record-answer'
import { createMemoryStorage } from '@/shared/lib'
import { chordSkill, qualitiesIn } from '@/shared/lib/music'
import { LearnedButton } from './LearnedButton'
import { LearnedCheck } from './LearnedCheck'

function renderWithProgress(ui: ReactNode) {
  const store = createProgressStore({ storage: createMemoryStorage() })
  render(<ProgressStoreProvider store={store}>{ui}</ProgressStoreProvider>)
  return store
}

describe('LearnedCheck', () => {
  it('marks a step learned on its row and unmarks it, named by the step', async () => {
    const user = userEvent.setup()
    const store = renderWithProgress(<LearnedCheck step="chords:tri" title="Triads" />)
    const toggle = screen.getByRole('button', { name: 'Triads: learned' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(store.getState().learned['chords:tri']).toBeDefined()
    await user.click(toggle)
    expect(store.getState().learned['chords:tri']).toBeUndefined()
  })
})

describe('LearnedButton', () => {
  it('shows a step the quiz marked learned', () => {
    const store = renderWithProgress(<LearnedButton step="chords:tri" />)
    act(() => {
      for (const quality of qualitiesIn('tri'))
        for (let i = 0; i < 4; i++)
          recordAnswer(store, { skill: chordSkill(quality), correct: true }, new Date())
    })
    expect(screen.getByRole('button', { name: 'Learned' })).toHaveAttribute('aria-pressed', 'true')
  })
})
