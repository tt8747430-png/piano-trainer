import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { courseById } from '@/entities/course'

const book = courseById('called-to-play')!
const at = book.lessons.findIndex((lesson) => lesson.id === 'five-ways')

describe('A course’s lesson', () => {
  it('says its course and its number there, its course a link to its page', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/courses/called-to-play/five-ways')
    const place = await screen.findByRole('navigation', { name: 'Where this lesson is' })
    expect(place).toHaveTextContent(`Lesson ${at + 1} of ${book.lessons.length}`)
    await user.click(within(place).getByRole('link', { name: book.title.en }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/courses/called-to-play'))
  })

  it('goes on to its course’s next lesson, learned on the way under its course', async () => {
    const user = userEvent.setup()
    const { progressStore, router } = await renderApp('/courses/called-to-play/five-ways')
    const next = book.lessons[at + 1]!
    await user.click(await screen.findByRole('link', { name: /Next lesson/ }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/courses/called-to-play/${next.id}`),
    )
    expect(progressStore.getState().learned['course:called-to-play/five-ways']).toBeDefined()
    expect(progressStore.getState().learned['lesson:five-ways']).toBeUndefined()
  })

  it('moves the focus to the next lesson’s heading, so Enter again learns nothing unread', async () => {
    const user = userEvent.setup()
    const { progressStore, router } = await renderApp('/courses/called-to-play/five-ways')
    const next = book.lessons[at + 1]!
    ;(await screen.findByRole('link', { name: /Next lesson/ })).focus()
    await user.keyboard('{Enter}')
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/courses/called-to-play/${next.id}`),
    )
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveFocus())
    await user.keyboard('{Enter}')
    expect(router.state.location.pathname).toBe(`/courses/called-to-play/${next.id}`)
    expect(progressStore.getState().learned[`course:called-to-play/${next.id}`]).toBeUndefined()
  })

  it('ends its course on the way to the guided songs', async () => {
    const last = book.lessons.at(-1)!
    await renderApp(`/courses/called-to-play/${last.id}`)
    const way = await screen.findByRole('link', { name: /On to the guided songs/ })
    expect(way.getAttribute('href')).toBe('/courses/called-to-play')
    expect(screen.queryByRole('link', { name: /Next lesson/ })).not.toBeInTheDocument()
  })

  it('opens a pattern’s piece in the Player with it, and closes back to the lesson', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/courses/called-to-play/five-ways')
    const card = await screen.findByRole('article', { name: '1 · Bass + chords' })
    await user.click(within(card).getByRole('link', { name: 'Open in the Player' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/play/ex3'))
    expect(router.state.location.search).toMatchObject({ pattern: 'M1' })
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/courses/called-to-play/five-ways'),
    )
  })

  it('is not found under a course that does not have it', async () => {
    await renderApp('/courses/gorshkov/five-ways')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('speaks Russian on every block', async () => {
    await renderApp('/courses/called-to-play/five-ways', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1 })
    expect(untranslated(document.body)).toEqual([])
  })
})
