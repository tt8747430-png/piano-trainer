import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { COURSES, courseById, coursesOn } from '@/entities/course'
import { JOURNEYS } from '@/entities/lesson'

const at = '2026-10-01T10:00:00Z'

describe('Learn', () => {
  it('floats Continue onto the first lesson on a first run', async () => {
    await renderApp('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeInTheDocument()
    expect(
      await screen.findByRole('link', { name: 'Continue Finding your way on the keys' }),
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
      await screen.findByRole('link', { name: `Continue ${second?.title.en}` }),
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

  describe('its Lessons', () => {
    it('show the current journey’s chapters as groups of rows, Continue’s marked Next', async () => {
      await renderApp('/')
      const journey = JOURNEYS[0]!
      expect(
        await screen.findByRole('heading', { level: 2, name: 'Foundations' }),
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

    it('count each journey’s steps in its pop-up, its lessons and its checks, and say so', async () => {
      const user = userEvent.setup()
      await renderApp('/')
      const picker = await screen.findByRole('combobox', { name: 'Journeys' })
      expect(picker).toHaveTextContent('Foundations')
      await user.click(picker)
      const journey = JOURNEYS[0]!
      const steps = journey.chapters.flatMap((chapter) => chapter.steps).length
      expect(await screen.findByRole('option', { name: /^Foundations/ })).toHaveTextContent(
        `0/${steps} steps`,
      )
      expect(screen.getAllByRole('option')).toHaveLength(JOURNEYS.length)
    })

    it('say a learned step is learned', async () => {
      const { progressStore } = await renderApp('/')
      await screen.findByRole('heading', { level: 2, name: 'Foundations' })
      act(() => progressStore.setState({ learned: { 'lesson:finding-home': at } }))
      const chapter = screen.getByRole('region', { name: /^Chapter 1:/ })
      expect(
        within(chapter).getByRole('link', { name: /^Finding your way on the keys.*, learned/ }),
      ).toHaveAttribute('href', '/lessons/finding-home')
      expect(
        within(chapter).getByRole('link', { name: /^The staff and the treble clef/ }),
      ).not.toHaveAccessibleName(/learned/)
    })

    it('switch journeys from the pop-up', async () => {
      const user = userEvent.setup()
      const { router } = await renderApp('/')
      await user.click(await screen.findByRole('combobox', { name: 'Journeys' }))
      await user.click(await screen.findByRole('option', { name: /^Fluency/ }))
      expect(await screen.findByRole('heading', { level: 2, name: 'Fluency' })).toBeInTheDocument()
      expect(router.state.location.search).toMatchObject({ journey: 'fluency' })
      const chapter = JOURNEYS[1]!.chapters[0]!
      expect(
        screen.getByRole('region', { name: `Chapter 1: ${chapter.title.en}` }),
      ).toHaveTextContent(`0/${chapter.steps.length}`)
    })
  })

  describe('its Courses', () => {
    it('come up from the header’s toggle, shelf by shelf', async () => {
      const user = userEvent.setup()
      const { router } = await renderApp('/')
      const toggle = await screen.findByRole('navigation', { name: 'What Learn shows' })
      expect(within(toggle).getByRole('link', { name: 'Lessons' })).toHaveAttribute(
        'aria-current',
        'page',
      )
      await user.click(within(toggle).getByRole('link', { name: 'Courses' }))
      expect(router.state.location.search).toMatchObject({ view: 'courses' })
      const shelf = await screen.findByRole('region', { name: 'Beginner courses' })
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

    it('stay up when Learn is opened again from the navigation', async () => {
      const user = userEvent.setup()
      const { router, viewsStore } = await renderApp('/?view=courses')
      await screen.findByRole('region', { name: 'Method books' })
      expect(viewsStore.getState().views['/']).toEqual({ view: 'courses' })
      const nav = screen.getAllByRole('navigation', { name: 'Main navigation' })[0]
      if (!nav) throw new Error('no navigation')
      await user.click(within(nav).getByRole('link', { name: 'Learn' }))
      expect(router.state.location.search).toEqual({ view: 'courses' })
      expect(viewsStore.getState().views['/']).toEqual({ view: 'courses' })
      expect(await screen.findByRole('region', { name: 'Method books' })).toBeInTheDocument()
    })

    it('ring the course Continue is in', async () => {
      const { progressStore } = await renderApp('/?view=courses')
      await screen.findByRole('region', { name: 'Method books' })
      act(() => progressStore.setState({ learned: { 'course:gorshkov/sevenths-in-a-song': at } }))
      const card = screen
        .getAllByRole('link')
        .find((link) => link.getAttribute('href') === '/courses/gorshkov')
      expect(card).toHaveAttribute('aria-current', 'step')
    })
  })

  it('reads in Russian, with nothing left in English, either way it shows', async () => {
    await renderApp('/', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Обучение' })).toBeInTheDocument()
    await screen.findByRole('heading', { level: 2, name: 'Основы' })
    expect(untranslated(document.body)).toEqual([])
  })
})
