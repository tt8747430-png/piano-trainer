import { describe, expect, it } from 'vitest'
import { achievementsOf } from './achievements'

const record = {
  daysPractised: 3,
  bestStreak: 7,
  stepsLearned: 12,
  lessonsDone: 0,
  songsPlayed: 1,
  skillsKnown: 0,
}

describe('achievementsOf', () => {
  it('earns each badge once its figure reaches its goal, and says how far the rest are', () => {
    const badges = achievementsOf(record)
    expect(badges.map(({ id, earned }) => [id, earned])).toEqual([
      ['firstStep', true],
      ['week', true],
      ['tenSteps', true],
      ['firstSong', true],
      ['month', false],
      ['fiftySteps', false],
      ['tenSongs', false],
      ['tenSkills', false],
    ])
    expect(badges.find(({ id }) => id === 'month')).toMatchObject({ have: 3, goal: 30 })
    expect(badges.find(({ id }) => id === 'week')).toMatchObject({ have: 7, goal: 7 })
  })

  it('earns nothing on the first day', () => {
    const none = achievementsOf({
      daysPractised: 0,
      bestStreak: 0,
      stepsLearned: 0,
      lessonsDone: 0,
      songsPlayed: 0,
      skillsKnown: 0,
    })
    expect(none.every(({ earned }) => !earned)).toBe(true)
  })
})
