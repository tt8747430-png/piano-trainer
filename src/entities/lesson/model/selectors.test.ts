import { describe, expect, it } from 'vitest'
import { lessonById, nextLesson } from './selectors'

describe('nextLesson', () => {
  it('follows a lesson with the next as Learn lists them, into the next module at its end', () => {
    expect(nextLesson('finding-home')?.id).toBe('reading-notes')
    expect(nextLesson('key-signatures')?.module).toBe('accompaniment')
    expect(lessonById('gospel-reharmonisation')).toBeDefined()
    expect(nextLesson('gospel-reharmonisation')).toBeUndefined()
    expect(nextLesson('no-such-lesson')).toBeUndefined()
  })
})
