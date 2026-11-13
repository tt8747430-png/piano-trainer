import { Link, useNavigate } from '@tanstack/react-router'
import { ChartNoAxesColumnIncreasing, Ellipsis, KeyboardMusic, Trash2 } from 'lucide-react'
import { Fragment, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  allJourneys,
  lessonById,
  lessonIds,
  type Chapter,
  type Journey,
  type JourneyStep,
} from '@/entities/lesson'
import { STAGE_PAINT } from '@/entities/step'
import { DraftActions, DraftStatus, useAddLesson, useJourneyDraft } from '@/features/edit-original'
import { i18n, localText, useLocale, type Locale } from '@/shared/i18n'
import { cn, slug, useSetSearch } from '@/shared/lib'
import { ActionMenu, ChoiceChips, confirm, PAINT, say } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  AddRow,
  DocText,
  languageActions,
  NotOpen,
  RowGroups,
  type RowOrder,
} from '@/widgets/content-editor'
import type { LearnView } from '../model/learn-view'
import { rowKey, withOrder } from '../model/journey-order'
import { useStepTitle } from '../model/use-step-title'

/** A chapter's heading, renamed in place, and its menu: Remove chapter, asked first. Dragged by its handle. */
function ChapterHead({
  chapter,
  at,
  count,
  locale,
  onRename,
  onRemove,
}: {
  chapter: Chapter
  at: number
  count: number
  locale: Locale
  onRename: (title: Chapter['title']) => void
  onRemove: () => void
}) {
  const { t } = useTranslation('learn')
  const shown = useLocale()
  const words = i18n.getFixedT(locale, 'learn')
  const name = localText(chapter.title, shown) || chapter.id
  const menu = t('edit.doc.chapterMenu', { title: name })
  return (
    <div className="mt-4 flex items-end gap-1 px-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="px-3 text-sm font-semibold text-muted-foreground">
          {t('edit.journey.chapterN', { n: at + 1 })}
        </span>
        <DocText
          size="heading"
          label={t('edit.journey.chapterName')}
          value={chapter.title}
          locale={locale}
          placeholder={words('edit.doc.chapterName')}
          onChange={onRename}
          className="rounded-control px-3 text-xl transition-colors duration-150 ease-out hover:bg-muted/60 focus:bg-muted/60"
        />
      </div>
      <ActionMenu
        label={menu}
        align="end"
        trigger={<Ellipsis aria-hidden />}
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-11 shrink-0"
            aria-label={menu}
            title={menu}
          />
        }
        actions={[
          {
            key: 'remove',
            label: t('edit.journey.removeChapter'),
            icon: Trash2,
            destructive: true,
            hidden: count === 1,
            onSelect: onRemove,
          },
        ]}
      />
    </div>
  )
}

/**
 * The level as one document in one language (round 21), in place on the Lessons: its title and
 * goal written where they show; each chapter's heading renamed in place, its ⋯ Remove chapter
 * (asked first); its steps rows dragged into order within the chapter or onto another, each row's
 * menu Remove (with Undo); Add lesson at a chapter's end, Add chapter at the level's.
 */
function LevelDocument({
  initial,
  locale,
  onChange,
  onAddLesson,
}: {
  initial: Journey
  locale: Locale
  onChange: (journey: Journey) => void
  /** Makes a lesson of this name in the chapter; resolves once it is opened, false where it was not made. */
  onAddLesson: (journey: Journey, chapterId: string, name: string) => Promise<boolean>
}) {
  const { t } = useTranslation('learn')
  const shown = useLocale()
  const stepTitle = useStepTitle()
  const words = i18n.getFixedT(locale, 'learn')
  const [journey, setJourney] = useState(initial)
  const change = (next: Journey) => {
    setJourney(next)
    onChange(next)
  }
  const chapters = (next: readonly Chapter[]) => change({ ...journey, chapters: next })
  const reorder = (order: RowOrder) => change(withOrder(journey, order))
  const paint = PAINT[STAGE_PAINT[journey.stage]]
  const rowOf = (chapter: Chapter, step: JourneyStep) => {
    const key = rowKey(chapter, step)
    if (step.kind !== 'lesson')
      return {
        key,
        title: stepTitle(step).primary,
        detail: t('edit.journey.check'),
        icon: step.kind === 'chords' ? KeyboardMusic : ChartNoAxesColumnIncreasing,
        paint: cn(paint.fill, paint.ink),
      }
    const lesson = lessonById(step.lessonId)
    return {
      key,
      title: lesson ? localText(lesson.title, locale) : step.lessonId,
      detail: lesson ? t('edit.journey.lesson') : t('edit.order.unpublished'),
      paint: cn(paint.fill, paint.ink),
      link: <Link to="/lessons/$lessonId/edit" params={{ lessonId: step.lessonId }} />,
    }
  }
  const removeChapter = async (chapter: Chapter, name: string) => {
    const asked = await confirm({
      title: t('edit.journey.removingChapter', { title: name }),
      body: t('edit.journey.removingChapterBody'),
      action: t('edit.order.remove'),
    })
    if (asked) chapters(journey.chapters.filter((each) => each !== chapter))
  }
  return (
    <div className="flex flex-col gap-2">
      <DocText
        size="title"
        label={t('edit.kinds.title')}
        value={journey.title}
        locale={locale}
        placeholder={words('edit.doc.journeyTitle')}
        onChange={(title) => change({ ...journey, title })}
      />
      <DocText
        label={t('edit.journey.goal')}
        value={journey.goal}
        locale={locale}
        placeholder={words('edit.doc.journeyGoal')}
        onChange={(goal) => change({ ...journey, goal })}
      />
      <RowGroups
        groups={journey.chapters.map((chapter, c) => {
          const name = localText(chapter.title, shown) || chapter.id
          return {
            key: chapter.id,
            region: name,
            label: t('edit.journey.steps', { title: name }),
            empty: t('edit.journey.noSteps'),
            head: (
              <ChapterHead
                chapter={chapter}
                at={c}
                count={journey.chapters.length}
                locale={locale}
                onRename={(title) =>
                  chapters(
                    journey.chapters.map((each) => (each === chapter ? { ...each, title } : each)),
                  )
                }
                onRemove={() => void removeChapter(chapter, name)}
              />
            ),
            rows: chapter.steps.map((step) => rowOf(chapter, step)),
            foot: (
              <AddRow
                label={t('edit.order.addLesson')}
                title={t('edit.order.newLesson')}
                createLabel={t('edit.order.createLesson')}
                failed={t('edit.order.addFailed')}
                onCreate={(lesson) => onAddLesson(journey, chapter.id, lesson)}
              />
            ),
          }
        })}
        onChange={reorder}
      />
      <div className="mt-6 border-t border-border pt-4">
        <AddRow
          label={t('edit.order.addChapter')}
          title={t('edit.order.newChapter')}
          createLabel={t('edit.order.createChapter')}
          failed={t('edit.order.addFailed')}
          onCreate={async (name) => {
            const id = slug(
              name,
              journey.chapters.map((chapter) => chapter.id),
              'chapter',
            )
            const title = { en: '', ru: '', [locale]: name }
            chapters([...journey.chapters, { id, title, steps: [] }])
            say(t('edit.journey.chapterAdded', { title: name }))
            return true
          }}
        />
      </div>
    </div>
  )
}

/**
 * A level of the Lessons in Edit mode (R29 B4, content as data ADR 0116), in place on Learn: the
 * level's draft as one document, one language at a time (chosen in the draft's menu); a new lesson
 * made on the server unpublished and opened in the lesson editor. Its bar (`bar`) carries where the
 * draft stands, Publish and the draft's menu before the page's Done; until the draft opens, why not.
 */
export function LevelEditor({
  journey,
  bar,
}: {
  journey: Journey
  /** The page's bar, given the draft's status and actions for its end. */
  bar: (actions: ReactNode) => ReactNode
}) {
  const { t } = useTranslation(['learn', 'editor', 'common'])
  const { t: words } = useTranslation('learn')
  const shown = useLocale()
  const [locale, setLocale] = useState<Locale>(shown)
  const draft = useJourneyDraft(journey)
  const addLesson = useAddLesson()
  const navigate = useNavigate()
  const show = useSetSearch<LearnView>()
  // The last change, where the document opens again (another language): kept as it was written.
  const [written, setWritten] = useState<{ opened: number; journey: Journey } | null>(null)
  const { load } = draft
  const title = localText(load.state === 'ready' ? load.value.title : journey.title, shown)
  const save = (next: Journey) => {
    setWritten({ opened: draft.opened, journey: next })
    draft.save(next)
  }
  const add = async (current: Journey, chapterId: string, name: string) => {
    const made = await addLesson(name, lessonIds())
    if (!made.ok) return false
    save({
      ...current,
      chapters: current.chapters.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, steps: [...chapter.steps, { kind: 'lesson', lessonId: made.value }] }
          : chapter,
      ),
    })
    await draft.flush()
    await navigate({ to: '/lessons/$lessonId/edit', params: { lessonId: made.value } })
    return true
  }
  return (
    <>
      {bar(
        load.state === 'ready' ? (
          <>
            <DraftStatus draft={draft} className="me-1" />
            <DraftActions
              draft={draft}
              title={title}
              unreadable={t('learn:edit.journey.unreadable')}
              onReset={draft.reopen}
              more={languageActions(locale, setLocale, words)}
            />
          </>
        ) : null,
      )}
      <div className="mx-auto mt-4 flex w-full max-w-2xl min-w-0 flex-col gap-6">
        {/* The four levels, each its own lessons to edit. */}
        <ChoiceChips
          label={t('learn:journey.label')}
          value={journey.id}
          scroll
          options={allJourneys().map((each) => ({
            value: each.id,
            label: t(`common:stage.${each.stage}`),
          }))}
          onChange={(id) => show({ view: 'lessons', journey: id })}
        />
        {load.state === 'loading' ? (
          <NotOpen line={t('editor:original.opening')} />
        ) : load.state === 'failed' ? (
          <NotOpen
            line={t(
              load.reason === 'offline' ? 'editor:original.offline' : 'editor:original.failed',
            )}
          >
            <Button onClick={draft.reopen}>{t('editor:original.retry')}</Button>
          </NotOpen>
        ) : (
          <Fragment key={`${draft.opened}-${locale}`}>
            <LevelDocument
              locale={locale}
              initial={written?.opened === draft.opened ? written.journey : load.value}
              onChange={save}
              onAddLesson={add}
            />
          </Fragment>
        )}
      </div>
    </>
  )
}
