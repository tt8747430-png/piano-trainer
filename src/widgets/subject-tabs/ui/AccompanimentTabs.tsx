import { useTranslation } from 'react-i18next'
import { isMethodBookId, METHOD_BOOK_NAMES } from '@/entities/book'
import { REFERENCE_PARTS, type ReferencePart } from '@/entities/pattern'
import { NavTab, NavTabs } from '@/shared/ui'

/**
 * Accompaniment's pages as tabs: each method book's under its name, the rhythm styles, and what the
 * learner keeps. A tab changes the page in the screen's place.
 */
export function AccompanimentTabs({ current }: { current: ReferencePart }) {
  const { t } = useTranslation('practice')
  return (
    <NavTabs label={t('subjects.accompaniment')}>
      {REFERENCE_PARTS.map((part) => (
        <NavTab
          key={part}
          to="/practice/accompaniment"
          search={{ show: part }}
          replace
          current={part === current}
        >
          {isMethodBookId(part) ? METHOD_BOOK_NAMES[part] : t(`accompaniment.${part}`)}
        </NavTab>
      ))}
    </NavTabs>
  )
}
