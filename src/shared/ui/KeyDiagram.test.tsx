import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { KeyDiagram } from './KeyDiagram'

/** C♯m7 as the Player's right hand holds it: E4 G♯4 B4, its root left to the bass. */
const HAND = [64, 68, 71].map(midi)

/** The keys a diagram draws that match `selector`, lowest first. */
const keysIn = (diagram: Element, selector: string) =>
  [...diagram.querySelectorAll(selector)]
    .map((key) => Number(key.getAttribute('data-midi')))
    .sort((a, b) => a - b)

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i)

describe('KeyDiagram', () => {
  it('is a picture named by its chord and notes', () => {
    render(<KeyDiagram keys={HAND} label="C♯m7: E G♯ B" />)
    expect(screen.getByRole('img', { name: 'C♯m7: E G♯ B' })).toBeInTheDocument()
  })

  it('draws the keys round the chord, from a C or an F to an E or a B', () => {
    render(<KeyDiagram keys={HAND} label="C♯m7" />)
    // C4 to E5: ten white keys and their seven black keys.
    expect(keysIn(screen.getByRole('img'), '[data-midi]')).toEqual(range(60, 76))
  })

  it('marks each key held with a dot, on a white key or a black one, and no other', () => {
    render(<KeyDiagram keys={HAND} label="C♯m7" />)
    const diagram = screen.getByRole('img')
    expect(keysIn(diagram, '[data-held]')).toEqual([64, 68, 71])
    expect(diagram.querySelectorAll('[data-mark="dot"]')).toHaveLength(3)
    expect(diagram.querySelector('[data-midi="68"] [data-mark]')).toHaveClass('fill-on-key-black')
    expect(diagram.querySelector('[data-midi="64"] [data-mark]')).toHaveClass('fill-on-key-white')
  })

  it('rings the lowest key held where the bass is asked for', () => {
    render(<KeyDiagram keys={HAND} label="C♯m7" bass />)
    const diagram = screen.getByRole('img')
    expect(diagram.querySelector('[data-midi="64"] [data-mark]')).toHaveAttribute(
      'data-mark',
      'ring',
    )
    expect(diagram.querySelectorAll('[data-mark="dot"]')).toHaveLength(2)
  })

  it('greys whole when muted: the next chord', () => {
    const { rerender } = render(<KeyDiagram keys={HAND} label="C♯m7" />)
    expect(screen.getByRole('img')).not.toHaveAttribute('data-muted')
    rerender(<KeyDiagram keys={HAND} label="C♯m7" muted />)
    expect(screen.getByRole('img')).toHaveAttribute('data-muted')
  })
})
