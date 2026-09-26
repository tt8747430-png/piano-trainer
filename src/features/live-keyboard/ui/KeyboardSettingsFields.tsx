import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { KEY_SIZES, NAMED_KEYS, SWIPES } from '@/shared/lib'
import { Segmented } from '@/shared/ui'
import { Switch } from '@/shared/ui/primitives/switch'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
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
        <label className="flex min-h-14 items-center justify-between gap-4 border-b border-border">
          {t('keyboardSettings.map')}
          <Switch checked={keyboard.map} onCheckedChange={(map) => setKeyboard(store, { map })} />
        </label>
        <label className="flex min-h-14 items-center justify-between gap-4">
          <span className="flex flex-col">
            {t('keyboardSettings.typing')}
            {keyboard.typing ? (
              <span className="text-sm text-muted-foreground">
                {t('keyboardSettings.typingHint')}
              </span>
            ) : null}
          </span>
          <Switch
            checked={keyboard.typing}
            onCheckedChange={(typing) => setKeyboard(store, { typing })}
          />
        </label>
      </div>
    </div>
  )
}
