import { Link, useNavigate, useParams } from '@tanstack/react-router'
import {
  Bookmark,
  BookOpenText,
  Languages,
  Link2,
  ListChecks,
  Map,
  type LucideIcon,
} from 'lucide-react'
import { useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { courseLesson } from '@/entities/course'
import {
  LESSONS,
  lessonById,
  lessonIds,
  lessonLanguages,
  lessonPlace,
  withAfter,
  type Lesson,
} from '@/entities/lesson'
import { selectLessonReading, useSettings } from '@/entities/settings'
import { courseLessonStepId, lessonStepId, type StepId } from '@/entities/step'
import { RemoveGroup, useLessonDraft } from '@/features/edit-original'
import { ResetStepsRow } from '@/features/reset-progress'
import { localText, useLocale } from '@/shared/i18n'
import { shareLink } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import {
  BackButton,
  ChoiceRow,
  MultiDropdown,
  RowButton,
  RowLink,
  say,
  ScreenHeader,
  SettingsGroup,
  TileMark,
} from '@/shared/ui'
import { ChangesGroup } from '@/widgets/content-editor'

/** Where a lesson stands: a level's chapter, or a course. */
type Where =
  | {
      readonly kind: 'level'
      readonly level: string
      readonly chapter: string
      readonly manage: ReactElement
    }
  | { readonly kind: 'course'; readonly course: string; readonly link: ReactElement }

/** A level's lesson's Settings (`/lessons/$lessonId/settings`). */
export function LessonSettingsPage() {
  const locale = useLocale()
  const { lessonId } = useParams({ from: '/shell/lessons/$lessonId/settings' })
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
      back={<BackButton fallback={{ to: '/lessons/$lessonId', params: { lessonId } }} />}
      readFirst
      where={{
        kind: 'level',
        level: localText(place.journey.title, locale),
        chapter: localText(place.chapter.title, locale),
        manage: <Link to="/journeys/$journeyId/edit" params={{ journeyId: place.journey.id }} />,
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
      back={
        <BackButton
          fallback={{ to: '/courses/$courseId/$lessonId', params: { courseId, lessonId } }}
        />
      }
      where={{
        kind: 'course',
        course: localText(place.course.title, locale),
        link: <Link to="/courses/$courseId/edit" params={{ courseId }} />,
      }}
    />
  )
}

/**
 * A lesson's Settings (round 28, as a song's: Noji's deck settings): one list of grouped rows. How
 * lessons read (One page, A section at a time), Share link, and apart the learner's own progress
 * reset, asked first. An editor's: where it stands (its level and chapter, Manage lessons; or its
 * course), the lessons to read first, the languages it is written in, and its changes with Publish.
 */
function LessonSettings({
  lesson,
  id,
  step,
  path,
  back,
  where,
  readFirst = false,
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
  /** A level's lesson: the lessons to read before it chosen here. */
  readFirst?: boolean
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { account } = useAccount()
  const reading = useSettings(selectLessonReading)
  const title = localText(lesson.title, locale)
  const share = async () => {
    const shared = await shareLink({ title, path })
    if (shared === 'copied') say(t('settings.shared'))
    if (shared === 'failed') say(t('settings.shareFailed'))
  }
  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader title={t('settings.title')} back={back} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <p className="px-1 font-display text-2xl font-semibold text-balance">{title}</p>
        <SettingsGroup flush title={t('settings.reading')}>
          <RowLink
            title={t('reading.title')}
            icon={BookOpenText}
            paint="lilac"
            value={t(`reading.${reading}`)}
            render={<Link to="/settings" />}
          />
        </SettingsGroup>
        <SettingsGroup flush title={t('settings.share')}>
          <RowButton
            title={t('settings.shareLink')}
            icon={Link2}
            paint="grass"
            onClick={() => void share()}
          />
        </SettingsGroup>
        {editsContent(account) ? (
          <EditorRows lesson={lesson} id={id} title={title} where={where} readFirst={readFirst} />
        ) : null}
        <SettingsGroup flush title={t('settings.progress')}>
          <ResetStepsRow
            steps={[step]}
            words={{
              row: t('settings.reset'),
              title: t('settings.resetLesson'),
              body: t('settings.resetLessonBody'),
              cancel: t('settings.cancel'),
              confirm: t('settings.confirm'),
              done: t('settings.resetDone'),
            }}
          />
        </SettingsGroup>
      </div>
    </div>
  )
}

/** A row that says a value, not a way on: its tile, its name, the value at its end. */
function ValueRow({ title, value, icon }: { title: string; value: string; icon: LucideIcon }) {
  return (
    // Its name kept whole: a long value wraps under itself, at the row's end.
    <div className="flex min-h-16 min-w-0 items-center gap-3 py-2 pr-4 pl-2">
      <TileMark icon={icon} paint="lilac" />
      <span className="shrink-0 text-lg font-semibold">{title}</span>
      <span className="min-w-0 flex-1 text-right text-balance text-muted-foreground">{value}</span>
    </div>
  )
}

/**
 * An editor's rows (ADR 0116): where the lesson stands, a way to where it is placed; the lessons to
 * read first, chosen here, saved to its draft; the languages its draft has in full; and the draft's
 * changes, where they stand with Publish and its menu.
 */
function EditorRows({
  lesson,
  id,
  title,
  where,
  readFirst,
}: {
  lesson: Lesson
  id: string
  title: string
  where: Where
  readFirst: boolean
}) {
  const { t } = useTranslation(['learn', 'settings'])
  const locale = useLocale()
  const draft = useLessonDraft(lesson, id)
  const navigate = useNavigate()
  // What was chosen since it opened: the draft's own until then.
  const [chosen, setChosen] = useState<Lesson | null>(null)
  const written = chosen ?? (draft.load.state === 'ready' ? draft.load.value : null)
  const languages = written ? lessonLanguages(written) : []
  return (
    <>
      <SettingsGroup flush title={t('settings.lesson')}>
        {where.kind === 'level' ? (
          <>
            <RowLink
              title={t('settings.level')}
              value={where.level}
              icon={Map}
              paint="sky"
              render={where.manage}
            />
            <ValueRow title={t('settings.chapter')} value={where.chapter} icon={Bookmark} />
          </>
        ) : (
          <RowLink
            title={t('settings.inCourse')}
            value={where.course}
            icon={Map}
            paint="sky"
            render={where.link}
          />
        )}
        {readFirst && written ? (
          <ChoiceRow title={t('settings.readFirst')} icon={ListChecks} paint="grass">
            <MultiDropdown
              label={t('settings.readFirst')}
              none={t('edit.doc.readFirstNone')}
              bare
              value={written.after ?? []}
              options={lessonIds()
                .filter((each) => each !== id)
                .map((each) => ({
                  value: each,
                  label: localText(lessonById(each)?.title ?? { en: each, ru: each }, locale),
                }))}
              onChange={(after) => {
                const next = withAfter(written, after)
                setChosen(next)
                draft.save(next)
              }}
            />
          </ChoiceRow>
        ) : null}
        <ValueRow
          title={t('settings.languages')}
          icon={Languages}
          value={
            written === null
              ? t('settings.opening')
              : languages.length === 0
                ? t('settings.noLanguage')
                : languages.map((each) => t(`settings:language.${each}`)).join(', ')
          }
        />
      </SettingsGroup>
      <ChangesGroup draft={draft} title={title} unreadable={t('edit.unreadable')} />
      {/* A level's lesson made in the app, not one the app ships with (a course's is its course's):
          Unpublish and Delete (round 28). */}
      {where.kind !== 'level' || LESSONS.some((each) => each.id === lesson.id) ? null : (
        <RemoveGroup
          kind="lesson"
          id={id}
          title={title}
          onDeleted={() => void navigate({ to: '/', search: { view: 'lessons' } })}
        />
      )}
    </>
  )
}
