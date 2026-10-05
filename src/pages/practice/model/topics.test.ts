import { describe, expect, it } from 'vitest'
import { EXERCISE_GROUPS } from '@/entities/exercise'
import { TRAINER_IDS } from '@/features/trainer'
import { EXPLORERS, PRACTICE_TOPICS, TOPICS } from './topics'

const everywhere = <T>(pick: (topic: (typeof TOPICS)[keyof typeof TOPICS]) => readonly T[]) =>
  PRACTICE_TOPICS.flatMap((topic) => pick(TOPICS[topic]))

describe('Practice topics', () => {
  it('puts every explorer in one topic', () => {
    expect([...everywhere((topic) => topic.explore)].sort()).toEqual([...EXPLORERS].sort())
  })

  it('puts every trainer but My gaps in one topic', () => {
    expect([...everywhere((topic) => topic.quiz)].sort()).toEqual(
      TRAINER_IDS.filter((id) => id !== 'gaps').sort(),
    )
  })

  it('puts every exercise group in one topic', () => {
    expect([...everywhere((topic) => topic.play)].sort()).toEqual([...EXERCISE_GROUPS].sort())
  })

  it('plays the studies and the progressions once each', () => {
    expect(PRACTICE_TOPICS.flatMap((topic) => TOPICS[topic].pieces ?? []).sort()).toEqual([
      'progressions',
      'studies',
    ])
  })

  it('leaves no topic empty', () => {
    for (const topic of PRACTICE_TOPICS) {
      const { explore, quiz, play, pieces } = TOPICS[topic]
      expect(explore.length + quiz.length + play.length + (pieces ? 1 : 0)).toBeGreaterThan(0)
    }
  })
})
