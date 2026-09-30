import type { SkillId } from '@/shared/lib/music'
import type { QuizConfig } from '../quiz-machine'

/** A random source that plays back fixed values, round and round. */
export const scripted =
  (...values: number[]) =>
  () => {
    const value = values.shift() ?? 0
    values.push(value)
    return value
  }

export const config = (
  skills: SkillId[],
  extra: Partial<QuizConfig['scope']> = {},
  chordMode: QuizConfig['chordMode'] = 'build-chord',
): QuizConfig => ({
  chordMode,
  scope: { skills, ...extra },
})
