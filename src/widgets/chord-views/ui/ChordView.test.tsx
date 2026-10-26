import { screen, waitFor, within } from '@testing-library/react'
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
import { stubMatchMedia } from '@/shared/test/match-media'
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
        pinned={false}
        textSize={100}
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

/** A sung line of C and G, then the same two bars twice with no words, then F. */
const sung: ChartPiece = {
  ...piece,
  sections: [{ kind: 'verse', lines: ['C G', 'C G', 'C G', 'F'] }],
  staves: [{ notes: 'E4/4 | D4/4 | r/4 | r/4 | r/4 | r/4 | r/4' }],
  lyrics: ['Good day'],
}
const sungPerformance = arrangePiece(sung, ownChoice(sung), BUILT_IN_PATTERNS, { unfold: true })

/** Chords over lyrics or the Grid of the sung song, the cursor at a bar's first beat. */
function renderView(
  view: 'lyrics' | 'grid',
  {
    bar = 0,
    pinned = true,
    textSize = 100,
    words = true,
  }: { bar?: number; pinned?: boolean; textSize?: 80 | 100 | 130; words?: boolean } = {},
) {
  const group = sungPerformance.beatGroups.findIndex(
    (each) => each.bar === bar && each.tick === bar * 96,
  )
  const practice = {
    state: { ...initialPractice(sungPerformance, 'listen', 'both'), beatGroup: group },
    clock: null,
    jumpToBeatGroup: vi.fn(),
  }
  return renderWithSettings(
    <ServicesProvider services={{ audio: createFakeAudio(), midi: createFakeMidi() }}>
      <ChordView
        view={view}
        mode="animated"
        title="Morning"
        performance={sungPerformance}
        headings={[]}
        practice={practice}
        loop={null}
        words={words}
        pinned={pinned}
        textSize={textSize}
      />
    </ServicesProvider>,
  )
}

describe('Chords over lyrics (ADR 0108)', () => {
  it('pins the song’s chord diagrams under the strip, the one sounding marked', () => {
    renderView('lyrics', { bar: 1 })
    const strip = document.querySelector('[data-slot="beat-strip"]')?.parentElement
    const pinned = within(strip as HTMLElement).getByRole('list', { name: 'Chords' })
    const marked = within(pinned)
      .getAllByRole('button')
      .map((card) => `${card.textContent}${card.getAttribute('aria-current') ? '*' : ''}`)
    expect(marked).toEqual(['C', 'G*', 'F'])
  })

  it('shows no diagrams with the switch off', () => {
    renderView('lyrics', { pinned: false })
    expect(screen.queryByRole('list', { name: 'Chords' })).not.toBeInTheDocument()
  })

  it('sizes the words and their chords together by the text size', () => {
    renderView('lyrics', { textSize: 130 })
    const song = document.querySelector('[data-line="0"]')?.parentElement
    expect(song).toHaveStyle({ fontSize: '130%' })
  })

  it('shows a line of chords alone played again straight after itself once, ×2', () => {
    renderView('lyrics')
    const lines = [...document.querySelectorAll('[data-line]')]
    expect(lines).toHaveLength(3)
    expect(lines[1]).toHaveTextContent(/^CG×2/)
    expect(within(lines[1] as HTMLElement).getByText('Played 2 times')).toBeInTheDocument()
    expect(lines[2]).not.toHaveTextContent('×')
  })

  it('marks the line playing in either copy of a line shown once', () => {
    renderView('lyrics', { bar: 4 })
    expect(document.querySelector('[data-line="1"] button[aria-current]')).toBeInTheDocument()
    expect(document.querySelector('[data-line="1"] [data-sounding]')).toHaveTextContent('C')
  })

  it('shows a chord’s diagram as a pointer rests on it, where the device hovers', async () => {
    stubMatchMedia({ dark: true })
    const user = userEvent.setup()
    renderView('lyrics', { pinned: false })
    const [chip] = within(document.querySelector('[data-line="0"]') as HTMLElement).getAllByRole(
      'button',
      { name: 'C' },
    )
    await user.hover(chip as HTMLElement)
    await waitFor(() =>
      expect(
        within(document.querySelector('[data-slot="tooltip-content"]') as HTMLElement).getByRole(
          'img',
        ),
      ).toHaveAccessibleName(/^C: /),
    )
  })

  it('shows no diagram on a pointer resting where the device does not hover', async () => {
    const user = userEvent.setup()
    renderView('lyrics', { pinned: false })
    const [chip] = within(document.querySelector('[data-line="0"]') as HTMLElement).getAllByRole(
      'button',
      { name: 'C' },
    )
    await user.hover(chip as HTMLElement)
    expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull()
  })
})

describe('the Grid’s words (ADR 0108)', () => {
  it('writes the words under the beats they are sung on with the View’s Lyrics', () => {
    renderView('grid')
    expect(screen.getByRole('button', { name: 'Bar 1: C · Good' })).toBeInTheDocument()
    expect(document.querySelectorAll('[data-verse]')).toHaveLength(2)
  })

  it('writes none with the Lyrics off', () => {
    renderView('grid', { words: false })
    expect(screen.getByRole('button', { name: 'Bar 1: C' })).toBeInTheDocument()
    expect(document.querySelector('[data-verse]')).toBeNull()
  })
})
