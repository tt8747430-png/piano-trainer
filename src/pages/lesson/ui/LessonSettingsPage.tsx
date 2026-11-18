import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Book } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { courseLesson } from '@/entities/course'
import { LESSONS, lessonById, lessonPlace, type Lesson } from '@/entities/lesson'
import { courseLessonStepId, lessonStepId, type StepId } from '@/entities/step'
import { selectOwnLesson, useOwnLessons } from '@/entities/own-lessons'
import { DraftPublishing, RemoveGroup, useLessonDraft } from '@/features/edit-original'
import { ResetStepsRow } from '@/features/reset-progress'
import { localText, useLocale } from '@/shared/i18n'
import { shareLink } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import {
  ActionRow,
  BackButton,
  RowLink,
  say,
  ScreenHeader,
  SettingsGroup,
  ThingHead,
} from '@/shared/ui'
import { useStanding } from '@/widgets/content-editor'
import { OwnLessonSettings } from './OwnLessonSettings'

/** Where a lesson stands: a level's chapter, or a course. */
type Where =
  | {
      readonly kind: 'level'
      /** The level's id, its page where the lesson is listed. */
      readonly levelId: string
      readonly level: string
      readonly chapter: string
      /** Its number in the level, and the level's count. */
      readonly n: number
      readonly total: number
      /** Where it is moved: the level's page, in Edit for an editor. */
      readonly manage: ReactElement
    }
  | { readonly kind: 'course'; readonly course: string; readonly link: ReactElement }

/** A level's lesson's Settings (`/lessons/$lessonId/settings`), or one of the learner's own (R30-5). */
export function LessonSettingsPage() {
  const locale = useLocale()
  const { lessonId } = useParams({ from: '/shell/lessons/$lessonId/settings' })
  const own = useOwnLessons(selectOwnLesson(lessonId))
  if (own) return <OwnLessonSettings key={lessonId} lesson={own} />
  const lesson = lessonById(lessonId)
  const place = lessonPlace(lessonId)
  // The route finds no lesson that no level has.
  if (!lesson || !place) return null
  return (
    <LessonSettings
      key={lessonId}
      lesson={lesson}
      id={lessonId}
      step={lessonStepId(lessonId)}
      path={`/lessons/${lessonId}`}
      back={<BackButton />}
      where={{
        kind: 'level',
        levelId: place.journey.id,
        level: localText(place.journey.title, locale),
        chapter: localText(place.chapter.title, locale),
        n: place.n,
        total: place.total,
        manage: <Link to="/levels/$levelId" params={{ levelId: place.journey.id }} />,
      }}
    />
  )
}

/** A course's lesson's Settings (`/courses/$courseId/$lessonId/settings`). */
export function CourseLessonSettingsPage() {
  const locale = useLocale()
  const { courseId, lessonId } = useParams({ from: '/shell/courses/$courseId/$lessonId/settings' })
  const place = courseLesson(courseId, lessonId)
  // The route finds no lesson its course does not have.
  if (!place) return null
  return (
    <LessonSettings
      key={`${courseId}/${lessonId}`}
      lesson={place.lesson}
      id={`${courseId}/${lessonId}`}
      step={courseLessonStepId(courseId, lessonId)}
      path={`/courses/${courseId}/${lessonId}`}
      back={<BackButton />}
      where={{
        kind: 'course',
        course: localText(place.course.title, locale),
        link: <Link to="/courses/$courseId/edit" params={{ courseId }} />,
      }}
    />
  )
}

/**
 * A lesson's Settings, one shape with a course's (owner, 2026-11-18: "i dont like the structure of
 * these settings"; the board's THINGSET): the lesson at the head (its picture, its name, where it
 * stands), The lesson (its Place, a way to where it is moved), Share, for an editor its Publishing
 * (where it stands, Versions; Publish changes and Discard changes only while there are changes), the
 * learner's progress, and the loss of the whole lesson last and apart. One column, phone and laptop.
 */
function LessonSettings({
  lesson,
  id,
  step,
  path,
  back,
  where,
}: {
  lesson: Lesson
  /** Its id in the database (a course's as `<course>/<lesson>`). */
  id: string
  step: StepId
  /** Its page's path, its link shared. */
  path: string
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  where: Where
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { account } = useAccount()
  const navigate = useNavigate()
  const title = localText(lesson.title, locale)
  const share = async () => {
    const shared = await shareLink({ title, path })
    if (shared === 'copied') say(t('settings.shared'))
    if (shared === 'failed') say(t('settings.shareFailed'))
  }
  const placeLine =
    where.kind === 'level'
      ? `${t('place', { n: where.n, total: where.total })} · ${where.level}`
      : where.course
  return (
    <div className="flex flex-col gap-2 pb-8">
      <ScreenHeader column="until-laptop" title={t('settings.title')} back={back} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 lg:max-w-295">
        <ThingHead
          mark={
            <span className="grid size-16 shrink-0 place-items-center rounded-pill bg-card ring-1 ring-border ring-inset">
              <Book aria-hidden className="size-6" />
            </span>
          }
          name={title}
          line={placeLine}
        />
        <SettingsGroup flush title={t('settings.lesson')}>
          {where.kind === 'level' ? (
            <RowLink
              title={t('settings.place')}
              value={`${where.level} · ${where.chapter} · ${t('lessonNumber', { n: where.n })}`}
              render={where.manage}
            />
          ) : (
            <RowLink title={t('settings.inCourse')} value={where.course} render={where.link} />
          )}
        </SettingsGroup>
        <SettingsGroup flush title={t('settings.share')}>
          <ActionRow title={t('settings.shareLink')} onClick={() => void share()} />
        </SettingsGroup>
        {editsContent(account) && where.kind === 'level' ? (
          // A course's lesson is published with its course.
          <LessonPublishing lesson={lesson} id={id} title={title} />
        ) : null}
        <ResetStepsRow
          steps={[step]}
          words={{
            row: t('settings.reset'),
            done: t('settings.resetDone'),
            undo: t('settings.undo'),
          }}
        />
        {editsContent(account) &&
        where.kind === 'level' &&
        !LESSONS.some((each) => each.id === lesson.id) ? (
          // A level's lesson made in the app, not one the app ships with (a course's is its
          // course's): Delete (round 28), last of all and apart (R25).
          <RemoveGroup
            kind="lesson"
            id={id}
            title={title}
            onDeleted={() =>
              void navigate({
                to: '/levels/$levelId',
                params: { levelId: where.levelId },
                replace: true,
              })
            }
          />
        ) : null}
      </div>
    </div>
  )
}

/** A level's lesson's Publishing (ADR 0116), its draft's: where it stands, Versions, its changes. */
function LessonPublishing({ lesson, id, title }: { lesson: Lesson; id: string; title: string }) {
  const { t } = useTranslation(['editor', 'learn'])
  const draft = useLessonDraft(lesson, id)
  const { published, standing } = useStanding('lesson', id, draft)
  return (
    <DraftPublishing
      draft={draft}
      title={title}
      status={published === null ? undefined : t(`publishPage.standing.${standing}`)}
      unreadable={t('learn:edit.unreadable')}
      onReset={draft.reopen}
    />
  )
}
