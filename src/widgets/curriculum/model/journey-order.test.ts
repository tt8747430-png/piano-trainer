import { describe, expect, it } from 'vitest'
import { JOURNEYS } from '@/entities/lesson'
import { rowKey, withOrder } from './journey-order'

const JOURNEY = JOURNEYS[0]!
const [FIRST, SECOND] = JOURNEY.chapters
if (!FIRST || !SECOND) throw new Error('a journey of two chapters at least')
const keys = (chapter: typeof FIRST) => chapter.steps.map((step) => rowKey(chapter, step))
const ORDER = JOURNEY.chapters.map((chapter) => ({ key: chapter.id, rows: keys(chapter) }))

describe('a level put in the order its chapters and steps were dragged into', () => {
  it('keeps the level as it is for the order it has', () => {
    expect(withOrder(JOURNEY, ORDER)).toEqual(JOURNEY)
  })

  it('moves a chapter, its steps with it', () => {
    const [first, second, ...rest] = ORDER
    const moved = withOrder(JOURNEY, [second!, first!, ...rest])
    expect(moved.chapters.slice(0, 2)).toEqual([SECOND, FIRST])
  })

  it('moves a step from one chapter onto another', () => {
    const [step, ...others] = keys(FIRST)
    const order = ORDER.map((group) =>
      group.key === FIRST.id
        ? { ...group, rows: others }
        : group.key === SECOND.id
          ? { ...group, rows: [...group.rows, step!] }
          : group,
    )
    const moved = withOrder(JOURNEY, order)
    expect(moved.chapters[0]?.steps).toEqual(FIRST.steps.slice(1))
    expect(moved.chapters[1]?.steps.at(-1)).toEqual(FIRST.steps[0])
  })
})
