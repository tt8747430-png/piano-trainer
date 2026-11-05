import { FileText, GalleryHorizontalEnd, Rows3, type LucideIcon } from 'lucide-react'
import type { KeyboardEvent } from 'react'
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
 * Sibelius's names), three icon radios, each named and saying what it does when pointed at. The
 * arrows walk them as a radio group's do.
 */
export function SheetLayoutPicker({
  value,
  onChange,
}: {
  value: SheetView
  onChange: (layout: SheetView) => void
}) {
  const { t } = useTranslation('music')
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (step === undefined) return
    event.preventDefault()
    const at = SHEET_VIEWS.indexOf(value)
    const next = SHEET_VIEWS[(at + step + SHEET_VIEWS.length) % SHEET_VIEWS.length] ?? value
    onChange(next)
    event.currentTarget.querySelector<HTMLElement>(`[data-layout="${next}"]`)?.focus()
  }
  return (
    <div
      role="radiogroup"
      aria-label={t('sheet.layout.label')}
      data-setting="scoreView.layout"
      className="flex items-center"
      onKeyDown={onKeyDown}
    >
      {SHEET_VIEWS.map((layout) => {
        const Icon = ICONS[layout]
        const chosen = layout === value
        return (
          <button
            key={layout}
            type="button"
            role="radio"
            aria-checked={chosen}
            aria-label={t(`sheet.layout.${layout}`)}
            title={`${t(`sheet.layout.${layout}`)}: ${t(`sheet.layout.describe.${layout}`)}`}
            tabIndex={chosen ? 0 : -1}
            data-layout={layout}
            onClick={() => onChange(layout)}
            className={cn(
              'grid size-11 place-items-center rounded-pill transition-colors duration-200 ease-out hover:bg-muted [&_svg]:size-5',
              chosen && 'bg-chosen',
            )}
          >
            <Icon aria-hidden />
          </button>
        )
      })}
    </div>
  )
}
