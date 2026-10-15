import { describe, expect, it } from 'vitest'
import { isStepId, lessonStepId, pieceStepId, stepIdOf } from './types'

describe('step ids', () => {
  it('name a piece’s step and a lesson’s', () => {
    expect(pieceStepId('bz5')).toBe('piece:bz5')
    expect(lessonStepId('triads')).toBe('lesson:triads')
  })

  it('are derived from the step', () => {
    expect(stepIdOf({ kind: 'piece', pieceId: 'bz5' })).toBe('piece:bz5')
    expect(stepIdOf({ kind: 'chords', family: 'sev' })).toBe('chords:sev')
    expect(stepIdOf({ kind: 'scale', scale: 'harmonic' })).toBe('scale:harmonic')
    expect(stepIdOf({ kind: 'lesson', lessonId: 'triads' })).toBe('lesson:triads')
  })

  it.each([
    ['piece:bz5', true],
    ['chords:sev', true],
    ['scale:harmonic', true],
    ['lesson:triads', true],
    ['lesson:', false],
    ['chords:', false],
    ['chords:x', false],
    ['piece:', false],
    ['piece1', false],
    ['scalemajor', false],
    ['scale:constructor', false],
    [3, false],
    [null, false],
  ])('isStepId(%j) is %s', (value, expected) => {
    expect(isStepId(value)).toBe(expected)
  })
})
