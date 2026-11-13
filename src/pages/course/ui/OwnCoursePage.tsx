import { Link, useNavigate } from '@tanstack/react-router'
import { BookOpenText, Check, RotateCcw, Settings } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { lessonPlace } from '@/entities/lesson'
import { FolderTile } from '@/entities/library'
import {
  ownCourseLessons,
  selectOwnLessons,
  useOwnLessons,
  type CourseLesson,
  type OwnCourse,
} from '@/entities/own-lessons'
import { selectLearned, selectRead, useProgress } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, FabLink, FloatingActions, RoundLink, ScreenHeader } from '@/shared/ui'
import {
  isComplete,
  LearnedMeter,
  LessonLine,
  lessonShare,
  LessonRow,
  LessonStop,
} from '@/widgets/curriculum'

/** A lesson read in the course: its page, carrying the course on. */
const inCourse = (course: OwnCourse, lessonId: string) => (
  <Link to="/lessons/$lessonId" params={{ lessonId }} search={{ course: course.id }} />
)

/** The course's lessons, numbered in its order, each as a lesson's row: the learner's, or a level's. */
function Lessons({
  course,
  lessons,
  next,
}: {
  course: OwnCourse
  lessons: readonly CourseLesson[]
  next: string | undefined
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const learned = useProgress(selectLearned)
  const read = useProgress(selectRead)
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="font-sans text-xl font-bold">
        {t('course.lessons')}
      </h2>
      {lessons.length === 0 ? (
        <p className="px-1 text-muted-foreground">{t('own.noCourseLessons')}</p>
      ) : (
        <LessonLine>
          {lessons.map(({ lesson, own }, i) => {
            const step = lessonStepId(lesson.id)
            const done = learned[step] !== undefined
            const place = own ? undefined : lessonPlace(lesson.id)
            return (
              <LessonStop key={lesson.id}>
                <LessonRow
                  render={inCourse(course, lesson.id)}
                  mark={i + 1}
                  done={done}
                  share={lessonShare(lesson.sections.length, read[step], done)}
                  current={lesson.id === next}
                  said={t('lessonNumber', { n: i + 1 })}
                  title={localText(lesson.title, locale)}
                  detail={place ? localText(place.journey.title, locale) : t('own.yourLesson')}
                />
              </LessonStop>
            )
          })}
        </LessonLine>
      )}
    </section>
  )
}

/**
 * A course of the learner's own (R30-5), `/courses/own-course-n`, as a course's page reads: one card
 * with its cover, its line, how much is learned and its one way in floating (Start course, Continue,
 * Review); then its lessons. Its gear opens its Settings, its pencil the course editor.
 */
export function OwnCoursePage({ course }: { course: OwnCourse }) {
  const { t } = useTranslation('learn')
  const navigate = useNavigate()
  const learned = useProgress(selectLearned)
  const lessons = ownCourseLessons(course, useOwnLessons(selectOwnLessons))
  const open = lessons.find(({ lesson }) => learned[lessonStepId(lesson.id)] === undefined)
  const done = lessons.filter(({ lesson }) => learned[lessonStepId(lesson.id)] !== undefined)
  const progress = { done: done.length, total: lessons.length }
  const way = open ?? lessons[0]
  const label = !open
    ? t('course.review')
    : progress.done === 0
      ? t('course.start')
      : t('course.continue')
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader
        title={course.title}
        large
        back={<BackButton />}
        settings={
          <RoundLink
            label={t('settings.open')}
            icon={Settings}
            render={<Link to="/courses/$courseId/settings" params={{ courseId: course.id }} />}
          />
        }
        edit={{
          editing: false,
          onEdit: () =>
            void navigate({
              to: '/courses/$courseId/edit',
              params: { courseId: course.id },
              replace: true,
            }),
          onDone: () => undefined,
        }}
      />
      {/* A wide laptop: the course's card on the left, its lessons on the right. */}
      <div className="-mt-2 grid gap-8 xl:grid-cols-2 xl:items-start xl:gap-10">
        <section className="flex max-w-3xl min-w-0 flex-col overflow-hidden card xl:sticky xl:top-4">
          <div className="flex items-start gap-4 p-5">
            <FolderTile look={course.look} />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {course.line ? <p className="text-pretty">{course.line}</p> : null}
              <p className="text-sm text-muted-foreground">
                {t('course.lessonCount', { count: lessons.length })}
              </p>
            </div>
          </div>
          {lessons.length > 0 ? (
            <div className="flex flex-col gap-4 border-t border-hairline bg-muted/40 p-5">
              {isComplete(progress) ? (
                <p className="flex flex-1 items-center gap-2 font-semibold text-learned">
                  <Check aria-hidden className="size-5" strokeWidth={3} />
                  {t('course.done')}
                </p>
              ) : (
                <LearnedMeter progress={progress} className="flex-1" />
              )}
            </div>
          ) : null}
        </section>
        <div className="flex max-w-3xl min-w-0 flex-col gap-8">
          <Lessons course={course} lessons={lessons} next={open?.lesson.id} />
        </div>
      </div>
      {way ? (
        <FloatingActions>
          <FabLink
            label={label}
            icon={open ? BookOpenText : RotateCcw}
            render={inCourse(course, way.lesson.id)}
          />
        </FloatingActions>
      ) : null}
    </div>
  )
}
