import { describe, expect, it } from 'vitest'
import type { SkillId } from '@/shared/lib/music'
import { countAnswer, latestEvidence, rate, stepCompletedBy } from './mastery'
import { EMPTY_PROGRESS, type Answer, type ProgressState } from './types'

/** Answers from a string: 1 right, 0 wrong, oldest first. */
const answers = (pattern: string): Answer[] =>
  [...pattern].map((c, i) => ({
    correct: c === '1',
    at: `2026-09-${String(i + 1).padStart(2, '0')}`,
  }))

const withAnswers = (entries: Partial<Record<SkillId, string>>): ProgressState => ({
  ...EMPTY_PROGRESS,
  answers: Object.fromEntries(
    Object.entries(entries).map(([skill, p]) => [skill, answers(p ?? '')]),
  ),
})

describe('rate', () => {
  it.each([
    ['', 'unknown'],
    ['11000', 'gap'],
    ['11110', 'gap'],
    ['01111', 'known'],
    ['11011', 'known'],
    ['11111', 'known'],
    ['1111', 'known'],
    ['111', 'gap'],
    ['0', 'gap'],
    ['011110', 'gap'],
    ['010111', 'known'],
  ])('%j is %s', (pattern, rating) => {
    expect(rate(answers(pattern))).toBe(rating)
  })
})

describe('latestEvidence', () => {
  it('keeps the last five answers', () => {
    expect(latestEvidence(answers('011111'))).toEqual(answers('011111').slice(1))
    expect(latestEvidence(answers('11'))).toEqual(answers('11'))
  })
})

describe('countAnswer', () => {
  const stats = { correct: 3, total: 5, streak: 2, best: 2 }

  it('counts a right answer into the streak and the best', () => {
    expect(countAnswer(stats, true)).toEqual({ correct: 4, total: 6, streak: 3, best: 3 })
  })

  it('ends the streak on a wrong answer and keeps the best', () => {
    expect(countAnswer({ ...stats, best: 7 }, false)).toEqual({
      correct: 3,
      total: 6,
      streak: 0,
      best: 7,
    })
  })
})

describe('stepCompletedBy', () => {
  const allSeventhsKnown = {
    'chord:maj7': '11111',
    'chord:m7': '11111',
    'chord:d7': '11111',
    'chord:hd': '11111',
    'chord:o7': '11111',
    'chord:mM7': '11111',
    'chord:sus7': '11111',
    'chord:M7s11': '11111',
  } as const

  it('names a scale step when its skill turns Known', () => {
    const before = withAnswers({ 'scale:blues': '0111' })
    const after = withAnswers({ 'scale:blues': '01111' })
    expect(stepCompletedBy(before, after, 'scale:blues')).toBe('scale:blues')
  })

  it('names a chord family only when its last quality turns Known', () => {
    const before = withAnswers({ ...allSeventhsKnown, 'chord:M7s5': '111' })
    const after = withAnswers({ ...allSeventhsKnown, 'chord:M7s5': '1111' })
    expect(stepCompletedBy(before, after, 'chord:M7s5')).toBe('chords:sev')
    const stillMissing = withAnswers({ ...allSeventhsKnown, 'chord:M7s5': '1', 'chord:m7': '0' })
    expect(stepCompletedBy(before, stillMissing, 'chord:M7s5')).toBeNull()
  })

  it('names nothing when the family was all Known before', () => {
    const known = withAnswers({ ...allSeventhsKnown, 'chord:M7s5': '11111' })
    expect(stepCompletedBy(known, known, 'chord:M7s5')).toBeNull()
  })

  it('names nothing while a quality stays a gap', () => {
    const before = withAnswers({ 'scale:blues': '000' })
    const after = withAnswers({ 'scale:blues': '0001' })
    expect(stepCompletedBy(before, after, 'scale:blues')).toBeNull()
  })
})
