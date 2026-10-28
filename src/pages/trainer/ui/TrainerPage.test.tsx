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

/** Opens a trainer at its setup and starts a run. */
async function start(path: string) {
  const app = await renderApp(path)
  await userEvent.setup().click(await screen.findByRole('button', { name: 'Start' }))
  return app
}

describe('A trainer', () => {
  it('opens at its setup: the first drill and level, ten rounds, no limit, how it works', async () => {
    await renderApp('/practice/quiz/chords')
    expect(await screen.findByRole('heading', { level: 1, name: 'Chords' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Cards' })).toBeChecked()
    expect(screen.getByRole('combobox', { name: /^Level/ })).toHaveTextContent(
      'The main chords of C',
    )
    expect(screen.getByRole('radio', { name: '10' })).toBeChecked()
    expect(screen.getByRole('combobox', { name: /^Time limit/ })).toHaveTextContent('Off')
    expect(screen.getByRole('complementary', { name: 'How it works' })).toHaveTextContent(
      /^A chord is shown by its name, keys or staff/,
    )
    expect(screen.queryByText(/^Round 1/)).not.toBeInTheDocument()
  })

  it('starts a run from its setup, and closes it back to the setup', async () => {
    const user = userEvent.setup()
    await start('/practice/quiz/chords')
    expect(screen.getByText('Round 1 of 10')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reveal' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })

  it('writes the drill and what a card shows to the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/quiz/intervals')
    await user.click(await screen.findByRole('radio', { name: 'Staff' }))
    expect(router.state.location.search).toMatchObject({ show: 'staff' })
    await user.click(screen.getByRole('radio', { name: 'By ear' }))
    expect(router.state.location.search).toMatchObject({ drill: 'ear' })
    expect(screen.queryByRole('radio', { name: 'Staff' })).not.toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: 'How it works' })).toHaveTextContent(
      'An interval is played. Choose what you hear from four.',
    )
  })

  it('takes a level’s chord built on the keys', async () => {
    const user = userEvent.setup()
    await start('/practice/quiz/chords?drill=entry')
    const prompt = await screen.findByRole('heading', { level: 2, name: /^Build [CFG]$/ })
    const symbol = prompt.textContent?.replace('Build ', '') ?? ''
    for (const name of MAIN_CHORDS[symbol] ?? [])
      await user.click(within(keyboard()).getByRole('button', { name }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByText('Correct')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Round 2 of 10')).toBeInTheDocument()
  })

  it('reads a note from the staff, answered by the one key pressed', async () => {
    const user = userEvent.setup()
    await start('/practice/quiz/reading-notes')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Play this note' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('figure', { name: 'Sheet music' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    await user.click(within(keyboard()).getByRole('button', { name: 'C4' }))
    expect(
      screen.getByText(/^(Correct|Not quite: it’s F3|Not quite: it’s G4)$/),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Check' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
  })

  it('takes a key’s degrees in order on the keys', async () => {
    const user = userEvent.setup()
    await start('/practice/quiz/key-degrees')
    const prompt = await screen.findByRole('heading', {
      level: 2,
      name: /^Play the degrees of [CGF] major$/,
    })
    const key = prompt.textContent?.replace('Play the degrees of ', '') ?? ''
    for (const name of DEGREES[key] ?? [])
      await user.click(within(keyboard()).getByRole('button', { name }))
    expect(screen.getByText('Correct')).toBeInTheDocument()
    expect(
      within(screen.getByRole('list', { name: 'Degrees' })).getAllByRole('listitem'),
    ).toHaveLength(7)
  })

  it('sounds an ear round as it is shown, and is answered by a choice', async () => {
    const user = userEvent.setup()
    const { audio } = await start('/practice/quiz/intervals?drill=ear')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Which interval do you hear?' }),
    ).toBeInTheDocument()
    expect(audio.played).toHaveLength(1)
    const answers = screen.getByRole('group', { name: 'Answers' })
    expect(within(answers).getAllByRole('button')).toHaveLength(4)
    await user.click(within(answers).getAllByRole('button')[0] ?? answers)
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
  })

  it('runs a level to its results and keeps its record, shown in its setup', async () => {
    const user = userEvent.setup()
    await start('/practice/quiz/key-signatures')
    for (let round = 1; round <= 10; round++) {
      const answers = await screen.findByRole('group', { name: 'Answers' })
      await user.click(within(answers).getAllByRole('button')[0] ?? answers)
      await user.click(screen.getByRole('button', { name: round < 10 ? 'Next' : 'Results' }))
    }
    expect(await screen.findByRole('heading', { name: 'Results' })).toHaveFocus()
    expect(screen.getByText('Average time')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Again' }))
    expect(screen.getByText('Round 1 of 10')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.getByText('Runs: 1')).toBeInTheDocument()
  })

  it('ends a run when the learner stops, with the rounds answered so far', async () => {
    const user = userEvent.setup()
    await start('/practice/quiz/chord-role?rounds=0')
    expect(await screen.findByText('Round: 1')).toBeInTheDocument()
    const answers = screen.getByRole('group', { name: 'Answers' })
    await user.click(within(answers).getAllByRole('button')[0] ?? answers)
    await user.click(screen.getByRole('button', { name: 'End the run' }))
    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })

  it('asks which progression is heard, its lines as numerals to choose', async () => {
    const user = userEvent.setup()
    const { audio } = await start('/practice/quiz/progressions-by-ear?level=pop')
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /^In [A-G].* major: which progression is this\?$/,
      }),
    ).toBeInTheDocument()
    const answers = screen.getByRole('group', { name: 'Answers' })
    expect(within(answers).getByRole('button', { name: /I–V–vi–IV/ })).toBeInTheDocument()
    expect(audio.played[0]?.sounds.length).toBeGreaterThan(0)
    await user.click(within(answers).getAllByRole('button')[0] ?? answers)
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  it('asks which cadence is heard after the tonic, then shows its two chords on the staff', async () => {
    const user = userEvent.setup()
    const { audio } = await start('/practice/quiz/cadences?drill=ear&level=minor')
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /^In [A-G].* minor: which cadence do you hear\?$/,
      }),
    ).toBeInTheDocument()
    // The tonic, then the cadence's two chords: four voices each.
    expect(audio.played[0]?.sounds).toHaveLength(12)
    const answers = screen.getByRole('group', { name: 'Answers' })
    expect(within(answers).getAllByRole('button').length).toBe(4)
    await user.click(within(answers).getAllByRole('button')[0] ?? answers)
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  it('names a cadence and asks for the chord that makes it, played on the keys', async () => {
    await start('/practice/quiz/cadences?drill=entry')
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /^(Authentic|Plagal|Half|Deceptive) cadence in [A-G].* major: play the (chord before the last|last chord)$/,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Check' })).toBeDisabled()
  })

  it('writes a level, rounds and a time limit to the URL, and runs under them', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/quiz/chords?drill=ear')
    await user.click(await screen.findByRole('combobox', { name: /^Level/ }))
    await user.click(await screen.findByRole('option', { name: 'All 7th chords' }))
    expect(router.state.location.search).toMatchObject({ level: 'sevenths' })
    await user.click(screen.getByRole('radio', { name: 'Until stopped' }))
    expect(router.state.location.search).toMatchObject({ rounds: 0 })
    await user.click(screen.getByRole('combobox', { name: /^Time limit/ }))
    await user.click(await screen.findByRole('option', { name: '10 s' }))
    expect(router.state.location.search).toMatchObject({ limit: 10 })
    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('Round: 1')).toBeInTheDocument()
    expect(screen.getByText('10 s')).toBeInTheDocument()
  })

  it('shows Custom’s choices when Custom is the level, each written to the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/quiz/intervals?level=custom&drill=ear')
    const heard = await screen.findByRole('group', { name: 'How they sound' })
    await user.click(within(heard).getByRole('button', { name: 'Together' }))
    expect(router.state.location.search).toMatchObject({ ways: 'up.together' })
  })

  it('leaves Custom’s intervals out of the URL once they are its own again', async () => {
    const user = userEvent.setup()
    const own = 'm2.M2.m3.M3.P4.A4.P5.m6.M6.m7.M7.P8'
    const { router } = await renderApp(`/practice/quiz/intervals?level=custom&intervals=${own}.m9`)
    await user.click(await screen.findByRole('button', { name: /^Intervals/ }))
    await user.click(await screen.findByRole('checkbox', { name: /^Minor ninth/ }))
    expect(router.state.location.search).not.toHaveProperty('intervals')
  })

  it('chooses Custom’s chords and roots in sheets, the roots by natural, sharp and flat', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/quiz/chords?level=custom')
    const chords = await screen.findByRole('button', { name: /^Chords/ })
    expect(chords).toHaveTextContent('2 of 41')
    await user.click(chords)
    await user.click(await screen.findByRole('checkbox', { name: 'Diminished triad' }))
    expect(router.state.location.search).toMatchObject({ chords: 'maj.min.dim' })
    await user.click(screen.getByRole('button', { name: 'Close' }))
    await user.click(screen.getByRole('button', { name: /^Roots/ }))
    const sheet = await screen.findByRole('dialog', { name: 'Roots' })
    expect(
      within(sheet)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Natural', 'Sharp', 'Flat'])
    await user.click(within(sheet).getByRole('checkbox', { name: 'F♯' }))
    expect(router.state.location.search).toMatchObject({ roots: 'C.D.E.F.G.A.B.F#' })
    await user.click(within(sheet).getByRole('button', { name: 'Close' }))
    await user.click(screen.getByRole('switch', { name: 'Inversions' }))
    expect(router.state.location.search).toMatchObject({ inversions: true })
  })

  it('keeps the last of a list chosen: a run always asks something', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/quiz/chords?level=custom&chords=maj')
    await user.click(await screen.findByRole('button', { name: /^Chords/ }))
    await user.click(await screen.findByRole('checkbox', { name: 'Major triad' }))
    expect(router.state.location.search).toMatchObject({ chords: 'maj' })
  })

  it('shows Reading notes’ Custom range at middle C’s octave, as the run asks it', async () => {
    await renderApp('/practice/quiz/reading-notes?level=custom')
    expect(await screen.findByRole('combobox', { name: /^From/ })).toHaveTextContent('C4')
    expect(screen.getByRole('combobox', { name: /^To/ })).toHaveTextContent('C5')
  })

  it('opens a level its trainer does not have at the first, and keeps it out of the URL', async () => {
    const { router, viewsStore } = await renderApp('/practice/quiz/reading-notes?level=everything')
    expect(await screen.findByRole('combobox', { name: /^Level/ })).toHaveTextContent(
      'The three landmarks',
    )
    expect(router.state.location.search).toEqual({})
    expect(viewsStore.getState().views['/practice/quiz/reading-notes']).toEqual({})
  })

  it('writes its first level as no level, and Custom only for a trainer that has it', async () => {
    const first = await renderApp('/practice/quiz/chords?level=c-main')
    await screen.findByRole('heading', { level: 1, name: 'Chords' })
    expect(first.router.state.location.search).toEqual({})
    first.unmount()
    const gaps = await renderApp('/practice/quiz/gaps?level=custom&rounds=20')
    await screen.findByRole('heading', { level: 1, name: 'My gaps' })
    expect(gaps.router.state.location.search).toEqual({ rounds: 20 })
  })

  it('saves auto-next from its setup’s Timing, what it does in an ⓘ beside it', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/quiz/build-scale')
    const autoNext = await screen.findByRole('switch', { name: 'Go on automatically' })
    await user.click(autoNext)
    expect(settingsStore.getState().trainer.autoNext).toBe(true)
    expect(screen.getByRole('button', { name: 'About Go on automatically' })).toBeInTheDocument()
  })

  it('says My gaps has none yet, with a way to a trainer', async () => {
    await renderApp('/practice/quiz/gaps')
    expect(await screen.findByText('No gaps found yet.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Build chords' })).toHaveAttribute(
      'href',
      '/practice/quiz/chords?drill=entry',
    )
    expect(screen.queryByRole('combobox', { name: /^Level/ })).not.toBeInTheDocument()
  })

  it('asks My gaps’ gaps, read once as it opens', async () => {
    const { progressStore } = await renderApp('/practice/quiz')
    await screen.findByRole('link', { name: /^My gaps/ })
    act(() => recordAnswer(progressStore, { skill: 'chord:m7', correct: false }, new Date()))
    const user = userEvent.setup()
    await user.click(screen.getByRole('link', { name: /^My gaps/ }))
    await user.click(await screen.findByRole('button', { name: 'Start' }))
    expect(
      await screen.findByRole('heading', { level: 2, name: /^Build .+m7$/ }),
    ).toBeInTheDocument()
  })

  it('goes back to Quiz from its Back', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/quiz/chords')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    expect(router.state.location.pathname).toBe('/practice/quiz')
  })
})
