import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { recordAnswer } from '@/features/record-answer'
import { recordRun } from '@/features/record-run'

const hrefs = (region: HTMLElement) =>
  within(region)
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'))

describe('Practice → Quiz', () => {
  it('lists every trainer in four groups, by what it asks', async () => {
    await renderApp('/practice/quiz')
    expect(await screen.findByRole('heading', { level: 1, name: 'Quiz' })).toBeInTheDocument()
    expect(hrefs(screen.getByRole('region', { name: 'Chords and intervals' }))).toEqual([
      '/practice/quiz/chords',
      '/practice/quiz/intervals',
      '/practice/quiz/chord-role',
    ])
    expect(hrefs(screen.getByRole('region', { name: 'Scales and keys' }))).toEqual([
      '/practice/quiz/build-scale',
      '/practice/quiz/key-signatures',
      '/practice/quiz/key-degrees',
    ])
    expect(hrefs(screen.getByRole('region', { name: 'By ear' }))).toEqual([
      '/practice/quiz/scales-by-ear',
      '/practice/quiz/progressions-by-ear',
    ])
    expect(hrefs(screen.getByRole('region', { name: 'Reading' }))).toEqual([
      '/practice/quiz/reading-notes',
    ])
  })

  it('says how many runs a trainer has, over all its levels', async () => {
    const { progressStore } = await renderApp('/practice/quiz')
    await screen.findByRole('region', { name: 'Reading' })
    act(() => {
      recordRun(progressStore, 'reading-notes:anchors', { accuracy: 90, streak: 9 })
      recordRun(progressStore, 'reading-notes:treble', { accuracy: 70, streak: 3 })
    })
    expect(
      screen.getByRole('link', {
        name: 'Note reading Read a note on the staff, play it · Runs: 2',
      }),
    ).toBeInTheDocument()
  })

  it('keeps My gaps in its bar, saying how many skills it holds to check', async () => {
    const { progressStore } = await renderApp('/practice/quiz')
    const gaps = await screen.findByRole('link', { name: 'My gaps' })
    expect(gaps).toHaveAttribute('href', '/practice/quiz/gaps')
    act(() => recordAnswer(progressStore, { skill: 'chord:m7', correct: false }, new Date()))
    expect(screen.getByRole('link', { name: 'My gaps To check: 1' })).toBeInTheDocument()
  })

  it('opens from Practice, and a trainer’s Back returns to it', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    await user.click(await screen.findByRole('link', { name: /^Quiz / }))
    await user.click(await screen.findByRole('link', { name: /^Chords Cards/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Chords' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Quiz' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/practice/quiz')
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice/quiz', { locale: 'ru' })
    expect(await screen.findByRole('region', { name: 'На слух' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
