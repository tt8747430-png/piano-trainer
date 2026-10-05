import { Waves } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { RailButton } from '@/shared/ui'

/** The rail's glissando toggle: on, every key a finger slides onto sounds; off, only the key it touched. */
export function GlissandoToggle() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const on = useSettings((state) => selectKeyboard(state).swipe === 'glissando')
  return (
    <RailButton
      label={t('rail.glissando')}
      icon={Waves}
      aria-pressed={on}
      onClick={() => setKeyboard(store, { swipe: on ? 'scroll' : 'glissando' })}
    />
  )
}
