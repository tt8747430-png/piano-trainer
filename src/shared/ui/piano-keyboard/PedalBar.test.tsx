import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { PedalBar } from './PedalBar'

const UP = { sustain: false, sostenuto: false, soft: false }
const segment = (pedal: string) =>
  document.querySelector(`[data-pedal="${pedal}"]`)?.getAttribute('data-down')

describe('the pedal bar (R29 A26)', () => {
  it('lights and names the sustain while it is down, whoever holds it', () => {
    const { rerender } = renderWithSettings(<PedalBar {...UP} />)
    expect(segment('sustain')).toBe('false')
    rerender(<PedalBar {...UP} sustain />)
    expect(segment('sustain')).toBe('true')
    expect(screen.getByRole('group', { name: 'Pedals' })).toHaveTextContent('Sus.')
  })

  it('shows sostenuto and soft once a MIDI keyboard has pressed them, and keeps them', () => {
    const { rerender } = renderWithSettings(<PedalBar {...UP} />)
    expect(segment('soft')).toBeUndefined()
    rerender(<PedalBar {...UP} soft />)
    expect(segment('soft')).toBe('true')
    rerender(<PedalBar {...UP} />)
    expect(segment('soft')).toBe('false')
    expect(segment('sostenuto')).toBeUndefined()
  })
})
