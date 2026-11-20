import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { courseById, courseStepIds, type Course, SHELF_PAINT } from '@/entities/course'
import { selectOwnCourse, useOwnLessons } from '@/entities/own-lessons'
import { PieceLink, pieceById } from '@/entities/piece'
import { selectLearned, useProgress } from '@/entities/progress'
import { stepOf, type StepId } from '@/entities/step'
import { localText, useLocale, type Locale } from '@/shared/i18n'
import { editsContent, useAccount } from '@/shared/lib/account'
import { BackButton, ButtonLink, PAINT, RoundLink, ScreenHeader, PageName } from '@/shared/ui'
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
 * The course's one way in, the honey 50 under its meter (the canvas's BTN): Start, Continue or
 * Review and the step it opens ("Continue: The bass clef"); Review opens its first lesson.
 */
function CourseAction({ course }: { course: Course }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const learned = useProgress(selectLearned)
  const progress = courseProgress(course, learned)
  const open = openCourseStep(course, learned)
  const first = courseStepIds(course)[0]
  const id = open ?? first
  const step = id ? stepOf(id) : undefined
  if (!id || !step || (step.kind !== 'course-lesson' && step.kind !== 'piece')) return null
  const word = !open ? 'review' : progress.done === 0 ? 'start' : 'continue'
  return (
    <ButtonLink
      size="lg"
      className="w-full"
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
      {t(`journey.${word}`, { title: stepTitle(course, id, locale) ?? '' })}
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
 * A course's page (ADR 0053, 0061; the Course boards): the bar holds Back, the gear and an editor's
 * Edit; the cover in its shelf's paint, the course's name as the page's serif heading under it, what
 * it teaches, its facts in one line, how much is learned over a meter and its one way in; then its
 * lessons on the level's timeline and its guided songs. No About: what it teaches is said once, in
 * the summary. On a laptop the head is a band across the top (the cover beside the words), the
 * lessons four across and the songs on the same grid. A course of the learner's own (R30-5) reads as
 * `OwnCoursePage`.
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
  const paint = PAINT[SHELF_PAINT[course.shelf]]
  const next = openCourseStep(course, learned)
  const title = localText(course.title, locale)
  return (
    <div className="flex flex-col gap-8 pb-8">
      <ScreenHeader
        title={title}
        titleOnPage
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
      <div className="-mt-6 flex min-w-0 flex-col gap-8">
        <CourseOverview
          cover={<CourseBanner fill={paint.fill} ink={paint.ink} />}
          title={<PageName>{title}</PageName>}
          summary={localText(course.summary, locale)}
          facts={[
            t(`common:stage.${course.stage}`),
            ...(course.songs.length > 0
              ? [t('course.songCount', { count: course.songs.length })]
              : []),
            t('course.weekCount', { count: course.weeks }),
          ]}
          progress={progress}
          action={<CourseAction course={course} />}
        />
        <CourseLessons course={course} next={next} />
        <GuidedSongs course={course} />
      </div>
    </div>
  )
}
