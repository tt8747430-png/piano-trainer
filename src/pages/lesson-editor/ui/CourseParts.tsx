import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { i18n, type Locale, type LocalText } from '@/shared/i18n'
import { AddRow, DocText, RowGroups, type AddGroup, type DocRow } from '@/widgets/content-editor'

/**
 * What every course's document has (round 21; R30-5 for the learner's own): its title as the page's
 * heading and its summary under it, written in place; what stands under them (`children`: its
 * properties, its About); then its lessons as rows dragged into order, each opened or removed, and
 * Add lesson at their end, finding a lesson by name or making a new one.
 */
export function CourseParts({
  locale,
  title,
  summary,
  onTitle,
  onSummary,
  summaryPlaceholder,
  rows,
  found,
  onPick,
  onCreate,
  onOrder,
  children,
}: {
  locale: Locale
  title: LocalText
  summary: LocalText
  onTitle: (title: LocalText) => void
  onSummary: (summary: LocalText) => void
  /** What the summary is for, in the language written. */
  summaryPlaceholder: string
  /** Its lessons, in order. */
  rows: readonly DocRow[]
  /** What Add lesson finds by name. */
  found: readonly AddGroup[]
  onPick: (id: string) => void
  /** Makes a lesson of this name; resolves once it is listed and opened, false where it was not made. */
  onCreate: (name: string) => Promise<boolean>
  /** Its lessons' ids in their new order. */
  onOrder: (ids: readonly string[]) => void
  children: ReactNode
}) {
  const { t } = useTranslation('learn')
  const words = i18n.getFixedT(locale, 'learn')
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <DocText
          size="title"
          label={t('edit.kinds.title')}
          value={title}
          locale={locale}
          placeholder={words('edit.doc.courseTitle')}
          onChange={onTitle}
        />
        <DocText
          label={t('edit.kinds.summary')}
          value={summary}
          locale={locale}
          placeholder={summaryPlaceholder}
          onChange={onSummary}
        />
      </div>
      {children}
      <RowGroups
        groups={[
          {
            key: 'lessons',
            label: t('edit.course.lessonList'),
            head: <h2 className="font-sans text-xl font-bold">{t('edit.course.lessonList')}</h2>,
            empty: t('edit.course.noLessons'),
            rows,
            foot: (
              <AddRow
                label={t('edit.order.addLesson')}
                title={t('edit.order.newLesson')}
                createLabel={t('edit.order.createLesson')}
                failed={t('edit.order.addFailed')}
                found={found}
                onPick={onPick}
                onCreate={onCreate}
              />
            ),
          },
        ]}
        onChange={([group]) => onOrder(group?.rows ?? [])}
      />
    </div>
  )
}
