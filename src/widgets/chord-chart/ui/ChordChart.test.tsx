import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { pieceById, type Piece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { ChordChart } from './ChordChart'

function piece(id: string) {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')
const performance = arrangePiece(bz5, ownChoice(bz5), BUILT_IN_PATTERNS)

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

  it('goes to a bar as the Player’s chart: the bar playing current, kept in sight (ADR 0098)', async () => {
    const user = userEvent.setup()
    const onBar = vi.fn()
    const scrolled = vi.mocked(Element.prototype.scrollIntoView)
    const props = { performance, headings: ['Verse', 'Chorus'], tap: 'go', onBar } as const
    const { rerender } = render(<ChordChart {...props} playing={0} />)
    const first = screen.getByRole('button', { name: /^Bar 1:/ })
    expect(first).toHaveAttribute('aria-current', 'step')
    expect(first).not.toHaveAttribute('aria-pressed')
    // A pointer's target only, as the sheet's bars are: the arrows move the Player's cursor.
    expect(first).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('button', { name: /^Bar 2:/ })).not.toHaveAttribute('aria-current')
    await user.click(screen.getByRole('button', { name: /^Bar 3:/ }))
    expect(onBar).toHaveBeenCalledWith(2)
    scrolled.mockClear()
    rerender(<ChordChart {...props} playing={9} />)
    const tenth = screen.getByRole('button', { name: /^Bar 10:/ })
    expect(tenth).toHaveAttribute('aria-current', 'step')
    expect(scrolled.mock.contexts).toEqual([tenth])
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
