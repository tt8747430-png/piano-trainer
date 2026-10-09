import { Keyboard, Map as MapIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { MidiSoundToggle } from '@/features/connect-midi'
import { setKeyboard } from '@/features/set-preference'
import { KEY_SIZES, NAMED_KEYS } from '@/shared/lib'
import { RailButton, RailChoice } from '@/shared/ui'

/**
 * The keyboard settings set in the rail, every one in sight and saved for every keyboard: the keys'
 * size and the note names as small choices, the map and typing from the computer keyboard as
 * toggles; while a MIDI keyboard is connected, whether the app sounds it. How a swipe plays is the
 * rail's own glissando toggle beside them.
 */
export function KeyboardRailSettings() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const keyboard = useSettings(selectKeyboard)
  return (
    <>
      <RailChoice
        label={t('keyboardSettings.keySize.label')}
        value={keyboard.keySize}
        options={KEY_SIZES.map((value) => ({
          value,
          label: t(`keyboardSettings.keySize.${value}`),
        }))}
        onChange={(keySize) => setKeyboard(store, { keySize })}
      />
      <RailChoice
        label={t('keyboardSettings.namedKeys.label')}
        value={keyboard.namedKeys}
        options={NAMED_KEYS.map((value) => ({
          value,
          label: t(`keyboardSettings.namedKeys.${value}`),
        }))}
        onChange={(namedKeys) => setKeyboard(store, { namedKeys })}
      />
      <RailButton
        label={t('keyboardSettings.map')}
        icon={MapIcon}
        aria-pressed={keyboard.map}
        title={t('keyboardSettings.map')}
        onClick={() => setKeyboard(store, { map: !keyboard.map })}
      />
      <RailButton
        label={t('keyboardSettings.typing')}
        icon={Keyboard}
        aria-pressed={keyboard.typing}
        title={keyboard.typing ? t('keyboardSettings.typingHint') : t('keyboardSettings.typing')}
        onClick={() => setKeyboard(store, { typing: !keyboard.typing })}
      />
      <MidiSoundToggle />
    </>
  )
}
