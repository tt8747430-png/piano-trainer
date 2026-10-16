import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { ShortcutsButton } from '@/features/shortcuts-help'
import { KEY_DOCKS, KEY_LENGTHS, KEY_SIZES, NAMED_KEYS, RAILS } from '@/shared/lib'
import { Segmented, SettingField, SwitchRow } from '@/shared/ui'

/**
 * The keyboard settings, saved for every keyboard, as Settings lists them (the rail sets them in
 * place, as pictures): the keys' size and names, where a page's keys stay, how long they are, what
 * the rail holds, and whether a page's keys are folded away. How a swipe plays is the rail's own toggle, beside the keys it changes. Under
 * them, the way to the computer's shortcuts.
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
      <SwitchRow
        label={t('keyboardSettings.markNotes')}
        detail={t('keyboardSettings.markNotesNote')}
        checked={keyboard.markNotes}
        onCheckedChange={(markNotes) => setKeyboard(store, { markNotes })}
        className="border-b-0"
      />
      <SettingField label={t('keyboardSettings.dock.label')}>
        <Segmented
          label={t('keyboardSettings.dock.label')}
          value={keyboard.dock}
          options={KEY_DOCKS.map((value) => ({
            value,
            label: t(`keyboardSettings.dock.${value}`),
          }))}
          onChange={(dock) => setKeyboard(store, { dock })}
        />
      </SettingField>
      <SettingField label={t('keyboardSettings.keyLength.label')}>
        <Segmented
          label={t('keyboardSettings.keyLength.label')}
          value={keyboard.keyLength}
          options={KEY_LENGTHS.map((value) => ({
            value,
            label: t(`keyboardSettings.keyLength.${value}`),
          }))}
          onChange={(keyLength) => setKeyboard(store, { keyLength })}
        />
      </SettingField>
      <SettingField label={t('keyboardSettings.rail.label')}>
        <Segmented
          label={t('keyboardSettings.rail.label')}
          value={keyboard.rail}
          options={RAILS.map((value) => ({
            value,
            label: t(`keyboardSettings.rail.${value}`),
          }))}
          onChange={(rail) => setKeyboard(store, { rail })}
        />
      </SettingField>
      <SwitchRow
        label={t('keyboardSettings.folded')}
        detail={t('keyboardSettings.foldedNote')}
        checked={keyboard.folded}
        onCheckedChange={(folded) => setKeyboard(store, { folded })}
        className="border-b-0"
      />
      <SwitchRow
        label={t('keyboardSettings.chordNames')}
        checked={keyboard.chordNames}
        onCheckedChange={(chordNames) => setKeyboard(store, { chordNames })}
        className="border-b-0"
      />
      <SwitchRow
        label={t('keyboardSettings.typing')}
        detail={keyboard.typing ? t('keyboardSettings.typingHint') : undefined}
        checked={keyboard.typing}
        onCheckedChange={(typing) => setKeyboard(store, { typing })}
        className="border-b-0"
      />
      <ShortcutsButton />
    </div>
  )
}
