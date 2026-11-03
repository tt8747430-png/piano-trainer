import { describe, expect, it } from 'vitest'

import { BADGES, badgesOf, nextMilestone, type BadgeFigures } from './badges'

const none: BadgeFigures = {
  bestStreak: 0,
  songsLearned: 0,
  lessonsDone: 0,
  scalesLearned: 0,
  daysPractised: 0,
  libraryBuilt: 0,
}

describe('the badges (B1)', () => {
  it('are six, each four tiers, in one table', () => {
    expect(BADGES.map((badge) => badge.id)).toEqual([
      'streak',
      'repertoire',
      'lessons',
      'scales',
      'devotion',
      'library',
    ])
    for (const badge of BADGES) expect(badge.tiers).toHaveLength(4)
  })

  it('earns each tier at its figure, and says what the next needs', () => {
    const repertoire = badgesOf({ ...none, songsLearned: 6 }).find((b) => b.id === 'repertoire')
    expect(repertoire).toMatchObject({ earned: 2, have: 6, next: 15, tier: 'silver' })
    const streak = badgesOf({ ...none, bestStreak: 100 }).find((b) => b.id === 'streak')
    expect(streak).toMatchObject({ earned: 4, tier: 'platinum', next: null })
    const library = badgesOf(none).find((b) => b.id === 'library')
    expect(library).toMatchObject({ earned: 0, tier: null, next: 1 })
  })

  it('picks the nearest unearned tier as the next milestone', () => {
    const next = nextMilestone({ ...none, songsLearned: 13, lessonsDone: 2, bestStreak: 6 })
    // Repertoire is 8 of 10 songs from silver to gold, the streak 3 of 4 days, lessons 1 of 9:
    // repertoire is the furthest along.
    expect(next).toMatchObject({ id: 'repertoire', tier: 'gold', left: 2, goal: 15 })
  })

  it('has no next milestone once every tier is earned', () => {
    const all = {
      bestStreak: 999,
      songsLearned: 999,
      lessonsDone: 999,
      scalesLearned: 99,
      daysPractised: 999,
      libraryBuilt: 999,
    }
    expect(nextMilestone(all)).toBeNull()
  })
})
