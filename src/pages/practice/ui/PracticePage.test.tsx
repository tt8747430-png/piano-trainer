import { act, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { recordAnswer } from '@/features/record-answer'

describe('Practice', () => {
  it('lists the studies and the progressions, each opening on Practice', async () => {
    await renderApp('/practice')
    expect(await screen.findByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument()
    const studies = screen.getByRole('region', { name: 'Studies' })
    expect(within(studies).getAllByRole('link')[0]?.getAttribute('href')).toMatch(
      /^\/practice\/studies\//,
    )
    const progressions = screen.getByRole('region', { name: 'Progressions' })
    expect(within(progressions).getAllByRole('link')[0]?.getAttribute('href')).toMatch(
      /^\/practice\/progressions\//,
    )
  })

  it('offers the four quizzes, each opening on Practice', async () => {
    await renderApp('/practice')
    const quiz = await screen.findByRole('region', { name: 'Theory quiz' })
    expect(
      within(quiz)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual([
      '/practice/quiz/build-chord',
      '/practice/quiz/name-chord',
      '/practice/quiz/build-scale',
      '/practice/quiz/gaps',
    ])
    expect(within(quiz).getByRole('link', { name: 'My gaps' })).toBeInTheDocument()
  })

  it('says how many gaps My gaps holds', async () => {
    const { progressStore } = await renderApp('/practice')
    await screen.findByRole('region', { name: 'Theory quiz' })
    act(() => recordAnswer(progressStore, { skill: 'chord:m7', correct: false }, new Date()))
    expect(screen.getByRole('link', { name: 'My gaps Gaps: 1' })).toBeInTheDocument()
  })

  it('offers the chromatic walk among the exercises, opening in the Player', async () => {
    await renderApp('/practice')
    const exercises = await screen.findByRole('region', { name: 'Exercises' })
    expect(within(exercises).getByRole('link', { name: 'Chromatic walk' })).toHaveAttribute(
      'href',
      '/play/chromatic',
    )
  })
})
