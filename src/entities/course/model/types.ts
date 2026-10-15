import type { PieceId } from '@/entities/piece'
import type { LocalText } from '@/shared/i18n'
import { isOneOf } from '@/shared/lib'
import { CHORD_FAMILIES, SCALE_KINDS, type ChordFamily, type ScaleKind } from '@/shared/lib/music'

/** The curriculum's four stages, beginner to professional (ADR 0051). */
export const STAGES = ['beginner', 'intermediate', 'advanced', 'professional'] as const
export type Stage = (typeof STAGES)[number]
export const isStage = isOneOf(STAGES)

/** A stage's rank, 1 to 4, as a mark of rising pips draws it. */
export const stageRank = (stage: Stage): 1 | 2 | 3 | 4 =>
  (STAGES.indexOf(stage) + 1) as 1 | 2 | 3 | 4

/** One thing a course asks of the learner: a lesson to read, or what to practise. Steps refer to content and never copy it. */
export type Step =
  | { readonly kind: 'lesson'; readonly lessonId: string }
  | { readonly kind: 'piece'; readonly pieceId: PieceId }
  | { readonly kind: 'chords'; readonly family: ChordFamily }
  | { readonly kind: 'scale'; readonly scale: ScaleKind }

/** What a step's learned mark and a check are kept under. */
export type StepId =
  `lesson:${string}` | `piece:${PieceId}` | `chords:${ChordFamily}` | `scale:${ScaleKind}`

/** A step that is practised: a course's after its lessons. */
export type PracticeStep = Exclude<Step, { readonly kind: 'lesson' }>

/**
 * A course of the curriculum: its lessons in the order they are taught (a lesson does not name its
 * course: the course owns the order), then what to practise once they are read.
 */
export interface Course {
  readonly id: string
  readonly stage: Stage
  readonly title: LocalText
  /** What the course teaches, in a sentence. */
  readonly summary: LocalText
  readonly lessons: readonly string[]
  readonly practice: readonly PracticeStep[]
}

/** A piece's step: what its learned mark and its Check are kept under. */
export const pieceStepId = (id: PieceId): StepId => `piece:${id}`

/** A lesson's step: what its learned mark is kept under. */
export const lessonStepId = (id: string): StepId => `lesson:${id}`

export function stepIdOf(step: Step): StepId {
  switch (step.kind) {
    case 'lesson':
      return lessonStepId(step.lessonId)
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

/** Whether a value is written as a step id. A piece's or a lesson's id is only checked for being
 *  there: a saved one may name one a later version removed. */
export function isStepId(value: unknown): value is StepId {
  if (typeof value !== 'string') return false
  const colon = value.indexOf(':')
  if (colon < 0) return false
  const kind = value.slice(0, colon)
  const name = value.slice(colon + 1)
  switch (kind) {
    case 'lesson':
    case 'piece':
      return name !== ''
    case 'chords':
      return isChordFamily(name)
    case 'scale':
      return isScaleKind(name)
    default:
      return false
  }
}
