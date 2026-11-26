import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { lessonById, lessonPlace } from '@/entities/lesson'
import { midi } from '@/shared/lib/music'
import { untranslated } from '@/app/testing/untranslated'
import { stubIntersectionObserver } from '@/shared/test/intersection'

describe('A lesson', () => {
  it('shows its title over what it teaches and its sections', async () => {
    await renderApp('/lessons/reading-chord-symbols')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'How to read chord symbols' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/name the chords you play/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Naming any chord' })).toBeInTheDocument()
  })

  it('links the lessons to read before it by number, and its level shows them so', async () => {
    const { router } = await renderApp('/lessons/cadences')
    await screen.findByRole('navigation', { name: 'Where this lesson is' })
    const inversions = lessonPlace('inversions')!
    const functions = lessonPlace('chord-functions')!
    expect(screen.getByRole('link', { name: `${inversions.n} · Inversions` })).toHaveAttribute(
      'href',
      '/lessons/inversions',
    )
    expect(
      screen.getByRole('link', {
        name: `${functions.n} · Chord functions: tonic, subdominant, dominant`,
      }),
    ).toHaveAttribute('href', '/lessons/chord-functions')
    await act(() => router.navigate({ to: '/levels/$levelId', params: { levelId: 'fluency' } }))
    const node = await screen.findByRole('link', { name: /^Cadences/ })
    const asked = (lessonById('cadences')?.after ?? []).map((id) => lessonPlace(id)?.n)
    expect(asked).toEqual(expect.arrayContaining([inversions.n, functions.n]))
    expect(node).toHaveTextContent(`After ${asked.join(', ')}`)
  })

  it('is learned as the learner goes on, Undo in the toast, and its level shows it so', async () => {
    const user = userEvent.setup()
    const { progressStore, router } = await renderApp('/lessons/finding-home')
    await user.click((await screen.findAllByRole('link', { name: /Next lesson/ }))[0]!)
    await waitFor(() => expect(router.state.location.pathname).toBe('/lessons/reading-notes'))
    expect(progressStore.getState().learned['lesson:finding-home']).toBeDefined()
    expect(await screen.findByText('“Finding your way on the keys” learned')).toBeInTheDocument()
    await act(() => router.navigate({ to: '/levels/$levelId', params: { levelId: 'foundations' } }))
    const chapter = await screen.findByRole('region', { name: /^Chapter 1:/ })
    expect(chapter).toHaveTextContent(/1 of \d+/)
  })

  it('plays one of a chord written twice, pressing only the one tapped', async () => {
    const user = userEvent.setup()
    await renderApp('/lessons/inversions')
    await screen.findByRole('heading', { level: 1 })
    // The row C, F/C, G/B, C: C before and after its inversions, played as a progression.
    const bar = await screen.findByRole(
      'button',
      { name: /^Play bar \d+, G\/B$/ },
      { timeout: 5000 },
    )
    const row = bar.closest<HTMLElement>('[role="group"]')
    if (!row) throw new Error('the lesson writes its row of inversions')
    const [first, ...others] = within(row).getAllByRole('button', {
      name: /^Play bar \d+, C$/,
    })
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

  it('moves the focus to the next lesson’s heading, so Enter again learns nothing unread', async () => {
    const user = userEvent.setup()
    const { progressStore, router } = await renderApp('/lessons/finding-home')
    ;(await screen.findAllByRole('link', { name: /Next lesson/ }))[0]!.focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(router.state.location.pathname).toBe('/lessons/reading-notes'))
    expect(progressStore.getState().learned['lesson:finding-home']).toBeDefined()
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { level: 1, name: 'The staff and the treble clef' }),
      ).toHaveFocus(),
    )
    await user.keyboard('{Enter}')
    expect(router.state.location.pathname).toBe('/lessons/reading-notes')
    expect(progressStore.getState().learned['lesson:reading-notes']).toBeUndefined()
  })

  it('goes on into the next chapter', async () => {
    await renderApp('/lessons/bass-clef')
    const [next] = await screen.findAllByRole('link', { name: /Next lesson/ })
    expect(next).toHaveAttribute('href', '/lessons/rhythm-and-meter')
  })

  it('ends a level’s last lesson on the way back to its level, learned', async () => {
    const user = userEvent.setup()
    const { progressStore, router } = await renderApp('/lessons/pentatonic-improvisation')
    await user.click((await screen.findAllByRole('link', { name: /Back to the level/ }))[0]!)
    await waitFor(() => expect(router.state.location.pathname).toBe('/levels/mastery'))
    expect(progressStore.getState().learned['lesson:pentatonic-improvisation']).toBeDefined()
  })

  it('lists its sections in its contents, each a link to its heading', async () => {
    const user = userEvent.setup()
    await renderApp('/lessons/ninth-chords')
    await user.click(
      (await screen.findAllByRole('button', { name: /^In this lesson: section/ }))[0]!,
    )
    const contents = await screen.findByRole('navigation', { name: 'In this lesson' })
    const links = within(contents).getAllByRole('link')
    // Each link says its number, then its heading.
    expect(links.map((link) => link.textContent?.replace(/^\d+/, ''))).toEqual([
      'A 7th chord and one more 3rd',
      'Two triads stacked',
      'Bass left, two positions',
      'Split the root',
      'Try it',
    ])
    const href = links[3]?.getAttribute('href') ?? ''
    expect(href).toBe('/lessons/ninth-chords#section-4')
    const section = document.getElementById(href.split('#')[1] ?? '')
    expect(section).toContainElement(
      screen.getByRole('heading', { level: 2, name: 'Split the root', hidden: true }),
    )
  })

  it('says its number in its level, the level a link to its page', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/lessons/two-five-one')
    const place = await screen.findByRole('navigation', { name: 'Where this lesson is' })
    const where = lessonPlace('two-five-one')!
    expect(place).toHaveTextContent(`Lesson ${where.n} of ${where.total} · Mastery`)
    await user.click(within(place).getByRole('link', { name: 'Mastery' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/levels/mastery'))
  })

  it('goes back to its level when it was opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/lessons/reading-chord-symbols')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/levels/foundations'))
  })

  it('is not found for a lesson no level has: a course’s is its course’s', async () => {
    await renderApp('/lessons/five-ways')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeInTheDocument()
  })

  it('keeps a keyboard user in the question as it shows the answer, and starts again', async () => {
    const user = userEvent.setup()
    await renderApp('/lessons/triads')
    const question = await screen.findByRole('group', { name: 'Play E major.' })
    within(question).getByRole('button', { name: 'Show the answer' }).focus()
    await user.keyboard('{Enter}')
    expect(within(question).getByRole('status')).toHaveTextContent('The answer')
    expect(within(question).getByRole('button', { name: 'Again' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(within(question).getByRole('button', { name: 'Show the answer' })).toBeInTheDocument()
  })

  it('answers a Fundamentals question on its own keys', async () => {
    const user = userEvent.setup()
    await renderApp('/lessons/triads')
    const question = await screen.findByRole('group', { name: 'Play E major.' })
    const keyboard = within(question).getByRole('group', { name: 'Keyboard' })
    for (const key of ['E4', 'G sharp 4', 'B4']) {
      await user.click(within(keyboard).getByRole('button', { name: key }))
    }
    expect(within(question).getByRole('status')).toHaveTextContent('Correct')
  })

  it('answers a question from a MIDI keyboard, in the section being read', async () => {
    // The page scrolled to its last section, Try it, where the question is.
    stubIntersectionObserver({ visible: true, where: (element) => element.id === 'section-6' })
    const { midi: midiKeyboard } = await renderApp('/lessons/triads')
    const question = await screen.findByRole('group', { name: 'Play E major.' })
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
