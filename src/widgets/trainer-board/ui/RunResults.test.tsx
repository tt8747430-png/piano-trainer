import { act, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import type { RunSummary } from '@/features/trainer'
import { i18n } from '@/shared/i18n'
import { RunResults } from './RunResults'

const summary: RunSummary = {
  answered: 4,
  accuracy: 50,
  averageMs: 2500,
  bestStreak: 2,
  missed: [],
  cards: false,
}

const renderResults = (summed: RunSummary = summary) =>
  renderWithSettings(<RunResults summary={summed} onAgain={vi.fn()} onDone={vi.fn()} />)

describe('RunResults', () => {
  it('writes the average time and the share right in English', () => {
    renderResults()
    expect(screen.getByText('2.5 s')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('writes them the Russian way: a decimal comma, a spaced percent', () => {
    act(() => void i18n.changeLanguage('ru'))
    renderResults()
    expect(screen.getByText('2,5 с')).toBeInTheDocument()
    expect(screen.getByText('50 %')).toBeInTheDocument()
  })

  it('sums up a run of cards by how many and how long, with no score or misses', () => {
    renderResults({ ...summary, accuracy: 100, cards: true })
    expect(screen.getByText('Cards')).toBeInTheDocument()
    expect(screen.queryByText('100%')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Missed' })).not.toBeInTheDocument()
  })
})
