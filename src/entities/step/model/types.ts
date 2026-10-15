import type { PieceId } from '@/entities/piece'
import { isOneOf } from '@/shared/lib'
import { CHORD_FAMILIES, SCALE_KINDS, type ChordFamily, type ScaleKind } from '@/shared/lib/music'

/** The four levels, beginner to professional: a journey's, a course's (ADR 0053). */
export const STAGES = ['beginner', 'intermediate', 'advanced', 'professional'] as const
export type Stage = (typeof STAGES)[number]
export const isStage = isOneOf(STAGES)

/** A stage's rank, 1 to 4, as a mark of rising pips draws it. */
export const stageRank = (stage: Stage): 1 | 2 | 3 | 4 =>
  (STAGES.indexOf(stage) + 1) as 1 | 2 | 3 | 4

/**
 * One thing a learner learns and marks learned (ADR 0053): a lesson of the Lessons' journeys, a
 * course's own lesson, a piece, a chord family or a scale. A step names its content and never copies it.
 */
export type Step =
  | { readonly kind: 'lesson'; readonly lessonId: string }
  | { readonly kind: 'course-lesson'; readonly courseId: string; readonly lessonId: string }
  | { readonly kind: 'piece'; readonly pieceId: PieceId }
  | { readonly kind: 'chords'; readonly family: ChordFamily }
  | { readonly kind: 'scale'; readonly scale: ScaleKind }

/** What a step's learned mark and a check are kept under. */
export type StepId =
  | `lesson:${string}`
  | `course:${string}/${string}`
  | `piece:${PieceId}`
  | `chords:${ChordFamily}`
  | `scale:${ScaleKind}`

/** A piece's step: what its learned mark and its Check are kept under. */
export const pieceStepId = (id: PieceId): StepId => `piece:${id}`

/** A journey lesson's step: what its learned mark is kept under. */
export const lessonStepId = (id: string): StepId => `lesson:${id}`

/** A course lesson's step: kept under its course, so two courses never share a mark. */
export const courseLessonStepId = (courseId: string, lessonId: string): StepId =>
  `course:${courseId}/${lessonId}`

export function stepIdOf(step: Step): StepId {
  switch (step.kind) {
    case 'lesson':
      return lessonStepId(step.lessonId)
    case 'course-lesson':
      return courseLessonStepId(step.courseId, step.lessonId)
    case 'piece':
      return pieceStepId(step.pieceId)
    case 'chords':
      return `chords:${step.family}`
    case 'scale':
      return `scale:${step.scale}`
  }
}

const isChordFamily = isOneOf(CHORD_FAMILIES)
const isScaleKind = isOneOf(SCALE_KINDS)

/**
 * The step a step id names; undefined for a value written otherwise. A lesson's, a course's or a
 * piece's id is only checked for being there: a saved one may name one a later version removed.
 */
export function stepOf(value: unknown): Step | undefined {
  if (typeof value !== 'string') return undefined
  const colon = value.indexOf(':')
  if (colon < 0) return undefined
  const kind = value.slice(0, colon)
  const name = value.slice(colon + 1)
  switch (kind) {
    case 'lesson':
      return name === '' ? undefined : { kind: 'lesson', lessonId: name }
    case 'course': {
      const [courseId = '', lessonId = '', ...rest] = name.split('/')
      return courseId === '' || lessonId === '' || rest.length > 0
        ? undefined
        : { kind: 'course-lesson', courseId, lessonId }
    }
    case 'piece':
      return name === '' ? undefined : { kind: 'piece', pieceId: name }
    case 'chords':
      return isChordFamily(name) ? { kind: 'chords', family: name } : undefined
    case 'scale':
      return isScaleKind(name) ? { kind: 'scale', scale: name } : undefined
    default:
      return undefined
  }
}

/** Whether a value is written as a step id. */
export const isStepId = (value: unknown): value is StepId => stepOf(value) !== undefined
