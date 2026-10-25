import { describe, expect, it } from 'vitest'
import { fieldClosedBy } from './fields'

describe('the fields over the sheet (ADR 0096)', () => {
  it('opens the chord symbol’s where the View shows the chord symbols, saying so where it does not', () => {
    expect(fieldClosedBy('chord', { chordNames: true })).toBeNull()
    expect(fieldClosedBy('chord', { chordNames: false })).toBe('chordsHidden')
  })
})
