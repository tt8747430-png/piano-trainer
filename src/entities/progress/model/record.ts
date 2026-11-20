import { isSkillId } from '@/shared/lib/music'
import { streakOf } from './days'
import { ratingOf } from './mastery'
import { practiceSeconds } from './time'
import type { ProgressState } from './types'

/** What the learner has done, counted for their Profile. */
export interface PracticeRecord {
  readonly daysPractised: number
  /** The most days practised in a row, ever kept. */
  readonly bestStreak: number
  readonly stepsLearned: number
  readonly lessonsDone: number
  readonly songsPlayed: number
  /** The pieces marked Learned. */
  readonly songsLearned: number
  /** The seconds played, over the days kept. */
  readonly practiceSeconds: number
  /** The skills the quiz rates Known now. */
  readonly skillsKnown: number
}

const count = (record: Readonly<Partial<Record<string, unknown>>>) => Object.keys(record).length

/** The learner's record from their progress. */
export function practiceRecord(state: ProgressState): PracticeRecord {
  return {
    daysPractised: state.days.length,
    bestStreak: streakOf(state.days, state.days.at(-1) ?? '').best,
    stepsLearned: count(state.learned),
    lessonsDone: count(state.lessons),
    songsPlayed: count(state.practised),
    songsLearned: Object.keys(state.learned).filter((step) => step.startsWith('piece:')).length,
    practiceSeconds: practiceSeconds(state),
    skillsKnown: Object.keys(state.answers)
      .filter(isSkillId)
      .filter((skill) => ratingOf(state.answers, skill) === 'known').length,
  }
}
