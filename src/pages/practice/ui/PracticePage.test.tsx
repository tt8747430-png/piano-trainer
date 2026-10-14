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

  it('lists the tools under Tools, each saying what it works out', async () => {
    await renderApp('/practice')
    const tools = await screen.findByRole('region', { name: 'Tools' })
    expect(rowsOf(tools)).toEqual([
      ['Chord finder Names a chord, and the keys it is in', '/practice/chord-finder'],
      ['Passing chords The ways from one chord to the next', '/practice/passing-chords'],
      ['Reharmonise The chords that hold a melody note', '/practice/reharmonise'],
      ['Transpose A song’s chords: their key, degrees and any key', '/practice/transpose'],
      ['Free play A live score, marks and a metronome', '/practice/free-play'],
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
    expect(screen.getByRole('region', { name: 'Инструменты' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
