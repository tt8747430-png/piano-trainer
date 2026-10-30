import { useRef, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '@/entities/lesson'
import { useLessonDraft } from '@/features/edit-original'
import { localText, useLocale, type Locale } from '@/shared/i18n'
import { DraftScreen, LanguageChoice } from '@/widgets/content-editor'
import { LessonDocument } from './document/LessonDocument'

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
}: {
  lesson: Lesson
  /** The lesson's id in the database (a course's as `<course>/<lesson>`). */
  id: string
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to the lesson's own page. */
  toLesson: ReactElement
}) {
  const { t } = useTranslation('learn')
  const shown = useLocale()
  const [locale, setLocale] = useState<Locale>(shown)
  const draft = useLessonDraft(lesson, id)
  // The lesson as last written, for the document to open on in the other language.
  const written = useRef<{ opened: number; lesson: Lesson } | null>(null)
  // A new lesson's name is its draft's: the device has none of it.
  const opened = draft.load.state === 'ready' ? draft.load.value : lesson
  const title = localText(opened.title, shown)
  return (
    <DraftScreen
      draft={draft}
      heading={t('edit.title', { title })}
      title={title}
      back={back}
      backTo={{ link: toLesson, label: t('edit.back') }}
      editorsOnly={t('edit.editorsOnly')}
      unreadable={t('edit.unreadable')}
      bar={<LanguageChoice value={locale} onChange={setLocale} />}
    >
      {(initial) => (
        <LessonDocument
          key={locale}
          locale={locale}
          initial={written.current?.opened === draft.opened ? written.current.lesson : initial}
          onChange={(next) => {
            written.current = { opened: draft.opened, lesson: next }
            draft.save(next)
          }}
        />
      )}
    </DraftScreen>
  )
}
