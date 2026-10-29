import { Link, useNavigate } from '@tanstack/react-router'
import { useId, useState, type ReactElement, type ReactNode } from 'react'
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
import { localText, useLocale } from '@/shared/i18n'
import { slug } from '@/shared/lib'
import { InfoTip } from '@/shared/ui'
import { useStepTitle } from '@/widgets/curriculum'
import { DraftScreen } from '@/widgets/content-editor'
import { AddByName, OrderList } from '@/widgets/content-editor'
import { TextFields } from '@/widgets/content-editor'

/** A chapter's name, its steps in order (each lesson opened in its editor) and a new lesson added. */
function ChapterFields({
  chapter,
  onChange,
  onAdd,
}: {
  chapter: Chapter
  onChange: (chapter: Chapter) => void
  onAdd: (name: string) => Promise<boolean>
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const stepTitle = useStepTitle()
  const headingId = useId()
  const name = localText(chapter.title, locale) || chapter.id
  const steps = new Map<string, JourneyStep>(chapter.steps.map((step) => [stepIdOf(step), step]))
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3 card p-4">
      <h3 id={headingId} className="font-display text-lg">
        {name}
      </h3>
      <TextFields
        value={chapter.title}
        label={t('edit.journey.chapterName')}
        onChange={(title) => onChange({ ...chapter, title })}
      />
      {chapter.steps.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('edit.journey.noSteps')}</p>
      ) : (
        <OrderList
          label={t('edit.journey.steps', { title: name })}
          rows={[...steps].map(([key, step]) => {
            if (step.kind !== 'lesson')
              return { key, title: stepTitle(step).primary, detail: t('edit.journey.check') }
            const lesson = lessonById(step.lessonId)
            return {
              key,
              title: lesson ? localText(lesson.title, locale) : step.lessonId,
              detail: lesson ? undefined : t('edit.order.unpublished'),
              link: <Link to="/lessons/$lessonId/edit" params={{ lessonId: step.lessonId }} />,
            }
          })}
          onChange={(keys) =>
            onChange({ ...chapter, steps: keys.flatMap((key) => steps.get(key) ?? []) })
          }
        />
      )}
      <AddByName
        label={t('edit.order.newLesson')}
        action={t('edit.order.addLesson')}
        failed={t('edit.order.addFailed')}
        onAdd={onAdd}
      />
    </section>
  )
}

/** The journey's title, goal and chapters as fields, each change saved to the draft as it rests. */
function JourneyForm({
  initial,
  onChange,
  onAddLesson,
}: {
  initial: Journey
  onChange: (journey: Journey) => void
  /** Makes a lesson of this name in the chapter; resolves once it is opened, false where it was not made. */
  onAddLesson: (journey: Journey, chapterId: string, name: string) => Promise<boolean>
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const [journey, setJourney] = useState(initial)
  const chaptersId = useId()
  const change = (next: Journey) => {
    setJourney(next)
    onChange(next)
  }
  const chapters = new Map(journey.chapters.map((chapter) => [chapter.id, chapter]))
  const setChapter = (next: Chapter) =>
    change({
      ...journey,
      chapters: journey.chapters.map((chapter) => (chapter.id === next.id ? next : chapter)),
    })
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-1">
          <h2 className="font-display text-xl">{t('edit.journey.heading')}</h2>
          <InfoTip name={t('edit.journey.heading')}>{t('edit.journey.info')}</InfoTip>
        </div>
        <TextFields
          value={journey.title}
          label={t('edit.kinds.title')}
          onChange={(title) => change({ ...journey, title })}
        />
        <TextFields
          value={journey.goal}
          label={t('edit.journey.goal')}
          onChange={(goal) => change({ ...journey, goal })}
        />
      </section>
      <section aria-labelledby={chaptersId} className="flex flex-col gap-4">
        <div className="flex items-center gap-1">
          <h2 id={chaptersId} className="font-display text-xl">
            {t('edit.journey.chapters')}
          </h2>
          <InfoTip name={t('edit.journey.chapters')}>{t('edit.journey.chaptersInfo')}</InfoTip>
        </div>
        <OrderList
          label={t('edit.journey.chapters')}
          rows={journey.chapters.map((chapter) => ({
            key: chapter.id,
            title: localText(chapter.title, locale) || chapter.id,
          }))}
          onChange={(keys) =>
            change({ ...journey, chapters: keys.flatMap((key) => chapters.get(key) ?? []) })
          }
        />
        <AddByName
          label={t('edit.order.newChapter')}
          action={t('edit.order.addChapter')}
          failed={t('edit.order.addFailed')}
          onAdd={async (name) => {
            const id = slug(name, chapters.keys(), 'chapter')
            const chapter: Chapter = { id, title: { en: name.trim(), ru: '' }, steps: [] }
            change({ ...journey, chapters: [...journey.chapters, chapter] })
            return true
          }}
        />
        {journey.chapters.map((chapter) => (
          <ChapterFields
            key={chapter.id}
            chapter={chapter}
            onChange={setChapter}
            onAdd={(name) => onAddLesson(journey, chapter.id, name)}
          />
        ))}
      </section>
    </div>
  )
}

/**
 * An editor's journey editor (content as data, ADR 0116): the journey's title and goal, its chapters
 * in order (named, moved, removed, a new one added) and each chapter's steps in order (a new lesson
 * added, made on the server unpublished and opened in the lesson editor), on the journey's draft.
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
  const locale = useLocale()
  const draft = useJourneyDraft(journey)
  const addLesson = useAddLesson()
  const navigate = useNavigate()
  const title = localText(
    draft.load.state === 'ready' ? draft.load.value.title : journey.title,
    locale,
  )
  const add = async (current: Journey, chapterId: string, name: string) => {
    const made = await addLesson(name, lessonIds())
    if (!made.ok) return false
    draft.save({
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
      heading={t('edit.title', { title })}
      title={title}
      back={back}
      backTo={{ link: toLessons, label: t('edit.journey.back') }}
      editorsOnly={t('edit.journey.editorsOnly')}
      unreadable={t('edit.journey.unreadable')}
    >
      {(initial) => <JourneyForm initial={initial} onChange={draft.save} onAddLesson={add} />}
    </DraftScreen>
  )
}
