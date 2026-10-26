import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, initialPractice, ownChoice } from '@/features/practice'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import type { Performance } from '@/shared/lib/arrangement'
import { ServicesProvider } from '@/shared/lib/services'
import { ChordView } from './ChordView'

/** C, C, G and Am, a bar each of 4/4, as the Player plays them. */
const piece: ChartPiece = {
  id: 'my-1',
  kind: 'song',
  title: 'Morning',
  key: 'C',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['C C G Am'] }],
}
const performance: Performance = arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, {
  unfold: true,
})

/** The beat group starting a bar, as the cursor stands on it. */
const barGroup = (bar: number) =>
  performance.beatGroups.findIndex((group) => group.bar === bar && group.tick === bar * 96)

/** Diagrams in its summary mode, the cursor at a bar's first beat. */
function renderSummary(bar: number) {
  const practice = {
    state: { ...initialPractice(performance, 'listen', 'both'), beatGroup: barGroup(bar) },
    clock: null,
    jumpToBeatGroup: vi.fn(),
  }
  return renderWithSettings(
    <ServicesProvider services={{ audio: createFakeAudio(), midi: createFakeMidi() }}>
      <ChordView
        view="diagrams"
        mode="summary"
        title="Morning"
        performance={performance}
        headings={[]}
        practice={practice}
        loop={null}
        words={false}
      />
    </ServicesProvider>,
  )
}

/** The summary's cards, by their chord's symbol, the one sounding marked `*`. */
const cards = () =>
  within(screen.getByRole('list', { name: 'Chords' }))
    .getAllByRole('button')
    .map(
      (card) =>
        `${card.getAttribute('aria-label') ?? card.textContent}${card.getAttribute('aria-current') ? '*' : ''}`,
    )

describe('Diagrams, its summary (ADR 0101)', () => {
  it('shows the strip, then the song’s chords at once as cards, the one sounding marked', () => {
    renderSummary(0)
    const view = screen.getByRole('region', { name: 'Diagrams' })
    expect(view.querySelector('[data-slot="beat-strip"]')).toBeInTheDocument()
    expect(cards()).toEqual(['C*', 'G', 'Am'])
  })

  it('marks the chord sounding as the music moves on', () => {
    renderSummary(2)
    expect(cards()).toEqual(['C', 'G*', 'Am'])
  })

  it('opens a card’s chord in its sheet', async () => {
    const user = userEvent.setup()
    renderSummary(0)
    await user.click(screen.getByRole('button', { name: /^Am: / }))
    expect(await screen.findByRole('dialog', { name: 'Am chord' })).toBeInTheDocument()
  })
})
