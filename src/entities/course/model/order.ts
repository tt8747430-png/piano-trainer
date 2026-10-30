/**
 * The courses' own order (content as data, ADR 0116 r25): their ids as Manage courses dragged them,
 * read within each course's shelf. The database keeps it as `catalog` `courses`.
 */
export interface CourseOrder {
  readonly courses: readonly string[]
}

/** The order's id among the catalog's items. */
export const COURSE_ORDER_ID = 'courses'

export const isCourseOrder = (value: unknown): value is CourseOrder =>
  typeof value === 'object' &&
  value !== null &&
  Array.isArray((value as { courses?: unknown }).courses) &&
  (value as { courses: unknown[] }).courses.every((id) => typeof id === 'string')

/**
 * The courses in the order's sequence: the ones it names in its order, each other one after them
 * where it stood (a course made since it was published, one it never named).
 */
export function inCourseOrder<C extends { readonly id: string }>(
  courses: readonly C[],
  order: CourseOrder | undefined,
): readonly C[] {
  if (!order) return courses
  const place = new Map(order.courses.map((id, at) => [id, at]))
  return courses
    .map((course, at) => ({ course, rank: place.get(course.id) ?? order.courses.length + at }))
    .sort((a, b) => a.rank - b.rank)
    .map(({ course }) => course)
}
