import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { useQuiz, type QuizConfig } from '@/features/quiz'
import { createFakeAudio } from '@/shared/api/audio'
import { createMemoryStorage } from '@/shared/lib'
import { pitchClass } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { QuizBoard } from './QuizBoard'

function Board({ config }: { config: QuizConfig }) {
  const quiz = useQuiz(config, { random: () => 0 })
  return <QuizBoard quiz={quiz} />
}

function renderBoard(config: QuizConfig) {
  const store = createProgressStore({ storage: createMemoryStorage() })
  renderWithSettings(
    <ProgressStoreProvider store={store}>
      <ServicesProvider services={{ audio: createFakeAudio(), midi: null }}>
        <Board config={config} />
      </ServicesProvider>
    </ProgressStoreProvider>,
  )
  return store
}

const C = [pitchClass(0)]

describe('QuizBoard', () => {
  it('asks to build a chord, fills the chosen keys and answers a right build', async () => {
    const user = userEvent.setup()
    renderBoard({ chordMode: 'build-chord', scope: { skills: ['chord:maj'], roots: C } })
    expect(screen.getByRole('heading', { name: 'Build C' })).toBeInTheDocument()
    const check = screen.getByRole('button', { name: 'Check' })
    expect(check).toBeDisabled()
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-primary')
    for (const name of ['E4', 'G4'])
      await user.click(within(keyboard).getByRole('button', { name }))
    await user.click(check)
    expect(screen.getByText('Right')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
  })

  it('names the answer after a wrong build', async () => {
    const user = userEvent.setup()
    renderBoard({ chordMode: 'build-chord', scope: { skills: ['chord:min'], roots: C } })
    await user.click(screen.getByRole('button', { name: 'C4' }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByText('It’s Cm · Minor triad')).toBeInTheDocument()
  })

  it('asks to name a chord from four answers', async () => {
    const user = userEvent.setup()
    renderBoard({ chordMode: 'name-chord', scope: { skills: ['chord:d7'], roots: C } })
    expect(screen.getByRole('heading', { name: 'Which chord is this?' })).toBeInTheDocument()
    const answers = screen.getByRole('group', { name: 'Answers' })
    await user.click(within(answers).getByRole('button', { name: 'C7' }))
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('asks to build a scale', () => {
    renderBoard({
      chordMode: 'build-chord',
      scope: { skills: ['scale:harmonic'], roots: [pitchClass(9)] },
    })
    expect(screen.getByRole('heading', { name: 'Build A harmonic minor' })).toBeInTheDocument()
  })

  it('turns Play again into Stop while the question sounds', async () => {
    const user = userEvent.setup()
    renderBoard({ chordMode: 'name-chord', scope: { skills: ['chord:maj'], roots: C } })
    await user.click(screen.getByRole('button', { name: 'Play again' }))
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(screen.getByRole('button', { name: 'Play again' })).toBeInTheDocument()
  })
})
