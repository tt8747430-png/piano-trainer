import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { lessonPlace } from '@/entities/lesson'
import { midi } from '@/shared/lib/music'
import { untranslated } from '@/app/testing/untranslated'

describe('A lesson', () => {
  it('shows its title and summary over its sections', async () => {
    await renderApp('/lessons/reading-chord-symbols')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'How to read chord symbols' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/what its numbers mean/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Naming any chord' })).toBeInTheDocument()
  })

  it('is marked learned at its end, and its journey shows it so', async () => {
    const user = userEvent.setup()
    const { progressStore, router } = await renderApp('/lessons/reading-chord-symbols')
    await user.click(await screen.findByRole('button', { name: 'Learned' }))
    expect(progressStore.getState().learned['lesson:reading-chord-symbols']).toBeDefined()
    await act(() =>
      router.navigate({ to: '/', search: { view: 'lessons', journey: 'foundations' } }),
    )
    const chapter = await screen.findByRole('region', { name: /Your first chords/ })
    expect(chapter).toHaveTextContent('1 of 3')
  })

  it('opens its exercises in the Player, walked through the keys or in an inversion', async () => {
    await renderApp('/lessons/two-five-one')
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
    await renderApp('/lessons/inversions')
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
    const { audio } = await renderApp('/lessons/whole-and-half-steps')
    // The notes are buttons once the staff is engraved, which takes a while under a full run.
    const note = await screen.findAllByRole('button', { name: /^Play [A-G]/ }, { timeout: 5000 })
    const [first] = note
    if (!first) throw new Error('a line of notes')
    await user.click(first)
    expect(first).toHaveAttribute('aria-pressed', 'true')
    expect(audio.played.at(-1)?.sounds.length).toBeGreaterThan(0)
  })

  it('ends on Learned and the next lesson of its journey', async () => {
    await renderApp('/lessons/finding-home')
    const next = await screen.findByRole('link', { name: /Next lesson/ })
    expect(next.getAttribute('href')).toBe('/lessons/reading-notes')
    expect(screen.getByRole('button', { name: 'Learned' })).toBeInTheDocument()
  })

  it('floats its options: the fingers on its scales hidden or shown, and the way on', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/lessons/minor-scales')
    await user.click(await screen.findByRole('button', { name: 'Lesson options' }))
    const options = screen.getByRole('list', { name: 'Lesson options' })
    expect(within(options).getByRole('link', { name: /^Next lesson/ })).toBeInTheDocument()
    await user.click(within(options).getByRole('button', { name: 'Hide the fingers' }))
    expect(settingsStore.getState().lesson.fingers).toBe(false)
  })

  it('offers no fingers where it plays no scale', async () => {
    const user = userEvent.setup()
    await renderApp('/lessons/reading-chord-symbols')
    await user.click(await screen.findByRole('button', { name: 'Lesson options' }))
    expect(screen.queryByRole('button', { name: /the fingers$/ })).not.toBeInTheDocument()
  })

  it('is learned once the learner goes on to the next lesson', async () => {
    const user = userEvent.setup()
    const { progressStore, router } = await renderApp('/lessons/finding-home')
    await user.click(await screen.findByRole('link', { name: /Next lesson/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/lessons/reading-notes'))
    expect(progressStore.getState().learned['lesson:finding-home']).toBeDefined()
  })

  it('goes on into the next chapter, and ends a journey back on its map', async () => {
    await renderApp('/lessons/bass-clef')
    expect((await screen.findByRole('link', { name: /Next lesson/ })).getAttribute('href')).toBe(
      '/lessons/rhythm-and-meter',
    )
  })

  it('ends a journey’s last lesson on the way back to the journey', async () => {
    const user = userEvent.setup()
    const { progressStore, router } = await renderApp('/lessons/pentatonic-improvisation')
    await user.click(await screen.findByRole('link', { name: /Back to the journey/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.state.location.search).toMatchObject({ journey: 'mastery' })
    expect(progressStore.getState().learned['lesson:pentatonic-improvisation']).toBeDefined()
  })

  it('lists its sections at its top, each a link to its heading', async () => {
    await renderApp('/lessons/ninth-chords')
    const contents = await screen.findByRole('navigation', { name: 'In this lesson' })
    const links = within(contents).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual([
      'A 7th chord and one more 3rd',
      'Two triads stacked',
      'Bass left, 7th chord right',
      'The second position',
      'Split the root',
      'Try it',
    ])
    const href = links[3]?.getAttribute('href') ?? ''
    expect(href).toBe('/lessons/ninth-chords#section-4')
    const section = document.getElementById(href.split('#')[1] ?? '')
    expect(section).toContainElement(
      screen.getByRole('heading', { level: 2, name: 'The second position' }),
    )
  })

  it('says its journey, chapter and number, its journey a link to its map', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/lessons/two-five-one')
    const place = await screen.findByRole('navigation', { name: 'Where this lesson is' })
    const where = lessonPlace('two-five-one')!
    expect(place).toHaveTextContent(`Mastery · The ii–V–I · Lesson ${where.n} of ${where.total}`)
    await user.click(within(place).getByRole('link', { name: 'Mastery' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.state.location.search).toMatchObject({ journey: 'mastery' })
  })

  it('goes back to its journey when it was opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/lessons/reading-chord-symbols')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.state.location.search).toMatchObject({ journey: 'foundations' })
  })

  it('is not found for a lesson no journey has: a course’s is its course’s', async () => {
    await renderApp('/lessons/five-ways')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('keeps a keyboard user on the question’s button as it opens, shows the answer and starts again', async () => {
    const user = userEvent.setup()
    await renderApp('/lessons/triads')
    const question = await screen.findByRole('group', { name: 'Play E major.' })
    within(question).getByRole('button', { name: 'Answer on the keys' }).focus()
    await user.keyboard('{Enter}')
    expect(within(question).getByRole('button', { name: 'Show the answer' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(within(question).getByRole('button', { name: 'Try again' })).toHaveFocus()
  })

  it('answers a Fundamentals question on its keys', async () => {
    const user = userEvent.setup()
    await renderApp('/lessons/triads')
    const question = await screen.findByRole('group', { name: 'Play E major.' })
    await user.click(within(question).getByRole('button', { name: 'Answer on the keys' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    for (const key of ['E4', 'G sharp 4', 'B4']) {
      await user.click(within(keyboard).getByRole('button', { name: key }))
    }
    expect(within(question).getByRole('status')).toHaveTextContent('Correct')
  })

  it('answers a question from a MIDI keyboard', async () => {
    const user = userEvent.setup()
    const { midi: midiKeyboard } = await renderApp('/lessons/triads')
    const question = await screen.findByRole('group', { name: 'Play E major.' })
    await user.click(within(question).getByRole('button', { name: 'Answer on the keys' }))
    act(() => {
      for (const key of [64, 68, 71]) midiKeyboard.press(midi(key))
    })
    expect(within(question).getByRole('status')).toHaveTextContent('Correct')
  })

  it('speaks Russian on every block of a lesson', async () => {
    await renderApp('/lessons/inversions', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1 })
    expect(untranslated(document.body)).toEqual([])
  })

  it('opens an exercise a lesson links to on its chord', async () => {
    await renderApp('/lessons/inversions')
    const link = await screen.findByRole('link', { name: /^Climb C through its inversions/ })
    expect(link.getAttribute('href')).toBe('/play/exercise/inversions?root=C&quality=maj')
  })
})
