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

/** The groups' headings in the order the page reads. */
const groupOrder = () =>
  screen
    .getAllByRole('heading', { level: 2 })
    .map((heading) => heading.textContent)
    .filter((name) => ['Theory', 'Playing', 'Training', 'Tools'].includes(name ?? ''))

describe('Practice', () => {
  it('says what it is for, then orders its groups by relevance, the tools last (R32)', async () => {
    await renderApp('/practice')
    expect(await screen.findByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument()
    expect(
      screen.getByText('Daily technique, theory and accompaniment, in one place.'),
    ).toBeInTheDocument()
    expect(groupOrder()).toEqual(['Theory', 'Playing', 'Training', 'Tools'])
  })

  it('lists the things shown on the keys under Theory, each with one line', async () => {
    await renderApp('/practice')
    expect(rowsOf(await screen.findByRole('region', { name: 'Theory' }))).toEqual([
      ['Chords Triads to thirteenths, voicings and fingerings', '/practice/chords'],
      ['Scales and keys Scales, modes, harmony and key signatures', '/practice/scales'],
      ['Intervals Every interval, by ear and on the keyboard', '/practice/intervals'],
      ['Progressions Common progressions in every key', '/practice/progressions'],
    ])
  })

  it('lists Accompaniment and the Chord player under Playing, Exercises and the Quiz under Training', async () => {
    await renderApp('/practice')
    expect(rowsOf(await screen.findByRole('region', { name: 'Playing' }))).toEqual([
      ['Accompaniment Left- and right-hand accompaniment patterns', '/practice/accompaniment'],
      ['Chord player Chord charts played by a backing band', '/practice/chord-player'],
    ])
    expect(rowsOf(screen.getByRole('region', { name: 'Training' }))).toEqual([
      ['Exercises Technique, book by book', '/practice/exercises'],
      ['Quiz Chords, keys, intervals and sight-reading', '/practice/quiz'],
    ])
  })

  it('shows each tool as a tile with what it is set to now (R32)', async () => {
    await renderApp('/practice')
    expect(rowsOf(await screen.findByRole('region', { name: 'Tools' }))).toEqual([
      ['Metronome120 BPM · 4/4', '/practice/metronome'],
      ['TunerA4 = 440 Hz', '/practice/tuner'],
      ['Chord finderNames any chord you play', '/practice/chord-finder'],
      ['Circle of fifthsKeys, signatures and related keys', '/practice/circle-of-fifths'],
    ])
  })

  it('starts a new learner with the first exercise and Chords (R32)', async () => {
    await renderApp('/practice')
    const start = await screen.findByRole('region', { name: 'Start here' })
    expect(
      within(start)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Five-finger positionRecommended first step', 'ChordsBuild any chord from its root'])
  })

  it('puts the skills due and the page last opened, however reached, under Up next (R32)', async () => {
    const { router, progressStore } = await renderApp('/practice')
    await screen.findByRole('region', { name: 'Start here' })
    // A page reached by its link, not from Practice's rows, still counts.
    await act(() => router.history.push('/practice/progressions/line?p=I-V-vi-IV&key=C'))
    act(() => recordAnswer(progressStore, { skill: 'chord:m7', correct: false }, new Date()))
    await act(() => router.navigate({ to: '/practice' }))
    const next = await screen.findByRole('region', { name: 'Up next' })
    expect(
      within(next)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Quiz review1 skill due for review', 'ProgressionsLast opened in Practice'])
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
      await screen.findByRole('link', {
        name: 'Тесты Аккорды, тональности, интервалы и чтение с листа',
      }),
    ).toBeInTheDocument()
    for (const group of ['Теория', 'Игра', 'Тренировка', 'Инструменты', 'С чего начать'])
      expect(screen.getByRole('region', { name: group })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
