import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import {
  hasFinePointer,
  KEY_DOCKS,
  KEY_SIZES,
  NAMED_KEYS,
  PEDALS_SHOWN,
  SWIPES,
} from '@/shared/lib'
import {
  DockPicture,
  KeySizePicture,
  NoteNamesPicture,
  PictureChoice,
  SettingRows,
  SettingsGroup,
  SwipePicture,
  SwitchRow,
  VolumeSlider,
} from '@/shared/ui'
import { PedalIcon } from './PedalIcon'

/**
 * What matters while playing (R33, musicca's Settings): the key size, the note names, the volume, the
 * pedals and, on a computer, its keys: the On-screen piano page's first group.
 */
export function PianoEssentialRows() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const keyboard = useSettings(selectKeyboard)
  return (
    <>
      <PictureChoice
        setting="keyboard.keySize"
        label={t('keyboardSettings.keySize.label')}
        description={t('keyboardSettings.keySize.detail')}
        value={keyboard.keySize}
        options={KEY_SIZES.map((value) => ({
          value,
          label: t(`keyboardSettings.keySize.${value}`),
          picture: <KeySizePicture size={value} />,
        }))}
        onChange={(keySize) => setKeyboard(store, { keySize })}
      />
      <PictureChoice
        setting="keyboard.namedKeys"
        label={t('keyboardSettings.namedKeys.label')}
        description={t('keyboardSettings.namedKeys.detail')}
        value={keyboard.namedKeys}
        options={NAMED_KEYS.map((value) => ({
          value,
          label: t(`keyboardSettings.namedKeys.${value}`),
          picture: <NoteNamesPicture names={value} />,
        }))}
        onChange={(namedKeys) => setKeyboard(store, { namedKeys })}
      />
      <VolumeSlider
        setting="keyboard.volume"
        label={t('keyboardSettings.volume')}
        value={keyboard.volume}
        onChange={(volume) => setKeyboard(store, { volume })}
      />
      <PictureChoice
        setting="keyboard.pedals"
        label={t('keyboardSettings.pedals.label')}
        description={t('keyboardSettings.pedals.detail')}
        value={keyboard.pedals}
        options={PEDALS_SHOWN.map((value) => ({
          value,
          label: t(`keyboardSettings.pedals.${value}`),
          picture: (
            <span className="flex items-end gap-0.5">
              {Array.from({ length: value === 'all' ? 3 : 1 }, (_, at) => (
                <PedalIcon key={at} />
              ))}
            </span>
          ),
        }))}
        onChange={(pedals) => setKeyboard(store, { pedals })}
      />
      {hasFinePointer() ? <TypingSwitch /> : null}
    </>
  )
}

/**
 * The on-screen piano's settings (R21, R22, R32, R33, R34), saved for every on-screen piano, ordered
 * by what a pianist changes most: Keys and sound, Display (the chord symbol, names on highlighted
 * keys), While you play (the swipe, play on selection), then Placement (where a page docks the keys).
 * The keys' height is the divider's, and showing them the bar's Keyboard: neither is a setting here.
 * Each option says what it does in one line under its name; choices of look are pictures of the keys.
 * Settings › On-screen piano, and the same page in the Player's and the editor's gear.
 */
export function KeyboardSettingsFields() {
  const { t } = useTranslation(['common', 'settings'])
  const store = useSettingsStoreApi()
  const keyboard = useSettings(selectKeyboard)
  return (
    <>
      <SettingsGroup title={t('settings:piano.essentials')}>
        <SettingRows>
          <PianoEssentialRows />
        </SettingRows>
      </SettingsGroup>
      <SettingsGroup title={t('settings:piano.look')}>
        <SettingRows>
          <SwitchRow
            setting="keyboard.chordNames"
            label={t('keyboardSettings.chordNames')}
            description={t('keyboardSettings.chordNamesNote')}
            checked={keyboard.chordNames}
            onCheckedChange={(chordNames) => setKeyboard(store, { chordNames })}
          />
          <SwitchRow
            setting="keyboard.markNotes"
            label={t('keyboardSettings.markNotes')}
            description={t('keyboardSettings.markNotesNote')}
            checked={keyboard.markNotes}
            onCheckedChange={(markNotes) => setKeyboard(store, { markNotes })}
          />
        </SettingRows>
      </SettingsGroup>
      <SettingsGroup title={t('settings:piano.play')}>
        <SettingRows>
          <PictureChoice
            setting="keyboard.swipe"
            label={t('keyboardSettings.swipe.label')}
            description={t('keyboardSettings.swipe.detail')}
            value={keyboard.swipe}
            options={SWIPES.map((value) => ({
              value,
              label: t(`keyboardSettings.swipe.${value}`),
              picture: <SwipePicture swipe={value} />,
            }))}
            onChange={(swipe) => setKeyboard(store, { swipe })}
          />
          <SwitchRow
            setting="keyboard.autoplay"
            label={t('keyboardSettings.autoplay')}
            description={t('keyboardSettings.autoplayNote')}
            checked={keyboard.autoplay}
            onCheckedChange={(autoplay) => setKeyboard(store, { autoplay })}
          />
        </SettingRows>
      </SettingsGroup>
      <SettingsGroup title={t('settings:piano.place')}>
        <SettingRows>
          <PictureChoice
            setting="keyboard.dock"
            label={t('keyboardSettings.dock.label')}
            description={t('keyboardSettings.dock.detail')}
            value={keyboard.dock}
            options={KEY_DOCKS.map((value) => ({
              value,
              label: t(`keyboardSettings.dock.${value}`),
              picture: <DockPicture dock={value} />,
            }))}
            onChange={(dock) => setKeyboard(store, { dock })}
          />
        </SettingRows>
      </SettingsGroup>
    </>
  )
}

/** Whether the computer keys play the on-screen piano (R22): Settings › Computer keys. */
export function TypingSwitch() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const typing = useSettings((state) => selectKeyboard(state).typing)
  return (
    <SwitchRow
      setting="keyboard.typing"
      label={t('keyboardSettings.typing')}
      description={t('keyboardSettings.typingNote')}
      info={t('keyboardSettings.typingHint')}
      checked={typing}
      onCheckedChange={(on) => setKeyboard(store, { typing: on })}
    />
  )
}
