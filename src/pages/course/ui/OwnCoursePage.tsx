import { Link, useNavigate } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { lessonPlace } from '@/entities/lesson'
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
import { BackButton, ButtonLink, PAINT, RoundLink, ScreenHeader } from '@/shared/ui'
import {
  CourseBanner,
  CourseOverview,
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
 * A course of the learner's own (R30-5), `/courses/own-course-n`, as a course's page reads (its
 * board's): its cover in its paint, its line, its count, how much is learned and what is next, its
 * one way in in honey (Start course, Continue, Review); then its lessons. Its gear opens its Settings, its pencil the course editor.
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
  const paint = PAINT[course.look.paint]
  const locale = useLocale()
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
        named
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
      {/* A laptop: the course held in view on the left, its lessons beside it. */}
      <div className="-mt-4 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <CourseOverview
          className="min-w-0 lg:sticky lg:top-4 lg:w-100 lg:flex-none"
          cover={<CourseBanner fill={paint.fill} ink={paint.ink} />}
          summary={course.line || undefined}
          facts={[t('course.lessonCount', { count: lessons.length })]}
          progress={progress}
          next={open ? localText(open.lesson.title, locale) : undefined}
          action={
            way ? (
              <ButtonLink
                size="lg"
                className="h-13 w-full rounded-pill px-5 text-base font-bold"
                render={inCourse(course, way.lesson.id)}
              >
                {label}
              </ButtonLink>
            ) : undefined
          }
        />
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <Lessons course={course} lessons={lessons} next={open?.lesson.id} />
        </div>
      </div>
    </div>
  )
}
