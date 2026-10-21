import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { ShortcutsButton } from '@/features/shortcuts-help'
import { KEY_DOCKS, KEY_LENGTHS, KEY_SIZES, NAMED_KEYS, SWIPES } from '@/shared/lib'
import { Segmented, SettingField, SwitchRow } from '@/shared/ui'
import { RailControlsField } from './RailControlsField'

/** A part of the keyboard settings under its own small heading. */
function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

/**
 * The keyboard settings, saved for every keyboard, as Settings lists them, each saying what it does:
 * how the keys look, where a page's keys sit, how they play, and which controls the bar over the keys
 * holds (it sets the same settings in place, as pictures). Under them, the way to the shortcuts.
 */
export function KeyboardSettingsFields() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const keyboard = useSettings(selectKeyboard)
  return (
    <div className="flex flex-col gap-8">
      <Part title={t('keyboardSettings.look')}>
        <SettingField
          label={t('keyboardSettings.keySize.label')}
          detail={t('keyboardSettings.keySize.detail')}
        >
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
        <SettingField
          label={t('keyboardSettings.keyLength.label')}
          detail={t('keyboardSettings.keyLength.detail')}
        >
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
        <SettingField
          label={t('keyboardSettings.namedKeys.label')}
          detail={t('keyboardSettings.namedKeys.detail')}
        >
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
            label={t('keyboardSettings.markNotes')}
            detail={t('keyboardSettings.markNotesNote')}
            checked={keyboard.markNotes}
            onCheckedChange={(markNotes) => setKeyboard(store, { markNotes })}
          />
          <SwitchRow
            label={t('keyboardSettings.chordNames')}
            detail={t('keyboardSettings.chordNamesNote')}
            checked={keyboard.chordNames}
            onCheckedChange={(chordNames) => setKeyboard(store, { chordNames })}
            className="border-b-0"
          />
        </div>
      </Part>
      <Part title={t('keyboardSettings.place')}>
        <SettingField
          label={t('keyboardSettings.dock.label')}
          detail={t('keyboardSettings.dock.detail')}
        >
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
        <SwitchRow
          label={t('keyboardSettings.folded')}
          detail={t('keyboardSettings.foldedNote')}
          checked={keyboard.folded}
          onCheckedChange={(folded) => setKeyboard(store, { folded })}
        />
        <SwitchRow
          label={t('keyboardSettings.foldedLandscape')}
          detail={t('keyboardSettings.foldedLandscapeNote')}
          checked={keyboard.foldedLandscape}
          onCheckedChange={(foldedLandscape) => setKeyboard(store, { foldedLandscape })}
          className="border-b-0"
        />
      </Part>
      <Part title={t('keyboardSettings.play')}>
        <SettingField
          label={t('keyboardSettings.swipe.label')}
          detail={t('keyboardSettings.swipe.detail')}
        >
          <Segmented
            label={t('keyboardSettings.swipe.label')}
            value={keyboard.swipe}
            options={SWIPES.map((value) => ({
              value,
              label: t(`keyboardSettings.swipe.${value}`),
            }))}
            onChange={(swipe) => setKeyboard(store, { swipe })}
          />
        </SettingField>
        <SwitchRow
          label={t('keyboardSettings.typing')}
          detail={t(
            keyboard.typing ? 'keyboardSettings.typingHint' : 'keyboardSettings.typingNote',
          )}
          checked={keyboard.typing}
          onCheckedChange={(typing) => setKeyboard(store, { typing })}
          className="border-b-0"
        />
      </Part>
      <Part title={t('keyboardSettings.bar')}>
        <RailControlsField />
      </Part>
      <ShortcutsButton />
    </div>
  )
}
