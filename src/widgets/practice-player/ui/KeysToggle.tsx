import { Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectScoreView, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { Button } from '@/shared/ui/primitives/button'

/** The piano keys under the music, shown or hidden from the bar (R29, Flat's keyboard button). */
export function KeysToggle() {
  const { t } = useTranslation('player')
  const store = useSettingsStoreApi()
  const keys = useSettings((state) => selectScoreView(state).keys)
  return (
    <Button
      variant="tool"
      size="icon"
      aria-label={t('pianoKeys')}
      title={t('pianoKeys')}
      aria-pressed={keys}
      onClick={() => setScoreView(store, { keys: !keys })}
    >
      <Piano aria-hidden />
    </Button>
  )
}
