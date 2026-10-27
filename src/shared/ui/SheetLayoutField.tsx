import { useTranslation } from 'react-i18next'
import { SHEET_VIEWS, type SheetView } from '@/shared/lib'
import { Labelled } from './Labelled'
import { LayoutPicture } from './LayoutPicture'
import { PictureTiles } from './PictureTiles'

/**
 * How a score is laid out (ADR 0096, 0108, 0115), one choice wherever it is made (the sheet music's
 * part of the Player's View and the editor's, first in both): Page view, Vertical scroll or Panorama
 * (Dorico's and Sibelius's names), each a tile with its miniature, what each does the ⓘ beside its
 * name.
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
    <Labelled label={t('sheet.layout.label')} info={t('sheet.layout.about')}>
      <PictureTiles
        label={t('sheet.layout.label')}
        value={value}
        columns={3}
        tiles={SHEET_VIEWS.map((layout) => ({
          value: layout,
          label: t(`sheet.layout.${layout}`),
          picture: <LayoutPicture layout={layout} />,
        }))}
        onChange={onChange}
      />
    </Labelled>
  )
}
