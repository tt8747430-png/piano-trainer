import { act, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { recordAnswer } from '@/features/record-answer'

/** A list's rows: what each says, and where it leads. */
const rowsOf = (list: HTMLElement) =>
  within(list)
    .getAllByRole('link')
    .map((row) => [row.textContent, row.getAttribute('href')])

describe('Practice', () => {
  it('lists the things first, under no heading, each saying what is inside it', async () => {
    await renderApp('/practice')
    expect(await screen.findByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument()
    const [things] = within(screen.getByRole('main')).getAllByRole('list')
    expect(rowsOf(things!)).toEqual([
      ['Chords Triads to 13ths · Inversions · Tensions', '/practice/chords'],
      ['Scales and keys Scale · Chords · Key', '/practice/scales'],
      ['Intervals On the keys, up and down', '/practice/intervals'],
      ['Progressions From the library or typed, in any key', '/practice/progressions'],
      [
        'Accompaniment Called to Play · Called to Play 2 · Боброва · Горшков · Styles · Yours',
        '/practice/accompaniment',
      ],
    ])
  })

  it('offers the pages used last first, the latest at the top, none on a first visit', async () => {
    const { router } = await renderApp('/practice')
    await screen.findByRole('heading', { level: 1, name: 'Practice' })
    expect(screen.queryByRole('region', { name: 'Pick up where you left off' })).toBeNull()
    for (const to of ['/practice/scales', '/practice/chord-finder', '/practice'] as const) {
      await act(() => router.navigate({ to }))
    }
    const recent = await screen.findByRole('region', { name: 'Pick up where you left off' })
    expect(rowsOf(recent).map(([, href]) => href)).toEqual([
      '/practice/chord-finder',
      '/practice/scales',
    ])
  })

  it('lists the Chord finder at the keys, a tool of its own', async () => {
    await renderApp('/practice')
    const keys = await screen.findByRole('region', { name: 'At the keys' })
    expect(rowsOf(keys)).toEqual([
      ['Chord finder Any chord named, spelled and written', '/practice/chord-finder'],
    ])
  })

  it('lists Exercises and Quiz under Training, each saying its groups', async () => {
    await renderApp('/practice')
    const training = await screen.findByRole('region', { name: 'Training' })
    expect(rowsOf(training)).toEqual([
      ['Exercises Finger technique · Barry Harris · Piano With Jonny', '/practice/exercises'],
      ['Quiz Chords · Scales and keys · By ear · Reading', '/practice/quiz'],
    ])
  })

  it('has no tabs: a page is reached one way', async () => {
    await renderApp('/practice')
    await screen.findByRole('heading', { level: 1, name: 'Practice' })
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })

  it('says on the Quiz row how many skills My gaps holds to check', async () => {
    const { progressStore } = await renderApp('/practice')
    const quiz = await screen.findByRole('link', { name: /^Quiz / })
    expect(quiz).not.toHaveTextContent('To check')
    act(() => recordAnswer(progressStore, { skill: 'chord:m7', correct: false }, new Date()))
    expect(screen.getByRole('link', { name: /^Quiz .* To check: 1$/ })).toBeInTheDocument()
  })

  it('reads in Russian, a row’s line in the words its page uses', async () => {
    await renderApp('/practice', { locale: 'ru' })
    expect(
      await screen.findByRole('link', {
        name: 'Тесты Аккорды · Гаммы и тональности · На слух · Чтение',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'За клавиатурой' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
