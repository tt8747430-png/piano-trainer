import { describe, expect, it } from 'vitest'
import { lessonShare } from './progress'

describe('lessonShare', () => {
  it('counts a lesson’s sections read of all it has', () => {
    expect(lessonShare(4, undefined, false)).toBe(0)
    expect(lessonShare(4, [0, 2], false)).toBe(0.5)
  })

  it('fills a learned lesson, and ignores sections it no longer has', () => {
    expect(lessonShare(4, [0], true)).toBe(1)
    expect(lessonShare(2, [0, 1, 5], false)).toBe(1)
    expect(lessonShare(0, [0], false)).toBe(0)
  })
})
