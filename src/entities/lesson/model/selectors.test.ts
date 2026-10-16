import { describe, expect, it } from 'vitest'
import { JOURNEYS } from '../content/journeys'
import { lessonPlace, nextLessonId, previousLessonId } from './selectors'

const lessonsOf = (index: number) =>
  JOURNEYS[index]!.chapters.flatMap((chapter) =>
    chapter.steps.flatMap((step) => (step.kind === 'lesson' ? [step.lessonId] : [])),
  )

describe('a lesson’s neighbours in its journey', () => {
  const ids = lessonsOf(0)

  it('go on into the next chapter, and stop at the journey’s ends', () => {
    expect(nextLessonId(ids[0]!)).toBe(ids[1])
    expect(previousLessonId(ids[1]!)).toBe(ids[0])
    expect(previousLessonId(ids[0]!)).toBeUndefined()
    expect(nextLessonId(ids.at(-1)!)).toBeUndefined()
  })

  it('are none for a lesson no journey has', () => {
    expect(lessonPlace('no-such-lesson')).toBeUndefined()
    expect(previousLessonId('no-such-lesson')).toBeUndefined()
    expect(nextLessonId('no-such-lesson')).toBeUndefined()
  })
})
