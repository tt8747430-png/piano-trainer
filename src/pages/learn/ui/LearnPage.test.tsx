import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { lessonsIn } from '@/entities/lesson'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'

describe('Learn', () => {
  it('lists the subjects’ lessons under their modules, each by its title and its level', async () => {
    await renderApp('/learn')
    const fundamentals = await screen.findByRole('region', { name: 'Fundamentals' })
    const lesson = within(fundamentals).getByRole('link', { name: /^How to read chord symbols/ })
    expect(lesson).toHaveAttribute('href', '/learn/lessons/reading-chord-symbols')
    // Its number and its title: the module's heading already says where it belongs.
    expect(lesson).toHaveTextContent(/^\d+\s*How to read chord symbols\s*$/)
    expect(within(lesson).getByRole('img', { name: 'Level 1' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 }).map((each) => each.textContent)).toEqual([
      expect.stringContaining('Fundamentals'),
      expect.stringContaining('Accompaniment'),
      expect.stringContaining('Gospel'),
    ])
  })

  it('has two tabs: the subjects, and the courses, each in its own order', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn')
    const tabs = await screen.findByRole('navigation', { name: 'Lessons' })
    expect(within(tabs).getByRole('link', { name: 'Subjects' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await user.click(within(tabs).getByRole('link', { name: 'Courses' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ tab: 'courses' }))
    expect(
      (await screen.findAllByRole('region')).map((each) => each.getAttribute('aria-label')),
    ).toEqual(['Called to Play', 'Called to Play 2', 'Боброва', 'Горшков'])
  })

  it('folds each module under its heading, the one the learner is at open', async () => {
    await renderApp('/learn?tab=courses')
    const calledToPlay = await screen.findByRole('region', { name: 'Called to Play' })
    const gorshkov = screen.getByRole('region', { name: 'Горшков' })
    expect(within(calledToPlay).getByRole('button', { name: /Called to Play/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(within(gorshkov).getByRole('button', { name: /Горшков/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(within(gorshkov).queryByRole('link')).not.toBeInTheDocument()
    expect(
      within(calledToPlay).getByText(`0 of ${lessonsIn('called-to-play').length} learned`),
    ).toBeInTheDocument()
    expect(within(gorshkov).getByText(/Vasily Gorshkov’s accompaniment course/)).toBeInTheDocument()
  })

  it('ends a course with its patterns and pieces, on its part of Accompaniment', async () => {
    await renderApp('/learn?tab=courses&open=called-to-play.gorshkov')
    // Called to Play is Accompaniment's first part: its URL names none.
    for (const [course, href] of [
      ['Called to Play', '/practice/accompaniment'],
      ['Горшков', '/practice/accompaniment?show=gorshkov'],
    ] as const) {
      const links = within(await screen.findByRole('region', { name: course })).getAllByRole('link')
      expect(links.at(-1)).toHaveTextContent('Patterns and pieces')
      expect(links.at(-1)).toHaveAttribute('href', href)
    }
  })

  it('opens a folded module into the URL, so Back from a lesson finds it open', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn?tab=courses')
    const gorshkov = await screen.findByRole('region', { name: 'Горшков' })
    await user.click(within(gorshkov).getByRole('button', { name: /Горшков/ }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ open: 'called-to-play.gorshkov' }),
    )
    const first = lessonsIn('gorshkov')[0]
    await user.click(
      within(gorshkov).getByRole('link', { name: new RegExp(`^${first?.title.en ?? ''}`) }),
    )
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/learn/lessons/${first?.id ?? ''}`),
    )
    router.history.back()
    const back = await screen.findByRole('region', { name: 'Горшков' })
    expect(within(back).getByRole('button', { name: /Горшков/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('numbers a module’s lessons in the order they are taught', async () => {
    await renderApp('/learn')
    const gospel = await screen.findByRole('region', { name: 'Gospel' })
    expect(
      within(gospel)
        .getAllByRole('link', { hidden: true })
        .map((link) => link.querySelector('[data-slot="row-tile"]')?.textContent),
    ).toEqual(['1', '2', '3'])
  })

  it('heads a tab with the lesson to continue with, once something in it is learned', async () => {
    const { progressStore } = await renderApp('/learn')
    await screen.findByRole('region', { name: 'Fundamentals' })
    expect(screen.queryByRole('region', { name: 'Continue' })).not.toBeInTheDocument()
    act(() =>
      progressStore.setState({ learned: { 'lesson:finding-home': '2026-10-01T10:00:00Z' } }),
    )
    const next = within(await screen.findByRole('region', { name: 'Continue' })).getByRole('link')
    expect(next).toHaveAttribute('href', '/learn/lessons/reading-notes')
  })

  it('holds lessons only: what is explored and practised is on Practice', async () => {
    await renderApp('/learn')
    await screen.findByRole('region', { name: 'Fundamentals' })
    expect(screen.queryByRole('link', { name: 'Chord finder' })).not.toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('reads in Russian, with nothing left in English, on either tab', async () => {
    await renderApp('/learn?tab=courses', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Обучение' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
