import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { cn, nextNamedKeys, type NamedKeys } from '@/shared/lib'
import { RailButton } from '@/shared/ui'

/** What the button wears for each choice: the names the keys carry. */
const GLYPH: Readonly<Record<NamedKeys, string>> = { c: 'C', all: 'CDE', none: 'C' }

/**
 * The rail's note names: one button that goes round every C, every key, none, wearing what the keys
 * show (the names struck out when they carry none) and saying it; saved for every keyboard.
 */
export function NamedKeysToggle() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const namedKeys = useSettings((state) => selectKeyboard(state).namedKeys)
  return (
    <RailButton
      label={t(`rail.names.${namedKeys}`)}
      aria-pressed={namedKeys !== 'none'}
      onClick={() => setKeyboard(store, { namedKeys: nextNamedKeys(namedKeys) })}
    >
      <span aria-hidden className={cn(namedKeys === 'none' && 'line-through opacity-70')}>
        {GLYPH[namedKeys]}
      </span>
    </RailButton>
  )
}
