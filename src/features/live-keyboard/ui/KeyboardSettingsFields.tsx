import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { KEY_SIZES, NAMED_KEYS } from '@/shared/lib'
import { Segmented, SettingField, SwitchRow } from '@/shared/ui'

/**
 * The keyboard settings, saved for every keyboard, as Settings lists them (the rail sets them in place). How a swipe
 * plays is the rail's own toggle, beside the keys it changes.
 */
export function KeyboardSettingsFields() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const keyboard = useSettings(selectKeyboard)
  return (
    <div className="flex flex-col gap-4">
      <SettingField label={t('keyboardSettings.keySize.label')}>
        <Segmented
          label={t('keyboardSettings.keySize.label')}
          value={keyboard.keySize}
          options={KEY_SIZES.map((value) => ({
            value,
            label: t(`keyboardSettings.keySize.${value}`),
          }))}
          onChange={(keySize) => setKeyboard(store, { keySize })}
        />
      </SettingField>
      <SettingField label={t('keyboardSettings.namedKeys.label')}>
        <Segmented
          label={t('keyboardSettings.namedKeys.label')}
          value={keyboard.namedKeys}
          options={NAMED_KEYS.map((value) => ({
            value,
            label: t(`keyboardSettings.namedKeys.${value}`),
          }))}
          onChange={(namedKeys) => setKeyboard(store, { namedKeys })}
        />
      </SettingField>
      <div>
        <SwitchRow
          label={t('keyboardSettings.map')}
          checked={keyboard.map}
          onCheckedChange={(map) => setKeyboard(store, { map })}
        />
        <SwitchRow
          label={t('keyboardSettings.typing')}
          detail={keyboard.typing ? t('keyboardSettings.typingHint') : undefined}
          checked={keyboard.typing}
          onCheckedChange={(typing) => setKeyboard(store, { typing })}
          className="border-b-0"
        />
      </div>
    </div>
  )
}
