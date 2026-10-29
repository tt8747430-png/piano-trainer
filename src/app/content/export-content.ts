import { COURSES } from '@/entities/course'
import { LESSONS, type Lesson } from '@/entities/lesson'
import { PIECES, pieceRecordBody, pieceRecordMeta } from '@/entities/piece'
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

const lessonMeta = (lesson: Lesson) => ({ title: lesson.title })

/** Every body the app carries, as the database keys it: a course's lesson as `<course>/<lesson>`. */
export function bundledBodies(): readonly Omit<ContentRecord, 'version' | 'meta'>[] {
  return [
    ...PIECES.map((piece) => ({
      kind: 'piece' as const,
      id: piece.id,
      body: pieceRecordBody(piece),
    })),
    ...LESSONS.map((lesson) => ({ kind: 'lesson' as const, id: lesson.id, body: lesson })),
    ...COURSES.flatMap((course) =>
      course.lessons.map((lesson) => ({
        kind: 'lesson' as const,
        id: `${course.id}/${lesson.id}`,
        body: lesson,
      })),
    ),
  ]
}

/** The version of each body the app carries, by `<kind> <id>`: what the database's are compared with. */
export function bundledVersions(): ReadonlyMap<string, string> {
  return new Map(
    bundledBodies().map(({ kind, id, body }) => [
      `${kind} ${id}`,
      contentHash(JSON.stringify(body)),
    ]),
  )
}

/**
 * Every built-in piece and lesson as the database's records: the authored files are their source
 * until content is edited in the app (round 6). A course's lesson is `<course>/<lesson>`, its id
 * being unique only in its course.
 */
export function exportContent(): readonly ContentRecord[] {
  return [
    ...PIECES.map((piece) =>
      record('piece', piece.id, pieceRecordMeta(piece), pieceRecordBody(piece)),
    ),
    ...LESSONS.map((lesson) => record('lesson', lesson.id, lessonMeta(lesson), lesson)),
    ...COURSES.flatMap((course) =>
      course.lessons.map((lesson) =>
        record('lesson', `${course.id}/${lesson.id}`, lessonMeta(lesson), lesson),
      ),
    ),
  ]
}
