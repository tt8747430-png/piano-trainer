import { useParams, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { courseLesson } from '@/entities/course'
import { blankLesson, lessonById, type Lesson } from '@/entities/lesson'
import { useLessonDraft } from '@/features/edit-original'
import { localText, useLocale } from '@/shared/i18n'
import { useUp } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import { say } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { exampleTarget } from '../model/editor-target'
import {
  exampleBlock,
  exampleMusic,
  notesBlocks,
  withNotesBlock,
  type ExampleRefusal,
  type NotesBlock,
} from '../model/example-music'
import { NotOpen } from './NotOpen'
import { ScoreEditor } from './ScoreEditor'

/**
 * A lesson's example of notes on its own score (round 27, plan §6b): the lesson's draft opened (a
 * course's lesson's where the route names its course), its `n`th example of notes written as a
 * score the score editor edits with all it has, each change written back into the draft as the
 * lesson writes the example; what the example cannot hold (a mark, notes struck together, a staff
 * more) said once, the example last written kept. Close and Done save the draft and go back to the
 * lesson's editor. An editor's alone.
 */
export function ExampleEditorPage() {
  const { t } = useTranslation('editor')
  const { account } = useAccount()
  const { lessonId } = useParams({ from: '/full-screen/lessons/$lessonId/example' })
  const { n, course } = useSearch({ from: '/full-screen/lessons/$lessonId/example' })
  if (!editsContent(account)) return <NotOpen line={t('original.editorsOnly')} />
  const lesson =
    (course ? courseLesson(course, lessonId)?.lesson : lessonById(lessonId)) ??
    blankLesson(lessonId)
  return (
    <ExampleOf
      key={`${course ?? ''}/${lessonId}/${n}`}
      lesson={lesson}
      draftId={course ? `${course}/${lessonId}` : lessonId}
      at={n}
    />
  )
}

function ExampleOf({ lesson, draftId, at }: { lesson: Lesson; draftId: string; at: number }) {
  const { t } = useTranslation('editor')
  // Up to the lesson's editor (its course's lesson's, under a course), the draft written first.
  const up = useUp()
  const draft = useLessonDraft(lesson, draftId)
  const { load, flush } = draft
  const back = async () => {
    await flush()
    up()
  }
  if (load.state === 'loading') return <NotOpen line={t('original.opening')} />
  if (load.state === 'failed')
    return (
      <NotOpen line={t(load.reason === 'offline' ? 'original.offline' : 'original.failed')}>
        <Button onClick={draft.reopen}>{t('original.retry')}</Button>
      </NotOpen>
    )
  const block = notesBlocks(load.value)[at]
  if (!block) return <NotOpen line={t('example.missing')} />
  return (
    <ExampleScore
      key={draft.opened}
      opened={load.value}
      block={block}
      at={at}
      save={draft.save}
      back={() => void back()}
    />
  )
}

/** The example's score, opened once on the draft as read; its changes its own from then. */
function ExampleScore({
  opened,
  block,
  at,
  save,
  back,
}: {
  opened: Lesson
  block: NotesBlock
  at: number
  save: (lesson: Lesson) => void
  back: () => void
}) {
  const { t } = useTranslation('editor')
  const locale = useLocale()
  const { t: tc } = useTranslation('common')
  const [target] = useState(() => {
    // The lesson as last written here, each change replacing its example in it; and what the example
    // could not hold, said once until it changes.
    let latest = opened
    let refused: ExampleRefusal | null = null
    return exampleTarget(
      localText(opened.title, locale),
      exampleMusic(block),
      (music) => {
        const current = notesBlocks(latest)[at] ?? block
        const written = exampleBlock(music, current)
        if (!written.ok) {
          if (refused !== written.why) say(t(`example.refused.${written.why}`))
          refused = written.why
          return
        }
        refused = null
        latest = withNotesBlock(latest, at, written.block)
        save(latest)
      },
      back,
    )
  })
  return (
    <ScoreEditor
      target={target}
      done={
        <Button variant="tool" className="rounded-pill px-4 font-semibold" onClick={back}>
          {tc('editMode.done')}
        </Button>
      }
    />
  )
}
