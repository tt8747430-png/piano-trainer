import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Slider } from './slider'

// Base UI shows a thumb once it has measured the track, which jsdom never lays out.
const thumbs = () => screen.getAllByRole('slider', { hidden: true })

describe('Slider', () => {
  it('draws one thumb for one number', () => {
    render(<Slider aria-label="Tempo" value={72} min={40} max={160} />)
    expect(thumbs()).toHaveLength(1)
    expect(thumbs()[0]).toHaveAttribute('aria-valuenow', '72')
  })

  it('draws a thumb per value for a range', () => {
    render(<Slider value={[20, 80]} />)
    expect(thumbs()).toHaveLength(2)
  })
})
