import { useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Course, CourseTexts } from '@/entities/course'
import { useCourseDraft } from '@/features/edit-original'
import { localText, useLocale } from '@/shared/i18n'
import { InfoTip } from '@/shared/ui'
import { DraftScreen } from './DraftScreen'
import { TextFields } from './TextFields'

/** The course's title and summary as fields, each change saved to the draft as it rests. */
function CourseForm({
  initial,
  onChange,
}: {
  initial: CourseTexts
  onChange: (texts: CourseTexts) => void
}) {
  const { t } = useTranslation('learn')
  const [texts, setTexts] = useState(initial)
  const change = (next: CourseTexts) => {
    setTexts(next)
    onChange(next)
  }
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-1">
        <h2 className="font-display text-xl">{t('edit.course.heading')}</h2>
        <InfoTip name={t('edit.course.heading')}>{t('edit.course.lessons')}</InfoTip>
      </div>
      <TextFields
        value={texts.title}
        label={t('edit.kinds.title')}
        onChange={(title) => change({ ...texts, title })}
      />
      <TextFields
        value={texts.summary}
        label={t('edit.kinds.summary')}
        onChange={(summary) => change({ ...texts, summary })}
      />
    </section>
  )
}

/**
 * An editor's course editor (ADR 0116, round 12): the course's own title and summary, English and
 * Russian, on the course's draft, with the draft's strip; its lessons are edited each on its own.
 */
export function CourseEditor({
  course,
  back,
  toCourse,
}: {
  course: Course
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to the course's page. */
  toCourse: ReactElement
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const draft = useCourseDraft(course)
  const title = localText(course.title, locale)
  return (
    <DraftScreen
      draft={draft}
      heading={t('edit.title', { title })}
      title={title}
      back={back}
      backTo={{ link: toCourse, label: t('edit.course.back') }}
      editorsOnly={t('edit.course.editorsOnly')}
      unreadable={t('edit.course.unreadable')}
    >
      {(initial) => <CourseForm initial={initial} onChange={draft.save} />}
    </DraftScreen>
  )
}
