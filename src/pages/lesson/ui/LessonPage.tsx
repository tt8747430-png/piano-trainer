import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  lessonById,
  lessonPlace,
  nextLessonId,
  previousLessonId,
  type Lesson,
} from '@/entities/lesson'
import {
  isOwnLessonId,
  ownCourseLessons,
  selectOwnCourse,
  selectOwnLesson,
  selectOwnLessons,
  useOwnLessons,
  type OwnCourse,
} from '@/entities/own-lessons'
import { lessonStepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { editsContent, useAccount } from '@/shared/lib/account'
import { BackButton, type EditAction } from '@/shared/ui'
import { LessonLayout, PlaceLink, type LessonTrack } from './LessonLayout'

const ROUTE = '/shell/lessons/$lessonId'

/** A lesson's Edit: its lesson editor, in place of its page. */
function useEdit(lessonId: string): EditAction {
  const navigate = useNavigate()
  return {
    editing: false,
    onDone: () => undefined,
    onEdit: () =>
      void navigate({ to: '/lessons/$lessonId/edit', params: { lessonId }, replace: true }),
  }
}

/** A lesson's page around it, wherever it is read: its place, its way on, its Edit where it has one. */
function LessonScreen({
  lesson,
  place,
  track,
  edit,
  course,
}: {
  lesson: Lesson
  place: ReactNode
  track: LessonTrack
  edit: EditAction | undefined
  /** The learner's course it is read in, which its links carry on. */
  course?: string
}) {
  const locale = useLocale()
  // Keyed by its lesson: the next one is a new screen, its heading taking the focus from the way on,
  // so Enter again does not go on (and learn) past a lesson unread.
  return (
    <LessonLayout
      key={lesson.id}
      lesson={lesson}
      step={lessonStepId(lesson.id)}
      edit={edit}
      settings={<Link to="/lessons/$lessonId/settings" params={{ lessonId: lesson.id }} />}
      back={<BackButton />}
      after={(lesson.after ?? []).flatMap((id) => {
        const before = lessonById(id)
        return before
          ? [
              {
                title: localText(before.title, locale),
                link: {
                  to: '/lessons/$lessonId',
                  params: { lessonId: id },
                  search: course ? { course } : {},
                } as const,
              },
            ]
          : []
      })}
      place={place}
      track={track}
    />
  )
}

/**
 * A lesson's page (ADR 0053), `/lessons/$lessonId`: a level's lesson, with its level and chapter over
 * it and its number along the level; or one of the learner's own (R30-5), read the same, under Your
 * lessons. Either, read in a course of the learner's (`?course=`), has that course over it and its
 * lessons either side. Its progress is the lesson's own wherever it is read.
 */
export function LessonPage() {
  const { lessonId } = useParams({ from: ROUTE })
  const { course: courseId } = useSearch({ from: ROUTE })
  const own = useOwnLessons(selectOwnLesson(lessonId))
  const course = useOwnLessons(selectOwnCourse(courseId ?? ''))
  const lesson = own ?? lessonById(lessonId)
  // The route finds no lesson that is not there.
  if (!lesson) return null
  if (course?.lessons.includes(lessonId))
    return <InOwnCourse key={`${course.id}/${lessonId}`} lesson={lesson} course={course} />
  if (isOwnLessonId(lessonId)) return <OwnLesson key={lessonId} lesson={lesson} />
  return <LevelLesson key={lessonId} lesson={lesson} />
}

/** A level's lesson: the lesson before it, and on to the level's next, or after its last back to it. */
function LevelLesson({ lesson }: { lesson: Lesson }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { account } = useAccount()
  const edit = useEdit(lesson.id)
  const place = lessonPlace(lesson.id)
  // The route finds no lesson that no level has.
  if (!place) return null
  const journey = { to: '/levels/$levelId', params: { levelId: place.journey.id } } as const
  const lessonAt = (id: string | undefined) => (id === undefined ? undefined : lessonById(id))
  const next = lessonAt(nextLessonId(lesson.id))
  const previous = lessonAt(previousLessonId(lesson.id))
  const journeyTitle = localText(place.journey.title, locale)
  return (
    <LessonScreen
      lesson={lesson}
      edit={editsContent(account) ? edit : undefined}
      place={
        <>
          <PlaceLink {...journey}>{journeyTitle}</PlaceLink> ·{' '}
          {localText(place.chapter.title, locale)} ·{' '}
          {t('place', { n: place.n, total: place.total })}
        </>
      }
      track={{
        up: { link: <Link {...journey} />, label: t('track.toJourney'), title: journeyTitle },
        ...(previous
          ? {
              previous: {
                link: <Link to="/lessons/$lessonId" params={{ lessonId: previous.id }} />,
                label: t('track.previous'),
                title: localText(previous.title, locale),
              },
            }
          : {}),
        next: next
          ? {
              link: <Link to="/lessons/$lessonId" params={{ lessonId: next.id }} />,
              label: t('track.next'),
              title: localText(next.title, locale),
            }
          : { link: <Link {...journey} />, label: t('track.toJourney'), title: journeyTitle },
      }}
    />
  )
}

/** One of the learner's own lessons, under Your lessons, the way on back to them. */
function OwnLesson({ lesson }: { lesson: Lesson }) {
  const { t } = useTranslation('learn')
  const edit = useEdit(lesson.id)
  const own = { to: '/' } as const
  const title = t('own.title')
  const back = { link: <Link {...own} />, label: t('own.toOwn'), title }
  return (
    <LessonScreen
      lesson={lesson}
      edit={edit}
      place={<PlaceLink {...own}>{title}</PlaceLink>}
      track={{ up: back, next: back }}
    />
  )
}

/**
 * A lesson read in a course of the learner's: the course over it and its number there, the lesson
 * before it, and on to the course's next, or after its last back to the course. The learner's own
 * lesson has its Edit; one of the app's, an editor's.
 */
function InOwnCourse({ lesson, course }: { lesson: Lesson; course: OwnCourse }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { account } = useAccount()
  const edit = useEdit(lesson.id)
  const lessons = ownCourseLessons(course, useOwnLessons(selectOwnLessons))
  const at = lessons.findIndex((each) => each.lesson.id === lesson.id)
  const previous = lessons[at - 1]?.lesson
  const next = lessons[at + 1]?.lesson
  const home = { to: '/courses/$courseId', params: { courseId: course.id } } as const
  const inCourse = (id: string) => (
    <Link to="/lessons/$lessonId" params={{ lessonId: id }} search={{ course: course.id }} />
  )
  const back = { link: <Link {...home} />, label: t('track.courseDone'), title: course.title }
  return (
    <LessonScreen
      lesson={lesson}
      course={course.id}
      edit={isOwnLessonId(lesson.id) || editsContent(account) ? edit : undefined}
      place={
        <>
          <PlaceLink {...home}>{course.title}</PlaceLink> ·{' '}
          {t('place', { n: at + 1, total: lessons.length })}
        </>
      }
      track={{
        up: { link: <Link {...home} />, label: t('track.toCourseLessons'), title: course.title },
        ...(previous
          ? {
              previous: {
                link: inCourse(previous.id),
                label: t('track.previous'),
                title: localText(previous.title, locale),
              },
            }
          : {}),
        next: next
          ? {
              link: inCourse(next.id),
              label: t('track.next'),
              title: localText(next.title, locale),
            }
          : back,
      }}
    />
  )
}
