import type { PracticeRecord } from './record'

/** The badges, each a figure of the record and the goal it earns at, in the order they come. */
const BADGES = [
  ['firstStep', 'stepsLearned', 1],
  ['week', 'bestStreak', 7],
  ['tenSteps', 'stepsLearned', 10],
  ['firstSong', 'songsPlayed', 1],
  ['month', 'daysPractised', 30],
  ['fiftySteps', 'stepsLearned', 50],
  ['tenSongs', 'songsPlayed', 10],
  ['tenSkills', 'skillsKnown', 10],
] as const satisfies readonly (readonly [string, keyof PracticeRecord, number])[]

export type AchievementId = (typeof BADGES)[number][0]

/** A badge: earned or not, how much of its figure the learner has and the goal, its figure's name. */
export interface Achievement {
  readonly id: AchievementId
  readonly figure: keyof PracticeRecord
  readonly earned: boolean
  readonly have: number
  readonly goal: number
}

/**
 * The learner's badges (the Profile's, as Noji's and Quizlet's): earned ones first in their order,
 * then the ones still to earn, each with how far along it is (`have` of `goal`, at most the goal).
 */
export function achievementsOf(record: PracticeRecord): readonly Achievement[] {
  const all = BADGES.map(([id, figure, goal]) => ({
    id,
    figure,
    goal,
    have: Math.min(record[figure], goal),
    earned: record[figure] >= goal,
  }))
  return [...all.filter((each) => each.earned), ...all.filter((each) => !each.earned)]
}
