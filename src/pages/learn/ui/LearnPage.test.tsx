import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { lessonsIn } from '@/entities/lesson'
import { pathSteps } from '@/entities/path'
import { OPEN_PLAINLY } from '@/shared/lib'

describe('Learn', () => {
  it('suggests the first lesson on a first run, saying where it is read', async () => {
    await renderApp('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeInTheDocument()
    const card = await screen.findByRole('region', { name: 'Finding your way on the keys' })
    expect(card).toHaveTextContent(
      `Fundamentals · Lesson 1 of ${lessonsIn('fundamentals').length} · Beginner`,
    )
    expect(within(card).getByRole('link', { name: 'Continue' })).toHaveAttribute(
      'href',
      '/learn/lessons/finding-home',
    )
  })

  it('goes on to a level’s practice once its lessons are learned', async () => {
    const { progressStore } = await renderApp('/')
    const lessons = pathSteps().filter(
      (placed) => placed.level === 1 && placed.step.kind === 'lesson',
    )
    act(() =>
      progressStore.setState({
        learned: Object.fromEntries(lessons.map(({ id }) => [id, '2026-10-01T10:00:00Z'])),
      }),
    )
    const card = await screen.findByRole('region', { name: 'Triads' })
    expect(within(card).getByText('Chords · 0 of 6 known · Beginner')).toBeInTheDocument()
    expect(within(card).getByRole('link', { name: 'Continue' }).getAttribute('href')).toMatch(
      /^\/practice\/chords\?.*step=chords(%3A|:)tri/,
    )
  })

  it('suggests the song practised last, with the chords it has to check', async () => {
    const { progressStore } = await renderApp('/')
    act(() => progressStore.setState({ practised: { bz5: '2026-09-25T10:00:00Z' } }))
    const card = await screen.findByRole('region', { name: 'Still, my soul, be still' })
    expect(within(card).getByRole('link', { name: 'Continue' })).toHaveAttribute(
      'href',
      '/play/bz5',
    )
    expect(
      within(card)
        .getByRole('link', { name: /^Chords to check: \d+$/ })
        .getAttribute('href'),
    ).toMatch(/^\/check\?of=piece(%3A|:)bz5$/)
  })

  it('lists the pieces practised last, latest first, and none before the first', async () => {
    const { progressStore } = await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    expect(screen.queryByRole('region', { name: 'Recently practised' })).not.toBeInTheDocument()
    act(() =>
      progressStore.setState({
        practised: {
          bz5: '2026-09-25T10:00:00Z',
          ode: '2026-09-27T10:00:00Z',
          'my-404': '2026-09-28T10:00:00Z',
        },
      }),
    )
    const recent = await screen.findByRole('region', { name: 'Recently practised' })
    expect(
      within(recent)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(['/songs/ode', '/songs/bz5'])
  })

  describe('its Journey', () => {
    it('draws level 1 as a line of steps, the one Continue opens lit, its count learned', async () => {
      const { progressStore } = await renderApp('/')
      const level = await screen.findByRole('region', { name: 'Level 1 · Beginner' })
      const steps = within(level).getAllByRole('listitem')
      expect(within(level).getByText(`0 of ${steps.length}`)).toBeInTheDocument()
      expect(steps[0]).toHaveAttribute('aria-current', 'step')
      expect(within(steps[0] ?? level).getByRole('link')).toHaveAttribute(
        'href',
        '/learn/lessons/finding-home',
      )
      act(() =>
        progressStore.setState({
          learned: { 'lesson:finding-home': '2026-10-01T10:00:00Z' },
        }),
      )
      expect(within(level).getByText(`1 of ${steps.length}`)).toBeInTheDocument()
      expect(within(level).getAllByRole('listitem')[1]).toHaveAttribute('aria-current', 'step')
      expect(within(level).getAllByRole('listitem')[0]).toHaveTextContent(/^Finding.*Learned/)
    })

    it('opens a song from its node, and a chord step in its explorer', async () => {
      const user = userEvent.setup()
      await renderApp('/')
      const level = await screen.findByRole('region', { name: 'Level 1 · Beginner' })
      const elementary = screen.getByRole('region', { name: 'Level 2 · Elementary' })
      await user.click(within(elementary).getByRole('button', { name: /Level 2/ }))
      expect(
        within(elementary).getByRole('link', { name: /Still, my soul, be still/ }),
      ).toHaveAttribute('href', '/songs/bz5')
      expect(
        within(level)
          .getByRole('link', { name: /^Triads\s*Chords/ })
          .getAttribute('href'),
      ).toMatch(/^\/practice\/chords\?.*step=chords(%3A|:)tri/)
    })

    it('opens the level the learner is at, the others folded until opened', async () => {
      const user = userEvent.setup()
      await renderApp('/')
      const beginner = await screen.findByRole('region', { name: 'Level 1 · Beginner' })
      const elementary = screen.getByRole('region', { name: 'Level 2 · Elementary' })
      expect(within(beginner).getByRole('button', { name: /Level 1/ })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
      expect(within(elementary).queryByRole('list')).not.toBeInTheDocument()
      await user.click(within(elementary).getByRole('button', { name: /Level 2/ }))
      expect(within(elementary).getByRole('list')).toBeInTheDocument()
    })
  })

  describe('its Courses', () => {
    it('shelves every module as a course, subjects then courses, kept in the URL', async () => {
      const user = userEvent.setup()
      const { router } = await renderApp('/')
      await user.click(await screen.findByRole('radio', { name: 'Courses' }))
      await waitFor(() => expect(router.state.location.search).toMatchObject({ view: 'courses' }))
      const subjects = screen.getByRole('region', { name: 'Subjects' })
      expect(
        within(subjects)
          .getAllByRole('link')
          .map((link) => link.getAttribute('href')),
      ).toEqual(['/learn/fundamentals', '/learn/accompaniment', '/learn/gospel'])
      const courses = screen.getByRole('region', { name: 'Courses' })
      const gorshkov = within(courses).getByRole('link', { name: /Горшков/ })
      expect(gorshkov).toHaveTextContent(`0 of ${lessonsIn('gorshkov').length} learned`)
      expect(screen.queryByRole('region', { name: 'Level 1 · Beginner' })).not.toBeInTheDocument()
    })

    it('opens as it was left', async () => {
      const { router } = await renderApp('/?view=courses')
      await screen.findByRole('region', { name: 'Subjects' })
      await act(() => router.navigate({ to: '/songs' }))
      // As the navigation opens a place: plainly.
      await act(() => router.navigate({ to: '/', state: OPEN_PLAINLY }))
      expect(await screen.findByRole('region', { name: 'Subjects' })).toBeInTheDocument()
    })
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/?view=courses', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Обучение' })).toBeInTheDocument()
    await screen.findByRole('region', { name: 'Темы' })
    expect(untranslated(document.body)).toEqual([])
  })
})
