import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScaleStaff, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setScaleStaff } from '@/features/set-preference'
import { BackButton, GroupLink, GroupRows, GroupSwitch, Sheet, SheetContent } from '@/shared/ui'
import { useScaleSettingsSheet } from '../model/settings-sheet'

/**
 * A scale's page, as the Scales board reads (`r60_scales.py`): the keys at the top, edge to edge; then
 * its name, its music and its sections, one column. On a laptop the column is centred, 880 wide at most,
 * the music 640 inside it, the keys 28 above it. The view's
 * choices are Scale settings, the gear's sheet (canvas 196), over On the staff, a page inside the
 * card (its Back to Scale settings) where the staff's writing is switched: the tonic, the
 * tetrachords. The view's floating bar is its own.
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
  const store = useSettingsStoreApi()
  const staff = useSettings(selectScaleStaff)
  // Scale settings' first page, or On the staff inside it; the card opens on its first page.
  const [onStaff, setOnStaff] = useState(false)
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
      <Sheet
        hung="header"
        open={sheet.open}
        onOpenChange={(open) => {
          if (!open) setOnStaff(false)
          sheet.onOpenChange(open)
        }}
      >
        {onStaff ? (
          <SheetContent
            title={t('scaleStaff.group')}
            back={<BackButton onClick={() => setOnStaff(false)} />}
          >
            <GroupRows>
              <GroupSwitch
                setting="scaleStaff.tonic"
                label={t('scaleStaff.tonic')}
                checked={staff.tonic}
                onCheckedChange={(tonic) => setScaleStaff(store, { tonic })}
              />
              <GroupSwitch
                setting="scaleStaff.tetrachords"
                label={t('scaleStaff.tetrachords')}
                info={t('scaleStaff.tetrachordsDetail')}
                checked={staff.tetrachords}
                onCheckedChange={(tetrachords) => setScaleStaff(store, { tetrachords })}
              />
            </GroupRows>
          </SheetContent>
        ) : (
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
                onClick={() => setOnStaff(true)}
              />
            </GroupRows>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}
