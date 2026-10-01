import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { KEY_SIZES, NAMED_KEYS, SWIPES } from '@/shared/lib'
import { Segmented, SwitchRow } from '@/shared/ui'

/** One choice: its name as a row's text (the group around it has the heading), its control under it. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-foreground">{label}</span>
      {children}
    </div>
  )
}

/** The keyboard settings, saved for every keyboard: in the rail's popover and in Settings. */
export function KeyboardSettingsFields() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const keyboard = useSettings(selectKeyboard)
  return (
    <div className="flex flex-col gap-4">
      <Field label={t('keyboardSettings.keySize.label')}>
        <Segmented
          label={t('keyboardSettings.keySize.label')}
          value={keyboard.keySize}
          options={KEY_SIZES.map((value) => ({
            value,
            label: t(`keyboardSettings.keySize.${value}`),
          }))}
          onChange={(keySize) => setKeyboard(store, { keySize })}
        />
      </Field>
      <Field label={t('keyboardSettings.swipe.label')}>
        <Segmented
          label={t('keyboardSettings.swipe.label')}
          value={keyboard.swipe}
          options={SWIPES.map((value) => ({ value, label: t(`keyboardSettings.swipe.${value}`) }))}
          onChange={(swipe) => setKeyboard(store, { swipe })}
        />
      </Field>
      <Field label={t('keyboardSettings.namedKeys.label')}>
        <Segmented
          label={t('keyboardSettings.namedKeys.label')}
          value={keyboard.namedKeys}
          options={NAMED_KEYS.map((value) => ({
            value,
            label: t(`keyboardSettings.namedKeys.${value}`),
          }))}
          onChange={(namedKeys) => setKeyboard(store, { namedKeys })}
        />
      </Field>
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
