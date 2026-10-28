import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { courseById } from '@/entities/course'

const gorshkov = courseById('gorshkov')!

describe('A course', () => {
  it('lists its own lessons in order under one way in, its first', async () => {
    await renderApp('/courses/gorshkov')
    expect(
      await screen.findByRole('heading', { level: 1, name: gorshkov.title.en }),
    ).toBeInTheDocument()
    const region = screen.getByRole('region', { name: 'Lessons' })
    const hrefs = within(region)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(gorshkov.lessons.map((lesson) => `/courses/gorshkov/${lesson.id}`))
    expect(screen.getByRole('link', { name: /^Start course/ })).toHaveAttribute('href', hrefs[0])
    const total = gorshkov.lessons.length + gorshkov.songs.length
    expect(screen.getByText(`0 of ${total} learned`)).toBeInTheDocument()
    const facts = screen.getByRole('list', { name: 'About this course' })
    expect(facts).toHaveTextContent(`Advanced`)
    expect(facts).toHaveTextContent(`${gorshkov.weeks} weeks`)
    expect(facts).toHaveTextContent(`${gorshkov.lessons.length} lessons`)
    expect(facts).toHaveTextContent(`${gorshkov.songs.length} songs`)
  })

  it('ends on its guided songs', async () => {
    await renderApp('/courses/gorshkov')
    const songs = await screen.findByRole('region', { name: 'Guided songs' })
    expect(
      within(songs)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(gorshkov.songs.map((id) => `/songs/${id}`))
  })

  it('continues with the first lesson not learned, then its songs, then offers a review', async () => {
    const { progressStore } = await renderApp('/courses/gorshkov')
    await screen.findByRole('heading', { level: 1 })
    const [first, second] = gorshkov.lessons
    act(() =>
      progressStore.setState({ learned: { [`course:gorshkov/${first?.id}`]: '2026-10-01' } }),
    )
    expect(screen.getByRole('link', { name: /^Continue/ })).toHaveAttribute(
      'href',
      `/courses/gorshkov/${second?.id}`,
    )
    const [row, secondRow] = within(screen.getByRole('region', { name: 'Lessons' })).getAllByRole(
      'link',
    )
    expect(row).not.toHaveAttribute('aria-current')
    expect(row).toHaveAccessibleName(/^Lesson 1:.*, learned$/)
    expect(secondRow).not.toHaveAccessibleName(/learned/)
    act(() =>
      progressStore.setState({
        learned: Object.fromEntries(
          gorshkov.lessons.map((lesson) => [`course:gorshkov/${lesson.id}`, '2026-10-01']),
        ),
      }),
    )
    expect(screen.getByRole('link', { name: /^Continue/ })).toHaveAttribute(
      'href',
      `/songs/${gorshkov.songs[0]}`,
    )
    act(() =>
      progressStore.setState({
        learned: Object.fromEntries([
          ...gorshkov.lessons.map((lesson) => [`course:gorshkov/${lesson.id}`, '2026-10-01']),
          ...gorshkov.songs.map((id) => [`piece:${id}`, '2026-10-01']),
        ]),
      }),
    )
    expect(screen.getByRole('link', { name: /^Review/ })).toHaveAttribute(
      'href',
      `/courses/gorshkov/${first?.id}`,
    )
    expect(screen.getByText('Course complete')).toBeInTheDocument()
  })

  it('rings a lesson as its sections are read, the one Continue leads to ringed in honey alone', async () => {
    const { progressStore } = await renderApp('/courses/gorshkov')
    await screen.findByRole('heading', { level: 1 })
    const [first, , third] = gorshkov.lessons
    const sections = third?.sections.length ?? 0
    act(() =>
      progressStore.setState({
        read: {
          [`course:gorshkov/${first?.id}`]: [0],
          [`course:gorshkov/${third?.id}`]: [0],
        },
      }),
    )
    const rows = within(screen.getByRole('region', { name: 'Lessons' })).getAllByRole('link')
    expect(rows[2]).toHaveAccessibleName(new RegExp(`, ${Math.round(100 / sections)}% read$`))
    // The first is where Continue leads: its honey ring says so.
    expect(rows[0]).toHaveAttribute('aria-current', 'step')
  })

  it('goes back to the Courses when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/courses/gorshkov')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.state.location.search).toMatchObject({ view: 'courses' })
  })

  it('is not found for a course there is not, nor a lesson it does not have', async () => {
    await renderApp('/courses/nothing')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/courses/seven-types', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1, name: courseById('seven-types')?.title.ru })
    expect(untranslated(document.body)).toEqual([])
  })
})
