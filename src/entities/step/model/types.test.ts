import { describe, expect, it } from 'vitest'
import { courseLessonStepId, isStepId, lessonStepId, pieceStepId, stepIdOf, stepOf } from './types'

describe('step ids', () => {
  it('name a piece’s step, a journey lesson’s and a course lesson’s', () => {
    expect(pieceStepId('bz5')).toBe('piece:bz5')
    expect(lessonStepId('triads')).toBe('lesson:triads')
    expect(courseLessonStepId('major-scales', 'g-major')).toBe('course:major-scales/g-major')
  })

  it('are derived from the step', () => {
    expect(stepIdOf({ kind: 'piece', pieceId: 'bz5' })).toBe('piece:bz5')
    expect(stepIdOf({ kind: 'chords', family: 'sev' })).toBe('chords:sev')
    expect(stepIdOf({ kind: 'scale', scale: 'harmonic' })).toBe('scale:harmonic')
    expect(stepIdOf({ kind: 'lesson', lessonId: 'triads' })).toBe('lesson:triads')
    expect(stepIdOf({ kind: 'course-lesson', courseId: 'rhythm', lessonId: 'rests' })).toBe(
      'course:rhythm/rests',
    )
  })

  it('read back as the step they name', () => {
    expect(stepOf('course:rhythm/rests')).toEqual({
      kind: 'course-lesson',
      courseId: 'rhythm',
      lessonId: 'rests',
    })
    expect(stepOf('scale:blues')).toEqual({ kind: 'scale', scale: 'blues' })
    expect(stepOf('lesson:triads')).toEqual({ kind: 'lesson', lessonId: 'triads' })
  })

  it.each([
    ['piece:bz5', true],
    ['chords:sev', true],
    ['scale:harmonic', true],
    ['lesson:triads', true],
    ['course:rhythm/rests', true],
    ['course:rhythm', false],
    ['course:rhythm/', false],
    ['course:/rests', false],
    ['course:a/b/c', false],
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
