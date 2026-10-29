import { keptContent } from '@/shared/api/content'
import { LESSONS } from '../content'
import { JOURNEYS } from '../content/journeys'
import { updatesJourney, type Chapter, type Journey } from './journey'
import { updatesLesson, type Lesson } from './types'

const BUNDLED_BY_ID: ReadonlyMap<string, Lesson> = new Map(
  LESSONS.map((lesson) => [lesson.id, lesson]),
)

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

const placesOf = (journeys: readonly Journey[]): ReadonlyMap<string, LessonPlace> =>
  new Map(
    journeys.flatMap((journey) => {
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

interface Catalog {
  readonly revision: number
  readonly lessons: ReadonlyMap<string, Lesson>
  readonly journeys: readonly Journey[]
  readonly journeyIndex: ReadonlyMap<string, Journey>
  readonly places: ReadonlyMap<string, LessonPlace>
}

let built: Catalog = {
  revision: -1,
  lessons: BUNDLED_BY_ID,
  journeys: JOURNEYS,
  journeyIndex: new Map(JOURNEYS.map((journey) => [journey.id, journey])),
  places: placesOf(JOURNEYS),
}

/**
 * The Lessons over the kept content (ADR 0116): each journey the database's where its copy reads as
 * the journey (its chapters and their steps in order), else the app's own; each lesson the
 * database's newer copy where it reads as the lesson, else the app's own. A lesson a journey lists
 * with no body on the device (not yet published) is passed over. Built again when the kept content
 * changes.
 */
function catalog(): Catalog {
  const kept = keptContent()
  if (kept.revision === built.revision) return built
  const lessons = new Map(BUNDLED_BY_ID)
  for (const id of BUNDLED_BY_ID.keys()) {
    const body = kept.body('lesson', id)
    if (updatesLesson(id, body)) lessons.set(id, body)
  }
  const readable = (id: string) => {
    if (lessons.has(id)) return true
    const body = kept.body('lesson', id)
    if (!updatesLesson(id, body)) return false
    lessons.set(id, body)
    return true
  }
  const journeys = JOURNEYS.map((journey): Journey => {
    const body = kept.body('journey', journey.id)
    if (!updatesJourney(journey.id, body)) return journey
    return {
      ...body,
      chapters: body.chapters.map((chapter) => ({
        ...chapter,
        steps: chapter.steps.filter((step) => step.kind !== 'lesson' || readable(step.lessonId)),
      })),
    }
  })
  built = {
    revision: kept.revision,
    lessons,
    journeys,
    journeyIndex: new Map(journeys.map((journey) => [journey.id, journey])),
    places: placesOf(journeys),
  }
  return built
}

export const lessonById = (id: string): Lesson | undefined => catalog().lessons.get(id)

/** The four journeys as the learner has them, the database's copies in place. */
export const allJourneys = (): readonly Journey[] => catalog().journeys

export const journeyById = (id: string): Journey | undefined => catalog().journeyIndex.get(id)

/** Every journey lesson's id: what a new lesson's id must not be. */
export const lessonIds = (): readonly string[] => [...catalog().lessons.keys()]

/** A lesson's journey, chapter and number; undefined for a lesson no journey has. */
export const lessonPlace = (lessonId: string): LessonPlace | undefined =>
  catalog().places.get(lessonId)

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
