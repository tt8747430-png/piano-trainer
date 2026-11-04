import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderRouted } from '@/app/testing/render-routed'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import type { Question, RunSummary } from '@/features/trainer'
import { i18n } from '@/shared/i18n'
import { note, spellChord } from '@/shared/lib/music'
import { FloatingHost } from '@/shared/ui'
import { RunResults } from './RunResults'

const summary: RunSummary = {
  answered: 4,
  accuracy: 50,
  averageMs: 2500,
  bestStreak: 2,
  missed: [],
  cards: false,
}

const cMajor: Question = {
  mode: 'build-chord',
  root: note('C'),
  quality: 'maj',
  symbol: 'C',
  tones: spellChord(note('C'), 'maj'),
  inversion: null,
}

const dMinor: Question = {
  ...cMajor,
  root: note('D'),
  quality: 'min',
  symbol: 'Dm',
  tones: spellChord(note('D'), 'min'),
}

const renderResults = (summed: RunSummary = summary) =>
  renderWithSettings(
    <RunResults summary={summed} onAgain={vi.fn()} onReview={vi.fn()} onDone={vi.fn()} />,
  )

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

  it('Review the missed ones starts a run of the two missed, each listed once', async () => {
    const onReview = vi.fn()
    await renderRouted(
      <FloatingHost screen="results">
        <RunResults
          summary={{ ...summary, missed: [cMajor, dMinor, cMajor] }}
          onAgain={vi.fn()}
          onReview={onReview}
          onDone={vi.fn()}
        />
      </FloatingHost>,
    )
    expect(
      within(screen.getByRole('region', { name: 'What to review' })).getAllByRole('listitem'),
    ).toHaveLength(2)
    await userEvent.click(screen.getByRole('button', { name: 'Review the missed ones' }))
    expect(onReview).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Again' })).toBeInTheDocument()
  })

  it('a missed chord opens Chords on it', async () => {
    await renderRouted(
      <FloatingHost screen="results">
        <RunResults
          summary={{ ...summary, missed: [dMinor] }}
          onAgain={vi.fn()}
          onReview={vi.fn()}
          onDone={vi.fn()}
        />
      </FloatingHost>,
    )
    const row = screen.getByRole('link', { name: /^Dm · Minor triad/ })
    expect(row.getAttribute('href')).toMatch(/^\/practice\/chords\?/)
    expect(row.getAttribute('href')).toContain('root=D')
    expect(row).toHaveTextContent('Open in Chords')
  })
})
