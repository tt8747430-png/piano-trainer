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
  return (
    <>
      <RailButton
        label={t('rail.zoomOut')}
        icon={ZoomOut}
        disabled={smaller === null}
        onClick={() => smaller && setKeyboard(store, { keySize: smaller })}
      />
      <RailButton
        label={t('rail.zoomIn')}
        icon={ZoomIn}
        disabled={larger === null}
        onClick={() => larger && setKeyboard(store, { keySize: larger })}
      />
    </>
  )
}
