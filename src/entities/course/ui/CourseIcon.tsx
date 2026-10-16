import { BookOpen } from 'lucide-react'
import type { ComponentProps } from 'react'
import { COURSE_ICON } from './course-look'

/** A course's icon, drawn: its card's, its page's. */
export function CourseIcon({
  courseId,
  ...props
}: { courseId: string } & Omit<ComponentProps<'svg'>, 'ref'>) {
  const Icon = COURSE_ICON[courseId] ?? BookOpen
  return <Icon aria-hidden {...props} />
}
