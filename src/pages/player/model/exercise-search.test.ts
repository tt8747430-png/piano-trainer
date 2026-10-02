import { describe, expect, it } from 'vitest'
import { ruleExercise } from '@/entities/exercise'
import { note } from '@/shared/lib/music'
import { exercisePatch } from './exercise-search'

const arpeggio = ruleExercise('arpeggio')

describe('exercisePatch', () => {
  it('writes only the choices a change names, the exercise’s own as none', () => {
    expect(exercisePatch(arpeggio, { quality: 'min' })).toEqual({ quality: 'min' })
    expect(exercisePatch(arpeggio, { quality: 'maj', octaves: 3 })).toEqual({
      quality: undefined,
      octaves: 3,
    })
  })

  it('writes a root by its note, none for the exercise’s own however spelled', () => {
    expect(exercisePatch(arpeggio, { root: note('D') })).toEqual({ root: 'D' })
    expect(exercisePatch(arpeggio, { root: note('B', 1) })).toEqual({ root: undefined })
  })
})
