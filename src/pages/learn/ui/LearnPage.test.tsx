import { act, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { courseById, COURSES, lessonStepId } from '@/entities/course'

describe('Learn', () => {
  it('suggests the first lesson on a first run, saying where it is read', async () => {
    await renderApp('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeInTheDocument()
    const card = await screen.findByRole('region', { name: 'Finding your way on the keys' })
    expect(card).toHaveTextContent('First steps at the piano · Lesson 1 of 4 · Beginner')
    expect(within(card).getByRole('link', { name: 'Continue' })).toHaveAttribute(
      'href',
      '/learn/lessons/finding-home',
    )
  })

  it('goes on to a course’s practice once its lessons are learned', async () => {
    const { progressStore } = await renderApp('/')
    const learned = (ids: readonly string[]) =>
      Object.fromEntries(ids.map((id) => [lessonStepId(id), '2026-10-01T10:00:00Z']))
    const before = COURSES.slice(0, 3).flatMap((course) => [
      ...course.lessons.map(lessonStepId),
      ...course.practice.map((step) =>
        step.kind === 'piece'
          ? `piece:${step.pieceId}`
          : step.kind === 'scale'
            ? `scale:${step.scale}`
            : `chords:${step.family}`,
      ),
    ])
    act(() =>
      progressStore.setState({
        learned: {
          ...Object.fromEntries(before.map((id) => [id, '2026-10-01T10:00:00Z'])),
          ...learned(courseById('chord-basics')?.lessons ?? []),
        },
      }),
    )
    const card = await screen.findByRole('region', { name: 'Triads' })
    expect(within(card).getByText('Chords · 0 of 6 known · Chords · Beginner')).toBeInTheDocument()
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

  describe('its curriculum', () => {
    it('lists the four stages in order, each its courses on one line', async () => {
      await renderApp('/')
      await screen.findByRole('heading', { level: 1, name: 'Learn' })
      const stages = ['Beginner', 'Intermediate', 'Advanced', 'Professional'].map((name) =>
        screen.getByRole('region', { name }),
      )
      const hrefs = stages.flatMap((stage) =>
        within(stage)
          .getAllByRole('link')
          .map((link) => link.getAttribute('href')),
      )
      expect(hrefs).toEqual(COURSES.map((course) => `/learn/${course.id}`))
      expect(within(stages[0] ?? document.body).getByText('0 of 5 courses')).toBeInTheDocument()
    })

    it('marks the course Continue is in, and counts each course’s steps learned', async () => {
      const { progressStore } = await renderApp('/')
      const beginner = await screen.findByRole('region', { name: 'Beginner' })
      const [first, second] = within(beginner).getAllByRole('listitem')
      expect(first).toHaveAttribute('aria-current', 'step')
      expect(first).toHaveTextContent('0 of 5 learned')
      const firstSteps = courseById('first-steps')
      act(() =>
        progressStore.setState({
          learned: Object.fromEntries(
            [...(firstSteps?.lessons.map(lessonStepId) ?? []), 'piece:ode'].map((id) => [
              id,
              '2026-10-01T10:00:00Z',
            ]),
          ),
        }),
      )
      expect(first).toHaveTextContent('Course complete')
      expect(second).toHaveAttribute('aria-current', 'step')
    })
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Обучение' })).toBeInTheDocument()
    await screen.findByRole('region', { name: 'Начальный' })
    expect(untranslated(document.body)).toEqual([])
  })
})
