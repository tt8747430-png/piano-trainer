import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { FileText, GalleryHorizontalEnd, Rows3, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn, SHEET_VIEWS, type SheetView } from '@/shared/lib'

/** Each layout's picture: pages, systems down the screen, one line across. */
const ICONS: Readonly<Record<SheetView, LucideIcon>> = {
  page: FileText,
  vertical: Rows3,
  panorama: GalleryHorizontalEnd,
}

/**
 * How a score is laid out (ADR 0096, 0108, 0115, R34), chosen in the sheet's pill (Songscription's
 * Page · Infinite height · Infinite width): Page view, Vertical scroll or Panorama (Dorico's and
 * Sibelius's names), three icon radios on the kit's radio group, each named and saying what it does
 * when pointed at; the arrows move to one and choose it.
 */
export function SheetLayoutPicker({
  value,
  onChange,
}: {
  value: SheetView
  onChange: (layout: SheetView) => void
}) {
  const { t } = useTranslation('music')
  return (
    <RadioGroup
      aria-label={t('sheet.layout.label')}
      data-setting="scoreView.layout"
      value={value}
      onValueChange={(next) => {
        const picked = SHEET_VIEWS.find((layout) => layout === next)
        if (picked) onChange(picked)
      }}
      className="flex items-center"
    >
      {SHEET_VIEWS.map((layout) => {
        const Icon = ICONS[layout]
        const chosen = layout === value
        return (
          <Radio.Root
            key={layout}
            value={layout}
            aria-label={t(`sheet.layout.${layout}`)}
            title={`${t(`sheet.layout.${layout}`)}: ${t(`sheet.layout.describe.${layout}`)}`}
            data-layout={layout}
            className={cn(
              'grid size-11 place-items-center rounded-pill transition-colors duration-200 ease-out hover:bg-muted [&_svg]:size-5',
              chosen && 'bg-chosen',
            )}
          >
            <Icon aria-hidden />
          </Radio.Root>
        )
      })}
    </RadioGroup>
  )
}
