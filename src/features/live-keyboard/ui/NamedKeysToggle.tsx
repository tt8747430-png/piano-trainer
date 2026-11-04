import { CaseSensitive } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { nextNamedKeys } from '@/shared/lib'
import { RailButton } from '@/shared/ui'

/**
 * The rail's note names: one button that goes round every C, every key, none, wearing what the keys
 * show (the names struck out when they carry none) and saying it; saved for every keyboard. Where the
 * screen hides the names (a round played on the keys) it stays in its place, off and out of reach.
 */
export function NamedKeysToggle({ disabled = false }: { disabled?: boolean }) {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const namedKeys = useSettings((state) => selectKeyboard(state).namedKeys)
  return (
    <RailButton
      label={t(`rail.names.${namedKeys}`)}
      name={`${t('rail.named.noteNames')}: ${t(`rail.named.noteValue.${namedKeys}`)}`}
      icon={CaseSensitive}
      aria-pressed={namedKeys !== 'none' && !disabled}
      disabled={disabled}
      onClick={() => setKeyboard(store, { namedKeys: nextNamedKeys(namedKeys) })}
    />
  )
}
