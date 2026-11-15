import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScaleStaff, useSettings } from '@/entities/settings'
import { GroupLink, GroupRows, Sheet, SheetContent } from '@/shared/ui'
import { useScaleSettingsSheet } from '../model/settings-sheet'

/**
 * A view of a scale, as the Chords page reads (canvas 174): the keys at the top, edge to edge; then its
 * name, line and views; its music; then its sections. On a laptop (canvas 197) the keys are a card
 * heading the first column over the name and the music, the sections a 400 column beside them. The view's
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
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start lg:gap-x-10 lg:gap-y-5 lg:pt-2">
      {keyboard}
      <div className="flex min-w-0 flex-col gap-4 lg:col-start-1 lg:row-start-2 lg:gap-5">
        {heading}
        {music}
      </div>
      <div className="flex min-w-0 flex-col gap-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:gap-5 lg:pt-1">
        {children}
      </div>
      {bar}
      <Sheet open={sheet.open} onOpenChange={sheet.onOpenChange}>
        <SheetContent title={t('scales.settings')}>
          <div className="flex flex-col gap-4">
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
                onClick={() =>
                  void navigate({ to: '/settings/scales', search: { from: 'scales' } })
                }
              />
            </GroupRows>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
