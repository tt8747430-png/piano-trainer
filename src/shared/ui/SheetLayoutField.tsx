import { useTranslation } from 'react-i18next'
import { SHEET_VIEWS, type SheetView } from '@/shared/lib'
import { MenuSection } from './MenuSection'
import { Segmented } from './Segmented'
import { SheetViewIcon } from './SheetViewIcon'

/**
 * How a score is laid out (ADR 0064), one choice wherever it is made (the Player's and the editor's
 * View menus, first in both, ADR 0085): across on one line, in lines down the screen, or on A4
 * pages, each drawn. A menu's group, under the same heading as the groups after it.
 */
export function SheetLayoutField({
  value,
  onChange,
}: {
  value: SheetView
  onChange: (layout: SheetView) => void
}) {
  const { t } = useTranslation('music')
  return (
    <MenuSection title={t('sheet.layout.label')}>
      <Segmented
        label={t('sheet.layout.label')}
        value={value}
        options={SHEET_VIEWS.map((each) => ({
          value: each,
          label: t(`sheet.layout.${each}`),
          icon: <SheetViewIcon view={each} />,
        }))}
        onChange={onChange}
      />
    </MenuSection>
  )
}
