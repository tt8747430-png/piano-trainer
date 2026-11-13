import { useNavigate } from '@tanstack/react-router'
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
import { ChoiceChips, NewSheet, Segmented, SheetPart } from '@/shared/ui'

type Kind = 'lesson' | 'course'
const NO_COURSE = 'none'

/**
 * New (canvas 165): one sheet for a lesson or a course of the learner's own, as Flat's New score.
 * What it is, its name, then the one thing it needs: the course a lesson goes in, or a course's
 * cover; Create opens what was made in its editor.
 */
export function NewOwnSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('learn')
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const courses = useOwnLessons(selectOwnCourses)
  const [kind, setKind] = useState<Kind>('lesson')
  const [name, setName] = useState('')
  const [into, setInto] = useState<OwnCourseId | typeof NO_COURSE>(NO_COURSE)
  const [look, setLook] = useState<FolderLook>(OWN_COURSE_LOOK)
  const [failed, setFailed] = useState(false)
  const close = (next: boolean) => {
    onOpenChange(next)
    if (next) return
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
      open={open}
      onOpenChange={close}
      title={t('own.new')}
      nameLabel={t('edit.order.name')}
      name={name}
      onName={setName}
      maxLength={OWN_NAME_MAX}
      createLabel={kind === 'lesson' ? t('own.createLesson') : t('own.createCourse')}
      failed={failed ? t('own.lessonFailed') : null}
      onCreate={create}
      lead={
        <Segmented
          label={t('own.kindLabel')}
          value={kind}
          options={[
            { value: 'lesson', label: t('own.kindLesson') },
            { value: 'course', label: t('own.kindCourse') },
          ]}
          onChange={setKind}
        />
      }
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
