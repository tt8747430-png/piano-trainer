import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScaleStaff, useSettings } from '@/entities/settings'
import { GroupLink, GroupRows, Sheet, SheetContent } from '@/shared/ui'
import { useScaleSettingsSheet } from '../model/settings-sheet'

/**
 * A scale's page, as the Scales board reads (`r60_scales.py`): the keys at the top, edge to edge; then
 * its name, its music and its sections, one column. On a laptop the column is centred, 880 wide at most,
 * the music 640 inside it, the keys 28 above it. The view's
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
  const navigate = useNavigate()
  const staff = useSettings(selectScaleStaff)
  const written = (['tonic', 'tetrachords'] as const).filter((layer) => staff[layer])
  return (
    <div className="flex flex-col gap-4 lg:gap-7">
      {keyboard}
      <div className="flex min-w-0 flex-col gap-4 lg:mx-auto lg:w-full lg:max-w-220 lg:gap-6">
        {heading}
        {music}
        {children}
      </div>
      {bar}
      <Sheet hung="header" open={sheet.open} onOpenChange={sheet.onOpenChange}>
        <SheetContent title={t('scales.settings')}>
          {fields}
          <GroupRows>
            <GroupLink
              label={t('scaleStaff.group')}
              aria-haspopup={undefined}
              value={
                written.length
                  ? written.map((layer) => t(`scaleStaff.${layer}`)).join(', ')
                  : t('scaleStaff.none')
              }
              onClick={() => void navigate({ to: '/settings/scales', search: { from: 'scales' } })}
            />
          </GroupRows>
        </SheetContent>
      </Sheet>
    </div>
  )
}
