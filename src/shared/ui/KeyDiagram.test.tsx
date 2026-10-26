import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { KeyDiagram } from './KeyDiagram'

/** C♯m7 folded as Chordify draws it: G♯3 B3 C♯4 E4. */
const KEYS = [56, 59, 61, 64].map(midi)
/** F3 to B4: eleven white keys. */
const RANGE = { from: midi(53), to: midi(71) }

/** The keys a diagram draws that match `selector`, lowest first. */
const keysIn = (diagram: Element, selector: string) =>
  [...diagram.querySelectorAll(selector)]
    .map((key) => Number(key.getAttribute('data-midi')))
    .sort((a, b) => a - b)

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i)

describe('KeyDiagram', () => {
  it('is a picture named by its chord and notes', () => {
    render(<KeyDiagram keys={KEYS} range={RANGE} label="C♯m7: G# B C# E" />)
    expect(screen.getByRole('img', { name: 'C♯m7: G# B C# E' })).toBeInTheDocument()
  })

  it('draws the keys its caller gives, whatever the chord', () => {
    const { rerender } = render(<KeyDiagram keys={KEYS} range={RANGE} label="C♯m7" />)
    expect(keysIn(screen.getByRole('img'), '[data-midi]')).toEqual(range(53, 71))
    rerender(<KeyDiagram keys={KEYS} range={{ from: midi(48), to: midi(76) }} label="C♯m7" />)
    expect(keysIn(screen.getByRole('img'), '[data-midi]')).toEqual(range(48, 76))
  })

  it('marks each key held with a dot, dark on a white key and light on a black one', () => {
    render(<KeyDiagram keys={KEYS} range={RANGE} label="C♯m7" />)
    const diagram = screen.getByRole('img')
    expect(keysIn(diagram, '[data-held]')).toEqual([56, 59, 61, 64])
    expect(diagram.querySelectorAll('[data-mark="dot"]')).toHaveLength(4)
    expect(diagram.querySelector('[data-midi="56"] [data-mark]')).toHaveClass('fill-on-key-black')
    expect(diagram.querySelector('[data-midi="59"] [data-mark]')).toHaveClass('fill-on-key-white')
  })

  it('rings the key it is asked to: a bass the chord has not', () => {
    render(
      <KeyDiagram keys={[58, 60, 64, 67].map(midi)} ring={midi(58)} range={RANGE} label="C/B♭" />,
    )
    const diagram = screen.getByRole('img')
    expect(diagram.querySelector('[data-midi="58"] [data-mark]')).toHaveAttribute(
      'data-mark',
      'ring',
    )
    expect(diagram.querySelectorAll('[data-mark="dot"]')).toHaveLength(3)
  })

  it('greys whole when muted: the next chord', () => {
    const { rerender } = render(<KeyDiagram keys={KEYS} range={RANGE} label="C♯m7" />)
    expect(screen.getByRole('img')).not.toHaveAttribute('data-muted')
    rerender(<KeyDiagram keys={KEYS} range={RANGE} label="C♯m7" muted />)
    expect(screen.getByRole('img')).toHaveAttribute('data-muted')
  })
})
