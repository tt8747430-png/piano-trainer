import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { pieceById } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { ChordChart } from './ChordChart'

function piece(id: string) {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')
const performance = arrangePiece(bz5, ownChoice(bz5))

const strip = (current: number) => (
  <ChordChart
    performance={performance}
    headings={['Verse', 'Chorus']}
    meter={bz5.meter}
    layout="strip"
    current={current}
    onBar={() => {}}
  />
)

describe('ChordChart', () => {
  it('scrolls the strip itself to the current bar, and nothing around it', () => {
    const { rerender } = render(strip(0))
    const row = screen.getByRole('group', { name: 'Chart' })
    // jsdom lays nothing out: give the strip a width to scroll in.
    Object.defineProperties(row, { scrollWidth: { value: 2000 }, clientWidth: { value: 400 } })
    const scrollTo = vi.fn()
    row.scrollTo = scrollTo
    rerender(strip(4))
    expect(scrollTo).toHaveBeenCalledOnce()
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: expect.any(Number) }))
  })
})
