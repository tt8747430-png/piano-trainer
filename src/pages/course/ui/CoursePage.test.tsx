import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { courseById } from '@/entities/course'

describe('A course', () => {
  it('lists its lessons in order under one way in, its first', async () => {
    await renderApp('/learn/gorshkov')
    expect(await screen.findByRole('heading', { level: 1, name: 'Горшков' })).toBeInTheDocument()
    const lessons = courseById('gorshkov')?.lessons ?? []
    const region = screen.getByRole('region', { name: 'Lessons' })
    const hrefs = within(region)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(lessons.map((id) => `/learn/lessons/${id}`))
    expect(screen.getByRole('link', { name: /^Start/ })).toHaveAttribute('href', hrefs[0])
    expect(screen.getByText(`0 of ${lessons.length + 5} learned`)).toBeInTheDocument()
    expect(screen.getByText('Advanced · 9 lessons')).toBeInTheDocument()
  })

  it('lists what to practise after its lessons: its chords and songs', async () => {
    await renderApp('/learn/gorshkov')
    const practise = await screen.findByRole('region', { name: 'Practise' })
    const links = within(practise).getAllByRole('link')
    expect(links[0]?.getAttribute('href')).toMatch(/^\/practice\/chords\?.*step=chords(%3A|:)nin/)
    expect(links.slice(1).map((link) => link.getAttribute('href'))).toEqual([
      '/songs/romashki',
      '/songs/olen',
      '/songs/wafriend',
      '/songs/metel',
    ])
  })

  it('continues with the first step not learned, and says what is learned', async () => {
    const { progressStore } = await renderApp('/learn/first-steps')
    await screen.findByRole('heading', { level: 1, name: 'First steps at the piano' })
    act(() =>
      progressStore.setState({ learned: { 'lesson:finding-home': '2026-10-01T10:00:00Z' } }),
    )
    expect(screen.getByRole('link', { name: /^Continue/ })).toHaveAttribute(
      'href',
      '/learn/lessons/hands-and-fingers',
    )
    const [first] = within(screen.getByRole('region', { name: 'Lessons' })).getAllByRole('listitem')
    expect(first).toHaveTextContent(/Learned/)
  })

  it('offers a review once every step is learned', async () => {
    const { progressStore } = await renderApp('/learn/gospel')
    await screen.findByRole('heading', { level: 1, name: 'Gospel' })
    const lessons = courseById('gospel')?.lessons ?? []
    act(() =>
      progressStore.setState({
        learned: Object.fromEntries(lessons.map((id) => [`lesson:${id}`, '2026-10-01'])),
      }),
    )
    expect(screen.getByRole('link', { name: /^Review/ })).toHaveAttribute(
      'href',
      `/learn/lessons/${lessons[0]}`,
    )
    expect(screen.getByText('Course complete')).toBeInTheDocument()
  })

  it('leads on to the next course, into the next stage at a stage’s end', async () => {
    await renderApp('/learn/called-to-play')
    const next = await screen.findByRole('region', { name: 'Next course' })
    expect(within(next).getByRole('link')).toHaveAttribute('href', '/learn/accompaniment')
    expect(next).toHaveTextContent('Intermediate · Course 6')
  })

  it('goes back to Learn when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/gospel')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
  })

  it('is not found for a course there is not', async () => {
    await renderApp('/learn/nothing')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/learn/accompaniment', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1, name: 'Аккомпанемент' })
    expect(untranslated(document.body)).toEqual([])
  })
})
