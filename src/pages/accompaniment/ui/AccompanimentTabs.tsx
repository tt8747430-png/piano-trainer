import { useTranslation } from 'react-i18next'
import { ACCOMPANIMENT_PARTS, usePartName, type AccompanimentPart } from '@/entities/pattern'
import { NavTab, NavTabs } from '@/shared/ui'

/** Accompaniment's parts as tabs: each method book by its own name, then Styles and Yours. */
export function AccompanimentTabs({ current }: { current: AccompanimentPart }) {
  const { t } = useTranslation('practice')
  const partName = usePartName()
  return (
    <NavTabs label={t('pages.accompaniment')}>
      {ACCOMPANIMENT_PARTS.map((part) => (
        <NavTab
          key={part}
          to="/practice/accompaniment"
          search={{ show: part }}
          replace
          current={part === current}
        >
          {partName(part)}
        </NavTab>
      ))}
    </NavTabs>
  )
}
