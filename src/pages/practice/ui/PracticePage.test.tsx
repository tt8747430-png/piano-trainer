import { act, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { recordAnswer } from '@/features/record-answer'

describe('Practice', () => {
  it('lists its seven places, each a link to one page that says what is inside it', async () => {
    await renderApp('/practice')
    expect(await screen.findByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument()
    const rows = within(screen.getByRole('main')).getAllByRole('link')
    expect(rows.map((row) => [row.textContent, row.getAttribute('href')])).toEqual([
      ['Chords Build · Find · Tensions', '/practice/chords'],
      ['Scales and keys Scale · Chords · Key', '/practice/scales'],
      ['Progressions In any key · Passing chords · Reharmonise', '/practice/progressions'],
      ['Intervals On the keys, up and down', '/practice/intervals'],
      ['Accompaniment Patterns · Studies', '/practice/patterns'],
      ['Exercises Technique · Barry Harris · Piano With Jonny', '/practice/exercises'],
      ['Quiz Chords · Scales and keys · By ear · Reading', '/practice/quiz'],
    ])
  })

  it('has no tabs and no second list: a place is reached one way', async () => {
    await renderApp('/practice')
    await screen.findByRole('heading', { level: 1, name: 'Practice' })
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(within(screen.getByRole('main')).queryByRole('heading', { level: 2 })).toBeNull()
  })

  it('says on the Quiz row how many skills My gaps holds to check', async () => {
    const { progressStore } = await renderApp('/practice')
    const quiz = await screen.findByRole('link', { name: /^Quiz / })
    expect(quiz).not.toHaveTextContent('To check')
    act(() => recordAnswer(progressStore, { skill: 'chord:m7', correct: false }, new Date()))
    expect(screen.getByRole('link', { name: /^Quiz .* To check: 1$/ })).toBeInTheDocument()
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice', { locale: 'ru' })
    expect(await screen.findByRole('link', { name: /^Гаммы и тональности / })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
