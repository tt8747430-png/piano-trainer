import { FolderInput } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  selectOwnCourses,
  useOwnLessons,
  useOwnLessonsStoreApi,
  type OwnLessonId,
} from '@/entities/own-lessons'
import { setInCourse } from '@/features/manage-own-lessons'
import { RowButton, RowCheck, Sheet, SheetContent } from '@/shared/ui'

/**
 * In courses (canvas 165), a lesson of the learner's Settings row: the courses it is in, named; a tap
 * opens them all, each ticked to put the lesson in or take it out at once. Hidden while the learner
 * has no course.
 */
export function InCoursesRow({ lessonId }: { lessonId: OwnLessonId }) {
  const { t } = useTranslation('learn')
  const store = useOwnLessonsStoreApi()
  const courses = useOwnLessons(selectOwnCourses)
  const [open, setOpen] = useState(false)
  if (courses.length === 0) return null
  const named = courses.filter((course) => course.lessons.includes(lessonId))
  return (
    <>
      <RowButton
        title={t('own.inCourses')}
        icon={FolderInput}
        paint="yellow"
        value={
          named.length > 0 ? named.map((course) => course.title).join(', ') : t('own.noCourses')
        }
        onClick={() => setOpen(true)}
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent title={t('own.inCourses')}>
          <ul className="flex flex-col divide-y divide-hairline overflow-hidden card">
            {courses.map((course) => (
              <li key={course.id}>
                <RowCheck
                  title={course.title}
                  checked={course.lessons.includes(lessonId)}
                  onCheckedChange={(inIt) => setInCourse(store, course.id, lessonId, inIt)}
                />
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  )
}
