import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { isMethodBookId, METHOD_BOOK_NAMES } from '@/entities/book'
import { REFERENCE_PARTS, type ReferencePart } from '@/entities/pattern'
import { NavTabs } from '@/shared/ui'

/**
 * Accompaniment's pages as tabs: each method book's under its name, the rhythm styles, and what the
 * learner keeps. A tab changes the page in the screen's place.
 */
export function AccompanimentTabs({ current }: { current: ReferencePart }) {
  const { t } = useTranslation('practice')
  return (
    <NavTabs
      label={t('subjects.accompaniment')}
      tabs={REFERENCE_PARTS.map((part) => ({
        id: part,
        label: isMethodBookId(part) ? METHOD_BOOK_NAMES[part] : t(`accompaniment.${part}`),
        current: part === current,
        render: <Link to="/practice/accompaniment" search={{ show: part }} replace />,
      }))}
    />
  )
}
