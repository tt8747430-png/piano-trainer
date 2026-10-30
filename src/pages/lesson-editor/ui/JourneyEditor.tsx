import { Link, useNavigate } from '@tanstack/react-router'
import { ChartNoAxesColumnIncreasing, Ellipsis, KeyboardMusic, Trash2 } from 'lucide-react'
import { useRef, useState, type ReactElement, type ReactNode } from 'react'
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
import { useAddLesson, useJourneyDraft } from '@/features/edit-original'
import { i18n, localText, useLocale, type Locale } from '@/shared/i18n'
import { cn, slug } from '@/shared/lib'
import { ActionMenu, ChoiceChips, PAINT, say } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useStepTitle } from '@/widgets/curriculum'
import { rowKey, withOrder } from '../model/journey-order'
import { AddRow, DocText, DraftScreen, RowGroups, type RowOrder } from '@/widgets/content-editor'

/** A chapter's heading, renamed in place, and its menu: removed (with Undo). Dragged by its handle. */
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
          className="rounded-lg px-3 text-xl transition-colors duration-150 ease-out hover:bg-muted/60 focus:bg-muted/60"
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
            label: t('edit.order.remove'),
            icon: Trash2,
            destructive: true,
            disabled: count === 1,
            onSelect: onRemove,
          },
        ]}
      />
    </div>
  )
}

/**
 * The journey as one document in one language (round 21): its title as the page's heading and its
 * goal under it; each chapter an `h2` renamed in place, its steps rows dragged into order, within
 * the chapter or onto another; a new lesson added at a chapter's end, a new chapter at the journey's.
 * Each change saved to the draft as it rests.
 */
function JourneyDocument({
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
                onRemove={() => {
                  chapters(journey.chapters.filter((each) => each !== chapter))
                  say(t('edit.order.removed', { title: name }), {
                    label: t('edit.order.undo'),
                    onClick: () => change(journey),
                  })
                }}
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
            return true
          }}
        />
      </div>
    </div>
  )
}

/**
 * An editor's journey editor (content as data, ADR 0116, round 21): the journey's draft as one
 * document, one language at a time (the bar's choice): a new lesson made on the server unpublished
 * and opened in the lesson editor; the draft's status, Publish and menu in the bar.
 */
export function JourneyEditor({
  journey,
  back,
  toLessons,
}: {
  journey: Journey
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to the Lessons. */
  toLessons: ReactElement
}) {
  const { t } = useTranslation('learn')
  const { t: tc } = useTranslation('common')
  const shown = useLocale()
  const [locale, setLocale] = useState<Locale>(shown)
  const draft = useJourneyDraft(journey)
  const addLesson = useAddLesson()
  const navigate = useNavigate()
  const written = useRef<{ opened: number; journey: Journey } | null>(null)
  const title = localText(
    draft.load.state === 'ready' ? draft.load.value.title : journey.title,
    shown,
  )
  const save = (next: Journey) => {
    written.current = { opened: draft.opened, journey: next }
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
    <DraftScreen
      draft={draft}
      heading={t('edit.bar.journey')}
      title={title}
      back={back}
      backTo={{ link: toLessons, label: t('edit.journey.back') }}
      editorsOnly={t('edit.journey.editorsOnly')}
      unreadable={t('edit.journey.unreadable')}
      language={{ value: locale, onChange: setLocale }}
    >
      {(initial) => (
        <>
          {/* The four levels, each its own lessons to manage. */}
          <ChoiceChips
            label={t('journey.label')}
            value={journey.id}
            scroll
            options={allJourneys().map((each) => ({
              value: each.id,
              label: tc(`stage.${each.stage}`),
            }))}
            onChange={(journeyId) =>
              void navigate({ to: '/journeys/$journeyId/edit', params: { journeyId } })
            }
          />
          <JourneyDocument
            key={locale}
            locale={locale}
            initial={written.current?.opened === draft.opened ? written.current.journey : initial}
            onChange={save}
            onAddLesson={add}
          />
        </>
      )}
    </DraftScreen>
  )
}
