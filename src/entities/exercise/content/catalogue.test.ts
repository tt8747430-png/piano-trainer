import { describe, expect, it } from 'vitest'
import { note, noteParam } from '@/shared/lib/music'
import { exerciseChoice } from '../model/resolve'
import { EXERCISE_GROUPS, EXERCISE_IDS, isRuleExercise } from '../model/types'
import { EXERCISES } from './catalogue'

describe('the exercises', () => {
  it('names each exercise once', () => {
    const ids = EXERCISES.map((exercise) => exercise.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('writes every rule’s exercise, and only those', () => {
    expect(
      EXERCISES.filter(isRuleExercise)
        .map((exercise) => exercise.id)
        .toSorted(),
    ).toEqual([...EXERCISE_IDS].toSorted())
  })

  it('lists every group in the page’s order, none empty', () => {
    const groups = EXERCISES.map((exercise) => exercise.group)
    expect([...new Set(groups)]).toEqual(EXERCISE_GROUPS)
  })

  it('says each one’s name and what it trains in both languages', () => {
    for (const exercise of EXERCISES) {
      for (const text of [exercise.name, exercise.trains]) {
        expect(text.en.trim(), exercise.id).not.toBe('')
        expect(text.ru.trim(), exercise.id).not.toBe('')
      }
    }
  })

  it('plays each rule its own way when its URL names nothing', () => {
    for (const exercise of EXERCISES.filter(isRuleExercise)) {
      const choice = exerciseChoice(exercise, {})
      for (const [field, value] of Object.entries(exercise.own)) {
        expect(choice[field as keyof typeof choice], `${exercise.id}: ${field}`).toEqual(value)
      }
    }
  })
})

describe('exerciseChoice', () => {
  const [scale] = EXERCISES.filter(isRuleExercise)

  it('takes what the exercise allows and plays its own for the rest', () => {
    if (!scale) throw new Error('No scale')
    const choice = exerciseChoice(scale, { kind: 'dorian', octaves: 3, voicing: 'drop2' })
    expect(choice.kind).toBe('dorian')
    expect(choice.octaves).toBe(3)
    expect(choice.voicing).toBe('close')
  })

  it('spells the root by the exercise’s rule', () => {
    if (!scale) throw new Error('No scale')
    expect(exerciseChoice(scale, { root: noteParam(note('A', 1)), kind: 'major' }).root).toEqual(
      note('B', -1),
    )
  })

  it('starts a run its scale cannot start there on its tonic, fingered its own way', () => {
    if (!scale) throw new Error('No scale')
    const choice = exerciseChoice(scale, { kind: 'pent', start: 6, fingering: 'scale' })
    expect(choice.start).toBe(0)
    expect(exerciseChoice(scale, { kind: 'dorian', start: 2, fingering: 'scale' }).fingering).toBe(
      'scale',
    )
    expect(exerciseChoice(scale, { kind: 'blues', start: 2, fingering: 'scale' }).fingering).toBe(
      'thumb',
    )
  })
})
