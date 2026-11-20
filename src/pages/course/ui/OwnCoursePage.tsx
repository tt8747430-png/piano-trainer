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
import { selectLearned, selectRead, useProgress, isLearned } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, ButtonLink, PAINT, RoundLink, ScreenHeader, PageName } from '@/shared/ui'
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
    <section aria-labelledby={id} className="flex flex-col gap-1">
      <h2 id={id} className="font-sans text-xl font-bold">
        {t('course.lessons')}
      </h2>
      {lessons.length === 0 ? (
        <p className="px-1 text-muted-foreground">{t('own.noCourseLessons')}</p>
      ) : (
        <LessonLine across={4}>
          {lessons.map(({ lesson, own }, i) => {
            const step = lessonStepId(lesson.id)
            const done = isLearned(learned, step)
            const place = own ? undefined : lessonPlace(lesson.id)
            return (
              <LessonStop
                key={lesson.id}
                reached={done || lesson.id === next}
                passed={done}
                first={i === 0}
                last={i === lessons.length - 1}
              >
                <LessonRow
                  render={inCourse(course, lesson.id)}
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
  const open = lessons.find(({ lesson }) => !isLearned(learned, lessonStepId(lesson.id)))
  const done = lessons.filter(({ lesson }) => isLearned(learned, lessonStepId(lesson.id)))
  const progress = { done: done.length, total: lessons.length }
  const way = open ?? lessons[0]
  const paint = PAINT[course.look.paint]
  const locale = useLocale()
  const word = !open ? 'review' : progress.done === 0 ? 'start' : 'continue'
  return (
    <div className="flex flex-col gap-8 pb-8">
      <ScreenHeader
        title={course.title}
        titleOnPage
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
      {/* As the app's course: the head a band across the top on a laptop, the lessons under it. */}
      <div className="-mt-6 flex min-w-0 flex-col gap-8 lg:-mt-4">
        <CourseOverview
          cover={<CourseBanner fill={paint.fill} ink={paint.ink} />}
          title={<PageName>{course.title}</PageName>}
          summary={course.line || undefined}
          facts={[t('own.course'), t('course.lessonCount', { count: lessons.length })]}
          progress={progress}
          action={
            way ? (
              <ButtonLink size="lg" className="w-full" render={inCourse(course, way.lesson.id)}>
                {t(`journey.${word}`, { title: localText(way.lesson.title, locale) })}
              </ButtonLink>
            ) : undefined
          }
        />
        <Lessons course={course} lessons={lessons} next={open?.lesson.id} />
      </div>
    </div>
  )
}
