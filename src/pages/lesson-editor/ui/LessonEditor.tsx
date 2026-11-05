import { Link, useNavigate } from '@tanstack/react-router'
import { useRef, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '@/entities/lesson'
import { useLessonDraft } from '@/features/edit-original'
import { localText, useLocale, type Locale } from '@/shared/i18n'
import { DraftScreen } from '@/widgets/content-editor'
import type { EditAction } from '@/shared/ui'
import { LessonDocument, OpenScore } from '@/widgets/lesson-document'

/**
 * An editor's lesson editor (ADR 0116, round 21): the lesson's draft opened (else the lesson as
 * published) as one document, written where it reads, one language at a time (the bar's choice);
 * each change saved to the draft once the editor rests; the draft's status, Publish and menu in the
 * bar.
 */
export function LessonEditor({
  lesson,
  id,
  back,
  toLesson,
  edit,
  course,
}: {
  lesson: Lesson
  /** The lesson's id in the database (a course's as `<course>/<lesson>`). */
  id: string
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to the lesson's own page. */
  toLesson: ReactElement
  /** Its Edit, in Edit: Done at the bar's end. */
  edit?: EditAction
  /** The course whose lesson it is, where it is a course's: an example's score opens under it. */
  course?: string
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
