import { describe, expect, it } from 'vitest'
import { qualitiesIn, type SkillId } from '@/shared/lib/music'
import { withAnswer, withLearned, withRun } from './changes'
import { EMPTY_PROGRESS, type ProgressState } from './types'

const MONDAY = '2026-09-21T10:00:00.000Z'
const FRIDAY = '2026-09-25T10:00:00.000Z'

/** Answers on a skill from a string, 1 right and 0 wrong, all on `at`. */
const answer = (state: ProgressState, skill: SkillId, pattern: string, at = MONDAY) =>
  [...pattern].reduce((next, c) => withAnswer(next, { skill, correct: c === '1' }, at), state)

describe('withAnswer', () => {
  it('keeps the last five answers on a skill', () => {
    const saved = answer(EMPTY_PROGRESS, 'chord:m7', '0111111').answers['chord:m7']
    expect(saved).toHaveLength(5)
    expect(saved?.every((a) => a.correct && a.at === MONDAY)).toBe(true)
  })

  it('marks a scale step learned once its skill is Known', () => {
    const three = answer(EMPTY_PROGRESS, 'scale:blues', '111')
    expect(three.learned['scale:blues']).toBeUndefined()
    expect(answer(three, 'scale:blues', '1', FRIDAY).learned['scale:blues']).toBe(FRIDAY)
  })

  it('marks a chord family only when its last quality turns Known', () => {
    const [last = 'six', ...others] = [...qualitiesIn('six')].reverse()
    const allButOne = others.reduce(
      (state, quality) => answer(state, `chord:${quality}`, '1111'),
      EMPTY_PROGRESS,
    )
    const almost = answer(allButOne, `chord:${last}`, '111')
    expect(almost.learned['chords:six']).toBeUndefined()
    expect(answer(almost, `chord:${last}`, '1', FRIDAY).learned['chords:six']).toBe(FRIDAY)
  })

  it('leaves a step marked by hand with its own date', () => {
    const marked = withLearned(EMPTY_PROGRESS, 'scale:blues', MONDAY)
    expect(answer(marked, 'scale:blues', '1111', FRIDAY).learned['scale:blues']).toBe(MONDAY)
  })

  it('leaves an unmarked step unmarked until a skill slips and comes back', () => {
    const known = answer(EMPTY_PROGRESS, 'scale:blues', '1111')
    const unmarked: ProgressState = { ...known, learned: {} }
    const stillKnown = answer(unmarked, 'scale:blues', '111')
    expect(stillKnown.learned['scale:blues']).toBeUndefined()
    const slipped = answer(stillKnown, 'scale:blues', '0')
    expect(slipped.learned['scale:blues']).toBeUndefined()
    expect(answer(slipped, 'scale:blues', '1', FRIDAY).learned['scale:blues']).toBe(FRIDAY)
  })
})

describe('withLearned', () => {
  it('marks a step learned on the day', () => {
    expect(withLearned(EMPTY_PROGRESS, 'piece:bz5', MONDAY).learned).toEqual({
      'piece:bz5': MONDAY,
    })
  })

  it('keeps the day a step was first marked, and the same state', () => {
    const marked = withLearned(EMPTY_PROGRESS, 'piece:bz5', MONDAY)
    expect(withLearned(marked, 'piece:bz5', FRIDAY)).toBe(marked)
  })
})

describe('withRun', () => {
  it('counts a run at a level, its accuracy the last, keeping the bests', () => {
    const first = withRun(EMPTY_PROGRESS, 'intervals-by-ear:2', { accuracy: 90, streak: 7 })
    const second = withRun(first, 'intervals-by-ear:2', { accuracy: 60, streak: 3 })
    expect(second.trainers['intervals-by-ear:2']).toEqual({
      runs: 2,
      last: 60,
      best: 90,
      bestStreak: 7,
    })
  })

  it('keeps each level’s record apart', () => {
    const state = withRun(EMPTY_PROGRESS, 'build-chord:1', { accuracy: 100, streak: 10 })
    expect(withRun(state, 'build-chord:2', { accuracy: 50, streak: 2 }).trainers).toEqual({
      'build-chord:1': { runs: 1, last: 100, best: 100, bestStreak: 10 },
      'build-chord:2': { runs: 1, last: 50, best: 50, bestStreak: 2 },
    })
  })
})
