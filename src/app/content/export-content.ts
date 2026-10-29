import { COURSES } from '@/entities/course'
import { LESSONS, type Lesson } from '@/entities/lesson'
import { PIECES, factsOf, type Piece } from '@/entities/piece'
import { contentHash } from '@/shared/lib'

/** One content item as the database holds it (ADR 0116): what lists show in `meta`, the whole item in `body`. */
export interface ContentRecord {
  readonly kind: 'piece' | 'lesson'
  readonly id: string
  readonly version: string
  readonly meta: Readonly<Record<string, unknown>>
  readonly body: unknown
}

const record = (
  kind: ContentRecord['kind'],
  id: string,
  meta: ContentRecord['meta'],
  body: unknown,
): ContentRecord => ({ kind, id, version: contentHash(JSON.stringify(body)), meta, body })

const pieceMeta = (piece: Piece) => ({
  title: piece.title,
  titleEn: piece.titleEn,
  titleRu: piece.titleRu,
  key: piece.key,
  meter: piece.meter,
  facts: factsOf(piece),
})

const lessonMeta = (lesson: Lesson) => ({ title: lesson.title })

/**
 * Every built-in piece and lesson as the database's records: the authored files are their source
 * until content is edited in the app (round 6). A course's lesson is `<course>/<lesson>`, its id
 * being unique only in its course.
 */
export function exportContent(): readonly ContentRecord[] {
  return [
    ...PIECES.map((piece) => record('piece', piece.id, pieceMeta(piece), piece)),
    ...LESSONS.map((lesson) => record('lesson', lesson.id, lessonMeta(lesson), lesson)),
    ...COURSES.flatMap((course) =>
      course.lessons.map((lesson) =>
        record('lesson', `${course.id}/${lesson.id}`, lessonMeta(lesson), lesson),
      ),
    ),
  ]
}
