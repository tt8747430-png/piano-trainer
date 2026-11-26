import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'

/** A group's rows, as its list on a phone holds them: where each leads. */
const rowsOf = (group: HTMLElement) => {
  const [list] = within(group).getAllByRole('list')
  if (!list) throw new Error('a list of rows')
  return within(list)
    .getAllByRole('link')
    .map((row) => row.getAttribute('href'))
}

/** A group's section, by the heading that folds it. */
const group = (name: string) => {
  const section = screen.getByRole('button', { name }).closest('section')
  if (!section) throw new Error(`the ${name} section`)
  return section
}

/** The groups' headings in the order the page reads. */
const groupOrder = () =>
  screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)

describe('Practice', () => {
  it('orders its groups by relevance, the tools last (R32)', async () => {
    await renderApp('/practice')
    expect(await screen.findByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument()
    expect(groupOrder()).toEqual(['Theory', 'Exercises', 'Tools'])
  })

  it('lists the things shown on the keys under Theory, each with one line', async () => {
    await renderApp('/practice')
    await screen.findByRole('heading', { level: 1, name: 'Practice' })
    const theory = group('Theory')
    expect(rowsOf(theory)).toEqual([
      '/practice/chords',
      '/practice/scales',
      '/practice/intervals',
      '/practice/progressions',
      '/practice/accompaniment',
    ])
    const [list] = within(theory).getAllByRole('list')
    expect(list).toHaveTextContent('Chords Chord types, voicings, inversions')
    expect(list).toHaveTextContent('Scales and keys Scales, fingerings, key signatures')
  })

  it('lists the exercises by shelf, each with how many it holds', async () => {
    await renderApp('/practice')
    await screen.findByRole('heading', { level: 1, name: 'Practice' })
    const exercises = group('Exercises')
    expect(rowsOf(exercises)).toEqual(['/practice/exercises', '/practice/exercises?book=jazz'])
    const [list] = within(exercises).getAllByRole('list')
    expect(list).toHaveTextContent('Finger technique 2 exercises')
    expect(list).toHaveTextContent('Jazz vocabulary 10 exercises')
  })

  it('shows each tool with what it is set to now, the Chord player first (R32)', async () => {
    await renderApp('/practice')
    await screen.findByRole('heading', { level: 1, name: 'Practice' })
    const tools = group('Tools')
    expect(rowsOf(tools)).toEqual([
      '/practice/chord-player',
      '/practice/metronome',
      '/practice/tuner',
      '/practice/chord-finder',
      '/practice/circle-of-fifths',
    ])
    const [list] = within(tools).getAllByRole('list')
    expect(list).toHaveTextContent('Metronome 120 BPM · 4/4')
    expect(list).toHaveTextContent('Tuner A4 = 440 Hz')
  })

  it('folds a group under its heading, and opens it again', async () => {
    const user = userEvent.setup()
    await renderApp('/practice')
    await screen.findByRole('heading', { level: 1, name: 'Practice' })
    const heading = screen.getByRole('button', { name: 'Tools' })
    expect(heading).toHaveAttribute('aria-expanded', 'true')
    await user.click(heading)
    expect(heading).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: /^Metronome/ })).not.toBeInTheDocument()
    await user.click(heading)
    expect(screen.getAllByRole('link', { name: /^Metronome/ }).length).toBeGreaterThan(0)
  })

  it('has no tabs: a page is reached one way', async () => {
    await renderApp('/practice')
    await screen.findByRole('heading', { level: 1, name: 'Practice' })
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })

  it('reads in Russian', async () => {
    await renderApp('/practice', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Практика' })).toBeInTheDocument()
    expect(groupOrder()).toEqual(['Теория', 'Упражнения', 'Инструменты'])
    expect(untranslated(document.body)).toEqual([])
  })
})
