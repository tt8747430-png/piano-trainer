import { describe, expect, it } from 'vitest'
import { isStepId, pieceStepId, stepIdOf } from './types'

describe('step ids', () => {
  it('name a piece’s step', () => {
    expect(pieceStepId('bz5')).toBe('piece:bz5')
  })

  it('are derived from the step', () => {
    expect(stepIdOf({ kind: 'piece', pieceId: 'bz5' })).toBe('piece:bz5')
    expect(stepIdOf({ kind: 'chords', family: 'sev' })).toBe('chords:sev')
    expect(stepIdOf({ kind: 'scale', scale: 'harmonic' })).toBe('scale:harmonic')
  })

  it.each([
    ['piece:bz5', true],
    ['chords:sev', true],
    ['scale:harmonic', true],
    ['lesson:1', false],
    ['chords:', false],
    ['chords:x', false],
    ['piece:', false],
    ['scale:constructor', false],
    [3, false],
    [null, false],
  ])('isStepId(%j) is %s', (value, expected) => {
    expect(isStepId(value)).toBe(expected)
  })
})
