import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { pieceById } from '@/entities/piece'
import type { LessonKey } from '@/entities/progress'
import { arrangePiece, ownChoice } from '@/features/practice'
import { lessonKeys, sectionLessons } from './section-lessons'
import { nextStep, progressOf, sectionIndex, songProgress } from './song-progress'

const DAY = '2026-10-25T10:00:00.000Z'
const piece = pieceById('bz5')
if (!piece) throw new Error('no bz5')
const performance = arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
const sections = [0, 1, 2].map((section) => sectionLessons(performance, 'bz5', section))
const keysOf = (section: number) => {
  const lessons = sections[section]
  return lessons ? lessonKeys(lessons) : []
}
const done = (...keys: readonly LessonKey[]) =>
  Object.fromEntries(keys.map((key) => [key, DAY])) as Partial<Record<LessonKey, string>>

describe('progressOf', () => {
  it('counts each key once', () => {
    expect(progressOf(['bz5:chord:G', 'bz5:chord:G', 'bz5:chord:C'], done('bz5:chord:G'))).toEqual({
      done: 1,
      total: 2,
    })
  })
})

describe('songProgress', () => {
  it('counts the sections’ lessons together, a chord two sections play once', () => {
    const all = new Set([...keysOf(0), ...keysOf(1), ...keysOf(2)])
    // G is a chord of the verse and of the ending.
    expect(keysOf(0)).toContain('bz5:chord:G')
    expect(keysOf(2)).toContain('bz5:chord:G')
    expect(songProgress(sections, done('bz5:chord:G'))).toEqual({ done: 1, total: all.size })
  })
})

describe('nextStep', () => {
  it('starts at the first section, then goes on to the first with a lesson not done', () => {
    expect(nextStep(sections, {})).toEqual({ kind: 'start', section: 0 })
    expect(nextStep(sections, done('bz5:chord:C'))).toEqual({ kind: 'next', section: 0 })
    expect(nextStep(sections, done(...keysOf(0)))).toEqual({ kind: 'next', section: 1 })
    // The ending's G was learned in the verse: its lesson of one bar is still to do.
    expect(nextStep(sections, done(...keysOf(0), ...keysOf(1)))).toEqual({
      kind: 'next',
      section: 2,
    })
  })

  it('says to play it through once every lesson is done, and nothing where there is none', () => {
    expect(nextStep(sections, done(...keysOf(0), ...keysOf(1), ...keysOf(2)))).toEqual({
      kind: 'done',
    })
    expect(nextStep([null], {})).toBeNull()
  })
})

describe('sectionIndex', () => {
  it('reads a section of the piece, counted from 1', () => {
    expect(sectionIndex(piece, '1')).toBe(0)
    expect(sectionIndex(piece, '3')).toBe(2)
    for (const param of ['0', '4', '01', '1.5', 'verse', '', '-1'])
      expect(sectionIndex(piece, param), param).toBeNull()
  })
})
