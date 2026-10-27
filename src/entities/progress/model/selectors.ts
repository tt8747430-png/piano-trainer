import type { PieceId } from '@/entities/piece'
import type { SkillId } from '@/shared/lib/music'
import { CHORD_HOLDS, type ChordLessonKey, type LessonKey } from './lessons'
import { NO_ANSWERS } from './mastery'
import type { Answer, ProgressState, RunKey, TrainerRecord } from './types'
import type { StepId } from '@/entities/step'

export const selectLearned = (state: ProgressState) => state.learned
export const selectDays = (state: ProgressState) => state.days
export const selectPractised = (state: ProgressState) => state.practised
export const selectTrainerRecords = (state: ProgressState) => state.trainers
export const selectLessons = (state: ProgressState) => state.lessons

export const selectAllAnswers = (state: ProgressState) => state.answers

export const selectIsLearned =
  (id: StepId) =>
  (state: ProgressState): boolean =>
    state.learned[id] !== undefined

export const selectAnswers =
  (skill: SkillId) =>
  (state: ProgressState): readonly Answer[] =>
    state.answers[skill] ?? NO_ANSWERS

export const selectTrainerRecord =
  (key: RunKey) =>
  (state: ProgressState): TrainerRecord | undefined =>
    state.trainers[key]

/** The pieces opened in the Player, latest first. A new list each time: memoise it over `practised`. */
export function byLastOpened(practised: ProgressState['practised']): PieceId[] {
  return Object.entries(practised)
    .flatMap(([id, at]) => (at === undefined ? [] : [{ id, at: Date.parse(at) }]))
    .sort((a, b) => b.at - a.at)
    .map(({ id }) => id)
}

/** Whether a song lesson is done (ADR 0100). */
export const selectLessonDone =
  (key: LessonKey) =>
  (state: ProgressState): boolean =>
    state.lessons[key] !== undefined

/** How many of some song lessons are done, a key named twice counted once. */
export function lessonsDone(lessons: ProgressState['lessons'], keys: readonly LessonKey[]): number {
  return new Set(keys.filter((key) => lessons[key] !== undefined)).size
}

/** How many times a chord lesson's chord was held (ADR 0111): CHORD_HOLDS once it is learned. */
export const selectHolds =
  (key: ChordLessonKey) =>
  (state: ProgressState): number =>
    state.lessons[key] !== undefined ? CHORD_HOLDS : (state.holds[key] ?? 0)
