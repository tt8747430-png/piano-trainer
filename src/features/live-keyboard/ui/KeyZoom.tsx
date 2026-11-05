import { ZoomIn, ZoomOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { zoomKeySize } from '@/shared/lib'
import { RailButton } from '@/shared/ui'

/**
 * The rail's zoom: the key size a step smaller or larger (the whole piano, the screen's keys fitted,
 * large keys), saved for every keyboard. The keys are its state; the button at an end is off.
 */
export function KeyZoom() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const keySize = useSettings((state) => selectKeyboard(state).keySize)
  const smaller = zoomKeySize(keySize, -1)
  const larger = zoomKeySize(keySize, 1)
  // The pair named once under it (R29 A26): Zoom.
  return (
    <div className="flex h-14 shrink-0 flex-col items-center justify-end pb-1 text-on-key-rail">
      <div className="flex">
        <RailButton
          label={t('rail.zoomOut')}
          icon={ZoomOut}
          className="h-10 justify-center pb-0"
          disabled={smaller === null}
          onClick={() => smaller && setKeyboard(store, { keySize: smaller })}
        />
        <RailButton
          label={t('rail.zoomIn')}
          icon={ZoomIn}
          className="h-10 justify-center pb-0"
          disabled={larger === null}
          onClick={() => larger && setKeyboard(store, { keySize: larger })}
        />
      </div>
      <span aria-hidden className="text-[11px] leading-tight">
        {t('rail.named.zoom')}
      </span>
    </div>
  )
}
