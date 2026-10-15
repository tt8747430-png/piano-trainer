import { describe, expect, it } from 'vitest'
import { LESSONS } from '@/entities/lesson'
import { COLLECTIONS, PIECES, entryById, isPiece } from '@/entities/piece'
import { CHORD_FAMILIES, SCALE_KINDS } from '@/shared/lib/music'
import { coursesIn, curriculumSteps } from '../model/selectors'
import { STAGES } from '../model/types'
import { COURSE_ICON_IDS } from '../ui/course-look'
import { COURSES } from './courses'

const steps = curriculumSteps()

describe('the curriculum', () => {
  it('teaches every lesson in exactly one course, and names only lessons there are', () => {
    const taught = COURSES.flatMap((course) => course.lessons)
    expect([...taught].sort()).toEqual(LESSONS.map((lesson) => lesson.id).sort())
  })

  it('names only pieces that exist, never a listing', () => {
    for (const { step } of steps) {
      if (step.kind !== 'piece') continue
      const entry = entryById(step.pieceId)
      expect(entry, step.pieceId).toBeDefined()
      expect(entry && isPiece(entry), step.pieceId).toBe(true)
    }
  })

  it('practises every piece exactly once', () => {
    const pieceIds = steps.flatMap(({ step }) => (step.kind === 'piece' ? [step.pieceId] : []))
    expect([...pieceIds].sort()).toEqual(PIECES.map((piece) => piece.id).sort())
    const listings = COLLECTIONS.flatMap((c) => c.entries).filter((entry) => !isPiece(entry))
    for (const listing of listings) expect(pieceIds).not.toContain(listing.id)
  })

  it('practises every chord family and scale kind', () => {
    const families = steps.flatMap(({ step }) => (step.kind === 'chords' ? [step.family] : []))
    const scales = steps.flatMap(({ step }) => (step.kind === 'scale' ? [step.scale] : []))
    expect([...families].sort()).toEqual([...CHORD_FAMILIES].sort())
    expect([...scales].sort()).toEqual([...SCALE_KINDS].sort())
  })

  it('runs beginner to professional: every stage has courses, listed in stage order', () => {
    for (const stage of STAGES) expect(coursesIn(stage).length, stage).toBeGreaterThan(0)
    expect(COURSES.map((course) => course.stage)).toEqual(
      STAGES.flatMap((stage) => coursesIn(stage).map(() => stage)),
    )
  })

  it('gives every course lessons, an id of its own and an icon', () => {
    const ids = COURSES.map((course) => course.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect([...COURSE_ICON_IDS].sort()).toEqual([...ids].sort())
    for (const course of COURSES) expect(course.lessons.length, course.id).toBeGreaterThan(0)
  })

  it('gives each step one id', () => {
    const ids = steps.map(({ id }) => id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
