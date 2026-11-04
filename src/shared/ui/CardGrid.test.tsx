import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CardGrid } from './CardGrid'

describe('CardGrid (P11)', () => {
  it('fills as many columns as fit a card at its least, never squeezing one', () => {
    const { container } = render(
      <CardGrid min="chord" label="Chords">
        <li>C</li>
      </CardGrid>,
    )
    const grid = container.querySelector('[data-card-grid]')
    expect(grid?.tagName).toBe('UL')
    expect(grid).toHaveAttribute('data-card-grid', 'chord')
    expect(grid?.className).toContain(
      'grid-cols-[repeat(auto-fill,minmax(var(--card-min-chord),1fr))]',
    )
  })
})
