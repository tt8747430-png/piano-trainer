import { keptContent } from '@/shared/api/content'
import { LESSONS } from '../content'
import { JOURNEYS } from '../content/journeys'
import type { Chapter, Journey } from './journey'
import { updatesLesson, type Lesson } from './types'

const BUNDLED_BY_ID = new Map(LESSONS.map((lesson) => [lesson.id, lesson]))
let built = { revision: -1, index: BUNDLED_BY_ID as ReadonlyMap<string, Lesson> }
const JOURNEY_BY_ID = new Map(JOURNEYS.map((journey) => [journey.id, journey]))

/**
 * The journey lessons by id: the app's own, each the database has a newer copy of (kept on the
 * device, ADR 0116) in that copy where it reads as the lesson. Built again when the kept content changes.
 */
function lessonIndex(): ReadonlyMap<string, Lesson> {
  const kept = keptContent()
  if (kept.revision === built.revision) return built.index
  const index = new Map(BUNDLED_BY_ID)
  for (const id of BUNDLED_BY_ID.keys()) {
    const body = kept.body('lesson', id)
    if (updatesLesson(id, body)) index.set(id, body)
  }
  built = { revision: kept.revision, index }
  return index
}

export const lessonById = (id: string): Lesson | undefined => lessonIndex().get(id)

export const journeyById = (id: string): Journey | undefined => JOURNEY_BY_ID.get(id)

/** Where a lesson is read: its journey and chapter, and its number in the journey from 1. */
export interface LessonPlace {
  readonly journey: Journey
  readonly chapter: Chapter
  readonly n: number
  readonly total: number
}

const lessonIdsOf = (journey: Journey): string[] =>
  journey.chapters.flatMap((chapter) =>
    chapter.steps.flatMap((step) => (step.kind === 'lesson' ? [step.lessonId] : [])),
  )

const PLACES = new Map(
  JOURNEYS.flatMap((journey) => {
    const ids = lessonIdsOf(journey)
    return journey.chapters.flatMap((chapter) =>
      chapter.steps.flatMap((step): [string, LessonPlace][] =>
        step.kind === 'lesson'
          ? [
              [
                step.lessonId,
                { journey, chapter, n: ids.indexOf(step.lessonId) + 1, total: ids.length },
              ],
            ]
          : [],
      ),
    )
  }),
)

/** A lesson's journey, chapter and number; undefined for a lesson no journey has. */
export const lessonPlace = (lessonId: string): LessonPlace | undefined => PLACES.get(lessonId)

/** The lesson after this one in its journey, into its next chapter; none after the journey's last. */
export function nextLessonId(lessonId: string): string | undefined {
  const place = lessonPlace(lessonId)
  return place ? lessonIdsOf(place.journey)[place.n] : undefined
}

/** The lesson before this one in its journey, back into its chapter before; none before its first. */
export function previousLessonId(lessonId: string): string | undefined {
  const place = lessonPlace(lessonId)
  return place && place.n > 1 ? lessonIdsOf(place.journey)[place.n - 2] : undefined
}
