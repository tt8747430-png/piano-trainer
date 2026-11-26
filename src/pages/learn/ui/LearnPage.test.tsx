import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { COURSES, courseById, coursesOn } from '@/entities/course'
import { JOURNEYS } from '@/entities/lesson'

const at = '2026-10-01T10:00:00Z'

describe('Learn', () => {
  it('floats Start onto the first lesson on a first run', async () => {
    await renderApp('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeInTheDocument()
    expect(
      await screen.findByRole('link', {
        name: /^Start · Foundations.*Finding your way on the keys/,
      }),
    ).toHaveAttribute('href', '/lessons/finding-home')
  })

  it('continues in the course whose lesson was learned last', async () => {
    const { progressStore } = await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    act(() =>
      progressStore.setState({
        learned: { 'course:gorshkov/sevenths-in-a-song': at, 'lesson:finding-home': '2026-09-01' },
      }),
    )
    const second = courseById('gorshkov')?.lessons[1]
    expect(
      await screen.findByRole('link', {
        name: (name) =>
          second !== undefined && name.startsWith('Continue') && name.includes(second.title.en),
      }),
    ).toHaveAttribute('href', `/courses/gorshkov/${second?.id}`)
  })

  it('continues onto a guided song’s page, where it is marked learned', async () => {
    const { progressStore } = await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    const course = courseById('introduction-to-the-piano')!
    act(() =>
      progressStore.setState({
        learned: Object.fromEntries(
          course.lessons.map((lesson) => [`course:${course.id}/${lesson.id}`, at]),
        ),
      }),
    )
    const song = course.songs[0]
    expect(await screen.findByRole('link', { name: /^Continue / })).toHaveAttribute(
      'href',
      `/songs/${song}`,
    )
  })

  it('leaves the days practised and the songs played last to the Profile', async () => {
    const { progressStore } = await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    act(() => progressStore.setState({ practised: { ode: '2026-09-27T10:00:00Z' } }))
    expect(screen.queryByRole('region', { name: 'Recently practised' })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Practice' })).not.toBeInTheDocument()
  })

  it('lists the four levels, each opening its page, the steps learned under its name', async () => {
    await renderApp('/')
    const levels = await screen.findByRole('region', { name: 'Levels' })
    const rows = within(levels).getAllByRole('link')
    expect(rows.map((row) => row.getAttribute('href'))).toEqual(
      JOURNEYS.map((journey) => `/levels/${journey.id}`),
    )
    const steps = JOURNEYS[0]!.chapters.flatMap((chapter) => chapter.steps).length
    expect(rows[0]).toHaveTextContent(/Beginner.*Foundations/)
    expect(rows[0]).toHaveTextContent(`0 of ${steps}`)
  })

  it('opens a level from its row', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/')
    const levels = await screen.findByRole('region', { name: 'Levels' })
    await user.click(within(levels).getByRole('link', { name: /Intermediate/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Fluency' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/levels/fluency')
    const chapter = JOURNEYS[1]!.chapters[0]!
    expect(
      screen.getByRole('region', { name: `Chapter 1: ${chapter.title.en}` }),
    ).toHaveTextContent(`0 of ${chapter.steps.length}`)
  })

  describe('a level’s page', () => {
    it('shows its chapters as lines of steps, Continue’s marked Next', async () => {
      await renderApp(`/levels/${JOURNEYS[0]!.id}`)
      const journey = JOURNEYS[0]!
      expect(
        await screen.findByRole('heading', { level: 1, name: 'Foundations' }),
      ).toBeInTheDocument()
      const chapters = journey.chapters.map((chapter, i) =>
        screen.getByRole('region', { name: `Chapter ${i + 1}: ${chapter.title.en}` }),
      )
      const first = within(chapters[0]!).getAllByRole('link')[0]
      expect(first).toHaveAttribute('href', '/lessons/finding-home')
      expect(first).toHaveAttribute('aria-current', 'step')
      expect(first).toHaveTextContent('Next')
      expect(within(chapters[0]!).getAllByRole('link')).toHaveLength(
        journey.chapters[0]!.steps.length,
      )
    })

    it('says a learned step is learned', async () => {
      const { progressStore } = await renderApp(`/levels/${JOURNEYS[0]!.id}`)
      await screen.findByRole('heading', { level: 1, name: 'Foundations' })
      act(() => progressStore.setState({ learned: { 'lesson:finding-home': at } }))
      const chapter = screen.getByRole('region', { name: /^Chapter 1:/ })
      expect(
        within(chapter).getByRole('link', { name: /^Finding your way on the keys.*, learned/ }),
      ).toHaveAttribute('href', '/lessons/finding-home')
      expect(
        within(chapter).getByRole('link', { name: /^The staff and the treble clef/ }),
      ).not.toHaveAccessibleName(/learned/)
    })
  })

  describe('the Courses', () => {
    it('open from Learn’s See all, shelf by shelf', async () => {
      const user = userEvent.setup()
      const { router } = await renderApp('/')
      const courses = await screen.findByRole('region', { name: 'Courses' })
      await user.click(within(courses).getByRole('link', { name: 'See all' }))
      expect(router.state.location.pathname).toBe('/courses')
      const shelf = await screen.findByRole('region', { name: 'Beginner' })
      expect(
        within(shelf)
          .getAllByRole('link')
          .map((link) => link.getAttribute('href')),
      ).toEqual(coursesOn('beginner').map((course) => `/courses/${course.id}`))
      const all = screen
        .getAllByRole('link')
        .filter((link) => /^\/courses\/[^/]+$/.test(link.getAttribute('href') ?? ''))
      expect(all).toHaveLength(COURSES.length)
      expect(screen.getByRole('region', { name: 'Method books' })).toBeInTheDocument()
    })

    it('ring the course Continue is in', async () => {
      const { progressStore } = await renderApp('/courses')
      await screen.findByRole('region', { name: 'Method books' })
      act(() => progressStore.setState({ learned: { 'course:gorshkov/sevenths-in-a-song': at } }))
      const card = screen
        .getAllByRole('link')
        .find((link) => link.getAttribute('href') === '/courses/gorshkov')
      expect(card).toHaveAttribute('aria-current', 'step')
    })
  })

  it('reads in Russian, with nothing left in English, on Learn and a level’s page', async () => {
    const { unmount } = await renderApp('/', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Обучение' })).toBeInTheDocument()
    await screen.findByRole('region', { name: 'Уровни' })
    expect(untranslated(document.body)).toEqual([])
    unmount()
    await renderApp(`/levels/${JOURNEYS[0]!.id}`, { locale: 'ru' })
    await screen.findByRole('heading', { level: 1, name: 'Основы' })
    expect(untranslated(document.body)).toEqual([])
  })
})
