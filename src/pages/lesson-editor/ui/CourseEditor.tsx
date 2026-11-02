import { Link, useNavigate } from '@tanstack/react-router'
import { useRef, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { COURSE_WEEKS, SHELVES, type Course, type CourseRecord } from '@/entities/course'
import { STAGES } from '@/entities/step'
import { useAddLesson, useCourseDraft } from '@/features/edit-original'
import { i18n, localText, useLocale, type Locale } from '@/shared/i18n'
import { Dropdown } from '@/shared/ui'
import {
  AddRow,
  DocText,
  DraftScreen,
  Properties,
  PropertyRow,
  RowGroups,
} from '@/widgets/content-editor'

/**
 * The course as one document in one language (round 21): its title as the page's heading and its
 * summary under it, written in place; its shelf, level and length as properties, each a choice in
 * place; its lessons as rows dragged into order, each opened in its editor or removed; Add lesson at
 * their end, finding a lesson it had by name, or making a new one. Each change saved to the draft as
 * it rests.
 */
function CourseDocument({
  course,
  initial,
  locale,
  onChange,
  onAdd,
}: {
  course: Course
  initial: CourseRecord
  locale: Locale
  onChange: (record: CourseRecord) => void
  /** Makes a lesson of this name; resolves once it is listed and opened, false where it was not made. */
  onAdd: (name: string, record: CourseRecord) => Promise<boolean>
}) {
  const { t } = useTranslation(['learn', 'common'])
  const words = i18n.getFixedT(locale, 'learn')
  const [record, setRecord] = useState(initial)
  const change = (next: CourseRecord) => {
    setRecord(next)
    onChange(next)
  }
  const ids = record.lessons ?? course.lessons.map((lesson) => lesson.id)
  const lessons = new Map(course.lessons.map((lesson) => [lesson.id, lesson]))
  const titleOf = (id: string) => {
    const lesson = lessons.get(id)
    return lesson ? localText(lesson.title, locale) : id
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <DocText
          size="title"
          label={t('learn:edit.kinds.title')}
          value={record.title}
          locale={locale}
          placeholder={words('edit.doc.courseTitle')}
          onChange={(title) => change({ ...record, title })}
        />
        <DocText
          label={t('learn:edit.kinds.summary')}
          value={record.summary}
          locale={locale}
          placeholder={words('edit.doc.courseSummary')}
          onChange={(summary) => change({ ...record, summary })}
        />
      </div>
      <Properties label={t('learn:edit.doc.properties')}>
        <PropertyRow name={t('learn:edit.course.shelf')}>
          <Dropdown
            bare
            className="max-w-full"
            label={t('learn:edit.course.shelf')}
            value={record.shelf ?? course.shelf}
            options={SHELVES.map((value) => ({ value, label: t(`learn:shelves.${value}`) }))}
            onChange={(shelf) => change({ ...record, shelf })}
          />
        </PropertyRow>
        <PropertyRow name={t('learn:edit.course.stage')}>
          <Dropdown
            bare
            className="max-w-full"
            label={t('learn:edit.course.stage')}
            value={record.stage ?? course.stage}
            options={STAGES.map((value) => ({ value, label: t(`common:stage.${value}`) }))}
            onChange={(stage) => change({ ...record, stage })}
          />
        </PropertyRow>
        <PropertyRow name={t('learn:edit.course.weeks')}>
          <Dropdown
            bare
            className="max-w-full"
            label={t('learn:edit.course.weeks')}
            value={record.weeks ?? course.weeks}
            options={COURSE_WEEKS.map((value) => ({
              value,
              label: t('learn:course.weekCount', { count: value }),
            }))}
            onChange={(weeks) => change({ ...record, weeks })}
          />
        </PropertyRow>
      </Properties>
      <RowGroups
        groups={[
          {
            key: 'lessons',
            label: t('learn:edit.course.lessonList'),
            head: <h2 className="font-display text-2xl">{t('learn:edit.course.lessonList')}</h2>,
            empty: t('learn:edit.course.noLessons'),
            rows: ids.map((id) => ({
              key: id,
              title: titleOf(id),
              detail: lessons.has(id) ? undefined : t('learn:edit.order.unpublished'),
              link: (
                <Link
                  to="/courses/$courseId/$lessonId/edit"
                  params={{ courseId: course.id, lessonId: id }}
                />
              ),
            })),
            foot: (
              <AddRow
                label={t('learn:edit.order.addLesson')}
                title={t('learn:edit.order.newLesson')}
                createLabel={t('learn:edit.order.createLesson')}
                failed={t('learn:edit.order.addFailed')}
                found={course.lessons
                  .filter((lesson) => !ids.includes(lesson.id))
                  .map((lesson) => ({ key: lesson.id, title: localText(lesson.title, locale) }))}
                onPick={(id) => change({ ...record, lessons: [...ids, id] })}
                onCreate={(name) => onAdd(name, { ...record, lessons: ids })}
              />
            ),
          },
        ]}
        onChange={([group]) => change({ ...record, lessons: group?.rows ?? [] })}
      />
    </div>
  )
}

/**
 * An editor's course editor (ADR 0116, round 21): the course's draft as one document, one language
 * at a time (the bar's choice); each lesson is edited on its own page; the draft's status, Publish
 * and menu in the bar.
 */
export function CourseEditor({
  course,
  back,
  toCourse,
  modes,
}: {
  course: Course
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to the course's page. */
  toCourse: ReactElement
  /** Its Read · Edit switch, set to Edit. */
  modes?: ReactNode
}) {
  const { t } = useTranslation('learn')
  const shown = useLocale()
  const [locale, setLocale] = useState<Locale>(shown)
  const draft = useCourseDraft(course)
  const addLesson = useAddLesson(course.id)
  const navigate = useNavigate()
  // The course as last written, for the document to open on in the other language.
  const written = useRef<{ opened: number; record: CourseRecord } | null>(null)
  // A new course's name is its draft's: the device has none of it.
  const title = localText(
    draft.load.state === 'ready' ? draft.load.value.title : course.title,
    shown,
  )
  const save = (record: CourseRecord) => {
    written.current = { opened: draft.opened, record }
    draft.save(record)
  }
  // A new lesson is made on the server, listed last in the course's draft, saved now, then opened.
  const add = async (name: string, record: CourseRecord) => {
    const ids = record.lessons ?? []
    const made = await addLesson(name, ids)
    if (!made.ok) return false
    save({ ...record, lessons: [...ids, made.value] })
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
      // The course's own name over it, as it reads: the page in Edit, not another page.
      heading={title}
      modes={modes}
      title={title}
      back={back}
      backTo={{ link: toCourse, label: t('edit.course.back') }}
      editorsOnly={t('edit.course.editorsOnly')}
      unreadable={t('edit.course.unreadable')}
      language={{ value: locale, onChange: setLocale }}
    >
      {(initial) => (
        <CourseDocument
          key={locale}
          course={course}
          locale={locale}
          initial={written.current?.opened === draft.opened ? written.current.record : initial}
          onChange={save}
          onAdd={add}
        />
      )}
    </DraftScreen>
  )
}
