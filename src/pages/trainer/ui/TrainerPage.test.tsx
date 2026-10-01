import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { recordAnswer } from '@/features/record-answer'

/** The keys of a main chord of C, as the board names them. */
const MAIN_CHORDS: Readonly<Record<string, readonly string[]>> = {
  C: ['C4', 'E4', 'G4'],
  F: ['F4', 'A4', 'C5'],
  G: ['G4', 'B4', 'D5'],
}

/** The keys of a degrees round's key, from its tonic up. */
const DEGREES: Readonly<Record<string, readonly string[]>> = {
  'C major': ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
  'G major': ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F sharp 5'],
  'F major': ['F4', 'G4', 'A4', 'A sharp 4', 'C5', 'D5', 'E5'],
}

const keyboard = () => screen.getByRole('group', { name: 'Keyboard' })

describe('A trainer', () => {
  it('opens at its first level, ten rounds, asking the first round', async () => {
    await renderApp('/practice/trainers/build-chord')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Build chord' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /^Level/ })).toHaveTextContent(
      'The main chords of C',
    )
    expect(screen.getByRole('radio', { name: '10' })).toBeChecked()
    expect(screen.getByText('Round 1 of 10')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /^Build [CFG]$/ })).toBeInTheDocument()
  })

  it('takes a level’s chord built on the keys', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/trainers/build-chord')
    const prompt = await screen.findByRole('heading', { level: 2, name: /^Build [CFG]$/ })
    const symbol = prompt.textContent?.replace('Build ', '') ?? ''
    for (const name of MAIN_CHORDS[symbol] ?? [])
      await user.click(within(keyboard()).getByRole('button', { name }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByText('Right')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Round 2 of 10')).toBeInTheDocument()
  })

  it('reads a note from the staff, answered by the one key pressed', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/trainers/reading-notes')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Play this note' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('figure', { name: 'Sheet music' })).toBeInTheDocument()
    await user.click(within(keyboard()).getByRole('button', { name: 'C4' }))
    expect(screen.getByText(/^(Right|It’s F3|It’s G4)$/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Check' })).not.toBeInTheDocument()
  })

  it('takes a key’s degrees in order on the keys', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/trainers/key-degrees')
    const prompt = await screen.findByRole('heading', {
      level: 2,
      name: /^Play the degrees of [CGF] major$/,
    })
    const key = prompt.textContent?.replace('Play the degrees of ', '') ?? ''
    for (const name of DEGREES[key] ?? [])
      await user.click(within(keyboard()).getByRole('button', { name }))
    expect(screen.getByText('Right')).toBeInTheDocument()
    expect(
      within(screen.getByRole('list', { name: 'Degrees' })).getAllByRole('listitem'),
    ).toHaveLength(7)
  })

  it('sounds an ear round as it is shown, and is answered by a choice', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/trainers/intervals-by-ear')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Which interval is this?' }),
    ).toBeInTheDocument()
    expect(audio.played).toHaveLength(1)
    const answers = screen.getByRole('group', { name: 'Answers' })
    expect(within(answers).getAllByRole('button')).toHaveLength(4)
    await user.click(within(answers).getAllByRole('button')[0] ?? answers)
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
  })

  it('runs a level to its results and keeps its record', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/trainers/key-signatures')
    for (let round = 1; round <= 10; round++) {
      const answers = await screen.findByRole('group', { name: 'Answers' })
      await user.click(within(answers).getAllByRole('button')[0] ?? answers)
      await user.click(screen.getByRole('button', { name: round < 10 ? 'Next' : 'Results' }))
    }
    expect(await screen.findByRole('heading', { name: 'Results' })).toHaveFocus()
    expect(screen.getByText('Average time')).toBeInTheDocument()
    expect(screen.getByText('Runs: 1')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Again' }))
    expect(screen.getByText('Round 1 of 10')).toBeInTheDocument()
  })

  it('ends a run when the learner stops, with the rounds answered so far', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/trainers/chord-role?rounds=0')
    expect(await screen.findByText('Round: 1')).toBeInTheDocument()
    const answers = screen.getByRole('group', { name: 'Answers' })
    await user.click(within(answers).getAllByRole('button')[0] ?? answers)
    await user.click(screen.getByRole('button', { name: 'End the run' }))
    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument()
  })

  it('writes a level and rounds to the URL, and starts the run again under them', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/trainers/chords-by-ear')
    await user.click(await screen.findByRole('combobox', { name: /^Level/ }))
    await user.click(await screen.findByRole('option', { name: '7th chords' }))
    expect(router.state.location.search).toMatchObject({ level: 'sevenths' })
    await user.click(screen.getByRole('radio', { name: 'Until stopped' }))
    expect(router.state.location.search).toMatchObject({ rounds: 0 })
    expect(screen.getByText('Round: 1')).toBeInTheDocument()
  })

  it('shows Custom’s choices when Custom is the level, each written to the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/trainers/intervals-by-ear?level=custom')
    await user.click(await screen.findByRole('combobox', { name: /^Heard/ }))
    await user.click(await screen.findByRole('option', { name: 'Together' }))
    expect(router.state.location.search).toMatchObject({ ways: 'up.together' })
  })

  it('opens an unknown level at the first', async () => {
    await renderApp('/practice/trainers/reading-notes?level=everything')
    expect(await screen.findByRole('combobox', { name: /^Level/ })).toHaveTextContent(
      'The three anchors',
    )
  })

  it('saves auto-next from its settings', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/trainers/build-scale')
    await user.click(await screen.findByRole('button', { name: 'Trainer settings' }))
    await user.click(screen.getByRole('switch', { name: 'Next by itself' }))
    expect(settingsStore.getState().trainer.autoNext).toBe(true)
  })

  it('says My gaps has none yet, with a way to a trainer', async () => {
    await renderApp('/practice/trainers/gaps')
    expect(await screen.findByText('No gaps found yet.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Build chords' })).toHaveAttribute(
      'href',
      '/practice/trainers/build-chord',
    )
    expect(screen.queryByRole('combobox', { name: /^Level/ })).not.toBeInTheDocument()
  })

  it('asks My gaps’ gaps, read once as it opens', async () => {
    const { progressStore } = await renderApp('/practice')
    await screen.findByRole('link', { name: /^My gaps/ })
    act(() => recordAnswer(progressStore, { skill: 'chord:m7', correct: false }, new Date()))
    const user = userEvent.setup()
    await user.click(screen.getByRole('link', { name: /^My gaps/ }))
    expect(
      await screen.findByRole('heading', { level: 2, name: /^Build .+m7$/ }),
    ).toBeInTheDocument()
  })

  it('goes back to Practice from its Back', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/trainers/build-chord')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    expect(router.state.location.pathname).toBe('/practice')
  })
})
