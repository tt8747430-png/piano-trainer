import type { QuizChoice } from '@/entities/settings'
import { chordSkill, qualitiesIn, scaleSkill, type SkillId } from '@/shared/lib/music'
import { isOneOf } from '@/shared/lib'
import type { QuizConfig, QuizMode } from './quiz-machine'

/** The open-ended quizzes Practice offers: the three modes over the chosen skills, and My gaps. */
export const THEORY_QUIZZES = ['build-chord', 'name-chord', 'build-scale', 'gaps'] as const
export type TheoryQuiz = (typeof THEORY_QUIZZES)[number]

/** Whether a value names one of Practice's Theory quizzes. */
export const isTheoryQuiz = isOneOf(THEORY_QUIZZES)

/** The skills a mode asks of the learner's choice: the chosen families' chords, or the chosen scales. */
export const chosenSkills = (mode: QuizMode, choice: QuizChoice): SkillId[] =>
  mode === 'build-scale'
    ? choice.scales.map(scaleSkill)
    : choice.families.flatMap((family) => qualitiesIn(family)).map(chordSkill)

/** What a Theory quiz asks (spec §4.5): the chosen families' chords or scales, or My gaps in order. */
export function theoryQuizConfig(
  quiz: TheoryQuiz,
  choice: QuizChoice,
  gaps: readonly SkillId[],
): QuizConfig {
  switch (quiz) {
    case 'build-scale':
      return { chordMode: 'build-chord', scope: { skills: chosenSkills(quiz, choice) } }
    case 'gaps':
      return { chordMode: 'build-chord', scope: { skills: gaps, ordered: true } }
    case 'build-chord':
    case 'name-chord':
      return { chordMode: quiz, scope: { skills: chosenSkills(quiz, choice) } }
  }
}
