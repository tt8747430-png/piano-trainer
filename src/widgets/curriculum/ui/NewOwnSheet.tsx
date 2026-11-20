import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FolderLook } from '@/entities/library'
import {
  OWN_COURSE_LOOK,
  OWN_COURSE_TEMPLATES,
  OWN_NAME_MAX,
  selectOwnCourses,
  useOwnLessons,
  useOwnLessonsStoreApi,
  type OwnCourseId,
} from '@/entities/own-lessons'
import { LookFields } from '@/features/manage-library'
import {
  createOwnCourse,
  createOwnCourseFrom,
  createOwnLesson,
  saveOwnCourse,
  setInCourse,
} from '@/features/manage-own-lessons'
import { localText, useLocale } from '@/shared/i18n'
import { ChoiceChips, NewSheet, SheetPart } from '@/shared/ui'

/** What the learner makes: a lesson or a course of their own. */
export type OwnKind = 'lesson' | 'course'
const NO_COURSE = 'none'
const EMPTY = 'empty'

/**
 * New lesson or New course (canvas 167), as Flat's New score: its name, then the one thing it needs,
 * the course a lesson goes in or a course's cover; a course can start from one the app hands over
 * (Start from), its lessons copied into Your lessons. Create opens what was made in its editor. Open
 * while `kind` is set.
 */
export function NewOwnSheet({ kind, onClose }: { kind: OwnKind | null; onClose: () => void }) {
  const { t } = useTranslation('learn')
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const locale = useLocale()
  const courses = useOwnLessons(selectOwnCourses)
  const [name, setName] = useState('')
  const [into, setInto] = useState<OwnCourseId | typeof NO_COURSE>(NO_COURSE)
  const [look, setLook] = useState<FolderLook>(OWN_COURSE_LOOK)
  const [from, setFrom] = useState<string>(EMPTY)
  const template = OWN_COURSE_TEMPLATES.find((each) => each.id === from)
  const startFrom = (id: string) => {
    const next = OWN_COURSE_TEMPLATES.find((each) => each.id === id)
    setFrom(id)
    setName(next ? localText(next.title, locale) : '')
    setLook(next ? next.look : OWN_COURSE_LOOK)
    setFailed(false)
  }
  const [failed, setFailed] = useState(false)
  const close = (next: boolean) => {
    if (next) return
    onClose()
    setName('')
    setInto(NO_COURSE)
    setLook(OWN_COURSE_LOOK)
    setFrom(EMPTY)
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
    const made = template
      ? createOwnCourseFrom(store, template, name, locale)
      : createOwnCourse(store, name)
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
        <SheetPart title={t('own.startFrom')}>
          <ChoiceChips<string>
            label={t('own.startFrom')}
            value={from}
            options={[
              { value: EMPTY, label: t('own.emptyCourse') },
              ...OWN_COURSE_TEMPLATES.map((each) => ({
                value: each.id,
                label: localText(each.title, locale),
              })),
            ]}
            onChange={startFrom}
          />
        </SheetPart>
      ) : null}
      {kind === 'course' ? (
        <SheetPart title={t('own.cover')}>
          <LookFields look={look} onChange={setLook} pictures={false} paintLabel={false} covers />
        </SheetPart>
      ) : null}
    </NewSheet>
  )
}
