import type { SkillId } from '@/shared/lib/music'
import { dateOfDay, localDay } from './days'
import { ratingOf } from './mastery'
import type { ProgressState } from './types'

/** What the learner has done, counted for their Profile. */
export interface PracticeRecord {
  readonly daysPractised: number
  /** The most days practised in a row, ever kept. */
  readonly bestStreak: number
  readonly stepsLearned: number
  readonly lessonsDone: number
  readonly songsPlayed: number
  /** The skills the quiz rates Known now. */
  readonly skillsKnown: number
}

/** The longest run of days in a row among `days` (oldest first, each once). */
function longestRun(days: readonly string[]): number {
  let best = 0
  let run = 0
  let previous: string | null = null
  for (const day of days) {
    run = previous !== null && localDay(dateOfDay(previous, 1)) === day ? run + 1 : 1
    best = Math.max(best, run)
    previous = day
  }
  return best
}

const count = (record: Readonly<Partial<Record<string, unknown>>>) => Object.keys(record).length

/** The learner's record from their progress. */
export function practiceRecord(state: ProgressState): PracticeRecord {
  return {
    daysPractised: state.days.length,
    bestStreak: longestRun(state.days),
    stepsLearned: count(state.learned),
    lessonsDone: count(state.lessons),
    songsPlayed: count(state.practised),
    skillsKnown: (Object.keys(state.answers) as SkillId[]).filter(
      (skill) => ratingOf(state.answers, skill) === 'known',
    ).length,
  }
}
