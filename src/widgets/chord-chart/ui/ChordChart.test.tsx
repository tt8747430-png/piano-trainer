import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
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
  it('makes every bar a toggle, pressed while it plays', () => {
    const props = { performance, headings: ['Verse', 'Chorus'], onBar: () => {} }
    const { rerender } = render(<ChordChart {...props} playing={0} />)
    expect(screen.getByRole('button', { name: /^Bar 1:/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /^Bar 2:/ })).toHaveAttribute('aria-pressed', 'false')
    rerender(<ChordChart {...props} playing={null} />)
    expect(screen.getByRole('button', { name: /^Bar 1:/ })).toHaveAttribute('aria-pressed', 'false')
  })
})
