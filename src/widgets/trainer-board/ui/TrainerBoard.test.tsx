import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { useTrainer, type Asks, type Drill } from '@/features/trainer'
import { createFakeAudio } from '@/shared/api/audio'
import { createMemoryStorage } from '@/shared/lib'
import { midi, note, pitchClass } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { ShortcutsProvider } from '@/shared/lib/shortcuts'
import { TrainerBoard } from './TrainerBoard'

function Board({ asks, autoNext, limit }: { asks: Asks; autoNext: boolean; limit?: number }) {
  const trainer = useTrainer(asks, {
    rounds: 10,
    random: () => 0,
    autoNext,
    ...(limit ? { limit } : {}),
  })
  return <TrainerBoard trainer={trainer} asks={asks} limit={limit} />
}

function renderBoard(
  asks: Asks,
  { autoNext = false, limit }: { autoNext?: boolean; limit?: number } = {},
) {
  const store = createProgressStore({ storage: createMemoryStorage() })
  renderWithSettings(
    <ProgressStoreProvider store={store}>
      <ServicesProvider services={{ audio: createFakeAudio(), midi: null }}>
        <ShortcutsProvider mac={false}>
          <Board asks={asks} autoNext={autoNext} {...(limit ? { limit } : {})} />
        </ShortcutsProvider>
      </ServicesProvider>
    </ProgressStoreProvider>,
  )
}

const C = [pitchClass(0)]
const skills = (skill: 'chord:maj' | 'chord:min' | 'chord:d7'): Asks => ({
  kind: 'skills',
  skills: [skill],
  roots: C,
})
/** A drill of one chord on C. */
const onC = (quality: 'maj' | 'd7', drill: Drill, extra: Partial<Asks> = {}): Asks =>
  ({
    kind: 'chords',
    drill,
    chords: [{ root: note('C'), quality, inversion: null }],
    ...extra,
  }) as Asks

describe('TrainerBoard', () => {
  it('asks to build a chord, fills the chosen keys and answers a right build', async () => {
    const user = userEvent.setup()
    renderBoard(skills('chord:maj'))
    expect(screen.getByRole('heading', { name: 'Build C' })).toBeInTheDocument()
    const check = screen.getByRole('button', { name: 'Check' })
    expect(check).toBeDisabled()
    expect(check).toHaveAccessibleDescription('Choose the keys on the keyboard, then Check.')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-primary')
    for (const name of ['E4', 'G4'])
      await user.click(within(keyboard).getByRole('button', { name }))
    await user.click(check)
    expect(screen.getByText('Correct')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
  })

  it('moves the focus to the next round’s prompt as auto-next goes on, not to the page', () => {
    vi.useFakeTimers()
    try {
      renderBoard(skills('chord:maj'), { autoNext: true })
      const keyboard = screen.getByRole('group', { name: 'Keyboard' })
      for (const name of ['C4', 'E4', 'G4'])
        fireEvent.click(within(keyboard).getByRole('button', { name }))
      fireEvent.click(screen.getByRole('button', { name: 'Check' }))
      expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
      act(() => void vi.advanceTimersByTime(2000))
      expect(screen.getByRole('heading', { name: 'Build C' })).toHaveFocus()
    } finally {
      vi.useRealTimers()
    }
  })

  it('names no chord played in a round, its chord names off: the name is the question', () => {
    renderBoard(onC('maj', 'quiz'))
    for (const [pointerId, name] of ['C4', 'E4', 'G4'].entries())
      fireEvent.pointerDown(screen.getByRole('button', { name }), {
        pointerId,
        pointerType: 'touch',
      })
    expect(screen.queryByText('Chord played:')).not.toBeInTheDocument()
    const names = screen.getByRole('button', { name: 'Name the chords played' })
    expect(names).toBeDisabled()
    expect(names).toHaveAttribute('aria-pressed', 'false')
  })

  it('names the answer after a wrong build', async () => {
    const user = userEvent.setup()
    renderBoard(skills('chord:min'))
    await user.click(screen.getByRole('button', { name: 'C4' }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByText('Not quite: it’s Cm · Minor triad')).toBeInTheDocument()
  })

  it('says which note must be lowest when an inversion is built in root position', async () => {
    const user = userEvent.setup()
    renderBoard({
      kind: 'chords',
      drill: 'entry',
      chords: [{ root: note('C'), quality: 'maj', inversion: 1 }],
    })
    expect(screen.getByRole('heading', { name: 'Build C/E, 1st inversion' })).toBeInTheDocument()
    for (const name of ['C4', 'E4', 'G4']) await user.click(screen.getByRole('button', { name }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByText('Not quite: it’s C/E · Major triad, with E lowest')).toBeInTheDocument()
  })

  it('prints the chord it asks for and names with ♯ and ♭, as the sheets print them', async () => {
    const user = userEvent.setup()
    renderBoard({ kind: 'skills', skills: ['chord:min'], roots: [pitchClass(1)] })
    expect(screen.getByRole('heading', { name: 'Build C♯m' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'C4' }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByText('Not quite: it’s C♯m · Minor triad')).toBeInTheDocument()
  })

  it('prints a chord to name among its answers as the sheets print it', async () => {
    const user = userEvent.setup()
    renderBoard({
      kind: 'chords',
      drill: 'quiz',
      chords: [{ root: note('C', 1), quality: 'min', inversion: null }],
    })
    const answers = screen.getByRole('group', { name: 'Answers' })
    await user.click(within(answers).getByRole('button', { name: 'C♯m' }))
    expect(screen.getByText('Correct')).toBeInTheDocument()
  })

  it('asks to name a chord from four answers', async () => {
    const user = userEvent.setup()
    renderBoard(onC('d7', 'quiz'))
    expect(screen.getByRole('heading', { name: 'Which chord is this?' })).toBeInTheDocument()
    const answers = screen.getByRole('group', { name: 'Answers' })
    expect(within(answers).getAllByRole('button')).toHaveLength(4)
    await user.click(within(answers).getByRole('button', { name: 'C7' }))
    expect(screen.getByText('Correct')).toBeInTheDocument()
  })

  it('keeps the answers in sight after a wrong choice: the one chosen and the answer marked', async () => {
    const user = userEvent.setup()
    renderBoard(onC('d7', 'quiz'))
    const options = within(screen.getByRole('group', { name: 'Answers' })).getAllByRole('button')
    const wrong = options.find((option) => option.textContent !== 'C7')
    if (!wrong) throw new Error('no wrong answer offered')
    const chosen = wrong.textContent ?? ''
    await user.click(wrong)
    expect(screen.getByText(/^Not quite: it’s C7/)).toBeInTheDocument()
    const answered = within(screen.getByRole('list', { name: 'Answers' })).getAllByRole('listitem')
    expect(answered.map((item) => item.textContent)).toEqual(
      options.map((option) =>
        option.textContent === 'C7'
          ? 'C7The answer'
          : option.textContent === chosen
            ? `${chosen}Your answer`
            : option.textContent,
      ),
    )
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
  })

  it('says Stop while the round sounds, from the moment it is shown', async () => {
    const user = userEvent.setup()
    renderBoard(onC('maj', 'ear'))
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    await user.click(screen.getByRole('button', { name: 'Play again' }))
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  })

  it('keeps the keyboard user’s place: on Next after an answer, on the new round after Next', async () => {
    const user = userEvent.setup()
    renderBoard(onC('d7', 'quiz'))
    const answers = screen.getByRole('group', { name: 'Answers' })
    await user.click(within(answers).getAllByRole('button')[0] ?? answers)
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Which chord is this?' })).toHaveFocus()
  })

  it('chooses the answer in a place on its number, and goes on with Enter', async () => {
    const user = userEvent.setup()
    renderBoard(onC('d7', 'quiz'))
    const options = within(screen.getByRole('group', { name: 'Answers' })).getAllByRole('button')
    const place = options.findIndex((option) => option.textContent === 'C7') + 1
    await user.keyboard(String(place))
    expect(screen.getByText('Correct')).toBeInTheDocument()
    await user.keyboard('{Enter}')
    expect(screen.queryByText('Correct')).not.toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Answers' })).toBeInTheDocument()
  })

  it('checks a build with Enter once keys are chosen', async () => {
    const user = userEvent.setup()
    renderBoard(skills('chord:maj'))
    await user.keyboard('{Enter}')
    expect(screen.queryByText('Correct')).not.toBeInTheDocument()
    for (const name of ['C4', 'E4', 'G4']) await user.click(screen.getByRole('button', { name }))
    await user.keyboard('{Enter}')
    expect(screen.getByText('Correct')).toBeInTheDocument()
  })

  it('stops and plays the round again on R', async () => {
    const user = userEvent.setup()
    renderBoard(onC('maj', 'ear'))
    await user.keyboard('r')
    expect(screen.getByRole('button', { name: 'Play again' })).toBeInTheDocument()
    await user.keyboard('r')
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  })

  it('names an interval’s options by their names', () => {
    renderBoard({ kind: 'intervals', drill: 'ear', intervals: ['m3', 'P5'], ways: ['up'] })
    const answers = screen.getByRole('group', { name: 'Answers' })
    expect(within(answers).getByRole('button', { name: 'Minor third' })).toBeInTheDocument()
    expect(within(answers).getByRole('button', { name: 'Perfect fifth' })).toBeInTheDocument()
  })

  it('names a signature’s counts and shows the key named after a wrong one', async () => {
    const user = userEvent.setup()
    renderBoard({ kind: 'signatures', keys: [{ tonic: note('D'), minor: false }] })
    expect(
      screen.getByRole('heading', { name: 'How many sharps or flats does D major have?' }),
    ).toBeInTheDocument()
    const answers = screen.getByRole('group', { name: 'Answers' })
    await user.click(within(answers).getByRole('button', { name: '2 ♯' }))
    expect(screen.getByText('Correct')).toBeInTheDocument()
  })

  it('reads a note on its staff, a wrong key showing the note’s name', async () => {
    const user = userEvent.setup()
    renderBoard({ kind: 'notes', notes: [{ key: midi(67), spelled: note('G'), clef: 'treble' }] })
    expect(screen.getByRole('figure', { name: 'Sheet music' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'A4' }))
    expect(screen.getByText('Not quite: it’s G4')).toBeInTheDocument()
  })

  it('turns a card over with the one button, which becomes Next in its place', async () => {
    const user = userEvent.setup()
    renderBoard(onC('maj', 'flashcards', { show: 'name' }))
    expect(screen.getByRole('heading', { name: 'C · Major triad' })).toBeInTheDocument()
    expect(screen.queryByRole('figure', { name: 'Sheet music' })).not.toBeInTheDocument()
    const reveal = screen.getByRole('button', { name: 'Reveal' })
    await user.click(reveal)
    expect(reveal).toHaveAccessibleName('Next')
    expect(reveal).toHaveFocus()
    expect(screen.getByRole('figure', { name: 'Sheet music' })).toBeInTheDocument()
    expect(screen.queryByText('Correct')).not.toBeInTheDocument()
  })

  it('shows a card’s staff and asks its name, the name revealed', async () => {
    const user = userEvent.setup()
    renderBoard(onC('maj', 'flashcards', { show: 'staff' }))
    expect(screen.getByRole('heading', { name: 'Which chord is this?' })).toBeInTheDocument()
    expect(screen.getByRole('figure', { name: 'Sheet music' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reveal' }))
    expect(screen.getByRole('heading', { name: 'C · Major triad' })).toBeInTheDocument()
  })

  it('keeps Next waiting for an answer, then lets it go on', async () => {
    const user = userEvent.setup()
    renderBoard(onC('d7', 'quiz'))
    const next = screen.getByRole('button', { name: 'Next' })
    expect(next).toBeDisabled()
    await user.click(
      within(screen.getByRole('group', { name: 'Answers' })).getByRole('button', { name: 'C7' }),
    )
    expect(next).toBeEnabled()
  })

  it('hides the keys and the staff of a chord asked by ear until it is answered', async () => {
    const user = userEvent.setup()
    renderBoard(onC('maj', 'ear'))
    expect(screen.getByRole('heading', { name: 'Which chord do you hear?' })).toBeInTheDocument()
    expect(screen.queryByRole('figure', { name: 'Sheet music' })).not.toBeInTheDocument()
    await user.click(
      within(screen.getByRole('group', { name: 'Answers' })).getByRole('button', { name: 'C' }),
    )
    expect(screen.getByRole('figure', { name: 'Sheet music' })).toBeInTheDocument()
  })

  it('shows a build’s answer on request, counted as missed', async () => {
    const user = userEvent.setup()
    renderBoard(skills('chord:maj'))
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    expect(screen.getByText('The answer: C · Major triad')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
  })

  it('shows the answer once the time limit runs out', () => {
    vi.useFakeTimers()
    try {
      renderBoard(onC('d7', 'quiz'), { limit: 5 })
      expect(screen.getByText('5 s')).toBeInTheDocument()
      act(() => void vi.advanceTimersByTime(5100))
      expect(screen.getByText(/^The answer: C7/)).toBeInTheDocument()
      expect(
        within(screen.getByRole('list', { name: 'Answers' })).getAllByRole('listitem'),
      ).toHaveLength(4)
    } finally {
      vi.useRealTimers()
    }
  })

  it('asks an interval’s upper note to be played over its given lower note', async () => {
    const user = userEvent.setup()
    renderBoard({
      kind: 'intervals',
      drill: 'entry',
      intervals: ['M3'],
      ways: ['up'],
      roots: [note('E')],
    })
    expect(
      screen.getByRole('heading', { name: 'Play the major third up from E' }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'G sharp 4' }))
    expect(screen.getByText('Correct')).toBeInTheDocument()
  })
})
