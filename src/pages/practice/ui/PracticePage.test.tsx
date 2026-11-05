import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  it('lists the things shown on the keys under Theory, each with one short line', async () => {
    await renderApp('/practice')
    expect(await screen.findByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument()
    expect(rowsOf(screen.getByRole('region', { name: 'Theory' }))).toEqual([
      ['Chords Triads to 13ths, inversions', '/practice/chords'],
      ['Scales and keys Scales, their chords, keys', '/practice/scales'],
      ['Intervals Every interval on the keys', '/practice/intervals'],
      ['Progressions Known loops in any key', '/practice/progressions'],
    ])
  })

  it('lists the tools first, under Tools (R29 B11)', async () => {
    await renderApp('/practice')
    const tools = await screen.findByRole('region', { name: 'Tools' })
    expect(rowsOf(tools)).toEqual([
      ['Metronome Clicks or drums, any tempo', '/practice/metronome'],
      ['Chord finder Play a chord, see its name', '/practice/chord-finder'],
      ['Circle of fifths Every key, its signature and chords', '/practice/circle-of-fifths'],
      ['Tuner Hear how in tune a note is', '/practice/tuner'],
    ])
  })

  it('lists the Chord player and Accompaniment under Playing', async () => {
    await renderApp('/practice')
    const playing = await screen.findByRole('region', { name: 'Playing' })
    expect(rowsOf(playing)).toEqual([
      ['Chord player A chord sheet played by a band', '/practice/chord-player'],
      ['Accompaniment Patterns for both hands', '/practice/accompaniment'],
    ])
  })

  it('lists Exercises and the Quiz under Training', async () => {
    await renderApp('/practice')
    const training = await screen.findByRole('region', { name: 'Training' })
    expect(rowsOf(training)).toEqual([
      ['Exercises Technique and drills', '/practice/exercises'],
      ['Quiz Chords, keys, ear, reading', '/practice/quiz'],
    ])
  })

  it('keeps the last two pages opened from it under Continue, the latest first (R30-4)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    expect(screen.queryByRole('region', { name: 'Continue' })).not.toBeInTheDocument()
    await user.click(await screen.findByRole('link', { name: /^Tuner/ }))
    await act(() => router.navigate({ to: '/practice' }))
    await user.click(await screen.findByRole('link', { name: /^Chords/ }))
    await act(() => router.navigate({ to: '/practice' }))
    expect(rowsOf(await screen.findByRole('region', { name: 'Continue' }))).toEqual([
      ['Chords Triads to 13ths, inversions', '/practice/chords'],
      ['Tuner Hear how in tune a note is', '/practice/tuner'],
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

  it('reads in Russian', async () => {
    await renderApp('/practice', { locale: 'ru' })
    expect(
      await screen.findByRole('link', { name: 'Тесты Аккорды, тональности, слух, чтение' }),
    ).toBeInTheDocument()
    for (const group of ['Теория', 'Игра', 'Тренировка'])
      expect(screen.getByRole('region', { name: group })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
