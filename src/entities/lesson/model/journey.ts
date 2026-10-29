import { isStage, type Stage, type Step } from '@/entities/step'
import type { LocalText } from '@/shared/i18n'
import { CHORD_FAMILIES, SCALE_KINDS } from '@/shared/lib/music'

/** A node of a journey's chapter: a lesson to read, or a chord family or scale to check on Practice. */
export type JourneyStep = Extract<Step, { readonly kind: 'lesson' | 'chords' | 'scale' }>

/** A journey's chapter: one subject, its lessons in order and then what to check. */
export interface Chapter {
  readonly id: string
  readonly title: LocalText
  readonly steps: readonly JourneyStep[]
}

/**
 * A journey (ADR 0053): the Lessons of one level, beginner to professional, in chapters, as the
 * journey-app lays them out. Its lessons are its own: no course reads or links them.
 */
export interface Journey {
  readonly id: string
  readonly stage: Stage
  readonly title: LocalText
  /** What the journey makes of the learner, in a sentence. */
  readonly goal: LocalText
  readonly chapters: readonly Chapter[]
}

const isText = (value: unknown): value is LocalText => {
  if (typeof value !== 'object' || value === null) return false
  const { en, ru } = value as Partial<LocalText>
  return typeof en === 'string' && typeof ru === 'string'
}

const isId = (value: unknown): value is string => typeof value === 'string' && value.trim() !== ''

/** A step as the database keeps it: a lesson by id, a chord family's or a scale's Check. */
function isJourneyStep(value: unknown): value is JourneyStep {
  if (typeof value !== 'object' || value === null) return false
  const step = value as Partial<Record<string, unknown>>
  switch (step.kind) {
    case 'lesson':
      return isId(step.lessonId)
    case 'chords':
      return CHORD_FAMILIES.some((family) => family === step.family)
    case 'scale':
      return SCALE_KINDS.some((scale) => scale === step.scale)
    default:
      return false
  }
}

function isChapter(value: unknown): value is Chapter {
  if (typeof value !== 'object' || value === null) return false
  const chapter = value as Partial<Chapter>
  return (
    isId(chapter.id) &&
    isText(chapter.title) &&
    Array.isArray(chapter.steps) &&
    chapter.steps.every(isJourneyStep)
  )
}

/**
 * Whether a body from the database reads as the journey `id` (content as data, ADR 0116): its level,
 * title and goal, and its chapters in order, each its steps in order. A journey is kept whole.
 */
export function updatesJourney(id: string, body: unknown): body is Journey {
  if (typeof body !== 'object' || body === null) return false
  const journey = body as Partial<Journey>
  return (
    journey.id === id &&
    isStage(journey.stage) &&
    isText(journey.title) &&
    isText(journey.goal) &&
    Array.isArray(journey.chapters) &&
    journey.chapters.every(isChapter)
  )
}
