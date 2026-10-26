import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import type { LessonKey } from '@/entities/progress'
import { progressOf, sectionIndex } from './song-progress'

const DAY = '2026-10-25T10:00:00.000Z'
const piece = pieceById('bz5')
if (!piece) throw new Error('no bz5')
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

describe('sectionIndex', () => {
  it('reads a section of the piece, counted from 1', () => {
    expect(sectionIndex(piece, '1')).toBe(0)
    expect(sectionIndex(piece, '3')).toBe(2)
    for (const param of ['0', '4', '01', '1.5', 'verse', '', '-1'])
      expect(sectionIndex(piece, param), param).toBeNull()
  })
})
