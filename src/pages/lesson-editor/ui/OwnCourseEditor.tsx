import { Link, useNavigate } from '@tanstack/react-router'
import { BookOpenText, ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { allJourneys, lessonById } from '@/entities/lesson'
import { FolderTile } from '@/entities/library'
import {
  isOwnLessonId,
  ownTitle,
  selectOwnLessons,
  useOwnLessons,
  useOwnLessonsStoreApi,
  type OwnCourse,
} from '@/entities/own-lessons'
import { LookFields } from '@/features/manage-library'
import { createOwnLesson, saveOwnCourse } from '@/features/manage-own-lessons'
import { i18n, localText, useLocale, type Locale } from '@/shared/i18n'
import { useRestingSave } from '@/shared/lib'
import type { EditAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import {
  LocalScreen,
  Properties,
  PropertyRow,
  type AddGroup,
  type DocRow,
} from '@/widgets/content-editor'
import { CourseParts } from './CourseParts'

/** Every lesson of the levels, in their order, with the level each is in. */
const levelLessons = (locale: Locale) =>
  allJourneys().flatMap((journey) =>
    journey.chapters.flatMap((chapter) =>
      chapter.steps.flatMap((step) => {
        const lesson = step.kind === 'lesson' ? lessonById(step.lessonId) : undefined
        return lesson
          ? [
              {
                key: lesson.id,
                title: localText(lesson.title, locale),
                detail: localText(journey.title, locale),
              },
            ]
          : []
      }),
    ),
  )

/** Its cover, chosen in place: its picture on its paint, opening the folders' choice of both. */
function CoverChoice({
  course,
  onChange,
}: {
  course: OwnCourse
  onChange: (next: OwnCourse) => void
}) {
  const { t } = useTranslation(['learn', 'songs'])
  const value = t('learn:own.coverValue', {
    picture: t(`songs:folder.pictures.${course.look.picture}`),
    paint: t(`songs:folder.paints.${course.look.paint}`),
  })
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="ghost" className="h-auto min-h-11 max-w-full gap-3 px-2" />}
        aria-label={`${t('learn:own.cover')}: ${value}`}
      >
        <FolderTile look={course.look} />
        <span className="truncate">{value}</span>
        <ChevronDown aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="end" aria-label={t('learn:own.cover')} className="w-auto p-4">
        <LookFields look={course.look} onChange={(look) => onChange({ ...course, look })} />
      </PopoverContent>
    </Popover>
  )
}

/**
 * The learner's own course in the course editor (R30-5): the same document as an editor's course,
 * with its own parts: its title and line written in place, its Cover, and its lessons dragged into
 * order. Add lesson finds one of the learner's or one of the levels' (added by reference: it stays
 * the app's, its progress its own wherever it is read), or makes a new lesson of the learner's and
 * opens it. Each change is kept on the device once the editor rests; Done keeps what waits.
 */
export function OwnCourseEditor({
  course,
  back,
  edit,
}: {
  course: OwnCourse
  back: ReactNode
  edit?: EditAction | undefined
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const words = i18n.getFixedT(locale, 'learn')
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const own = useOwnLessons(selectOwnLessons)
  const [value, setValue] = useState(course)
  const saving = useRestingSave((next: OwnCourse) => saveOwnCourse(store, next))
  const change = (next: OwnCourse) => {
    setValue(next)
    saving.save(next)
  }
  const ownById = new Map<string, (typeof own)[number]>(own.map((lesson) => [lesson.id, lesson]))
  const level = levelLessons(locale)
  const levelOf = new Map(level.map((each) => [each.key, each]))
  const rows = value.lessons.flatMap((id): DocRow[] => {
    const mine = ownById.get(id)
    if (mine)
      return [
        {
          key: id,
          title: localText(mine.title, locale),
          detail: t('own.yourLesson'),
          link: <Link to="/lessons/$lessonId/edit" params={{ lessonId: id }} />,
        },
      ]
    const app = levelOf.get(id)
    return app && !isOwnLessonId(id)
      ? [
          {
            key: id,
            title: app.title,
            detail: app.detail,
            link: (
              <Link
                to="/lessons/$lessonId"
                params={{ lessonId: id }}
                search={{ course: course.id }}
              />
            ),
          },
        ]
      : []
  })
  const found: AddGroup[] = [
    {
      title: t('own.lessons'),
      icon: BookOpenText,
      items: own
        .filter((lesson) => !value.lessons.includes(lesson.id))
        .map((lesson) => ({ key: lesson.id, title: localText(lesson.title, locale) })),
    },
    {
      title: t('own.appLessons'),
      icon: BookOpenText,
      typed: true,
      items: level.filter((each) => !value.lessons.includes(each.key)),
    },
  ]
  // A new lesson of the learner's, listed last and kept now, then opened in the lesson editor.
  const create = async (name: string) => {
    const id = createOwnLesson(store, name)
    if (!id) return false
    const next = { ...value, lessons: [...value.lessons, id] }
    setValue(next)
    saving.save(next)
    saving.flush()
    await navigate({ to: '/lessons/$lessonId/edit', params: { lessonId: id } })
    return true
  }
  const done: EditAction = {
    editing: true,
    onEdit: () => undefined,
    onDone: () => {
      saving.flush()
      edit?.onDone()
    },
  }
  return (
    <LocalScreen heading={course.title} back={back} edit={done}>
      <CourseParts
        locale={locale}
        title={ownTitle(value.title)}
        summary={ownTitle(value.line)}
        onTitle={(title) => change({ ...value, title: title[locale] })}
        onSummary={(line) => change({ ...value, line: line[locale] })}
        summaryPlaceholder={words('own.line')}
        rows={rows}
        found={found}
        onPick={(id) => change({ ...value, lessons: [...value.lessons, id] })}
        onCreate={create}
        onOrder={(order) => change({ ...value, lessons: order })}
      >
        <Properties label={t('edit.doc.properties')}>
          <PropertyRow name={t('own.cover')}>
            <CoverChoice course={value} onChange={change} />
          </PropertyRow>
        </Properties>
      </CourseParts>
    </LocalScreen>
  )
}
