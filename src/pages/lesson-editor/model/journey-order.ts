import type { Chapter, Journey, JourneyStep } from '@/entities/lesson'
import { stepIdOf } from '@/entities/step'
import type { RowOrder } from '@/widgets/content-editor'

/** A step's row key: its chapter's and its own, so a Check asked in two chapters is two rows. */
export const rowKey = (chapter: Chapter, step: JourneyStep) => `${chapter.id}|${stepIdOf(step)}`

/**
 * The journey's chapters in the order they were dragged into, each with the steps dragged into it
 * (from any chapter); a chapter or a step the order does not name is left out.
 */
export function withOrder(journey: Journey, order: RowOrder): Journey {
  const steps = new Map(
    journey.chapters.flatMap((chapter) =>
      chapter.steps.map((step) => [rowKey(chapter, step), step] as const),
    ),
  )
  return {
    ...journey,
    chapters: order.flatMap(({ key, rows }) => {
      const chapter = journey.chapters.find((each) => each.id === key)
      return chapter ? [{ ...chapter, steps: rows.flatMap((row) => steps.get(row) ?? []) }] : []
    }),
  }
}
