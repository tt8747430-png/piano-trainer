import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { midi } from '@/shared/lib/music'
import { untranslated } from '@/app/testing/untranslated'

describe('A lesson', () => {
  it('shows its title and summary over its sections', async () => {
    await renderApp('/learn/lessons/reading-chord-symbols')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'How to read chord symbols' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/what its numbers mean/)).toBeInTheDocument()
    expect(screen.getByText('Beginner · Chords')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Naming any chord' })).toBeInTheDocument()
  })

  it('is marked learned at its end, and Learn shows it so', async () => {
    const user = userEvent.setup()
    const { progressStore, router } = await renderApp('/learn/lessons/reading-chord-symbols')
    await user.click(await screen.findByRole('button', { name: 'Learned' }))
    expect(progressStore.getState().learned['lesson:reading-chord-symbols']).toBeDefined()
    await act(() => router.navigate({ to: '/learn' }))
    const row = await screen.findByRole('link', { name: /How to read chord symbols/ })
    expect(within(row).getByRole('img', { name: 'Learned' })).toBeInTheDocument()
  })

  it('opens its exercises in the Player, walked through the keys or in an inversion', async () => {
    await renderApp('/learn/lessons/two-five-one')
    const step1 = await screen.findByRole('link', { name: /^Step 1: up by semitones/ })
    expect(step1.getAttribute('href')).toBe(
      '/play/progression?p=ii-V-I&chordSize=sevenths&walk=semitones-up',
    )
    const step2 = screen.getByRole('link', { name: /^Step 2: down the circle of fifths/ })
    expect(step2.getAttribute('href')).toBe(
      '/play/progression?p=ii-V-I&chordSize=sevenths&walk=tones-down',
    )
    const ninths = screen.getByRole('link', { name: /^Step 2: from the 7th/ })
    expect(ninths.getAttribute('href')).toBe(
      '/play/progression?p=ii-V-I&chordSize=ninths&walk=tones-down&inversion=3&nearest=false',
    )
  })

  it('plays one of a chord written twice, pressing only the one tapped', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/lessons/inversions')
    await screen.findByRole('heading', { level: 1 })
    // The row C, F/C, G/B, C: C before and after its inversions, played as a progression.
    const row = screen.getByRole('button', { name: 'G/B' }).closest('ul')
    if (!row) throw new Error('the lesson writes its row of inversions')
    const [first, ...others] = within(row).getAllByRole('button', { name: /^C$/ })
    if (!first || others.length === 0) throw new Error('the row writes C twice')
    await user.click(first)
    expect(first).toHaveAttribute('aria-pressed', 'true')
    for (const other of others) expect(other).toHaveAttribute('aria-pressed', 'false')
  })

  it('plays a note tapped on a line’s staff, and a bar tapped over it', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/lessons/chromatic-scale')
    const note = await screen.findAllByRole('button', { name: /^Play [A-G]/ })
    const [first] = note
    if (!first) throw new Error('a line of notes')
    await user.click(first)
    expect(first).toHaveAttribute('aria-pressed', 'true')
    expect(audio.played.at(-1)?.sounds.length).toBeGreaterThan(0)
  })

  it('ends on Learned and the next lesson as Learn lists them', async () => {
    await renderApp('/learn/lessons/finding-home')
    const next = await screen.findByRole('link', { name: /Next lesson/ })
    expect(next.getAttribute('href')).toBe('/learn/lessons/reading-notes')
    expect(screen.getByRole('button', { name: 'Learned' })).toBeInTheDocument()
  })

  it('goes back to Learn when it was opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/lessons/reading-chord-symbols')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/learn'))
  })

  it('opens a pattern’s piece in the Player with it, and closes back to the lesson', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/lessons/five-ways')
    const card = await screen.findByRole('article', { name: '1 · Bass + chords' })
    await user.click(within(card).getByRole('link', { name: 'Open in the Player' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/play/ex3'))
    expect(router.state.location.search).toMatchObject({ pattern: 'M1' })
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/learn/lessons/five-ways'))
  })

  it('keeps a keyboard user on the quiz’s button as it opens, shows the answer and starts again', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/lessons/triads')
    const quiz = await screen.findByRole('group', { name: 'Play E major.' })
    within(quiz).getByRole('button', { name: 'Answer on the keys' }).focus()
    await user.keyboard('{Enter}')
    expect(within(quiz).getByRole('button', { name: 'Check' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'E4' }))
    await user.click(within(quiz).getByRole('button', { name: 'Check' }))
    await user.click(within(quiz).getByRole('button', { name: 'Show the answer' }))
    expect(within(quiz).getByRole('button', { name: 'Try again' })).toHaveFocus()
  })

  it('answers a Fundamentals quiz on its keys', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/lessons/triads')
    const quiz = await screen.findByRole('group', { name: 'Play E major.' })
    await user.click(within(quiz).getByRole('button', { name: 'Answer on the keys' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    for (const key of ['E4', 'G sharp 4', 'B4']) {
      await user.click(within(keyboard).getByRole('button', { name: key }))
    }
    await user.click(within(quiz).getByRole('button', { name: 'Check' }))
    expect(within(quiz).getByRole('status')).toHaveTextContent('Correct')
  })

  it('answers a quiz from a MIDI keyboard', async () => {
    const user = userEvent.setup()
    const { midi: midiKeyboard } = await renderApp('/learn/lessons/triads')
    const quiz = await screen.findByRole('group', { name: 'Play E major.' })
    await user.click(within(quiz).getByRole('button', { name: 'Answer on the keys' }))
    act(() => {
      for (const key of [64, 68, 71]) midiKeyboard.press(midi(key))
    })
    await user.click(within(quiz).getByRole('button', { name: 'Check' }))
    expect(within(quiz).getByRole('status')).toHaveTextContent('Correct')
  })

  it('speaks Russian on every block of a lesson', async () => {
    await renderApp('/learn/lessons/inversions', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1 })
    expect(untranslated(document.body)).toEqual([])
  })

  it('opens an exercise a lesson links to on its chord', async () => {
    await renderApp('/learn/lessons/inversions')
    const link = await screen.findByRole('link', { name: /^Climb C through its inversions/ })
    expect(link.getAttribute('href')).toBe('/play/exercise/inversions?root=C&quality=maj')
  })
})
