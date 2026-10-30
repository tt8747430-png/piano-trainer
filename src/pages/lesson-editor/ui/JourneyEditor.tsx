import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowDown, ArrowUp, Ellipsis, Trash2 } from 'lucide-react'
import { useRef, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  lessonById,
  lessonIds,
  type Chapter,
  type Journey,
  type JourneyStep,
} from '@/entities/lesson'
import { stepIdOf } from '@/entities/step'
import { useAddLesson, useJourneyDraft } from '@/features/edit-original'
import { i18n, localText, useLocale, type Locale } from '@/shared/i18n'
import { slug } from '@/shared/lib'
import { ActionMenu, say } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useStepTitle } from '@/widgets/curriculum'
import {
  AddRow,
  DocText,
  DraftScreen,
  LanguageChoice,
  RowGroups,
  type RowOrder,
} from '@/widgets/content-editor'

/** A step's row key: its chapter's and its own, so a Check asked in two chapters is two rows. */
const rowKey = (chapter: Chapter, step: JourneyStep) => `${chapter.id}|${stepIdOf(step)}`

/** A chapter moved up or down by one; the same chapters where it cannot move. */
function moved(chapters: readonly Chapter[], at: number, by: -1 | 1): readonly Chapter[] {
  const to = at + by
  if (to < 0 || to >= chapters.length) return chapters
  const next = [...chapters]
  const [chapter] = next.splice(at, 1)
  if (chapter) next.splice(to, 0, chapter)
  return next
}

/** A chapter's heading, renamed in place, and its menu: moved up or down, or removed (with Undo). */
function ChapterHead({
  chapter,
  at,
  count,
  locale,
  onRename,
  onMove,
  onRemove,
}: {
  chapter: Chapter
  at: number
  count: number
  locale: Locale
  onRename: (title: Chapter['title']) => void
  onMove: (by: -1 | 1) => void
  onRemove: () => void
}) {
  const { t } = useTranslation('learn')
  const shown = useLocale()
  const words = i18n.getFixedT(locale, 'learn')
  const name = localText(chapter.title, shown) || chapter.id
  const menu = t('edit.doc.chapterMenu', { title: name })
  return (
    <div className="mt-6 flex items-start gap-1 border-t border-border pt-6">
      <DocText
        size="heading"
        label={t('edit.journey.chapterName')}
        value={chapter.title}
        locale={locale}
        placeholder={words('edit.doc.chapterName')}
        onChange={onRename}
        className="min-w-0 flex-1"
      />
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
            key: 'up',
            label: t('edit.order.moveUp', { title: name }),
            icon: ArrowUp,
            disabled: at === 0,
            onSelect: () => onMove(-1),
          },
          {
            key: 'down',
            label: t('edit.order.moveDown', { title: name }),
            icon: ArrowDown,
            disabled: at === count - 1,
            onSelect: () => onMove(1),
          },
          {
            key: 'remove',
            label: t('edit.order.remove', { title: name }),
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
  const steps = new Map(
    journey.chapters.flatMap((chapter) =>
      chapter.steps.map((step) => [rowKey(chapter, step), step] as const),
    ),
  )
  const reorder = (order: RowOrder) =>
    chapters(
      journey.chapters.map((chapter, c) => ({
        ...chapter,
        steps: (order[c]?.rows ?? []).flatMap((key) => steps.get(key) ?? []),
      })),
    )
  const rowOf = (chapter: Chapter, step: JourneyStep) => {
    const key = rowKey(chapter, step)
    if (step.kind !== 'lesson')
      return { key, title: stepTitle(step).primary, detail: t('edit.journey.check') }
    const lesson = lessonById(step.lessonId)
    return {
      key,
      title: lesson ? localText(lesson.title, locale) : step.lessonId,
      detail: lesson ? undefined : t('edit.order.unpublished'),
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
                onMove={(by) => chapters(moved(journey.chapters, c, by))}
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
                newLabel={(lesson) => t('edit.doc.newLesson', { name: lesson })}
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
          newLabel={(name) => t('edit.doc.newChapter', { name })}
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
      bar={<LanguageChoice value={locale} onChange={setLocale} />}
    >
      {(initial) => (
        <JourneyDocument
          key={locale}
          locale={locale}
          initial={written.current?.opened === draft.opened ? written.current.journey : initial}
          onChange={save}
          onAddLesson={add}
        />
      )}
    </DraftScreen>
  )
}
