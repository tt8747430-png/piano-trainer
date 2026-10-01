import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { useTrainer, type Asks } from '@/features/trainer'
import { createFakeAudio } from '@/shared/api/audio'
import { createMemoryStorage } from '@/shared/lib'
import { midi, note, pitchClass } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { TrainerBoard } from './TrainerBoard'

function Board({ asks }: { asks: Asks }) {
  const trainer = useTrainer(asks, { rounds: 10, random: () => 0 })
  return <TrainerBoard trainer={trainer} asks={asks} />
}

function renderBoard(asks: Asks) {
  const store = createProgressStore({ storage: createMemoryStorage() })
  renderWithSettings(
    <ProgressStoreProvider store={store}>
      <ServicesProvider services={{ audio: createFakeAudio(), midi: null }}>
        <Board asks={asks} />
      </ServicesProvider>
    </ProgressStoreProvider>,
  )
}

const C = [pitchClass(0)]
const skills = (
  skill: 'chord:maj' | 'chord:min' | 'chord:d7',
  chords: 'build-chord' | 'name-chord',
): Asks => ({
  kind: 'skills',
  chords,
  skills: [skill],
  roots: C,
})

describe('TrainerBoard', () => {
  it('asks to build a chord, fills the chosen keys and answers a right build', async () => {
    const user = userEvent.setup()
    renderBoard(skills('chord:maj', 'build-chord'))
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
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
  })

  it('names the answer after a wrong build', async () => {
    const user = userEvent.setup()
    renderBoard(skills('chord:min', 'build-chord'))
    await user.click(screen.getByRole('button', { name: 'C4' }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByText('It’s Cm · Minor triad')).toBeInTheDocument()
  })

  it('says which note must be lowest when an inversion is built in root position', async () => {
    const user = userEvent.setup()
    renderBoard({
      kind: 'chords',
      mode: 'build-chord',
      chords: [{ root: note('C'), quality: 'maj', inversion: 1 }],
    })
    expect(screen.getByRole('heading', { name: 'Build C/E, 1st inversion' })).toBeInTheDocument()
    for (const name of ['C4', 'E4', 'G4']) await user.click(screen.getByRole('button', { name }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByText('It’s C/E · Major triad, with E lowest')).toBeInTheDocument()
  })

  it('asks to name a chord from four answers', async () => {
    const user = userEvent.setup()
    renderBoard(skills('chord:d7', 'name-chord'))
    expect(screen.getByRole('heading', { name: 'Which chord is this?' })).toBeInTheDocument()
    const answers = screen.getByRole('group', { name: 'Answers' })
    expect(within(answers).getAllByRole('button')).toHaveLength(4)
    await user.click(within(answers).getByRole('button', { name: 'C7' }))
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('turns Play again into Stop while the round sounds', async () => {
    const user = userEvent.setup()
    renderBoard(skills('chord:maj', 'name-chord'))
    await user.click(screen.getByRole('button', { name: 'Play again' }))
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(screen.getByRole('button', { name: 'Play again' })).toBeInTheDocument()
  })

  it('keeps the keyboard user’s place: on Next after an answer, on the new round after Next', async () => {
    const user = userEvent.setup()
    renderBoard(skills('chord:d7', 'name-chord'))
    const answers = screen.getByRole('group', { name: 'Answers' })
    await user.click(within(answers).getAllByRole('button')[0] ?? answers)
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Which chord is this?' })).toHaveFocus()
  })

  it('names an interval’s options by their names', () => {
    renderBoard({ kind: 'intervals', intervals: ['m3', 'P5'], ways: ['up'] })
    const answers = screen.getByRole('group', { name: 'Answers' })
    expect(within(answers).getByRole('button', { name: 'Minor third' })).toBeInTheDocument()
    expect(within(answers).getByRole('button', { name: 'Perfect fifth' })).toBeInTheDocument()
  })

  it('names a signature’s counts and shows the key named after a wrong one', async () => {
    const user = userEvent.setup()
    renderBoard({ kind: 'signatures', keys: [{ tonic: note('D'), minor: false }] })
    expect(
      screen.getByRole('heading', { name: 'How many sharps or flats in D major?' }),
    ).toBeInTheDocument()
    const answers = screen.getByRole('group', { name: 'Answers' })
    await user.click(within(answers).getByRole('button', { name: '2 ♯' }))
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('reads a note on its staff, a wrong key showing the note’s name', async () => {
    const user = userEvent.setup()
    renderBoard({ kind: 'notes', notes: [{ key: midi(67), spelled: note('G'), clef: 'treble' }] })
    expect(screen.getByRole('figure', { name: 'Sheet music' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'A4' }))
    expect(screen.getByText('It’s G4')).toBeInTheDocument()
  })
})
