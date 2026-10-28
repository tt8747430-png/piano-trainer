import type { SkillId } from '@/shared/lib/music'
import type { Asks } from '../draw'
import type { Question } from '../round-machine'

/** A random source that plays back fixed values, round and round. */
export const scripted =
  (...values: number[]) =>
  () => {
    const value = values.shift() ?? 0
    values.push(value)
    return value
  }

/** Skills on any root, as My gaps and the Check ask them. */
export const skillAsks = (
  skills: SkillId[],
  extra: Partial<Omit<Extract<Asks, { kind: 'skills' }>, 'kind' | 'skills'>> = {},
): Asks => ({ kind: 'skills', skills, ...extra })

/** The skill a round answers on, if it rates one. */
export const skillAsked = (question: Question): SkillId | undefined =>
  'skill' in question ? question.skill : undefined
