import { describe, expect, it } from 'vitest'
import { TRAINER_IDS } from '@/features/trainer'
import { QUIZ_GROUPS, QUIZ_TRAINERS } from './quiz-groups'

describe('the Quiz page’s groups', () => {
  it('put every trainer but My gaps in one group', () => {
    expect(QUIZ_GROUPS.flatMap((group) => QUIZ_TRAINERS[group]).toSorted()).toEqual(
      TRAINER_IDS.filter((id) => id !== 'gaps').toSorted(),
    )
  })

  it('leave no group empty', () => {
    for (const group of QUIZ_GROUPS) expect(QUIZ_TRAINERS[group].length, group).toBeGreaterThan(0)
  })
})
