import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { lessonsIn } from '@/entities/lesson'

describe('A course', () => {
  it('lists its lessons in order under one way in, its first', async () => {
    await renderApp('/learn/gorshkov')
    expect(await screen.findByRole('heading', { level: 1, name: 'Горшков' })).toBeInTheDocument()
    const lessons = screen.getByRole('region', { name: 'Lessons' })
    const ids = within(lessons)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
    expect(ids).toEqual(lessonsIn('gorshkov').map((lesson) => `/learn/lessons/${lesson.id}`))
    const start = screen.getByRole('link', { name: /^Start/ })
    expect(start).toHaveAttribute('href', ids[0])
    expect(screen.getByText(`0 of ${lessonsIn('gorshkov').length} learned`)).toBeInTheDocument()
  })

  it('continues after the lesson learned last, and says it is learned', async () => {
    const { progressStore } = await renderApp('/learn/fundamentals')
    await screen.findByRole('heading', { level: 1, name: 'Fundamentals' })
    act(() =>
      progressStore.setState({ learned: { 'lesson:finding-home': '2026-10-01T10:00:00Z' } }),
    )
    const go = screen.getByRole('link', { name: /^Continue/ })
    expect(go).toHaveAttribute('href', '/learn/lessons/reading-notes')
    const first = within(screen.getByRole('region', { name: 'Lessons' })).getAllByRole('link')[0]
    expect(within(first ?? document.body).getByRole('img', { name: 'Learned' })).toBeInTheDocument()
  })

  it('leads a method book to its patterns and pieces', async () => {
    await renderApp('/learn/called-to-play-2')
    const link = await screen.findByRole('link', { name: /Patterns and pieces/ })
    expect(link).toHaveAttribute('href', '/practice/accompaniment?show=called-to-play-2')
  })

  it('goes back to Learn’s courses when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/gospel')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.state.location.search).toMatchObject({ view: 'courses' })
  })

  it('is not found for a module there is not', async () => {
    await renderApp('/learn/nothing')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/learn/accompaniment', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1, name: 'Аккомпанемент' })
    expect(untranslated(document.body)).toEqual([])
  })
})
