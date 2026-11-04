import { noticeOf, type Notice } from '@/entities/notification'
import { badgesOf } from './badges'
import { levelOf, MILESTONES, type ProfileFigures } from './milestones'

/**
 * What the learner crossed between two of their figures (B1), a notice each: a level reached, each
 * badge tier earned, each milestone met, a new longest streak (two days or more), a new best
 * accuracy. Nothing crossed, none.
 */
export function noticesOf(before: ProfileFigures, after: ProfileFigures, at: string): Notice[] {
  const notices: Notice[] = []
  const level = levelOf(after.practiceSeconds)
  if (level > levelOf(before.practiceSeconds)) notices.push(noticeOf('level', String(level), at))
  const was = new Map(badgesOf(before).map((badge) => [badge.id, badge.earned]))
  for (const badge of badgesOf(after))
    for (let tier = (was.get(badge.id) ?? 0) + 1; tier <= badge.earned; tier++)
      notices.push(noticeOf('tier', `${badge.id}:${tier}`, at))
  for (const { id, figure, goal } of MILESTONES)
    if (after[figure] >= goal && before[figure] < goal) notices.push(noticeOf('milestone', id, at))
  if (after.bestStreak > before.bestStreak && after.bestStreak >= 2)
    notices.push(noticeOf('streak', String(after.bestStreak), at))
  if (after.bestAccuracy > before.bestAccuracy)
    notices.push(noticeOf('accuracy', String(after.bestAccuracy), at))
  return notices
}
