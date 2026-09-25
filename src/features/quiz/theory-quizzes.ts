import type { QuizChoice } from '@/entities/settings'
import { chordSkill, qualitiesIn, scaleSkill, type SkillId } from '@/shared/lib/music'
import type { QuizConfig } from './quiz-machine'

/** The open-ended quizzes Theory → Quiz offers: the three modes over the chosen skills, and My gaps. */
export const THEORY_QUIZZES = ['build-chord', 'name-chord', 'build-scale', 'gaps'] as const
export type TheoryQuiz = (typeof THEORY_QUIZZES)[number]

/** What a Theory quiz asks (spec §4.5): the chosen families' chords or scales, or My gaps in order. */
export function theoryQuizConfig(
  quiz: TheoryQuiz,
  choice: QuizChoice,
  gaps: readonly SkillId[],
): QuizConfig {
  switch (quiz) {
    case 'build-scale':
      return { chordMode: 'build-chord', scope: { skills: choice.scales.map(scaleSkill) } }
    case 'gaps':
      return { chordMode: 'build-chord', scope: { skills: gaps, ordered: true } }
    case 'build-chord':
    case 'name-chord':
      return {
        chordMode: quiz,
        scope: { skills: choice.families.flatMap((family) => qualitiesIn(family)).map(chordSkill) },
      }
  }
}
