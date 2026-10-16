import { Link, useParams } from '@tanstack/react-router'
import { ArrowRight, Check, Play, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { courseById, CourseIcon, courseStepIds, type Course } from '@/entities/course'
import { selectLearned, useProgress } from '@/entities/progress'
import { STAGE_PAINT, stepOf } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn, OPEN_PLAINLY } from '@/shared/lib'
import { BackButton, ButtonLink, PAINT, ScreenHeader } from '@/shared/ui'
import {
  CourseFacts,
  courseProgress,
  CourseLessons,
  GuidedSongs,
  isComplete,
  LearnedMeter,
} from '@/widgets/curriculum'

/** The course's first step not yet learned: a lesson, then a guided song. */
const openStepOf = (course: Course, learned: Readonly<Record<string, string | undefined>>) =>
  courseStepIds(course).find((id) => learned[id] === undefined)

/**
 * The course's one honey way in: Start course, or Continue onto the step to take; Review, onto its
 * first lesson, once every one is learned.
 */
function CourseAction({ course }: { course: Course }) {
  const { t } = useTranslation('learn')
  const learned = useProgress(selectLearned)
  const progress = courseProgress(course, learned)
  const open = openStepOf(course, learned)
  const step = stepOf(open ?? courseStepIds(course)[0])
  if (!step || (step.kind !== 'course-lesson' && step.kind !== 'piece')) return null
  const label = !open
    ? t('course.review')
    : progress.done === 0
      ? t('course.start')
      : t('course.continue')
  const Icon = !open ? RotateCcw : step.kind === 'piece' ? Play : ArrowRight
  return (
    <ButtonLink
      size="lg"
      variant={open ? 'default' : 'outline'}
      className="w-full sm:w-auto sm:min-w-48"
      render={
        step.kind === 'piece' ? (
          <Link to="/play/$pieceId" params={{ pieceId: step.pieceId }} state={OPEN_PLAINLY} />
        ) : (
          <Link
            to="/courses/$courseId/$lessonId"
            params={{ courseId: step.courseId, lessonId: step.lessonId }}
          />
        )
      }
    >
      {label}
      <Icon data-icon="inline-end" aria-hidden />
    </ButtonLink>
  )
}

/**
 * A course's page (ADR 0053, 0058): one card, its icon on its level's paint beside what it teaches
 * and its facts in words, and along its foot how much is learned and its one way in; then its
 * lessons numbered as taught, the next ringed, and its guided songs.
 */
export function CoursePage() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { courseId } = useParams({ from: '/shell/courses/$courseId' })
  const learned = useProgress(selectLearned)
  const course = courseById(courseId)
  // The route finds no course that is not there.
  if (!course) return null
  const progress = courseProgress(course, learned)
  const paint = PAINT[STAGE_PAINT[course.stage]]
  const next = openStepOf(course, learned)
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader
        title={localText(course.title, locale)}
        back={<BackButton fallback={{ to: '/', search: { view: 'courses', journey: '' } }} />}
      />
      {/* One card: what it is, its facts and progress, and its one way in along its foot. */}
      <section className="-mt-2 flex max-w-3xl flex-col overflow-hidden card">
        <div className="flex items-start gap-4 p-5">
          <span
            className={cn(
              'grid size-16 shrink-0 place-items-center rounded-2xl',
              paint.fill,
              paint.ink,
            )}
          >
            <CourseIcon courseId={course.id} className="size-8" strokeWidth={1.5} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-pretty">{localText(course.summary, locale)}</p>
            <CourseFacts course={course} level className="text-sm" />
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-hairline bg-muted/40 p-5 sm:flex-row sm:items-center">
          {isComplete(progress) ? (
            <p className="flex flex-1 items-center gap-2 font-semibold text-learned">
              <Check aria-hidden className="size-5" strokeWidth={3} />
              {t('course.done')}
            </p>
          ) : (
            <LearnedMeter progress={progress} className="flex-1" />
          )}
          <CourseAction course={course} />
        </div>
      </section>
      <div className="flex max-w-3xl flex-col gap-8">
        <CourseLessons course={course} next={next} />
        <GuidedSongs course={course} />
      </div>
    </div>
  )
}
