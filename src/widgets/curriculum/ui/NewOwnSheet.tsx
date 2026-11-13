import { useNavigate } from '@tanstack/react-router'
import { BookOpenText, Library } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FolderLook } from '@/entities/library'
import {
  OWN_COURSE_LOOK,
  OWN_NAME_MAX,
  selectOwnCourses,
  useOwnLessons,
  useOwnLessonsStoreApi,
  type OwnCourseId,
} from '@/entities/own-lessons'
import { LookFields } from '@/features/manage-library'
import {
  createOwnCourse,
  createOwnLesson,
  saveOwnCourse,
  setInCourse,
} from '@/features/manage-own-lessons'
import { ChoiceChips, NewSheet, SheetPart, type MenuAction } from '@/shared/ui'

/** What the learner makes: a lesson or a course of their own. */
export type OwnKind = 'lesson' | 'course'
const NO_COURSE = 'none'

/**
 * New's two (canvas 167): New lesson and New course, for the phone's dial and the menus of Learn's row
 * and the laptop's New; each opens its own sheet.
 */
export function useNewOwnActions(onPick: (kind: OwnKind) => void): readonly MenuAction[] {
  const { t } = useTranslation('learn')
  return [
    {
      key: 'lesson',
      label: t('own.newLesson'),
      icon: BookOpenText,
      onSelect: () => onPick('lesson'),
    },
    { key: 'course', label: t('own.newCourse'), icon: Library, onSelect: () => onPick('course') },
  ]
}

/**
 * New lesson or New course (canvas 167), as Flat's New score: its name, then the one thing it needs,
 * the course a lesson goes in or a course's cover; Create opens what was made in its editor. Open
 * while `kind` is set.
 */
export function NewOwnSheet({ kind, onClose }: { kind: OwnKind | null; onClose: () => void }) {
  const { t } = useTranslation('learn')
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const courses = useOwnLessons(selectOwnCourses)
  const [name, setName] = useState('')
  const [into, setInto] = useState<OwnCourseId | typeof NO_COURSE>(NO_COURSE)
  const [look, setLook] = useState<FolderLook>(OWN_COURSE_LOOK)
  const [failed, setFailed] = useState(false)
  const close = (next: boolean) => {
    if (next) return
    onClose()
    setName('')
    setInto(NO_COURSE)
    setLook(OWN_COURSE_LOOK)
    setFailed(false)
  }
  const create = () => {
    if (kind === 'lesson') {
      const made = createOwnLesson(store, name)
      if (!made) return setFailed(true)
      if (into !== NO_COURSE) setInCourse(store, into, made, true)
      close(false)
      void navigate({ to: '/lessons/$lessonId/edit', params: { lessonId: made } })
      return
    }
    const made = createOwnCourse(store, name)
    if (!made) return setFailed(true)
    const course = store.getState().courses.find((each) => each.id === made)
    if (course) saveOwnCourse(store, { ...course, look })
    close(false)
    void navigate({ to: '/courses/$courseId/edit', params: { courseId: made } })
  }
  return (
    <NewSheet
      open={kind !== null}
      onOpenChange={close}
      title={kind === 'course' ? t('own.newCourse') : t('own.newLesson')}
      nameLabel={t('edit.order.name')}
      name={name}
      onName={setName}
      maxLength={OWN_NAME_MAX}
      createLabel={kind === 'lesson' ? t('own.createLesson') : t('own.createCourse')}
      failed={failed ? t('own.lessonFailed') : null}
      onCreate={create}
    >
      {kind === 'lesson' && courses.length > 0 ? (
        <SheetPart title={t('own.inCourse')}>
          <ChoiceChips<OwnCourseId | typeof NO_COURSE>
            label={t('own.inCourse')}
            value={into}
            options={[
              { value: NO_COURSE, label: t('own.noCourse') },
              ...courses.map((course) => ({ value: course.id, label: course.title })),
            ]}
            onChange={setInto}
            scroll
          />
        </SheetPart>
      ) : null}
      {kind === 'course' ? (
        <SheetPart title={t('own.cover')}>
          <LookFields look={look} onChange={setLook} />
        </SheetPart>
      ) : null}
    </NewSheet>
  )
}
