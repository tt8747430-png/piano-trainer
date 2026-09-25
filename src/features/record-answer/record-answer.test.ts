import { describe, expect, it } from 'vitest'
import { createProgressStore, type ProgressStore } from '@/entities/progress'
import { markLearned, unmarkLearned } from '@/features/mark-learned'
import { createMemoryStorage } from '@/shared/lib'
import { qualitiesIn, type SkillId } from '@/shared/lib/music'
import { recordAnswer } from './index'

const NOW = new Date('2026-09-25T10:00:00.000Z')
const LATER = new Date('2026-09-26T10:00:00.000Z')

const setUp = () => createProgressStore({ storage: createMemoryStorage() })
const answer = (store: ProgressStore, skill: SkillId, pattern: string, now = NOW) => {
  for (const c of pattern) recordAnswer(store, { skill, correct: c === '1' }, now)
}

describe('recordAnswer', () => {
  it('keeps the last five answers on a skill', () => {
    const store = setUp()
    answer(store, 'chord:m7', '0111111')
    const saved = store.getState().answers['chord:m7']
    expect(saved).toHaveLength(5)
    expect(saved?.every((a) => a.correct && a.at === NOW.toISOString())).toBe(true)
  })

  it('counts the quiz stats, the streak ending on a wrong answer and the best kept', () => {
    const store = setUp()
    answer(store, 'chord:m7', '1110')
    expect(store.getState().quiz).toEqual({ correct: 3, total: 4, streak: 0, best: 3 })
    answer(store, 'chord:maj', '1')
    expect(store.getState().quiz).toEqual({ correct: 4, total: 5, streak: 1, best: 3 })
  })

  it('marks a scale step learned once its skill is Known', () => {
    const store = setUp()
    answer(store, 'scale:blues', '111')
    expect(store.getState().learned['scale:blues']).toBeUndefined()
    answer(store, 'scale:blues', '1', LATER)
    expect(store.getState().learned['scale:blues']).toBe(LATER.toISOString())
  })

  it('marks a chord family only when its last quality turns Known', () => {
    const store = setUp()
    const [last, ...others] = [...qualitiesIn('six')].reverse()
    for (const quality of others) answer(store, `chord:${quality}`, '1111')
    expect(store.getState().learned['chords:six']).toBeUndefined()
    answer(store, `chord:${last ?? 'six'}`, '111')
    expect(store.getState().learned['chords:six']).toBeUndefined()
    answer(store, `chord:${last ?? 'six'}`, '1', LATER)
    expect(store.getState().learned['chords:six']).toBe(LATER.toISOString())
  })

  it('leaves a step marked by hand with its own date', () => {
    const store = setUp()
    markLearned(store, 'scale:blues', NOW)
    answer(store, 'scale:blues', '1111', LATER)
    expect(store.getState().learned['scale:blues']).toBe(NOW.toISOString())
  })

  it('leaves a step unmarked by hand unmarked until a skill slips and comes back', () => {
    const store = setUp()
    answer(store, 'scale:blues', '1111')
    unmarkLearned(store, 'scale:blues')
    answer(store, 'scale:blues', '111')
    expect(store.getState().learned['scale:blues']).toBeUndefined()
    answer(store, 'scale:blues', '0')
    expect(store.getState().learned['scale:blues']).toBeUndefined()
    answer(store, 'scale:blues', '1', LATER)
    expect(store.getState().learned['scale:blues']).toBe(LATER.toISOString())
  })
})
