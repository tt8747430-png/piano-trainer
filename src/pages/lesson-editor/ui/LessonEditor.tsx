import { Link, useNavigate } from '@tanstack/react-router'
import { useRef, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '@/entities/lesson'
import { useOwnLessonsStoreApi, type OwnLesson } from '@/entities/own-lessons'
import { useLessonDraft } from '@/features/edit-original'
import { saveOwnLesson } from '@/features/manage-own-lessons'
import { localText, useLocale, type Locale } from '@/shared/i18n'
import { useRestingSave } from '@/shared/lib'
import type { EditAction } from '@/shared/ui'
import { DraftScreen, LocalScreen } from '@/widgets/content-editor'
import { inBothLanguages, LessonDocument, OpenScore } from '@/widgets/lesson-document'

/**
 * Where the lesson editor writes: an editor's draft of one of the app's lessons, the database's by
 * `id` (a course's as `<course>/<lesson>`, ADR 0116), or the learner's own lesson on their device
 * (R30-5).
 */
export type LessonSource =
  | { readonly kind: 'draft'; readonly id: string; readonly course?: string }
  | { readonly kind: 'own'; readonly lesson: OwnLesson }

interface EditorProps {
  lesson: Lesson
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to the lesson's own page. */
  toLesson: ReactElement
  /** Its Edit, in Edit: Done at the bar's end. */
  edit?: EditAction | undefined
}

/**
 * The lesson editor (round 21): the lesson as one document, written where it reads. The same editor
 * for an editor's draft of the app's lesson (`source` `draft`) and for the learner's own (`own`).
 */
export function LessonEditor({ source, ...props }: EditorProps & { source: LessonSource }) {
  return source.kind === 'own' ? (
    <OwnLessonEditor {...props} lesson={source.lesson} />
  ) : (
    <DraftLessonEditor {...props} id={source.id} course={source.course} />
  )
}

/**
 * The learner's own lesson (R30-5): the same document, written in the learner's language and read the
 * same in the other; each change kept on the device once the editor rests, Done keeping what waits
 * and reading it. No draft and no Publish: it is theirs. An example of notes is written as text in
 * place (the score editor's Edit music is the app's lessons').
 */
function OwnLessonEditor({
  lesson,
  back,
  edit,
}: Omit<EditorProps, 'lesson'> & { lesson: OwnLesson }) {
  const locale = useLocale()
  const store = useOwnLessonsStoreApi()
  // The lesson as it opened: the document is written from it once, then holds what is written.
  const [initial] = useState(lesson)
  const saving = useRestingSave((next: Lesson) =>
    saveOwnLesson(store, { ...inBothLanguages(next, locale), id: lesson.id }),
  )
  const done: EditAction = {
    editing: true,
    onEdit: () => undefined,
    onDone: () => {
      saving.flush()
      edit?.onDone()
    },
  }
  return (
    <LocalScreen heading={localText(lesson.title, locale)} back={back} edit={done}>
      <LessonDocument locale={locale} initial={initial} onChange={saving.save} />
    </LocalScreen>
  )
}

/**
 * An editor's lesson editor (ADR 0116, round 21): the lesson's draft opened (else the lesson as
 * published) as one document, written where it reads, one language at a time (the bar's choice);
 * each change saved to the draft once the editor rests; the draft's status, Publish and menu in the
 * bar.
 */
function DraftLessonEditor({
  lesson,
  id,
  back,
  toLesson,
  edit,
  course,
}: EditorProps & {
  /** The lesson's id in the database (a course's as `<course>/<lesson>`). */
  id: string
  /** The course whose lesson it is, where it is a course's: an example's score opens under it. */
  course: string | undefined
}) {
  const { t } = useTranslation('learn')
  const shown = useLocale()
  const [locale, setLocale] = useState<Locale>(shown)
  const draft = useLessonDraft(lesson, id)
  const navigate = useNavigate()
  // An example of notes opened on its own score (round 27): the draft saved first, so the score
  // opens on what was just written.
  const openScore = (n: number) =>
    void draft.flush().then(() =>
      navigate({
        to: '/lessons/$lessonId/example',
        params: { lessonId: lesson.id },
        search: { n, ...(course ? { course } : {}) },
      }),
    )
  // The lesson as last written, for the document to open on in the other language.
  const written = useRef<{ opened: number; lesson: Lesson } | null>(null)
  const save = (next: Lesson) => {
    written.current = { opened: draft.opened, lesson: next }
    draft.save(next)
  }
  // A new lesson's name is its draft's: the device has none of it.
  const opened = draft.load.state === 'ready' ? draft.load.value : lesson
  const title = localText(opened.title, shown)
  return (
    <DraftScreen
      draft={draft}
      // The lesson's own title over it, as it reads: the page in Edit, not another page.
      heading={title}
      edit={edit}
      title={title}
      back={back}
      backTo={{ link: toLesson, label: t('edit.back') }}
      editorsOnly={t('edit.editorsOnly')}
      unreadable={t('edit.unreadable')}
      language={{ value: locale, onChange: setLocale }}
      // A level's lesson's Publish page (R29 B6); a course's is published with its course.
      publishPage={
        course
          ? undefined
          : {
              link: <Link to="/lessons/$lessonId/publish" params={{ lessonId: id }} />,
              open: () =>
                void draft
                  .flush()
                  .then(() =>
                    navigate({ to: '/lessons/$lessonId/publish', params: { lessonId: id } }),
                  ),
            }
      }
    >
      {(initial) => {
        const last = written.current?.opened === draft.opened ? written.current.lesson : initial
        return (
          <OpenScore value={openScore}>
            <LessonDocument
              key={locale}
              locale={locale}
              initial={last}
              // The lessons to read first are the lesson's Settings': kept as they opened.
              onChange={save}
            />
          </OpenScore>
        )
      }}
    </DraftScreen>
  )
}
