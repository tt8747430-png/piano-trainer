import { Link, useNavigate } from '@tanstack/react-router'
import { useId, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { COURSE_WEEKS, SHELVES, type Course, type CourseRecord } from '@/entities/course'
import { STAGES } from '@/entities/step'
import { useAddLesson, useCourseDraft } from '@/features/edit-original'
import { localText, useLocale } from '@/shared/i18n'
import { Dropdown, InfoTip } from '@/shared/ui'
import { AddByName, DraftScreen, OrderList, TextFields } from '@/widgets/content-editor'

/** The course's lessons in order: each one's editor, moved up or down, removed; a new one added. */
function CourseLessons({
  course,
  ids,
  onChange,
  onAdd,
}: {
  course: Course
  ids: readonly string[]
  onChange: (ids: readonly string[]) => void
  /** Makes a lesson of this name; resolves once it is listed and opened, false where it was not made. */
  onAdd: (name: string) => Promise<boolean>
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const listId = useId()
  const lessons = new Map(course.lessons.map((lesson) => [lesson.id, lesson]))
  return (
    <section aria-labelledby={listId} className="flex flex-col gap-3">
      <div className="flex items-center gap-1">
        <h2 id={listId} className="font-display text-xl">
          {t('edit.course.lessonList')}
        </h2>
        <InfoTip name={t('edit.course.lessonList')}>{t('edit.course.lessonsInfo')}</InfoTip>
      </div>
      {ids.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('edit.course.noLessons')}</p>
      ) : (
        <OrderList
          label={t('edit.course.lessonList')}
          rows={ids.map((id) => {
            const lesson = lessons.get(id)
            return {
              key: id,
              title: lesson ? localText(lesson.title, locale) : id,
              detail: lesson ? undefined : t('edit.order.unpublished'),
              link: (
                <Link
                  to="/courses/$courseId/$lessonId/edit"
                  params={{ courseId: course.id, lessonId: id }}
                />
              ),
            }
          })}
          onChange={onChange}
        />
      )}
      <AddByName
        label={t('edit.order.newLesson')}
        action={t('edit.order.addLesson')}
        failed={t('edit.order.addFailed')}
        onAdd={onAdd}
      />
    </section>
  )
}

/** The course's title, summary and lessons as fields, each change saved to the draft as it rests. */
function CourseForm({
  course,
  initial,
  onChange,
  onAdd,
}: {
  course: Course
  initial: CourseRecord
  onChange: (record: CourseRecord) => void
  onAdd: (name: string, record: CourseRecord) => Promise<boolean>
}) {
  const { t } = useTranslation(['learn', 'common'])
  const [record, setRecord] = useState(initial)
  const change = (next: CourseRecord) => {
    setRecord(next)
    onChange(next)
  }
  const ids = record.lessons ?? course.lessons.map((lesson) => lesson.id)
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-1">
          <h2 className="font-display text-xl">{t('edit.course.heading')}</h2>
          <InfoTip name={t('edit.course.heading')}>{t('edit.course.lessons')}</InfoTip>
        </div>
        <TextFields
          value={record.title}
          label={t('edit.kinds.title')}
          onChange={(title) => change({ ...record, title })}
        />
        <TextFields
          value={record.summary}
          label={t('edit.kinds.summary')}
          onChange={(summary) => change({ ...record, summary })}
        />
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">{t('edit.course.where')}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <Dropdown
              className="sm:col-span-2"
              label={t('edit.course.shelf')}
              value={record.shelf ?? course.shelf}
              options={SHELVES.map((value) => ({ value, label: t(`shelves.${value}`) }))}
              onChange={(shelf) => change({ ...record, shelf })}
            />
            <Dropdown
              label={t('edit.course.stage')}
              value={record.stage ?? course.stage}
              options={STAGES.map((value) => ({ value, label: t(`common:stage.${value}`) }))}
              onChange={(stage) => change({ ...record, stage })}
            />
            <Dropdown
              label={t('edit.course.weeks')}
              value={record.weeks ?? course.weeks}
              options={COURSE_WEEKS.map((value) => ({
                value,
                label: t('course.weekCount', { count: value }),
              }))}
              onChange={(weeks) => change({ ...record, weeks })}
            />
          </div>
        </fieldset>
      </section>
      <CourseLessons
        course={course}
        ids={ids}
        onChange={(lessons) => change({ ...record, lessons })}
        onAdd={(name) => onAdd(name, { ...record, lessons: ids })}
      />
    </div>
  )
}

/**
 * An editor's course editor (ADR 0116): the course's own title and summary, English and Russian, and
 * its lessons in order (moved, removed, a new one added), on the course's draft, with the draft's
 * strip; each lesson is edited on its own page.
 */
export function CourseEditor({
  course,
  back,
  toCourse,
}: {
  course: Course
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to the course's page. */
  toCourse: ReactElement
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const draft = useCourseDraft(course)
  const addLesson = useAddLesson(course.id)
  const navigate = useNavigate()
  // A new course's name is its draft's: the device has none of it.
  const title = localText(
    draft.load.state === 'ready' ? draft.load.value.title : course.title,
    locale,
  )
  // A new lesson is made on the server, listed last in the course's draft, saved now, then opened.
  const add = async (name: string, record: CourseRecord) => {
    const ids = record.lessons ?? []
    const made = await addLesson(name, ids)
    if (!made.ok) return false
    draft.save({ ...record, lessons: [...ids, made.value] })
    await draft.flush()
    await navigate({
      to: '/courses/$courseId/$lessonId/edit',
      params: { courseId: course.id, lessonId: made.value },
    })
    return true
  }
  return (
    <DraftScreen
      draft={draft}
      heading={t('edit.title', { title })}
      title={title}
      back={back}
      backTo={{ link: toCourse, label: t('edit.course.back') }}
      editorsOnly={t('edit.course.editorsOnly')}
      unreadable={t('edit.course.unreadable')}
    >
      {(initial) => (
        <CourseForm course={course} initial={initial} onChange={draft.save} onAdd={add} />
      )}
    </DraftScreen>
  )
}
