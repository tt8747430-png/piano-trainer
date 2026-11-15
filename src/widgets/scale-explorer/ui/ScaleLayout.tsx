import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScaleStaff, useSettings } from '@/entities/settings'
import { RowLink, SettingsGroup, Sheet, SheetContent } from '@/shared/ui'
import { useScaleSettingsSheet } from '../model/settings-sheet'

/**
 * A view of a scale, as the Chords page reads (canvas 174): the keys at the top, edge to edge; then,
 * 820 wide at most on a laptop, its name, line and views; its music; then its sections. The view's
 * choices are Scale settings, the gear's sheet (canvas 196), over a link to what the staff writes,
 * whose one home is Settings. The view's floating bar is its own.
 */
export function ScaleLayout({
  keyboard,
  heading,
  music,
  fields,
  bar,
  children,
}: {
  keyboard: ReactNode
  heading: ReactNode
  /** The view's music, the score first (R34). */
  music?: ReactNode
  /** The view's choices, in Scale settings. */
  fields?: ReactNode
  /** The view's floating bar. */
  bar?: ReactNode
  children: ReactNode
}) {
  const { t } = useTranslation('practice')
  const sheet = useScaleSettingsSheet()
  const staff = useSettings(selectScaleStaff)
  const written = (['tonic', 'tetrachords'] as const).filter((layer) => staff[layer])
  return (
    <div className="flex flex-col gap-4">
      {keyboard}
      <div className="flex flex-col gap-4 md:mx-auto md:w-full md:max-w-[51.25rem]">
        {heading}
        {music}
        {children}
      </div>
      {bar}
      <Sheet open={sheet.open} onOpenChange={sheet.onOpenChange}>
        <SheetContent title={t('scales.settings')}>
          <div className="flex flex-col gap-5">
            {fields}
            <SettingsGroup flush>
              <RowLink
                title={t('scaleStaff.group')}
                value={
                  written.length
                    ? written.map((layer) => t(`scaleStaff.${layer}`)).join(', ')
                    : t('scaleStaff.none')
                }
                render={<Link to="/settings/scales" search={{ from: 'scales' }} />}
              />
            </SettingsGroup>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
