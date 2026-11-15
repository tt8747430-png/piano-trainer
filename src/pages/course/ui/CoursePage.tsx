import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { courseById, courseStepIds, type Course } from '@/entities/course'
import { selectOwnCourse, useOwnLessons } from '@/entities/own-lessons'
import { PieceLink, pieceById } from '@/entities/piece'
import { selectLearned, useProgress } from '@/entities/progress'
import { STAGE_PAINT, stepOf, type StepId } from '@/entities/step'
import { localText, useLocale, type Locale } from '@/shared/i18n'
import { editsContent, useAccount } from '@/shared/lib/account'
import { BackButton, ButtonLink, PAINT, RoundLink, ScreenHeader } from '@/shared/ui'
import { AboutView } from '@/widgets/lesson-view'
import {
  CourseBanner,
  CourseLessons,
  CourseOverview,
  courseProgress,
  GuidedSongs,
  openCourseStep,
} from '@/widgets/curriculum'
import { OwnCoursePage } from './OwnCoursePage'

/**
 * The course's one way in, the wide honey button along its card's foot (its board): Start course,
 * or Continue onto the step to take; Review, onto its first lesson, once every one is learned.
 */
function CourseAction({ course }: { course: Course }) {
  const { t } = useTranslation('learn')
  const learned = useProgress(selectLearned)
  const progress = courseProgress(course, learned)
  const open = openCourseStep(course, learned)
  const step = stepOf(open ?? courseStepIds(course)[0])
  if (!step || (step.kind !== 'course-lesson' && step.kind !== 'piece')) return null
  const label = !open
    ? t('course.review')
    : progress.done === 0
      ? t('course.start')
      : t('course.continue')
  return (
    <ButtonLink
      size="lg"
      className="h-13 w-full rounded-pill px-5 text-base font-bold"
      render={
        step.kind === 'piece' ? (
          // A guided song's page, where it is played and marked learned.
          <PieceLink entry={pieceById(step.pieceId) ?? { id: step.pieceId, kind: 'song' }} />
        ) : (
          <Link
            to="/courses/$courseId/$lessonId"
            params={{ courseId: step.courseId, lessonId: step.lessonId }}
          />
        )
      }
    >
      {label}
    </ButtonLink>
  )
}

/** A course's step by name: its lesson's title, or its guided song's. */
function stepTitle(course: Course, id: StepId, locale: Locale): string | undefined {
  const step = stepOf(id)
  if (step?.kind === 'course-lesson') {
    const lesson = course.lessons.find((each) => each.id === step.lessonId)
    return lesson ? localText(lesson.title, locale) : undefined
  }
  return step?.kind === 'piece' ? pieceById(step.pieceId)?.title : undefined
}

/**
 * A course's page (ADR 0053, 0061), its board's: its cover in its level's paint, what it teaches,
 * its facts as chips, how much is learned and what is next over a meter, its one way in in honey;
 * its About, where an editor wrote one (R29 B9); then its lessons numbered as taught, the next
 * ringed, and its guided songs. A course of the learner's own (R30-5) reads as `OwnCoursePage`.
 */
export function CoursePage() {
  const { courseId } = useParams({ from: '/shell/courses/$courseId' })
  const own = useOwnLessons(selectOwnCourse(courseId))
  return own ? <OwnCoursePage key={courseId} course={own} /> : <AppCourse courseId={courseId} />
}

/** One of the app's courses. */
function AppCourse({ courseId }: { courseId: string }) {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const { account } = useAccount()
  const navigate = useNavigate()
  const course = courseById(courseId)
  // The route finds no course that is not there.
  if (!course) return null
  const progress = courseProgress(course, learned)
  const paint = PAINT[STAGE_PAINT[course.stage]]
  const next = openCourseStep(course, learned)
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader
        title={localText(course.title, locale)}
        // A course's name in full over its page, as a song's: the bar echoes it once scrolled.
        large
        named
        back={<BackButton />}
        settings={
          <RoundLink
            label={t('settings.open')}
            icon={Settings}
            render={<Link to="/courses/$courseId/settings" params={{ courseId }} />}
          />
        }
        edit={
          editsContent(account)
            ? {
                editing: false,
                onEdit: () =>
                  void navigate({
                    to: '/courses/$courseId/edit',
                    params: { courseId },
                    replace: true,
                  }),
                onDone: () => undefined,
              }
            : undefined
        }
      />
      {/* A laptop: the course held in view on the left, its lessons and songs beside it. */}
      <div className="-mt-4 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-4 lg:w-100 lg:flex-none">
          <CourseOverview
            cover={<CourseBanner fill={paint.fill} ink={paint.ink} />}
            summary={localText(course.summary, locale)}
            facts={[
              t(`common:stage.${course.stage}`),
              t('course.lessonCount', { count: course.lessons.length }),
              ...(course.songs.length > 0
                ? [t('course.songCount', { count: course.songs.length })]
                : []),
              t('course.weekCount', { count: course.weeks }),
            ]}
            progress={progress}
            next={next ? stepTitle(course, next, locale) : undefined}
            action={<CourseAction course={course} />}
          />
          {/* Its About (R29 B9): the editor's document, each block in its own style. */}
          <AboutView about={course.about} label={t('course.about')} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <CourseLessons course={course} next={next} />
          <GuidedSongs course={course} />
        </div>
      </div>
    </div>
  )
}
