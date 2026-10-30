import { useRef, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { lessonById, lessonIds, type Lesson } from '@/entities/lesson'
import { useLessonDraft } from '@/features/edit-original'
import { localText, useLocale, type Locale } from '@/shared/i18n'
import { MultiDropdown } from '@/shared/ui'
import { DraftScreen, Properties, PropertyRow } from '@/widgets/content-editor'
import { LessonDocument } from './document/LessonDocument'

/** The lesson with these lessons to read first; none, the field left out. */
function withAfter(lesson: Lesson, after: readonly string[]): Lesson {
  const { after: _after, ...rest } = lesson
  return after.length > 0 ? { ...rest, after } : rest
}

/**
 * A level's lesson's one property (round 24): the lessons to read before it, chosen from every other
 * lesson by its name; the Lessons say them under its title.
 */
function ReadFirst({
  lesson,
  value,
  onChange,
}: {
  lesson: string
  value: readonly string[]
  onChange: (after: readonly string[]) => void
}) {
  const { t } = useTranslation('learn')
  const shown = useLocale()
  const [after, setAfter] = useState(value)
  return (
    <Properties label={t('edit.doc.properties')}>
      <PropertyRow name={t('edit.doc.readFirst')}>
        <MultiDropdown
          label={t('edit.doc.readFirst')}
          none={t('edit.doc.readFirstNone')}
          bare
          value={after}
          options={lessonIds()
            .filter((each) => each !== lesson)
            .map((each) => ({
              value: each,
              label: localText(lessonById(each)?.title ?? { en: each, ru: each }, shown),
            }))}
          onChange={(next) => {
            setAfter(next)
            onChange(next)
          }}
        />
      </PropertyRow>
    </Properties>
  )
}

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
  readFirst = false,
}: {
  lesson: Lesson
  /** The lesson's id in the database (a course's as `<course>/<lesson>`). */
  id: string
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to the lesson's own page. */
  toLesson: ReactElement
  /** A level's lesson: the lessons to read before it chosen above the document (a course's has none). */
  readFirst?: boolean
}) {
  const { t } = useTranslation('learn')
  const shown = useLocale()
  const [locale, setLocale] = useState<Locale>(shown)
  const draft = useLessonDraft(lesson, id)
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
      heading={t('edit.bar.lesson')}
      title={title}
      back={back}
      backTo={{ link: toLesson, label: t('edit.back') }}
      editorsOnly={t('edit.editorsOnly')}
      unreadable={t('edit.unreadable')}
      language={{ value: locale, onChange: setLocale }}
    >
      {(initial) => {
        const last = written.current?.opened === draft.opened ? written.current.lesson : initial
        return (
          <>
            {readFirst ? (
              <ReadFirst
                lesson={id}
                value={last.after ?? []}
                onChange={(after) => save(withAfter(written.current?.lesson ?? initial, after))}
              />
            ) : null}
            <LessonDocument
              key={locale}
              locale={locale}
              initial={last}
              // The document keeps what it does not write (the lessons to read first) as it opened;
              // what was chosen since is the last saved.
              onChange={(next) =>
                save(withAfter(next, (written.current?.lesson ?? initial).after ?? []))
              }
            />
          </>
        )
      }}
    </DraftScreen>
  )
}
