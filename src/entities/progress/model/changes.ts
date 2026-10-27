import { CHORD_HOLDS, keptHolds, keptLessons, type ChordLessonKey, type LessonKey } from './lessons'
import { latestEvidence, stepCompletedBy } from './mastery'
import { selectAnswers, selectIsLearned } from './selectors'
import type { ProgressState, QuizAnswer, RunKey, RunResult } from './types'
import type { StepId } from '@/entities/step'

/** The progress with a step or lesson learned on `at` (an ISO date), keeping the day it was first marked. */
export const withLearned = (state: ProgressState, id: StepId, at: string): ProgressState =>
  selectIsLearned(id)(state) ? state : { ...state, learned: { ...state.learned, [id]: at } }

/**
 * The progress after a quiz answer on `at`: evidence on its skill. The
 * answer that makes every skill of a chord or scale step Known marks that step learned, once: a step
 * the learner unmarked stays unmarked until one of its skills slips and comes back.
 */
export function withAnswer(state: ProgressState, answer: QuizAnswer, at: string): ProgressState {
  const evidence = [...selectAnswers(answer.skill)(state), { correct: answer.correct, at }]
  const answered: ProgressState = {
    ...state,
    answers: { ...state.answers, [answer.skill]: latestEvidence(evidence) },
  }
  const completed = stepCompletedBy(state, answered, answer.skill)
  return completed ? withLearned(answered, completed, at) : answered
}

/** The progress after a trainer's run at a level: one run more, its accuracy the last, the bests kept. */
export function withRun(state: ProgressState, key: RunKey, run: RunResult): ProgressState {
  const before = state.trainers[key]
  return {
    ...state,
    trainers: {
      ...state.trainers,
      [key]: {
        runs: (before?.runs ?? 0) + 1,
        last: run.accuracy,
        best: Math.max(before?.best ?? 0, run.accuracy),
        bestStreak: Math.max(before?.bestStreak ?? 0, run.streak),
      },
    },
  }
}

/** The progress with a song lesson done on `at` (an ISO date), keeping the day it was first done. */
export const withLesson = (state: ProgressState, key: LessonKey, at: string): ProgressState =>
  state.lessons[key] !== undefined
    ? state
    : { ...state, lessons: keptLessons({ ...state.lessons, [key]: at }) }

/**
 * The progress after a chord lesson's chord was held on `at` (ADR 0111): one hold more, the chord
 * learned on its CHORD_HOLDS-th, its count then dropped. A chord learned already changes nothing.
 */
export function withHold(state: ProgressState, key: ChordLessonKey, at: string): ProgressState {
  if (state.lessons[key] !== undefined) return state
  const { [key]: before = 0, ...others } = state.holds
  const held = before + 1
  return held >= CHORD_HOLDS
    ? { ...withLesson(state, key, at), holds: others }
    : { ...state, holds: keptHolds({ ...others, [key]: held }) }
}
