import { createLucideIcon } from 'lucide-react'

/**
 * A lesson, a closed book (the Learn board's `BOOKI`): the mark of a lesson wherever one is opened,
 * listed or made, and of Continue when it leads to one.
 */
export const LessonIcon = createLucideIcon('lesson', [
  ['path', { d: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z', key: 'cover' }],
  ['path', { d: 'M4 21V5', key: 'spine' }],
])
