import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { HandCard } from './HandCard'

// Cm(maj13)'s right hand as the Chords page fingers it: E♭ 1, G 2, B 3, D 5.
const NOTES = [
  { key: midi(63), finger: 1 },
  { key: midi(67), finger: 2 },
  { key: midi(71), finger: 3 },
  { key: midi(74), finger: 5 },
] as const

const tipOn = (finger: number) =>
  document.querySelector(`[data-tip="${finger}"]`)?.getAttribute('data-key')

describe('HandCard (R29-P5)', () => {
  it('places each finger that plays over its key, its number on the tip', () => {
    render(<HandCard hand="rh" notes={NOTES} label="Right hand over the keys" />)
    expect(screen.getByRole('img', { name: 'Right hand over the keys' })).toBeInTheDocument()
    expect(tipOn(1)).toBe('63')
    expect(tipOn(5)).toBe('74')
    expect(document.querySelector('[data-tip="1"]')).toHaveTextContent('1')
  })

  it('draws a finger that plays nothing light, and gives it no number', () => {
    render(<HandCard hand="rh" notes={NOTES} label="Right hand" />)
    expect(document.querySelector('[data-finger="4"]')).toHaveAttribute('data-used', 'false')
    expect(document.querySelector('[data-finger="2"]')).toHaveAttribute('data-used', 'true')
    expect(document.querySelector('[data-tip="4"]')).toBeNull()
  })

  it('draws the left hand as the right mirrored: its thumb on the right', () => {
    const x = (finger: number) =>
      Number(
        document.querySelector(`[data-finger="${finger}"] path`)?.getAttribute('d')?.split(' ')[1],
      )
    const { unmount } = render(<HandCard hand="rh" notes={NOTES} label="Right" />)
    expect(x(1)).toBeLessThan(x(5))
    unmount()
    render(
      <HandCard
        hand="lh"
        notes={[
          { key: midi(48), finger: 5 },
          { key: midi(52), finger: 3 },
          { key: midi(55), finger: 1 },
        ]}
        label="Left"
      />,
    )
    expect(x(1)).toBeGreaterThan(x(5))
  })
})
