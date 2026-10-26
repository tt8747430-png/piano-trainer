import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { pieceById, type Piece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { TWO_BARS } from '@/features/practice/testing/performances'
import { ChordChart } from './ChordChart'

function piece(id: string) {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')
const performance = arrangePiece(bz5, ownChoice(bz5), BUILT_IN_PATTERNS)

/** A bar's beat cells as they read: its number in the first, each chord in the beat it starts in. */
const beatsOf = (bar: HTMLElement) =>
  [...bar.querySelectorAll('[data-beat]')].map((cell) => cell.textContent)

describe('ChordChart', () => {
  it('makes every bar a toggle, pressed while it plays, under its section’s heading', () => {
    const props = { performance, headings: ['Verse', 'Chorus'], onBar: () => {} }
    const { rerender } = render(<ChordChart {...props} playing={0} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Verse' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Bar 1:/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /^Bar 2:/ })).toHaveAttribute('aria-pressed', 'false')
    rerender(<ChordChart {...props} playing={null} />)
    expect(screen.getByRole('button', { name: /^Bar 1:/ })).toHaveAttribute('aria-pressed', 'false')
  })

  it('counts each bar in its beats, each chord in the beat it starts in (ADR 0099)', () => {
    render(<ChordChart performance={performance} headings={[]} onBar={() => {}} playing={null} />)
    expect(beatsOf(screen.getByRole('button', { name: 'Bar 1: G' }))).toEqual(['1G', '', '', ''])
    // Named by its chords as it prints them.
    expect(beatsOf(screen.getByRole('button', { name: 'Bar 4: C C/E Dsus4 D/F♯' }))).toEqual([
      '4C',
      'C/E',
      'Dsus4',
      'D/F♯',
    ])
    // No beat sounds on a song's chart.
    expect(document.querySelector('[data-sounding]')).not.toBeInTheDocument()
  })

  it('goes to a beat tapped as the Player’s chart: the beat sounding filled, its bar current', async () => {
    const user = userEvent.setup()
    const onBar = vi.fn()
    const props = { performance, headings: ['Verse', 'Chorus'], tap: 'go', onBar } as const
    const { rerender } = render(<ChordChart {...props} playing={0} beat={2} />)
    const first = screen.getByRole('button', { name: /^Bar 1:/ })
    expect(first).toHaveAttribute('aria-current', 'step')
    expect(first).not.toHaveAttribute('aria-pressed')
    expect(first.querySelector('[data-sounding]')).toHaveAttribute('data-beat', '2')
    // A pointer's target only, as the sheet's bars are: the arrows move the Player's cursor.
    expect(first).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('button', { name: /^Bar 2:/ })).not.toHaveAttribute('aria-current')
    const third = screen.getByRole('button', { name: /^Bar 3:/ })
    const fourthBeat = third.querySelector('[data-beat="3"]')
    if (!fourthBeat) throw new Error('a fourth beat')
    await user.click(fourthBeat)
    // Bar 3's fourth beat: two bars and three beats in.
    expect(onBar).toHaveBeenLastCalledWith(2, 2 * 96 + 72)
    await user.click(third)
    expect(onBar).toHaveBeenLastCalledWith(2, 2 * 96)
    rerender(<ChordChart {...props} playing={9} beat={1} />)
    const tenth = screen.getByRole('button', { name: /^Bar 10:/ })
    expect(tenth).toHaveAttribute('aria-current', 'step')
    expect(tenth.querySelector('[data-sounding]')).toHaveAttribute('data-beat', '1')
    expect(first).not.toHaveAttribute('aria-current')
  })

  it('marks the loop’s bars, every beat on its band', () => {
    render(
      <ChordChart
        tap="go"
        performance={performance}
        headings={[]}
        playing={0}
        beat={0}
        looped={new Set([1, 2])}
        onBar={() => {}}
      />,
    )
    const looped = (name: RegExp) =>
      [...screen.getByRole('button', { name }).querySelectorAll('[data-beat]')].every((cell) =>
        cell.hasAttribute('data-looped'),
      )
    expect([/^Bar 1:/, /^Bar 2:/, /^Bar 3:/, /^Bar 4:/].map(looped)).toEqual([
      false,
      true,
      true,
      false,
    ])
  })

  it('shows music of one section and no heading, a walk’s or a progression’s', () => {
    render(
      <ChordChart tap="go" performance={TWO_BARS} headings={[]} playing={0} onBar={() => {}} />,
    )
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button').map((bar) => bar.getAttribute('aria-label'))).toEqual([
      'Bar 1: C',
      'Bar 2: G',
    ])
  })

  it('shows a bar of no chord as an empty bar, named by its number (ADR 0094)', () => {
    const song: Piece = {
      id: 'my-1',
      kind: 'song',
      title: 'Morning',
      key: 'C',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['C _ G'] }],
    }
    const played = arrangePiece(song, ownChoice(song), BUILT_IN_PATTERNS)
    render(<ChordChart performance={played} headings={['Verse']} onBar={() => {}} playing={null} />)
    expect(
      screen.getAllByRole('button').map((bar) => [bar.getAttribute('aria-label'), bar.textContent]),
    ).toEqual([
      ['Bar 1: C', '1C'],
      ['Bar 2', '2'],
      ['Bar 3: G', '3G'],
    ])
  })
})
