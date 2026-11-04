import { Music2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { RailButton } from '@/shared/ui'

/**
 * The rail's chord names: on, the rail names the chord a hand holds; off, it says nothing. It wears
 * a chord's symbol, what it shows; saved for every keyboard. Where the screen names no chord (a
 * round) it stays in its place, off and out of reach.
 */
export function ChordNamesToggle({ disabled = false }: { disabled?: boolean }) {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const chordNames = useSettings((state) => selectKeyboard(state).chordNames)
  return (
    <RailButton
      label={t('keyboardSettings.chordNames')}
      title={t('rail.chordNamesTitle')}
      name={t('rail.named.chordNames')}
      icon={Music2}
      aria-pressed={chordNames && !disabled}
      disabled={disabled}
      onClick={() => setKeyboard(store, { chordNames: !chordNames })}
    />
  )
}
